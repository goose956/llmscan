import { z } from 'zod';
import { getScan, storeEmail } from '@/lib/db';
import { Resend } from 'resend';
import { renderToBuffer } from '@react-pdf/renderer';
import { createElement } from 'react';
import { ReportPDF } from '@/lib/pdf/ReportPDF';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const schema = z.object({
  scanId: z.string().min(1),
  email: z.string().email('Please enter a valid email address.'),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const { scanId, email } = parsed.data;

  const scan = await getScan(scanId);
  if (!scan || scan.status !== 'complete') {
    return Response.json({ error: 'Scan not found or not yet complete.' }, { status: 404 });
  }

  // Store the email
  await storeEmail(scanId, email);

  // Fire-and-forget the email send (don't block the response)
  sendReportEmail(email, scanId, scan).catch((err) =>
    console.error('[email-capture] Email send failed:', err)
  );

  return Response.json({ success: true });
}

async function sendReportEmail(
  email: string,
  scanId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scan: any
) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.warn('[email-capture] RESEND_API_KEY not set — skipping email.');
    return;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://llmscan.app';
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'reports@llmscan.app';
  const resend = new Resend(resendKey);

  // Generate the PDF
  let pdfBuffer: Buffer | null = null;
  try {
    pdfBuffer = await renderToBuffer(createElement(ReportPDF, { scan }));
  } catch (err) {
    console.error('[email-capture] PDF generation failed:', err);
  }

  const bandLabel =
    scan.band === 'green' ? 'LLM-Ready' : scan.band === 'amber' ? 'Partially Visible' : 'Invisible to AI';

  await resend.emails.send({
    from: `LLM Scan <${fromEmail}>`,
    to: email,
    subject: `Your LLM-Readiness Report for ${scan.domain} — Score: ${scan.score}/100`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="font-family: system-ui, sans-serif; color: #1a1a1a; background: #fafaf8; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 48px 24px;">
    <div style="margin-bottom: 32px;">
      <span style="font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #6b6560;">LLM Scan Report</span>
      <h1 style="font-size: 28px; margin: 8px 0 4px; color: #1a1a1a;">Your report is ready</h1>
      <p style="color: #6b6560; margin: 0;">${scan.domain}</p>
    </div>

    <div style="background: #fff; border: 1px solid #e8e3dc; border-radius: 12px; padding: 32px; margin-bottom: 24px; text-align: center;">
      <div style="font-size: 64px; font-weight: 800; color: ${scan.band === 'green' ? '#166534' : scan.band === 'amber' ? '#92400e' : '#991b1b'};">${scan.score}</div>
      <div style="font-size: 14px; color: #6b6560; margin-top: 4px;">out of 100 · ${bandLabel}</div>
    </div>

    <p style="color: #3d3d3d; line-height: 1.6;">We've analysed your page against 5 LLM-readiness signals and identified the highest-impact improvements you can make to get cited by ChatGPT, Perplexity, and Google AI Mode.</p>

    <a href="${appUrl}/scan/${scanId}" style="display: inline-block; background: #1b3a6b; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; margin: 16px 0;">
      View your full report →
    </a>

    ${pdfBuffer ? '<p style="color: #6b6560; font-size: 14px;">Your PDF report is also attached to this email.</p>' : ''}

    <hr style="border: none; border-top: 1px solid #e8e3dc; margin: 32px 0;">

    <p style="color: #6b6560; font-size: 14px; line-height: 1.6;">
      This is a single-page pre-scan. For a full-site audit (50–100 pages, deeper signals, competitor benchmark), <a href="${process.env.NEXT_PUBLIC_CALENDLY_URL || appUrl}" style="color: #1b3a6b;">book a call with us</a>.
    </p>
  </div>
</body>
</html>`,
    attachments: pdfBuffer
      ? [
          {
            filename: `llm-readiness-report-${scan.domain.replace(/[^a-z0-9-]/gi, '-')}.pdf`,
            content: pdfBuffer,
          },
        ]
      : [],
  });
}
