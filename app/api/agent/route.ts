import { NextResponse } from 'next/server';
import { runAgent } from '@/scripts/agent';

/**
 * POST /api/agent
 * Body: { url?: string }
 * Header: Authorization: Bearer <AGENT_SECRET>
 *
 * Secured with AGENT_SECRET env var to prevent unauthorized triggering.
 * In production, set this in Vercel environment variables.
 */
export async function POST(request: Request) {
  // ── Auth check ─────────────────────────────────────────────────────────────
  const secret = process.env.PASSWORD;
  if (secret) {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '').trim();
    if (token !== secret) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
  } else {
    return NextResponse.json({ success: false, error: 'Server not configured (PASSWORD missing)' }, { status: 500 });
  }

  // ── Run agent ──────────────────────────────────────────────────────────────
  try {
    const body = await request.json().catch(() => ({}));
    const { url } = body as { url?: string };

    const result = await runAgent(url);

    return NextResponse.json({ success: true, result });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Agent API Error:', msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
