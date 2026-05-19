import type { Metadata } from 'next';
import { ScanInput } from '@/components/ScanInput';

export const metadata: Metadata = {
  title: 'LLM Scan — Is your ecommerce store visible to AI?',
};

const TRUST_SIGNALS = [
  { stat: '71%', label: 'of LLM answers cite pages with FAQPage schema' },
  { stat: '2.8×', label: 'more citations for pages with complete Product schema' },
  { stat: '30s', label: 'to get your full LLM-readiness score' },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Paste a product URL',
    body: 'Any product or collection page from your Shopify, WooCommerce, or custom store.',
  },
  {
    step: '02',
    title: 'We analyse 5 signals',
    body: 'Schema completeness, FAQ content, intent alignment, technical specificity, and review signals — all weighted by LLM citation research.',
  },
  {
    step: '03',
    title: 'Get your score + findings',
    body: '3 specific, actionable findings written by AI for your exact page. Plus: a live competitor benchmark.',
  },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-12 sm:pt-24 sm:pb-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-6">
            Free LLM-Readiness Pre-Scan
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground leading-tight tracking-tight">
            Is your store visible<br />
            when shoppers ask{' '}
            <span className="text-primary italic">AI?</span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl">
            ChatGPT, Perplexity, and Google AI Mode now answer millions of &ldquo;what should I buy&rdquo;
            questions every day. Paste any product page URL and find out if your store gets cited —
            or if your competitors do instead.
          </p>
        </div>

        {/* Input */}
        <div className="mt-10">
          <ScanInput />
        </div>

        <p className="mt-4 text-xs text-muted-foreground pl-1">
          Works with Shopify, WooCommerce, Magento, and any custom storefront.
          No account needed.
        </p>
      </section>

      {/* ── Trust signals ────────────────────────────────────────────────────── */}
      <section className="border-y border-border bg-muted/40">
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
            What your free report includes
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: 'LLM-Readiness Score',
                body: 'A single 0–100 score across 5 weighted signals. Colour-banded: LLM-Ready (green), Partially Visible (amber), or Invisible to AI (red).',
              },
              {
                title: '5-Signal Breakdown',
                body: 'Individual scores for Product schema, FAQPage markup, intent alignment, technical specificity, and review signals — each with a one-sentence explanation.',
              },
              {
                title: 'Top 3 Findings',
                body: 'Your 3 biggest opportunities, written by Claude specifically for your page — with citations from LLM research and a concrete fix (not generic SEO advice).',
              },
              {
                title: 'Live Competitor Benchmark',
                body: 'We run 3 real buying prompts in your category and tell you exactly which brands get cited instead of you. This is the part people screenshot.',
              },
              {
                title: 'Downloadable PDF Report',
                body: 'A polished, shareable PDF you can take to your team or agency. Emailed to you automatically.',
              },
              {
                title: 'A preview of what we held back',
                body: "5 more issues, off-site signal analysis, 30+ prompt taxonomy, site-level scoring — all reserved for the £497 full audit. You'll see exactly what you're missing.",
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
