import { z } from 'zod';
import { crawlPage } from '@/lib/firecrawl';
import { scoreAllSignals } from '@/lib/scoring';
import { probeCompetitors } from '@/lib/competitor-probe';
import { generateFindings } from '@/lib/claude';
import { createScan, updateScan } from '@/lib/db';

// Vercel Pro required for scans > 10 seconds
export const maxDuration = 60;

const scanSchema = z.object({
  url: z.string().url('Please enter a valid URL (include https://)'),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON in request body.' }, { status: 400 });
  }

  const parsed = scanSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const { url } = parsed.data;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch {
          // Stream already closed — ignore
        }
      };

      try {
        send({ type: 'progress', message: 'Initialising scan…', step: 1, total: 6 });
        const scanId = await createScan(url);

        // ── Step 2: Crawl ────────────────────────────────────────────────────
        send({ type: 'progress', message: 'Crawling your page with Firecrawl…', step: 2, total: 6 });
        const crawlData = await crawlPage(url);

        send({
          type: 'progress',
          message: `Found ${crawlData.schemaTypes.length} schema type${crawlData.schemaTypes.length !== 1 ? 's' : ''}, ${crawlData.wordCount.toLocaleString()} words of content…`,
          step: 3,
          total: 6,
        });

        // ── Step 3: Score ────────────────────────────────────────────────────
        send({ type: 'progress', message: 'Scoring 5 LLM-readiness signals with AI analysis…', step: 4, total: 6 });
        const scoring = await scoreAllSignals(crawlData);

        // ── Step 4: Competitor probe + findings (parallel) ───────────────────
        send({ type: 'progress', message: 'Probing AI engines for competitor citations…', step: 5, total: 6 });
        const domain = (() => {
          try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; }
        })();

        const [findings, competitorData] = await Promise.all([
          generateFindings(scoring.signals, crawlData),
          probeCompetitors(scoring.category, crawlData.metadata.title, domain),
        ]);

        // ── Step 5: Save & complete ──────────────────────────────────────────
        send({ type: 'progress', message: 'Compiling your report…', step: 6, total: 6 });
        await updateScan(scanId, {
          status: 'complete',
          score: scoring.total,
          band: scoring.band,
          signals: scoring.signals,
          findings,
          competitorData,
          metadata: crawlData.metadata,
        });

        send({ type: 'complete', scanId });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred during the scan.';
        console.error('[scan] Error:', err);
        send({ type: 'error', message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
