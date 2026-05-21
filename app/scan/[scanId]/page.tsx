import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getScan } from '@/lib/db';
import { ScoreGauge } from '@/components/ScoreGauge';
import { FindingCard } from '@/components/FindingCard';
import { CompetitorBenchmark } from '@/components/CompetitorBenchmark';
import { UpsellCTA } from '@/components/UpsellCTA';
import { EmailGate } from '@/components/EmailGate';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { formatDate, getDomain } from '@/lib/utils';
import { Download, ExternalLink, Lock } from 'lucide-react';
import type { ScoreBand } from '@/lib/types';

interface PageProps {
  params: Promise<{ scanId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { scanId } = await params;
  const scan = await getScan(scanId);
  if (!scan) return { title: 'Scan not found' };
  return {
    title: `AI Visibility Report — ${scan.domain} (${scan.score ?? '…'}/100)`,
  };
}

const SIGNAL_LABELS: Record<string, { name: string; weight: string }> = {
  productSchema: { name: 'Product Schema Completeness', weight: '×25' },
  faqSchema: { name: 'FAQPage Schema & Quote-Ready Answers', weight: '×20' },
  intentAlignment: { name: 'Intent-Aligned Title & Introduction', weight: '×20' },
  specificity: { name: 'Technical Specificity & Measurable Claims', weight: '×20' },
  reviewSignals: { name: 'Review & Rating Signals', weight: '×15' },
};

const BAND_VARIANT: Record<ScoreBand, 'green' | 'amber' | 'red'> = {
  green: 'green',
  amber: 'amber',
  red: 'red',
};

const TEASER_ITEMS = [
  '5 more issues found that aren\'t in this report',
  'Off-site signal analysis (Reddit, YouTube, review sites — accounts for 85% of AI citations)',
  'Site-level scoring including llms.txt, robots.txt, Agentic Storefronts opt-in',
  'Full prompt taxonomy: 30+ buying intents tested across 4 AI engines',
  'Priority backlog of pages to build with effort & impact estimates',
];

export default async function ScanPage({ params }: PageProps) {
  const { scanId } = await params;
  const scan = await getScan(scanId);

  if (!scan) notFound();

  // Processing — show a polling page
  if (scan.status === 'processing') {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center space-y-4">
        <div className="font-display text-2xl font-semibold">Scan in progress…</div>
        <p className="text-muted-foreground text-sm">This page will refresh automatically.</p>
        {/* Client-side auto-refresh */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script dangerouslySetInnerHTML={{ __html: 'setTimeout(()=>location.reload(),3000)' }} />
      </div>
    );
  }

  // Error state
  if (scan.status === 'error' || !scan.score || !scan.signals || !scan.findings) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center space-y-4">
        <div className="font-display text-2xl font-semibold text-destructive">Scan failed</div>
        <p className="text-muted-foreground text-sm">
          {scan.errorMessage ?? 'An unexpected error occurred during the scan.'}
        </p>
        <Button asChild variant="outline">
          <Link href="/">Try another URL</Link>
        </Button>
      </div>
    );
  }

  const domain = getDomain(scan.url);
  const signals = scan.signals;
  const signalKeys = Object.keys(SIGNAL_LABELS) as (keyof typeof signals)[];

  return (
    <>
      {/* Email gate overlay */}
      <EmailGate scanId={scanId} domain={domain} score={scan.score} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">

        {/* ── Header ──────────────────────────────────────────────────────────── */}
        <header className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={BAND_VARIANT[scan.band!]}>
              {scan.band === 'green' ? 'LLM-Ready' : scan.band === 'amber' ? 'Partially Visible' : 'Invisible to AI'}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Scanned {formatDate(scan.createdAt)}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-foreground leading-tight break-all">
              {domain}
            </h1>
            <a
              href={scan.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 text-muted-foreground hover:text-foreground transition-colors shrink-0"
              aria-label="Open scanned page"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          <p className="text-xs text-muted-foreground truncate max-w-full">{scan.url}</p>
        </header>

        {/* ── Score gauge ────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 rounded-xl border border-border bg-card p-6 sm:p-8">
          <ScoreGauge score={scan.score} band={scan.band!} className="shrink-0" />

          <div className="flex-1 w-full space-y-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">Signal breakdown</h2>
              <p className="text-sm text-muted-foreground mt-1">Each signal weighted by its impact on LLM citation likelihood.</p>
            </div>
            {signalKeys.map((key) => {
              const signal = signals[key];
              const meta = SIGNAL_LABELS[key as string];
              if (!signal || !meta) return null;
              return (
                <div key={key as string} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground font-medium">
                      {meta.name}{' '}
                      <span className="text-muted-foreground font-normal text-xs">{meta.weight}</span>
                    </span>
                    <span className="font-semibold tabular-nums">{signal.raw}/10</span>
                  </div>
                  <Progress
                    value={signal.raw * 10}
                    className={`h-1.5 ${signal.raw >= 7 ? '[&>div]:bg-green-500' : signal.raw >= 4 ? '[&>div]:bg-amber-500' : '[&>div]:bg-red-500'}`}
                  />
                  <p className="text-xs text-muted-foreground">{signal.explanation}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Findings ──────────────────────────────────────────────────────── */}
        <section className="space-y-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-foreground">Top 3 Findings</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Your highest-impact improvements, written specifically for this page.
            </p>
          </div>
          {scan.findings.map((finding, i) => (
            <FindingCard key={finding.signal} finding={finding} index={i} />
          ))}
        </section>

        {/* ── Competitor benchmark ────────────────────────────────────────── */}
        {scan.competitorData && (
          <CompetitorBenchmark data={scan.competitorData} />
        )}

        {/* ── "What we didn't scan" teaser ──────────────────────────────── */}
        <section className="rounded-xl border border-border overflow-hidden">
          <div className="bg-muted/60 px-6 py-4 border-b border-border">
            <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              What we didn&apos;t scan
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Reserved for the £497 full-site audit.
            </p>
          </div>
          <ul className="divide-y divide-border">
            {TEASER_ITEMS.map((item) => (
              <li
                key={item}
                className="px-6 py-3 text-sm text-muted-foreground flex items-start gap-3 select-none"
              >
                <span className="mt-0.5 h-2 w-2 rounded-full bg-muted-foreground/40 shrink-0 mt-1.5" aria-hidden />
                <span className="blur-[3px] hover:blur-none transition-[filter] duration-200 cursor-default">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Actions row ───────────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline" size="sm">
            <a href={`/api/pdf/${scanId}`} download>
              <Download className="h-4 w-4" />
              Download PDF
            </a>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/">Scan another URL</Link>
          </Button>
        </div>

        {/* ── Upsell CTA ────────────────────────────────────────────────────── */}
        <UpsellCTA />
      </div>
    </>
  );
}
