import { cn } from '@/lib/utils';
import type { ScoreBand } from '@/lib/types';

interface ScoreGaugeProps {
  score: number;
  band: ScoreBand;
  className?: string;
}

const BAND_COLORS: Record<ScoreBand, { stroke: string; text: string; label: string; bg: string }> = {
  green: { stroke: '#22C55E', text: '#166534', label: 'LLM-Ready', bg: '#DCFCE7' },
  amber: { stroke: '#F59E0B', text: '#92400E', label: 'Partially Visible', bg: '#FEF3C7' },
  red: { stroke: '#EF4444', text: '#991B1B', label: 'Invisible to AI', bg: '#FEE2E2' },
};

// SVG arc helper — draws a circle arc from startAngle to endAngle
function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
): string {
  const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;
  const x1 = cx + r * Math.cos(toRad(startAngle));
  const y1 = cy + r * Math.sin(toRad(startAngle));
  const x2 = cx + r * Math.cos(toRad(endAngle));
  const y2 = cy + r * Math.sin(toRad(endAngle));
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
}

export function ScoreGauge({ score, band, className }: ScoreGaugeProps) {
  const colors = BAND_COLORS[band];

  // The gauge arc spans 240° (from -120° to +120°, with 0° at top)
  const START = -120;
  const SWEEP = 240;
  const fillAngle = START + (SWEEP * Math.min(100, Math.max(0, score))) / 100;

  const cx = 100;
  const cy = 90;
  const r = 72;
  const strokeWidth = 10;

  const trackPath = describeArc(cx, cy, r, START, START + SWEEP);
  const fillPath = score > 0 ? describeArc(cx, cy, r, START, fillAngle) : '';

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="relative">
        <svg viewBox="0 0 200 160" width={220} height={176} aria-label={`LLM-Readiness Score: ${score} out of 100`}>
          {/* Track */}
          <path
            d={trackPath}
            fill="none"
            stroke="#E8E3DC"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Fill */}
          {fillPath && (
            <path
              d={fillPath}
              fill="none"
              stroke={colors.stroke}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s ease-out' }}
            />
          )}
          {/* Score number */}
          <text
            x={cx}
            y={cy + 8}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="44"
            fontWeight="800"
            fontFamily="Fraunces, Georgia, serif"
            fill={colors.text}
          >
            {score}
          </text>
          {/* /100 label */}
          <text
            x={cx}
            y={cy + 34}
            textAnchor="middle"
            fontSize="12"
            fontFamily="Inter, system-ui, sans-serif"
            fill="#9CA3AF"
          >
            out of 100
          </text>
        </svg>
      </div>

      {/* Band badge */}
      <div
        className="mt-1 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold"
        style={{ backgroundColor: colors.bg, color: colors.text }}
      >
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: colors.stroke }}
          aria-hidden="true"
        />
        {colors.label}
      </div>
    </div>
  );
}
