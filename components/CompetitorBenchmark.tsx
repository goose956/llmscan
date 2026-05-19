import type { CompetitorProbeResult } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CompetitorBenchmarkProps {
  data: CompetitorProbeResult;
}

export function CompetitorBenchmark({ data }: CompetitorBenchmarkProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 space-y-5">
      <div className="space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Competitor Benchmark
        </p>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Who AI engines cite when shoppers ask about{' '}
          <span className="italic">{data.category}</span>
        </h2>
      </div>

      {/* Prompt results */}
      <div className="space-y-3">
        {data.prompts.map((p, i) => (
          <div
            key={i}
            className="flex items-start gap-4 rounded-lg border border-border p-4"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground font-medium leading-snug">
                &ldquo;{p.prompt}&rdquo;
              </p>
              {p.competitorsCited.length > 0 && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Cited: {p.competitorsCited.slice(0, 3).join(', ')}
                </p>
              )}
            </div>
            <div
              className={cn(
                'shrink-0 rounded-full px-3 py-1 text-xs font-bold',
                p.brandCited
                  ? 'bg-score-green-bg text-score-green'
                  : 'bg-score-red-bg text-score-red'
              )}
            >
              {p.brandCited ? '✓ Cited' : '✗ Not cited'}
            </div>
          </div>
        ))}
      </div>

      {/* Analysis */}
      <div className="rounded-lg bg-muted/60 p-4">
        <p className="text-sm text-foreground leading-relaxed">{data.analysis}</p>
      </div>

      {data.topCompetitor && (
        <p className="text-xs text-muted-foreground">
          Top competitor identified:{' '}
          <span className="font-semibold text-foreground">{data.topCompetitor}</span>
          {' '}— The full audit maps all 30+ prompt variants and their citation patterns.
        </p>
      )}
    </section>
  );
}
