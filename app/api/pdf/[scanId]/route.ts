import { getScan } from '@/lib/db';
import { renderToBuffer } from '@react-pdf/renderer';
import { createElement } from 'react';
import { ReportPDF } from '@/lib/pdf/ReportPDF';

// Must be Node.js — @react-pdf/renderer needs Node APIs
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ scanId: string }> }
) {
  const { scanId } = await params;

  const scan = await getScan(scanId);
  if (!scan || scan.status !== 'complete') {
    return new Response('Scan not found or not yet complete.', { status: 404 });
  }

  try {
    const pdfBuffer = await renderToBuffer(createElement(ReportPDF, { scan }));
    const domain = scan.domain.replace(/[^a-z0-9-]/gi, '-');

    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="llm-readiness-report-${domain}.pdf"`,
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (err) {
    console.error('[pdf] Render error:', err);
    return new Response('Failed to generate PDF.', { status: 500 });
  }
}
