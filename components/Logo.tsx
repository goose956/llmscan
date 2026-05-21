import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  /** Show icon + wordmark (default) or icon only */
  iconOnly?: boolean;
}

export function Logo({ className, size = 'default', iconOnly = false }: LogoProps) {
  const iconClass =
    size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-11 h-11' : 'w-8 h-8';
  const textClass =
    size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg';

  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      {/* ── Icon mark ── */}
      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={iconClass}
        aria-hidden="true"
      >
        {/* Background */}
        <rect width="36" height="36" rx="9" fill="#004c3f" />

        {/* Left citation bracket */}
        <path
          d="M14 10H9V26H14"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right citation bracket */}
        <path
          d="M22 10H27V26H22"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Golden checkmark — "cited & verified" */}
        <path
          d="M15 18.5L17.2 21L21 15.5"
          stroke="#FCD34D"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* ── Wordmark ── */}
      {!iconOnly && (
        <span className={cn('font-display leading-none', textClass)}>
          <span className="font-bold text-foreground">cited</span>
          <span className="font-semibold text-primary">.shop</span>
        </span>
      )}
    </span>
  );
}
