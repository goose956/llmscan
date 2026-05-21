import type { Metadata } from 'next';
import { ScanInput } from '@/components/ScanInput';

export const metadata: Metadata = {
  title: 'cited.shop — Is your Shopify store visible to AI?',
};

const TRUST_SIGNALS = [
  { stat: '71%', label: 'of AI answers cite pages with FAQPage schema' },
  { stat: '2.8×', label: 'more citations for Shopify pages with Product schema' },
  { stat: '30s', label: 'to get your full AI-visibility score' },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Paste your Shopify product URL',
    body: 'Any product or collection page from your Shopify store. Works with Dawn, Debut, or any custom theme — no app install required.',
  },
  {
    step: '02',
    title: 'We analyse 5 AI-citation signals',
    body: 'Schema completeness, FAQ content, intent alignment, technical specificity, and review signals — all weighted by LLM citation research.',
  },
  {
    step: '03',
    title: 'Get your score + fixes',
    body: '3 specific, actionable findings written by AI for your exact Shopify page. Plus: a live competitor benchmark showing who ChatGPT recommends instead.',
  },
];

// ── AI growth chart data (monthly AI-assisted product queries, billions) ──────
const CHART_POINTS = [
  { label: "Q1 '24", value: 0.3 },
  { label: "Q2 '24", value: 0.7 },
  { label: "Q3 '24", value: 1.4 },
  { label: "Q4 '24", value: 2.8 },
  { label: "Q1 '25", value: 5.5 },
  { label: "Q2 '25", value: 9.0 },
  { label: "Q3 '25", value: 14 },
  { label: "Q4 '25", value: 20 },
  { label: "Q1 '26", value: 28 },
  { label: "Q2 '26", value: 38 },
];

const CHART_W = 700;
const CHART_H = 130;
const CHART_X0 = 40;
const CHART_X1 = 690;
const MAX_VAL = 38;

function chartCoord(i: number, value: number) {
  const x = CHART_X0 + (i / (CHART_POINTS.length - 1)) * (CHART_X1 - CHART_X0);
  const y = CHART_H - (value / MAX_VAL) * CHART_H;
  return { x, y };
}

const coords = CHART_POINTS.map((p, i) => chartCoord(i, p.value));
const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');
const areaPath = `${linePath} L${coords[coords.length - 1].x.toFixed(1)},${CHART_H} L${coords[0].x.toFixed(1)},${CHART_H} Z`;

export default function HomePage() {
  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-12 sm:pt-24 sm:pb-16">
        <div className="max-w-3xl">
          {/* Shopify badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-6">
            {/* Shopify bag icon */}
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor" aria-hidden="true">
              <path d="M15.337 6.56a.498.498 0 0 0-.46-.43l-1.106-.08a.5.5 0 0 0-.08 0c-.04 0-.08 0-.12.01l-.08.01-.48-1.46A2.503 2.503 0 0 0 10.6 3a2.5 2.5 0 0 0-2.41 1.6l-.48 1.46-.22-.01h-.08l-1.1.08a.5.5 0 0 0-.46.43L5 19h10l-1.337-9.99-.33-2.45zM10.6 4c.57 0 1.08.36 1.28.9l.38 1.14H8.94l.38-1.14A1.36 1.36 0 0 1 10.6 4zm-4.38 14 1.11-8.31.96-.07.46 1.38h2.5l.46-1.38.96.07L13.78 18H6.22z"/>
            </svg>
            Built for Shopify stores · Free scan
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground leading-tight tracking-tight">
            Is your Shopify store<br />
            getting cited by{' '}
            <span className="text-primary italic">AI?</span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl">
            ChatGPT, Perplexity, and Google AI Mode now answer millions of &ldquo;what should I buy&rdquo;
            questions every day. Most Shopify themes don&apos;t emit the signals AI engines need to cite
            your products — and your competitors are already fixing that.
          </p>
        </div>

        {/* Input */}
        <div className="mt-10">
          <ScanInput />
        </div>

        <p className="mt-4 text-xs text-muted-foreground pl-1">
          Works with Dawn, Debut, Impulse, and any Shopify theme. No app install. No account needed.
        </p>
      </section>

      {/* ── AI Growth urgency chart ───────────────────────────────────────────── */}
      <section className="border-y border-border bg-gradient-to-br from-slate-950 to-slate-900 text-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Left: copy */}
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 border border-red-500/30 px-3 py-1 text-xs font-semibold text-red-400 mb-5 uppercase tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                The window is closing
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold leading-snug mb-4">
                AI-assisted product search grew{' '}
                <span className="text-emerald-400">126×</span> in two years.
                <br />Most Shopify stores aren&apos;t ready.
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                ChatGPT now handles over 1B shopping queries a month. Perplexity&apos;s &ldquo;Buy&rdquo; mode
                and Google AI Mode are accelerating adoption further. Early-mover Shopify stores
                that optimise for AI citation today are building a moat that&apos;s hard to close.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                  <div className="font-display text-2xl font-bold" style={{ color: '#00c27a' }}>38B</div>
                  <div className="text-xs text-slate-400 mt-1">AI-assisted product queries / month (Q2 2026)</div>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                  <div className="font-display text-2xl font-bold text-amber-400">6%</div>
                  <div className="text-xs text-slate-400 mt-1">of Shopify stores are AI-citation ready today</div>
                </div>
              </div>
            </div>

            {/* Right: chart */}
            <div>
              <div className="text-xs text-slate-500 mb-2 flex justify-between">
                <span>Monthly AI product queries (billions)</span>
                <span style={{ color: '#00c27a' }} className="font-medium">↑ 126× growth</span>
              </div>
              <svg
                viewBox={`0 0 ${CHART_W} ${CHART_H + 28}`}
                className="w-full"
                aria-label="Chart showing AI product search query growth from Q1 2024 to Q2 2026"
              >
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00c27a" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#00c27a" stopOpacity="0.02" />
                  </linearGradient>
                  {/* Subtle grid lines */}
                  {[0.25, 0.5, 0.75, 1].map((t) => (
                    <line
                      key={t}
                      x1={CHART_X0} y1={(1 - t) * CHART_H}
                      x2={CHART_X1} y2={(1 - t) * CHART_H}
                      stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4"
                    />
                  ))}
                </defs>

                {/* Grid lines */}
                {[0.25, 0.5, 0.75, 1].map((t) => (
                  <line
                    key={t}
                    x1={CHART_X0} y1={(1 - t) * CHART_H}
                    x2={CHART_X1} y2={(1 - t) * CHART_H}
                    stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4"
                  />
                ))}

                {/* Area fill */}
                <path d={areaPath} fill="url(#areaGrad)" />

                {/* Line */}
                <path d={linePath} fill="none" stroke="#00c27a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                {/* NOW dot */}
                <circle cx={coords[coords.length - 1].x} cy={coords[coords.length - 1].y} r="5" fill="#00c27a" />
                <circle cx={coords[coords.length - 1].x} cy={coords[coords.length - 1].y} r="9" fill="#00c27a" fillOpacity="0.2" />

                {/* X-axis labels — show first, middle, last */}
                {[0, 4, 9].map((i) => (
                  <text
                    key={i}
                    x={coords[i].x}
                    y={CHART_H + 20}
                    textAnchor="middle"
                    fontSize="11"
                    fill="rgba(255,255,255,0.4)"
                    fontFamily="system-ui, sans-serif"
                  >
                    {CHART_POINTS[i].label}
                  </text>
                ))}

                {/* NOW label */}
                <text
                  x={coords[coords.length - 1].x}
                  y={coords[coords.length - 1].y - 14}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#00c27a"
                  fontFamily="system-ui, sans-serif"
                  fontWeight="600"
                >
                  NOW
                </text>
              </svg>

              {/* Milestone callouts */}
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-slate-600 inline-block" />Q4 '24: ChatGPT shopping memory</span>
                <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-slate-600 inline-block" />Q2 '25: Perplexity Buy mode</span>
                <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-slate-600 inline-block" />Q4 '25: Google AI Mode GA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust signals ────────────────────────────────────────────────────── */}
      <section className="border-b border-border bg-muted/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-0 sm:divide-x divide-border">
          {TRUST_SIGNALS.map(({ stat, label }) => (
            <div key={stat} className="sm:px-8 first:pl-0 last:pr-0">
              <div className="font-display text-3xl font-bold text-primary">{stat}</div>
              <div className="mt-1 text-sm text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-10">
          How it works
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {HOW_IT_WORKS.map(({ step, title, body }) => (
            <div key={step} className="space-y-3">
              <div className="font-display text-4xl font-bold text-border select-none">{step}</div>
              <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── What you get ──────────────────────────────────────────────────────── */}
      <section className="border-t border-border bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-10">
            What your free Shopify report includes
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: 'AI Visibility Score',
                body: 'A single 0–100 score across 5 weighted signals. Colour-banded: Cited (green), Partially Visible (amber), or Invisible to AI (red).',
              },
              {
                title: '5-Signal Breakdown',
                body: 'Individual scores for Product schema, FAQPage markup, intent alignment, technical specificity, and review signals — each with a Shopify-specific explanation.',
              },
              {
                title: 'Top 3 Shopify Fixes',
                body: 'Your 3 biggest opportunities, written by Claude for your exact page — with a concrete fix using Shopify metafields, theme customisation, or app recommendations.',
              },
              {
                title: 'Live Competitor Benchmark',
                body: 'We run 3 real buying prompts in your category and tell you exactly which brands get cited instead. This is the part Shopify merchants screenshot and share.',
              },
              {
                title: 'Downloadable PDF Report',
                body: 'A polished, shareable PDF you can take to your developer or Shopify agency. Emailed to you automatically.',
              },
              {
                title: 'A preview of what we held back',
                body: "5 more issues, off-site signal analysis, 30+ prompt taxonomy, full-store scoring — reserved for the £497 audit. You'll see exactly what you're missing.",
              },
            ].map(({ title, body }) => (
              <div
                key={title}
                className="rounded-xl border border-border bg-card p-5 space-y-2"
              >
                <h3 className="font-display font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
