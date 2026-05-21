'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';
import Image from 'next/image';

const FEATURES = [
  '50–100 pages scored across your entire store',
  '30+ buying intent prompts tested across 4 AI engines',
  'Full competitor citation map with domain-level data',
  'Off-site signal analysis — Reddit, YouTube, review sites',
  'Priority implementation backlog for your dev team',
  '48-hour turnaround',
];

const PREVIEWS = [
  {
    label: 'Overview',
    src: '/preview-overview.jpg',
    caption: 'Site-level score, top issues, and competitor citation gap',
  },
  {
    label: 'AI Heatmap',
    src: '/preview-heatmap.jpg',
    caption: '30 buying prompts × 4 AI engines — see exactly where you're invisible',
  },
  {
    label: 'Quick Wins',
    src: '/preview-quickwins.jpg',
    caption: 'Prioritised action list with effort estimates and ready-to-use code',
  },
];

export function UpsellCTA() {
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL;
  const [activePreview, setActivePreview] = useState(0);

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

      {/* Dashboard preview */}
      <div className="bg-muted/40 border-b border-border px-4 pt-4 pb-0">
        <p className="text-xs font-medium text-muted-foreground mb-3 px-1">
          This is what your full audit dashboard looks like:
        </p>

        {/* Tab strip */}
        <div className="flex gap-1">
          {PREVIEWS.map((p, i) => (
            <button
              key={p.label}
              onClick={() => setActivePreview(i)}
              className={`px-3 py-1.5 rounded-t-lg text-xs font-medium transition-colors border-t border-x ${
                activePreview === i
                  ? 'bg-card border-border text-foreground'
                  : 'bg-transparent border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Screenshot */}
        <div className="relative rounded-tr-xl overflow-hidden border border-b-0 border-border shadow-md">
          <Image
            src={PREVIEWS[activePreview].src}
            alt={PREVIEWS[activePreview].caption}
            width={930}
            height={650}
            className="w-full object-cover object-top"
            priority
          />
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-muted/70 to-transparent" />
          <p className="absolute bottom-2 left-3 right-3 text-[11px] text-muted-foreground text-center">
            {PREVIEWS[activePreview].caption}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="bg-card px-6 py-6 space-y-5">
        <p className="text-sm text-muted-foreground leading-relaxed">
          This pre-scan covered one page against 5 signals. The full-site audit maps every page
          in your Shopify store, probes 30+ buying intents, and delivers an implementation backlog
          your dev team can execute immediately.
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
