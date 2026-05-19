import { getSettingStatuses, saveSetting } from '@/lib/settings';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  const statuses = getSettingStatuses();
  return NextResponse.json(statuses);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { key?: string; value?: string };
    const { key, value } = body;

    if (!key || typeof key !== 'string') {
      return NextResponse.json({ error: 'Missing key.' }, { status: 400 });
    }
    if (value === undefined || typeof value !== 'string') {
      return NextResponse.json({ error: 'Missing value.' }, { status: 400 });
    }
    if (!value.trim()) {
      return NextResponse.json({ error: 'Value cannot be empty.' }, { status: 400 });
    }

    await saveSetting(key, value.trim());
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
