'use client';

import { useState } from 'react';
import { report } from '@/lib/mock-audit-data';
import type { BuyingPrompt, Competitor, OffSiteSignal, BacklogPage, QuickWin, PageAudit, PromptResult, NewPage, PlanPhase } from '@/lib/audit-types';

// ── Helpers ───────────────────────────────────────────────────────────────────

function bandLabel(band: string) {
  return band === 'green' ? 'Highly Visible' : band === 'amber' ? 'Partially Visible' : 'Invisible to AI';
}

function effortLabel(v: string) {
  return v === 'low' ? 'Low effort' : v === 'medium' ? 'Medium effort' : 'High effort';
}

function liftLabel(v: string) {
  return v === 'low' ? 'Low lift' : v === 'medium' ? 'Medium lift' : 'High lift';
}

function templateLabel(t: string) {
  const m: Record<string, string> = {
    'buyer-guide': 'Buyer Guide', comparison: 'Comparison', 'use-case': 'Use Case',
    'faq-hub': 'FAQ Hub', 'what-is': 'What-Is',
  };
  return m[t] ?? t;
}

// ── Score Gauge SVG ───────────────────────────────────────────────────────────

function ScoreGauge({ score, band }: { score: number; band: string }) {
  const cx = 100, cy = 100, r = 80;
  const circ = 2 * Math.PI * r;
  const arcLen = (270 / 360) * circ;   // 270° of the circle
  const fillLen = (score / 100) * arcLen;
  const color = band === 'green' ? '#166534' : band === 'amber' ? '#b45309' : '#991b1b';
  const bgColor = band === 'green' ? '#dcfce7' : band === 'amber' ? '#fef3c7' : '#fee2e2';

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 185" className="w-48 h-44">
        {/* Background track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth="14"
          strokeDasharray={`${arcLen} ${circ}`} strokeLinecap="round"
          transform="rotate(135 100 100)" />
        {/* Value arc */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="14"
          strokeDasharray={`${fillLen} ${circ}`} strokeLinecap="round"
          transform="rotate(135 100 100)" />
        {/* Score */}
        <text x="100" y="95" textAnchor="middle" fontSize="46" fontWeight="800"
          fill="#1a1a1a" fontFamily="Fraunces, Georgia, serif">{score}</text>
        <text x="100" y="116" textAnchor="middle" fontSize="13" fill="#9ca3af"
          fontFamily="Inter, sans-serif">out of 100</text>
      </svg>
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold mt-1"
        style={{ background: bgColor, color }}>
        {bandLabel(band)}
      </span>
    </div>
  );
}

// ── Heatmap ───────────────────────────────────────────────────────────────────

const CELL_STYLE: Record<string, { bg: string; color: string; abbr: string }> = {
  'Northwind Outdoor': { bg: '#166534', color: '#fff', abbr: '✓' },
  'Patagonia':         { bg: '#1e3a5f', color: '#fff', abbr: 'Pa' },
  'Finisterre':        { bg: '#0f766e', color: '#fff', abbr: 'Fi' },
  'Picture Organic':   { bg: '#c2410c', color: '#fff', abbr: 'Pi' },
  'Páramo':            { bg: '#6d28d9', color: '#fff', abbr: 'Pá' },
  'Vaude':             { bg: '#1d4ed8', color: '#fff', abbr: 'Va' },
  'Rab':               { bg: '#b91c1c', color: '#fff', abbr: 'Ra' },
  'Howies':            { bg: '#92400e', color: '#fff', abbr: 'Ho' },
  'Passenger Clothing':{ bg: '#9d174d', color: '#fff', abbr: 'Ps' },
  'Smartwool':         { bg: '#065f46', color: '#fff', abbr: 'Sw' },
};

function HeatmapCell({ result }: { result: PromptResult }) {
  if (result.status === 'neither') {
    return (
      <div className="w-16 h-7 rounded text-xs flex items-center justify-center font-medium"
        style={{ background: '#f3f4f6', color: '#9ca3af' }}>—</div>
    );
  }
  const brand = result.status === 'cited' ? 'Northwind Outdoor' : (result.citedBrand ?? '');
  const style = CELL_STYLE[brand] ?? { bg: '#e5e7eb', color: '#374151', abbr: brand.slice(0, 2) };
  return (
    <div className="w-16 h-7 rounded text-xs flex items-center justify-center font-bold tracking-wide"
      style={{ background: style.bg, color: style.color }} title={brand}>
      {style.abbr}
    </div>
  );
}

function BuyingPromptHeatmap({ prompts }: { prompts: BuyingPrompt[] }) {
  const engines = ['ChatGPT', 'Perplexity', 'Google AI', 'Claude'];
  return (
    <section className="max-w-[1280px] mx-auto px-6 py-12">
      <div className="mb-6 flex flex-wrap items-end gap-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Buying Prompt Heatmap</h2>
          <p className="text-sm text-muted-foreground mt-1">How AI engines respond to your category's top 30 buying queries</p>
        </div>
        <div className="flex flex-wrap gap-4 ml-auto text-sm">
          <span className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-7 h-5 rounded text-xs font-bold"
              style={{ background: '#166534', color: '#fff' }}>✓</span>
            <span className="text-foreground font-semibold">Northwind cited: 24</span>
            <span className="text-muted-foreground">of 120</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-7 h-5 rounded text-xs font-bold"
              style={{ background: '#1e3a5f', color: '#fff' }}>Pa</span>
            <span className="text-foreground font-semibold">Patagonia: 92</span>
            <span className="text-muted-foreground">of 120</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-7 h-5 rounded text-xs"
              style={{ background: '#f3f4f6', color: '#9ca3af' }}>—</span>
            <span className="text-muted-foreground">Neither cited: 18</span>
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        {/* Header */}
        <div className="grid min-w-[680px] border-b border-border bg-muted/40 px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
          style={{ gridTemplateColumns: '1fr 4rem 4rem 5rem 4rem' }}>
          <span>Buying Query</span>
          {engines.map(e => <span key={e} className="text-center">{e}</span>)}
        </div>
        {/* Rows */}
        {prompts.map((prompt, i) => {
          const hasNorthwind = prompt.results.some(r => r.status === 'cited');
          return (
            <div key={prompt.id}
              className={`grid min-w-[680px] px-4 py-2 border-b border-border last:border-0 items-center gap-2 ${hasNorthwind ? 'bg-green-50/40' : ''}`}
              style={{ gridTemplateColumns: '1fr 4rem 4rem 5rem 4rem' }}>
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs text-muted-foreground tabular-nums w-5 shrink-0">{i + 1}</span>
                <span className="text-sm text-foreground truncate">{prompt.prompt}</span>
              </div>
              {prompt.results.map(result => (
                <div key={result.engine} className="flex justify-center">
                  <HeatmapCell result={result} />
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3">
        {Object.entries(CELL_STYLE).filter(([b]) => b !== 'Northwind Outdoor').map(([brand, style]) => (
          <span key={brand} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-5 h-4 rounded flex items-center justify-center text-xs font-bold"
              style={{ background: style.bg, color: style.color }}>{style.abbr}</span>
            {brand}
          </span>
        ))}
      </div>
    </section>
  );
}

// ── Competitors ───────────────────────────────────────────────────────────────

const KG_BADGE: Record<string, { label: string; cls: string }> = {
  strong: { label: 'Strong KG', cls: 'bg-score-green-bg text-score-green' },
  medium: { label: 'Medium KG', cls: 'bg-score-amber-bg text-score-amber' },
  weak: { label: 'Weak KG', cls: 'bg-score-red-bg text-score-red' },
};

function CompetitorCard({ c }: { c: Competitor }) {
  const pct = Math.round((c.citationsAcrossPrompts / 30) * 100);
  const kg = KG_BADGE[c.knowledgeGraphStrength];
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-lg font-bold text-foreground">{c.brand}</p>
          <p className="text-xs text-muted-foreground">{c.domain}</p>
        </div>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${kg.cls}`}>{kg.label}</span>
      </div>
      <div>
        <div className="flex justify-between text-sm mb-1.5">
          <span className="text-muted-foreground">Citations</span>
          <span className="font-bold text-foreground tabular-nums">{c.citationsAcrossPrompts}<span className="text-muted-foreground font-normal">/30</span></span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Top advantage</p>
        <p className="text-sm text-foreground">{c.topAdvantage}</p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {c.pageFormats.map(f => (
          <span key={f} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{f}</span>
        ))}
      </div>
    </div>
  );
}

// ── Quick Wins ────────────────────────────────────────────────────────────────

const IMPACT_STYLE: Record<string, string> = {
  high: 'bg-score-green-bg text-score-green',
  medium: 'bg-score-amber-bg text-score-amber',
  low: 'bg-muted text-muted-foreground',
};

function QuickWinRow({ win }: { win: QuickWin }) {
  return (
    <div className="px-5 py-5 space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${IMPACT_STYLE[win.impact]}`}>
          {win.impact.charAt(0).toUpperCase() + win.impact.slice(1)} impact
        </span>
        <span className="text-xs text-muted-foreground border border-border rounded-full px-2.5 py-0.5">{win.timeToImplement}</span>
        <p className="font-semibold text-foreground text-sm">{win.title}</p>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{win.instructions}</p>
      {win.codeSnippet && (
        <pre className="bg-muted rounded-lg p-4 text-xs font-mono text-foreground overflow-x-auto leading-relaxed">
          {win.codeSnippet}
        </pre>
      )}
    </div>
  );
}

// ── Page Audit Table ──────────────────────────────────────────────────────────

const BAND_CELL: Record<string, string> = {
  green: 'bg-score-green-bg text-score-green',
  amber: 'bg-score-amber-bg text-score-amber',
  red: 'bg-score-red-bg text-score-red',
};

const TYPE_CELL: Record<string, string> = {
  product: 'bg-blue-50 text-blue-700',
  collection: 'bg-purple-50 text-purple-700',
  blog: 'bg-yellow-50 text-yellow-700',
  home: 'bg-green-50 text-green-700',
  policy: 'bg-gray-100 text-gray-600',
  other: 'bg-gray-100 text-gray-600',
};

function PageAuditTable({ pages }: { pages: PageAudit[] }) {
  const sorted = [...pages].sort((a, b) => a.score - b.score);
  return (
    <section className="max-w-[1280px] mx-auto px-6 py-12">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">Page Audit</h2>
        <p className="text-sm text-muted-foreground mt-1">{pages.length} pages scanned · sorted by score (lowest first)</p>
      </div>
      <div className="rounded-xl border border-border bg-card overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              <th className="px-4 py-3">Page</th>
              <th className="px-4 py-3 w-16 text-center">Score</th>
              <th className="px-4 py-3 w-24 hidden sm:table-cell">Type</th>
              <th className="px-4 py-3 hidden lg:table-cell">Top issues</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sorted.map(page => (
              <tr key={page.url} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{page.title}</p>
                  <p className="text-xs text-muted-foreground font-mono truncate max-w-[240px]">{page.url}</p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col items-center gap-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full tabular-nums ${BAND_CELL[page.band]}`}>{page.score}</span>
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${TYPE_CELL[page.type]}`}>{page.type}</span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <p className="text-xs text-muted-foreground">{page.topIssues[0]}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ── Off-site Signals ──────────────────────────────────────────────────────────

const GAP_STYLE: Record<string, { label: string; border: string; badge: string }> = {
  critical:    { label: 'Critical gap', border: 'border-red-300',  badge: 'bg-score-red-bg text-score-red' },
  significant: { label: 'Significant gap', border: 'border-amber-300', badge: 'bg-score-amber-bg text-score-amber' },
  minor:       { label: 'Minor gap', border: 'border-yellow-200', badge: 'bg-yellow-50 text-yellow-700' },
  closed:      { label: 'Closed', border: 'border-green-300', badge: 'bg-score-green-bg text-score-green' },
};

function OffSiteCard({ signal }: { signal: OffSiteSignal }) {
  const g = GAP_STYLE[signal.gap];
  return (
    <div className={`rounded-xl border-2 bg-card p-5 space-y-3 ${g.border}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{signal.icon}</span>
          <p className="font-semibold text-foreground">{signal.platform}</p>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${g.badge}`}>{g.label}</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Your mentions</p>
          <p className="text-2xl font-bold font-display text-foreground tabular-nums">{signal.mentions.toLocaleString()}</p>
        </div>
        {signal.topCompetitorMentions > 0 && (
          <div>
            <p className="text-xs text-muted-foreground">Patagonia</p>
            <p className="text-2xl font-bold font-display text-muted-foreground tabular-nums">{signal.topCompetitorMentions.toLocaleString()}</p>
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{signal.notes}</p>
    </div>
  );
}

// ── Page Backlog ──────────────────────────────────────────────────────────────

const PRIORITY_STYLE: Record<number, string> = {
  1: 'bg-score-red-bg text-score-red',
  2: 'bg-score-amber-bg text-score-amber',
  3: 'bg-muted text-muted-foreground',
};

const TEMPLATE_COLOR: Record<string, string> = {
  'buyer-guide': 'bg-blue-50 text-blue-700',
  comparison: 'bg-purple-50 text-purple-700',
  'use-case': 'bg-teal-50 text-teal-700',
  'faq-hub': 'bg-yellow-50 text-yellow-700',
  'what-is': 'bg-green-50 text-green-700',
};

function BacklogCard({ item }: { item: BacklogPage }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-3 flex flex-col">
      <div className="flex items-start justify-between gap-2">
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${PRIORITY_STYLE[item.priority]}`}>P{item.priority}</span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TEMPLATE_COLOR[item.template]}`}>{templateLabel(item.template)}</span>
      </div>
      <p className="font-semibold text-foreground text-sm leading-snug">{item.suggestedTitle}</p>
      <p className="text-xs text-muted-foreground leading-relaxed flex-1">{item.rationale}</p>
      <div className="flex flex-wrap gap-1.5">
        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{effortLabel(item.estimatedEffort)}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.estimatedLift === 'high' ? 'bg-score-green-bg text-score-green' : item.estimatedLift === 'medium' ? 'bg-score-amber-bg text-score-amber' : 'bg-muted text-muted-foreground'}`}>
          {liftLabel(item.estimatedLift)}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5 pt-1 border-t border-border">
        {item.targetPrompts.slice(0, 2).map(p => (
          <span key={p} className="text-xs text-muted-foreground italic truncate max-w-[200px]">"{p}"</span>
        ))}
      </div>
    </div>
  );
}

// ── Tab config ────────────────────────────────────────────────────────────────

type TabId = 'overview' | 'heatmap' | 'competitors' | 'quickwins' | 'pages' | 'offsite' | 'backlog' | 'newpages' | 'plan';

const TABS: { id: TabId; label: string; count?: string; color: string; activeColor: string; dot: string }[] = [
  { id: 'overview',     label: 'Overview',        color: 'hover:bg-blue-900/40',    activeColor: 'bg-blue-600',   dot: 'bg-blue-400'   },
  { id: 'heatmap',      label: 'AI Heatmap',       count: '30',  color: 'hover:bg-emerald-900/40', activeColor: 'bg-emerald-600', dot: 'bg-emerald-400' },
  { id: 'competitors',  label: 'Competitors',      count: '5',   color: 'hover:bg-violet-900/40',  activeColor: 'bg-violet-600',  dot: 'bg-violet-400'  },
  { id: 'quickwins',    label: 'Quick Wins',        count: '6',   color: 'hover:bg-amber-900/40',   activeColor: 'bg-amber-500',   dot: 'bg-amber-400'   },
  { id: 'pages',        label: 'Pages',             count: '20',  color: 'hover:bg-sky-900/40',     activeColor: 'bg-sky-600',     dot: 'bg-sky-400'     },
  { id: 'offsite',      label: 'Off-site Signals',  count: '5',   color: 'hover:bg-teal-900/40',    activeColor: 'bg-teal-600',    dot: 'bg-teal-400'    },
  { id: 'backlog',      label: 'Content Backlog',   count: '8',   color: 'hover:bg-orange-900/40',  activeColor: 'bg-orange-500',  dot: 'bg-orange-400'  },
  { id: 'newpages',     label: 'New Pages',         count: '320', color: 'hover:bg-pink-900/40',    activeColor: 'bg-pink-600',    dot: 'bg-pink-400'    },
  { id: 'plan',         label: 'Full Plan',                       color: 'hover:bg-green-900/40',   activeColor: 'bg-green-700',   dot: 'bg-green-400'   },
];

// ── Sidebar score gauge (compact) ────────────────────────────────────────────

function SidebarGauge({ score, band }: { score: number; band: string }) {
  const cx = 60, cy = 60, r = 46;
  const circ = 2 * Math.PI * r;
  const arcLen = (270 / 360) * circ;
  const fillLen = (score / 100) * arcLen;
  const color = band === 'green' ? '#4ade80' : band === 'amber' ? '#fbbf24' : '#f87171';
  const bgColor = band === 'green' ? '#166534' : band === 'amber' ? '#78350f' : '#7f1d1d';
  const label = band === 'green' ? 'Highly Visible' : band === 'amber' ? 'Partially Visible' : 'Invisible';
  return (
    <div className="flex flex-col items-center gap-2 py-4">
      <svg viewBox="0 0 120 110" className="w-32 h-28">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="9"
          strokeDasharray={`${arcLen} ${circ}`} strokeLinecap="round"
          transform="rotate(135 60 60)" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="9"
          strokeDasharray={`${fillLen} ${circ}`} strokeLinecap="round"
          transform="rotate(135 60 60)" />
        <text x="60" y="56" textAnchor="middle" fontSize="28" fontWeight="800"
          fill="white" fontFamily="Fraunces, Georgia, serif">{score}</text>
        <text x="60" y="70" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.5)"
          fontFamily="Inter, sans-serif">out of 100</text>
      </svg>
      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
        style={{ background: bgColor, color }}>
        {label}
      </span>
    </div>
  );
}

// ── Overview tab ──────────────────────────────────────────────────────────────

function OverviewPanel() {
  const { meta, overallScore, band, headlineFinding, topThreeFindings, revenueAtStake } = report;
  const bandBg   = band === 'green' ? '#dcfce7' : band === 'amber' ? '#fef3c7' : '#fee2e2';
  const bandText = band === 'green' ? '#166534' : band === 'amber' ? '#b45309' : '#991b1b';
  return (
    <div className="space-y-6">
      {/* Headline card */}
      <div className="rounded-2xl border border-border bg-card p-8 flex flex-col md:flex-row gap-8 items-start">
        <ScoreGauge score={overallScore} band={band} />
        <div className="space-y-4 flex-1">
          <p className="font-display text-2xl sm:text-3xl font-bold text-foreground leading-snug">{headlineFinding}</p>
          <ol className="space-y-3 mt-2">
            {topThreeFindings.map((f, i) => (
              <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                  style={{ background: bandBg, color: bandText }}>{i + 1}</span>
                <span>{f}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Pages scanned',        value: meta.pagesScanned,         sub: 'across your domain' },
          { label: 'Buying prompts tested', value: meta.promptsTested,        sub: 'real purchase-intent queries' },
          { label: 'AI engines probed',     value: meta.enginesProbed.length, sub: meta.enginesProbed.join(', ') },
          { label: 'Est. revenue at stake', value: revenueAtStake,            sub: 'from lost AI citations' },
        ].map(stat => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-5 space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{stat.label}</p>
            <p className="text-3xl font-bold text-foreground font-display tabular-nums">{stat.value}</p>
            <p className="text-xs text-muted-foreground truncate">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Citation summary bar */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Citation rate across 30 buying queries</p>
        <div className="space-y-3">
          {[
            { brand: 'Northwind Outdoor', count: 7,  color: '#b45309', bg: '#fef3c7' },
            { brand: 'Patagonia',         count: 23, color: '#1e3a5f', bg: '#dbeafe' },
            { brand: 'Finisterre',        count: 14, color: '#0f766e', bg: '#ccfbf1' },
            { brand: 'Picture Organic',   count: 11, color: '#c2410c', bg: '#ffedd5' },
            { brand: 'Páramo',            count: 9,  color: '#6d28d9', bg: '#f3e8ff' },
          ].map(b => (
            <div key={b.brand} className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground w-36 shrink-0">{b.brand}</span>
              <div className="flex-1 h-5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full flex items-center pl-2 text-xs font-bold transition-all"
                  style={{ width: `${(b.count / 30) * 100}%`, background: b.color, color: '#fff', minWidth: 28 }}>
                  {b.count}
                </div>
              </div>
              <span className="text-xs text-muted-foreground tabular-nums w-12 text-right">{b.count}/30</span>
            </div>
          ))}
        </div>
      </div>

      {/* Engines breakdown */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Northwind citations per engine</p>
        <div className="grid grid-cols-4 gap-4">
          {(['ChatGPT','Perplexity','Google AI Mode','Claude'] as const).map((engine) => {
            const cited = report.buyingPrompts.filter(p =>
              p.results.find(r => r.engine === engine && r.status === 'cited')
            ).length;
            const pct = Math.round((cited / 30) * 100);
            return (
              <div key={engine} className="rounded-xl border border-border bg-muted/30 p-4 text-center space-y-2">
                <p className="text-xs text-muted-foreground">{engine}</p>
                <p className="text-2xl font-bold text-foreground font-display tabular-nums">{cited}</p>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden mx-auto w-full">
                  <div className="h-full rounded-full bg-blue-500" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-muted-foreground">{pct}% of prompts</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Heatmap tab ───────────────────────────────────────────────────────────────

function HeatmapPanel({ prompts }: { prompts: BuyingPrompt[] }) {
  const engines = ['ChatGPT', 'Perplexity', 'Google AI Mode', 'Claude'];
  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Northwind cited',   value: '24', sub: 'of 120 total cells', bg: '#166534', text: '#fff' },
          { label: 'Patagonia cited',   value: '92', sub: 'of 120 total cells', bg: '#1e3a5f', text: '#fff' },
          { label: 'Neither cited',     value: '18', sub: 'of 120 total cells', bg: '#f3f4f6', text: '#374151' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-5 space-y-1" style={{ background: s.bg }}>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: s.bg === '#f3f4f6' ? '#9ca3af' : 'rgba(255,255,255,0.6)' }}>{s.label}</p>
            <p className="text-4xl font-bold font-display" style={{ color: s.text }}>{s.value}</p>
            <p className="text-xs" style={{ color: s.bg === '#f3f4f6' ? '#9ca3af' : 'rgba(255,255,255,0.5)' }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="grid min-w-[700px] border-b border-border bg-muted/40 px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
          style={{ gridTemplateColumns: '1fr 5rem 5.5rem 6.5rem 4.5rem' }}>
          <span>Buying Query</span>
          {engines.map(e => <span key={e} className="text-center">{e}</span>)}
        </div>
        <div className="divide-y divide-border overflow-x-auto">
          {prompts.map((prompt, i) => {
            const hasNorthwind = prompt.results.some(r => r.status === 'cited');
            return (
              <div key={prompt.id}
                className={`grid min-w-[700px] px-4 py-2 items-center gap-2 ${hasNorthwind ? 'bg-emerald-50/60' : ''}`}
                style={{ gridTemplateColumns: '1fr 5rem 5.5rem 6.5rem 4.5rem' }}>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs text-muted-foreground tabular-nums w-5 shrink-0">{i + 1}</span>
                  <span className="text-sm text-foreground truncate">{prompt.prompt}</span>
                </div>
                {prompt.results.map(result => (
                  <div key={result.engine} className="flex justify-center">
                    <HeatmapCell result={result} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="rounded-2xl border border-border bg-card p-4 flex flex-wrap gap-3">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide self-center mr-2">Legend:</span>
        {Object.entries(CELL_STYLE).map(([brand, style]) => (
          <span key={brand} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-6 h-5 rounded flex items-center justify-center text-xs font-bold"
              style={{ background: style.bg, color: style.color }}>{style.abbr}</span>
            {brand}
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="w-6 h-5 rounded flex items-center justify-center text-xs"
            style={{ background: '#f3f4f6', color: '#9ca3af' }}>—</span>
          Neither
        </span>
      </div>
    </div>
  );
}

// ── Competitors tab ───────────────────────────────────────────────────────────

function CompetitorsPanel({ competitors }: { competitors: Competitor[] }) {
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {competitors.map(c => <CompetitorCard key={c.brand} c={c} />)}
      </div>
      {/* Head-to-head */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="text-sm font-semibold text-foreground mb-5">Head-to-head: citations across 30 buying queries</p>
        <div className="space-y-4">
          {[
            { brand: 'Patagonia',       count: 23, color: '#1e3a5f' },
            { brand: 'Finisterre',      count: 14, color: '#0f766e' },
            { brand: 'Picture Organic', count: 11, color: '#c2410c' },
            { brand: 'Páramo',          count: 9,  color: '#6d28d9' },
            { brand: 'Vaude',           count: 8,  color: '#1d4ed8' },
            { brand: 'Northwind Outdoor (you)', count: 7, color: '#b45309' },
          ].map(b => (
            <div key={b.brand} className="flex items-center gap-4">
              <span className="text-sm text-foreground w-44 shrink-0">{b.brand}</span>
              <div className="flex-1 h-6 rounded-lg bg-muted overflow-hidden">
                <div className="h-full rounded-lg flex items-center pl-2 text-xs font-bold text-white"
                  style={{ width: `${(b.count / 23) * 100}%`, background: b.color, minWidth: 32 }}>
                  {b.count}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Quick Wins tab ────────────────────────────────────────────────────────────

function QuickWinsPanel({ quickWins }: { quickWins: QuickWin[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border">
      {quickWins.map((win, i) => (
        <div key={win.id} className="p-6 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${IMPACT_STYLE[win.impact]}`}>
              {win.impact.charAt(0).toUpperCase() + win.impact.slice(1)} impact
            </span>
            <span className="text-xs text-muted-foreground border border-border rounded-full px-2.5 py-0.5">{win.timeToImplement}</span>
            <p className="font-semibold text-foreground text-sm">{win.title}</p>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed pl-9">{win.instructions}</p>
          {win.codeSnippet && (
            <pre className="bg-slate-900 text-slate-100 rounded-xl p-4 text-xs font-mono overflow-x-auto leading-relaxed ml-9">
              {win.codeSnippet}
            </pre>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Pages tab ─────────────────────────────────────────────────────────────────

function PagesPanel({ pages }: { pages: PageAudit[] }) {
  const sorted = [...pages].sort((a, b) => a.score - b.score);
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="px-5 py-3 border-b border-border bg-muted/40 flex items-center gap-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{pages.length} pages scanned</p>
        <span className="text-muted-foreground/40">·</span>
        <p className="text-xs text-muted-foreground">Sorted by score (lowest first)</p>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            <th className="px-5 py-3">Page</th>
            <th className="px-5 py-3 w-20 text-center">Score</th>
            <th className="px-5 py-3 w-24 hidden sm:table-cell">Type</th>
            <th className="px-5 py-3 hidden lg:table-cell">Top issue</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {sorted.map(page => (
            <tr key={page.url} className="hover:bg-muted/30 transition-colors">
              <td className="px-5 py-3">
                <p className="font-medium text-foreground">{page.title}</p>
                <p className="text-xs text-muted-foreground font-mono truncate max-w-[260px]">{page.url}</p>
              </td>
              <td className="px-5 py-3 text-center">
                <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full tabular-nums ${BAND_CELL[page.band]}`}>{page.score}</span>
              </td>
              <td className="px-5 py-3 hidden sm:table-cell">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${TYPE_CELL[page.type]}`}>{page.type}</span>
              </td>
              <td className="px-5 py-3 hidden lg:table-cell">
                <p className="text-xs text-muted-foreground">{page.topIssues[0]}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Off-site tab ──────────────────────────────────────────────────────────────

function OffsitePanel({ signals }: { signals: OffSiteSignal[] }) {
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {signals.map(s => <OffSiteCard key={s.platform} signal={s} />)}
      </div>
      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="text-sm font-semibold text-foreground mb-4">Mention gap vs. Patagonia</p>
        <div className="space-y-4">
          {signals.map(s => {
            const total = s.mentions + s.topCompetitorMentions;
            const yourPct = total > 0 ? (s.mentions / total) * 100 : 0;
            return (
              <div key={s.platform} className="flex items-center gap-3">
                <span className="text-lg w-7 shrink-0">{s.icon}</span>
                <span className="text-sm text-foreground w-28 shrink-0">{s.platform}</span>
                <div className="flex-1 h-5 rounded-full bg-muted overflow-hidden relative flex">
                  <div className="h-full bg-teal-600 flex items-center pl-2 text-xs font-bold text-white"
                    style={{ width: `${yourPct}%`, minWidth: yourPct > 0 ? 32 : 0 }}>
                    {yourPct > 5 ? s.mentions.toLocaleString() : ''}
                  </div>
                  {yourPct > 0 && s.topCompetitorMentions > 0 && (
                    <div className="h-full bg-slate-700 flex items-center pl-2 text-xs font-bold text-white"
                      style={{ width: `${100 - yourPct}%` }}>
                      {(100 - yourPct) > 10 ? s.topCompetitorMentions.toLocaleString() : ''}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-4 mt-4">
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><span className="w-3 h-3 rounded-sm bg-teal-600 inline-block" /> Northwind</span>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><span className="w-3 h-3 rounded-sm bg-slate-700 inline-block" /> Patagonia</span>
        </div>
      </div>
    </div>
  );
}

// ── Backlog tab ───────────────────────────────────────────────────────────────

function BacklogPanel({ backlog }: { backlog: BacklogPage[] }) {
  return (
    <div className="space-y-6">
      {/* Upsell */}
      <div className="rounded-2xl border-2 border-primary bg-primary/5 p-6 flex flex-wrap gap-4 items-center justify-between">
        <div>
          <p className="font-display text-xl font-bold text-foreground">{backlog.length} recommended pages identified.</p>
          <p className="text-sm text-muted-foreground mt-1">Building these would capture the AI citations you're currently losing. Estimated: 6–8 weeks with the Cited build service.</p>
        </div>
        <a href="#" className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors whitespace-nowrap">
          Schedule a build call →
        </a>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {backlog.map(item => <BacklogCard key={item.id} item={item} />)}
      </div>
    </div>
  );
}

// ── New Pages panel ───────────────────────────────────────────────────────────

const TEMPLATE_BADGE: Record<string, { label: string; cls: string }> = {
  'buyer-guide': { label: 'Buyer Guide',  cls: 'bg-blue-100 text-blue-700' },
  'comparison':  { label: 'Comparison',   cls: 'bg-purple-100 text-purple-700' },
  'use-case':    { label: 'Use Case',     cls: 'bg-teal-100 text-teal-700' },
  'faq-hub':     { label: 'FAQ Hub',      cls: 'bg-yellow-100 text-yellow-700' },
  'what-is':     { label: 'What-Is',      cls: 'bg-green-100 text-green-700' },
};

const CITATION_BADGE: Record<string, string> = {
  high: 'bg-score-green-bg text-score-green',
  medium: 'bg-score-amber-bg text-score-amber',
  low: 'bg-muted text-muted-foreground',
};

const NP_PRIORITY: Record<number, string> = {
  1: 'bg-score-red-bg text-score-red',
  2: 'bg-score-amber-bg text-score-amber',
  3: 'bg-muted text-muted-foreground',
};

const PAGE_SIZE = 25;

function NewPagesPanel({ newPages }: { newPages: NewPage[] }) {
  const [filter, setFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = newPages.filter(p =>
    (filter === 'all' || p.template === filter) &&
    (priorityFilter === 'all' || String(p.priority) === priorityFilter)
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const visible = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const counts = {
    all: newPages.length,
    'buyer-guide': newPages.filter(p => p.template === 'buyer-guide').length,
    comparison: newPages.filter(p => p.template === 'comparison').length,
    'use-case': newPages.filter(p => p.template === 'use-case').length,
  };

  const p1 = newPages.filter(p => p.priority === 1).length;
  const p2 = newPages.filter(p => p.priority === 2).length;
  const p3 = newPages.filter(p => p.priority === 3).length;

  return (
    <div className="space-y-5">
      {/* Summary bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 col-span-2 sm:col-span-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total new pages</p>
          <p className="text-4xl font-bold font-display text-foreground mt-1">{newPages.length}</p>
          <p className="text-xs text-muted-foreground mt-1">4 content types per product page</p>
        </div>
        {[
          { label: 'P1 — Ship now',    count: p1, cls: 'bg-score-red-bg text-score-red' },
          { label: 'P2 — Month 2–3',   count: p2, cls: 'bg-score-amber-bg text-score-amber' },
          { label: 'P3 — Backfill',    count: p3, cls: 'bg-muted text-muted-foreground' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{s.label}</p>
            <p className={`text-4xl font-bold font-display mt-1 ${s.cls.split(' ')[1]}`}>{s.count}</p>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">How each new page works</p>
        <div className="grid sm:grid-cols-4 gap-4">
          {[
            { n: '1', t: 'AI receives query', d: '"best waterproof jacket for trail running uk"' },
            { n: '2', t: 'Finds your page',   d: 'Buyer guide / comparison / review page indexed by AI' },
            { n: '3', t: 'Cites Northwind',   d: 'Recommended with a direct link to your site' },
            { n: '4', t: 'User converts',     d: 'Deep link → collection page → product page → checkout' },
          ].map(s => (
            <div key={s.n} className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-full bg-pink-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{s.n}</span>
              <div>
                <p className="text-sm font-semibold text-foreground">{s.t}</p>
                <p className="text-xs text-muted-foreground mt-0.5 italic">"{s.d}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mr-1">Type:</span>
        {(['all', 'buyer-guide', 'comparison', 'use-case'] as const).map(t => (
          <button key={t} onClick={() => { setFilter(t); setPage(0); }}
            className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors ${filter === t ? 'bg-pink-600 text-white' : 'bg-muted text-muted-foreground hover:bg-pink-100 hover:text-pink-700'}`}>
            {t === 'all' ? `All (${counts.all})` : t === 'buyer-guide' ? `Buyer Guide (${counts['buyer-guide']})` : t === 'comparison' ? `Comparison (${counts.comparison})` : `Use Case (${counts['use-case']})`}
          </button>
        ))}
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide ml-4 mr-1">Priority:</span>
        {(['all', '1', '2', '3'] as const).map(p => (
          <button key={p} onClick={() => { setPriorityFilter(p); setPage(0); }}
            className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors ${priorityFilter === p ? 'bg-pink-600 text-white' : 'bg-muted text-muted-foreground hover:bg-pink-100 hover:text-pink-700'}`}>
            {p === 'all' ? 'All' : `P${p}`}
          </button>
        ))}
        <span className="text-xs text-muted-foreground ml-auto">{filtered.length} pages · showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)}</span>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              <th className="px-4 py-3 w-8">#</th>
              <th className="px-4 py-3">Page title</th>
              <th className="px-4 py-3 w-28 hidden md:table-cell">Type</th>
              <th className="px-4 py-3 w-16 hidden sm:table-cell">Priority</th>
              <th className="px-4 py-3 w-28 hidden lg:table-cell">Citation potential</th>
              <th className="px-4 py-3 w-20 hidden xl:table-cell">Words</th>
              <th className="px-4 py-3 w-8" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {visible.map((np, i) => (
              <>
                <tr key={np.id}
                  className="hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => setExpanded(expanded === np.id ? null : np.id)}>
                  <td className="px-4 py-3 text-xs text-muted-foreground tabular-nums">{page * PAGE_SIZE + i + 1}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground leading-snug">{np.title}</p>
                    <p className="text-xs text-muted-foreground font-mono truncate max-w-[320px] mt-0.5">{np.slug}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TEMPLATE_BADGE[np.template].cls}`}>{TEMPLATE_BADGE[np.template].label}</span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${NP_PRIORITY[np.priority]}`}>P{np.priority}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CITATION_BADGE[np.citationPotential]}`}>{np.citationPotential}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground tabular-nums hidden xl:table-cell">{np.wordCount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{expanded === np.id ? '▲' : '▼'}</td>
                </tr>
                {expanded === np.id && (
                  <tr key={`${np.id}-exp`} className="bg-pink-50/40">
                    <td />
                    <td colSpan={6} className="px-4 pb-4 pt-2">
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">{np.briefSummary}</p>
                      <div className="flex flex-wrap gap-6">
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Target queries</p>
                          <ul className="space-y-1">
                            {np.targetQueries.map(q => <li key={q} className="text-xs text-foreground flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-pink-400 shrink-0" />{q}</li>)}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Links to</p>
                          <div className="flex flex-wrap gap-1.5">
                            {np.linkedProducts.map(p => <span key={p} className="text-xs bg-pink-100 text-pink-700 border border-pink-200 px-2 py-0.5 rounded-full">{p}</span>)}
                          </div>
                        </div>
                        <div className="ml-auto">
                          <button className="px-4 py-2 bg-pink-600 text-white text-xs font-semibold rounded-lg hover:bg-pink-700 transition-colors">Get content brief →</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
            className="px-3 py-1.5 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted disabled:opacity-40 transition-colors">
            ← Prev
          </button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            const pg = totalPages <= 7 ? i : page < 4 ? i : page > totalPages - 4 ? totalPages - 7 + i : page - 3 + i;
            return (
              <button key={pg} onClick={() => setPage(pg)}
                className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${pg === page ? 'bg-pink-600 text-white' : 'border border-border text-muted-foreground hover:bg-muted'}`}>
                {pg + 1}
              </button>
            );
          })}
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}
            className="px-3 py-1.5 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted disabled:opacity-40 transition-colors">
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

// ── Full Plan panel ───────────────────────────────────────────────────────────

const PHASE_COLORS: Record<string, { border: string; dot: string; badge: string; label: string; header: string }> = {
  amber:  { border: 'border-amber-300',  dot: 'bg-amber-400',  badge: 'bg-amber-100 text-amber-800',  label: 'text-amber-700',  header: 'bg-amber-50'  },
  blue:   { border: 'border-blue-300',   dot: 'bg-blue-400',   badge: 'bg-blue-100 text-blue-800',    label: 'text-blue-700',   header: 'bg-blue-50'   },
  violet: { border: 'border-violet-300', dot: 'bg-violet-400', badge: 'bg-violet-100 text-violet-800',label: 'text-violet-700', header: 'bg-violet-50' },
  teal:   { border: 'border-teal-300',   dot: 'bg-teal-400',   badge: 'bg-teal-100 text-teal-800',    label: 'text-teal-700',   header: 'bg-teal-50'   },
};

const CATEGORY_ICON: Record<string, string> = {
  technical: '⚙️', content: '📝', offsite: '🌐', tracking: '📊',
};

const EFFORT_STYLE: Record<string, string> = {
  low: 'bg-score-green-bg text-score-green',
  medium: 'bg-score-amber-bg text-score-amber',
  high: 'bg-score-red-bg text-score-red',
};

function FullPlanPanel({ plan }: { plan: PlanPhase[] }) {
  const allItems = plan.flatMap(p => p.items);
  const done = allItems.filter(i => i.status === 'done').length;
  const inProgress = allItems.filter(i => i.status === 'in-progress').length;
  const todo = allItems.filter(i => i.status === 'todo').length;

  return (
    <div className="space-y-6">
      {/* Progress summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total actions',  value: allItems.length, cls: 'text-foreground' },
          { label: 'To do',          value: todo,           cls: 'text-muted-foreground' },
          { label: 'In progress',    value: inProgress,     cls: 'text-amber-600' },
          { label: 'Done',           value: done,           cls: 'text-score-green' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5 text-center">
            <p className={`text-3xl font-bold font-display ${s.cls}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="space-y-5">
        {plan.map(phase => {
          const c = PHASE_COLORS[phase.color];
          return (
            <div key={phase.id} className={`rounded-2xl border-2 ${c.border} overflow-hidden`}>
              {/* Phase header */}
              <div className={`${c.header} px-6 py-4 flex flex-wrap items-center gap-3 justify-between`}>
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${c.dot}`} />
                  <p className={`font-display font-bold text-lg ${c.label}`}>{phase.title}</p>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${c.badge}`}>{phase.timeline}</span>
                </div>
                <p className="text-sm text-muted-foreground">{phase.subtitle}</p>
              </div>

              {/* Items */}
              <div className="divide-y divide-border">
                {phase.items.map(item => (
                  <div key={item.id} className="px-6 py-4 flex gap-4 items-start bg-card hover:bg-muted/20 transition-colors">
                    {/* Status checkbox */}
                    <div className={`w-5 h-5 rounded border-2 shrink-0 mt-0.5 flex items-center justify-center ${
                      item.status === 'done' ? 'bg-score-green border-score-green' :
                      item.status === 'in-progress' ? 'border-amber-400 bg-amber-50' :
                      'border-border bg-card'
                    }`}>
                      {item.status === 'done' && <span className="text-white text-xs">✓</span>}
                      {item.status === 'in-progress' && <span className="text-amber-500 text-xs">◉</span>}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{CATEGORY_ICON[item.category]} {item.title}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>

                    <div className="flex flex-col gap-1.5 items-end shrink-0">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${EFFORT_STYLE[item.effort]}`}>
                        {item.effort.charAt(0).toUpperCase() + item.effort.slice(1)} effort
                      </span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${IMPACT_STYLE[item.impact]}`}>
                        {item.impact.charAt(0).toUpperCase() + item.impact.slice(1)} impact
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-6 flex flex-wrap gap-4 items-center justify-between">
        <div>
          <p className="font-display text-xl font-bold text-foreground">Want Cited to execute this plan for you?</p>
          <p className="text-sm text-muted-foreground mt-1">We handle schema, content writing, off-site outreach, and monthly reporting. Full-service from audit to citation.</p>
        </div>
        <a href="#" className="px-5 py-2.5 rounded-lg bg-[#008060] text-white font-semibold text-sm hover:bg-[#004c3f] transition-colors whitespace-nowrap">
          Book a strategy call →
        </a>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SampleAuditPage() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const { meta, overallScore, band, buyingPrompts, competitors, quickWins, pages, backlog, offSiteSignals, newPages, plan } = report;

  const activeTabCfg = TABS.find(t => t.id === activeTab)!;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f7f4]">

      {/* ── Top bar ── */}
      <header className="bg-[#0c1220] border-b border-white/10 shrink-0">
        <div className="flex items-center justify-between px-6 h-14 gap-4">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-white text-lg tracking-tight">Cited</span>
            <span className="text-white/20 text-lg">|</span>
            <span className="text-white/60 text-sm">AI Visibility Audit</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/40 hidden md:inline">Report #{meta.reportId} · 19 May 2026</span>
            <button className="px-3 py-1.5 rounded-lg border border-white/20 text-xs text-white/70 hover:bg-white/10 transition-colors">
              ↓ Export PDF
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 56px)' }}>

        {/* ── Left sidebar ── */}
        <aside className="w-60 shrink-0 bg-[#0f1928] border-r border-white/10 flex flex-col overflow-y-auto">
          {/* Brand */}
          <div className="px-5 pt-6 pb-4 border-b border-white/10">
            <p className="text-white font-display font-bold text-xl leading-tight">{meta.brand}</p>
            <p className="text-white/40 text-xs font-mono mt-0.5">{meta.domain}</p>
          </div>

          {/* Score gauge */}
          <div className="px-4 border-b border-white/10">
            <SidebarGauge score={overallScore} band={band} />
          </div>

          {/* Quick stats */}
          <div className="px-5 py-4 border-b border-white/10 grid grid-cols-2 gap-x-3 gap-y-3">
            {[
              { v: meta.pagesScanned, l: 'Pages' },
              { v: meta.promptsTested, l: 'Prompts' },
              { v: '£87k', l: 'At stake' },
              { v: '3.3×', l: 'Gap vs #1' },
            ].map(s => (
              <div key={s.l}>
                <p className="text-white font-bold text-lg tabular-nums">{s.v}</p>
                <p className="text-white/40 text-xs">{s.l}</p>
              </div>
            ))}
          </div>

          {/* Nav tabs */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {TABS.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all text-sm ${isActive ? 'bg-white/10 text-white font-semibold' : `text-white/50 ${tab.color}`}`}>
                  <span className={`w-2 h-2 rounded-full shrink-0 ${isActive ? tab.dot : 'bg-white/20'}`} />
                  <span className="flex-1 truncate">{tab.label}</span>
                  {tab.count && (
                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-md ${isActive ? `${tab.activeColor} text-white` : 'bg-white/10 text-white/40'}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-white/10">
            <p className="text-white/25 text-xs leading-relaxed">Rubric v2.4 · {meta.pagesScanned} pages · {meta.enginesProbed.length} engines</p>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 overflow-y-auto">
          {/* Section header bar */}
          <div className="sticky top-0 z-10 border-b border-border bg-white/80 backdrop-blur-sm px-8 py-4 flex items-center gap-3">
            <span className={`w-2.5 h-2.5 rounded-full ${activeTabCfg.dot}`} />
            <h1 className="font-display font-bold text-foreground text-lg">{activeTabCfg.label}</h1>
            {activeTabCfg.count && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md text-white ${activeTabCfg.activeColor}`}>
                {activeTabCfg.count}
              </span>
            )}
          </div>

          {/* Panel content */}
          <div className="p-8">
            {activeTab === 'overview'    && <OverviewPanel />}
            {activeTab === 'heatmap'     && <HeatmapPanel prompts={buyingPrompts} />}
            {activeTab === 'competitors' && <CompetitorsPanel competitors={competitors} />}
            {activeTab === 'quickwins'   && <QuickWinsPanel quickWins={quickWins} />}
            {activeTab === 'pages'       && <PagesPanel pages={pages} />}
            {activeTab === 'offsite'     && <OffsitePanel signals={offSiteSignals} />}
            {activeTab === 'backlog'     && <BacklogPanel backlog={backlog} />}
            {activeTab === 'newpages'    && <NewPagesPanel newPages={newPages} />}
            {activeTab === 'plan'        && <FullPlanPanel plan={plan} />}
          </div>
        </main>

      </div>
    </div>
  );
}
