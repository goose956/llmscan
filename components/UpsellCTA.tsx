import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';

const FEATURES = [
  '50–100 pages scored across your entire store',
  '30+ buying intent prompts tested across 4 AI engines',
  'Full competitor citation map with domain-level data',
  'Off-site signal analysis — Reddit, YouTube, review sites',
  'Priority implementation backlog for your dev team',
  '48-hour turnaround',
];

export function UpsellCTA() {
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL;

  return (
    <section className="rounded-xl overflow-hidden border border-primary/20">
      {/* Header */}
      <div className="bg-primary px-6 py-5">
        <p className="text-xs font-bold uppercase tracking-widest text-primary-foreground/60">
          Next step
        </p>
        <h2 className="mt-1 font-display text-2xl font-semibold text-primary-foreground">
          Get the full-site audit
        </h2>
      </div>

      {/* Body */}
      <div className="bg-card px-6 py-6 space-y-5">
        <p className="text-sm text-muted-foreground leading-relaxed">
          This pre-scan covered one page against 5 signals. The full-site audit maps every page
          in your store, probes 30+ buying intents, and delivers an implementation backlog your
          dev team can execute immediately.
        </p>

        <ul className="space-y-2">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 items-start">
          {calendlyUrl ? (
            <Button asChild size="lg" className="w-full sm:w-auto">
              <a href={calendlyUrl} target="_blank" rel="noopener noreferrer">
                Book a call — £497
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          ) : (
            <Button size="lg" disabled className="w-full sm:w-auto cursor-default opacity-100">
              Full-Site Audit · £497
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
          <p className="text-xs text-muted-foreground self-center">
            48-hr turnaround · Includes implementation backlog
          </p>
        </div>
      </div>
    </section>
  );
}
