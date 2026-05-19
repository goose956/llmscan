import { getScan } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ scanId: string }> }
) {
  const { scanId } = await params;

  if (!scanId || typeof scanId !== 'string') {
    return Response.json({ error: 'Invalid scan ID.' }, { status: 400 });
  }

  const scan = await getScan(scanId);
  if (!scan) {
    return Response.json({ error: 'Scan not found.' }, { status: 404 });
  }

  return Response.json(scan);
}
