import { cn } from '@/lib/utils';
import type { Finding } from '@/lib/types';

interface FindingCardProps {
  finding: Finding;
  index: number;
}

const EFFORT_STYLES = {
  low: 'bg-green-50 text-green-700 border-green-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  high: 'bg-red-50 text-red-700 border-red-200',
};

const SCORE_BAND = (score: number) => {
  if (score >= 7) return { bg: 'bg-score-green-bg', text: 'text-score-green' };
  if (score >= 4) return { bg: 'bg-score-amber-bg', text: 'text-score-amber' };
  return { bg: 'bg-score-red-bg', text: 'text-score-red' };
};

export function FindingCard({ finding, index }: FindingCardProps) {
  const scoreStyle = SCORE_BAND(finding.score);

  return (
    <article className="rounded-xl border border-border bg-card p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
            {index + 1}
          </span>
          <h3 className="font-display text-lg font-semibold text-foreground leading-tight">
            {finding.signalName}
          </h3>
        </div>
        <div
          className={cn(
            'shrink-0 rounded-full px-3 py-1 text-xs font-bold',
            scoreStyle.bg,
            scoreStyle.text
          )}
        >
          {finding.score}/10
        </div>
      </div>

      {/* Issue */}
      <div className="space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          The issue
        </span>
        <p className="text-sm font-medium text-foreground">{finding.issue}</p>
      </div>

      {/* Why it matters */}
      <div className="space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Why it matters
        </span>
        <p className="text-sm text-muted-foreground leading-relaxed">{finding.whyItMatters}</p>
      </div>

      {/* The fix */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">
          The fix
        </span>
        <p className="text-sm text-foreground leading-relaxed">{finding.specificFix}</p>
      </div>

      {/* Effort */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Effort:</span>
        <span
          className={cn(
            'rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize',
            EFFORT_STYLES[finding.effort]
          )}
        >
          {finding.effort}
        </span>
      </div>
    </article>
  );
}
