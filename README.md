# LLM Scan — LLM-Readiness Pre-Scan for Ecommerce

A polished lead-gen tool that scans a single ecommerce page and produces an **LLM-Readiness Score** — a measure of how visible that page is likely to be when shoppers ask ChatGPT, Perplexity, Claude, or Google AI Mode for product recommendations.

## Tech stack

- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS** (custom design system — Fraunces serif + Inter sans)
- **Firecrawl API** — page crawling and content extraction
- **Anthropic Claude** (`claude-sonnet-4-5`) — AI scoring + finding generation + competitor probe
- **@react-pdf/renderer** — server-side PDF generation
- **Resend** — email delivery with PDF attachment
- **PostgreSQL** (Vercel Postgres, Supabase, Railway, or any Postgres URL)

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.local.example .env.local
# Fill in FIRECRAWL_API_KEY, ANTHROPIC_API_KEY, RESEND_API_KEY, DATABASE_URL

# 3. Create the database table (skip if using in-memory for local dev)
npm run db:setup

# 4. Start the development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | ✅ | Anthropic Console — [console.anthropic.com](https://console.anthropic.com) |
| `FIRECRAWL_API_KEY` | ✅ | Firecrawl — [firecrawl.dev](https://firecrawl.dev) |
| `RESEND_API_KEY` | ✅ | Resend — [resend.com](https://resend.com) |
| `RESEND_FROM_EMAIL` | ✅ | Verified sender address on Resend |
| `DATABASE_URL` | ⚪ | PostgreSQL connection string. If omitted, in-memory store is used (dev only) |
| `NEXT_PUBLIC_APP_URL` | ⚪ | Your deployed URL (used in emails) |
| `NEXT_PUBLIC_CALENDLY_URL` | ⚪ | Calendly link shown in the upsell CTA |

**Without `DATABASE_URL`:** Scan results are stored in memory and lost on server restart. Fine for local testing, required for production.

## Cost per scan

| Service | Cost |
|---|---|
| Firecrawl `/v1/scrape` | ~$0.02 |
| Claude (scoring + findings + competitor probe) | ~$0.05–0.08 |
| **Total** | **~$0.07/scan** |

## Deployment on Vercel

1. Push to GitHub
2. Import into Vercel
3. Add environment variables in the Vercel dashboard
4. **Important:** Set `maxDuration = 60` is already configured in the scan route. This requires **Vercel Pro** (Hobby plan has a 10-second function timeout, which is too short for a full scan). Consider using Vercel Pro or configuring edge streaming for Hobby.

### Vercel Postgres

If using Vercel Postgres, copy the `POSTGRES_URL` from your Vercel dashboard and add it as `DATABASE_URL` in your environment variables.

## The 5-signal scoring rubric

| Signal | Weight | What's measured |
|---|---|---|
| Product Schema Completeness | ×25 | Product + Offer JSON-LD with name, brand, SKU, price, availability, ratings |
| FAQPage Schema + Quote-ready answers | ×20 | FAQPage markup with 3+ answers under 80 words each |
| Intent-Aligned Title & Introduction | ×20 | Claude judges: does the title match how a shopper phrases a buying query? |
| Technical Specificity & Measurable Claims | ×20 | Claude counts: specs, dimensions, numbered features, performance stats |
| Review & Rating Signals | ×15 | AggregateRating schema, Review schemas with text, visible review snippets |

**Score bands:** 70–100 green (LLM-Ready) · 40–69 amber (Partially Visible) · 0–39 red (Invisible to AI)

## Project structure

```
app/
  page.tsx                    # Landing page
  scan/[scanId]/page.tsx      # Results page
  api/
    scan/route.ts             # POST — run scan (SSE streaming)
    scan/[scanId]/route.ts    # GET — fetch scan result
    pdf/[scanId]/route.ts     # GET — stream PDF
    email-capture/route.ts    # POST — store email + send report
lib/
  types.ts                    # Shared TypeScript types
  db.ts                       # Postgres client + in-memory fallback
  firecrawl.ts                # Firecrawl API wrapper
  claude.ts                   # Anthropic client + AI scoring functions
  scoring.ts                  # 5-signal scoring logic
  competitor-probe.ts         # Claude web search competitor benchmark
  pdf/ReportPDF.tsx           # @react-pdf/renderer PDF component
  utils.ts                    # cn(), formatDate(), getDomain()
components/
  ScanInput.tsx               # URL input + SSE progress display
  ScoreGauge.tsx              # SVG arc gauge
  FindingCard.tsx             # Finding display card
  CompetitorBenchmark.tsx     # Competitor probe results
  UpsellCTA.tsx               # £497 audit upsell
  EmailGate.tsx               # Email capture overlay
  ui/                         # button, input, card, badge, progress
scripts/
  setup-db.ts                 # Creates the scans table
```
