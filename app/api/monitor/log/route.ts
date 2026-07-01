import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendWebhookAlert } from '@/lib/alerts';

/**
 * CORS options response handler
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Client-Key, Authorization',
    },
  });
}

/**
 * POST /api/monitor/log
 * Public log ingestion endpoint for client sites.
 * Expects X-Client-Key header to identify the client.
 */
export async function POST(request: Request) {
  // CORS Headers definition
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Client-Key, Authorization',
  };

  try {
    // ── Resolve client API Key ───────────────────────────────────────────────
    let apiKey = request.headers.get('x-client-key');
    if (!apiKey) {
      const authHeader = request.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        apiKey = authHeader.substring(7).trim();
      }
    }

    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'Missing Client API Key' }, { status: 401, headers: corsHeaders });
    }

    // Verify key in db
    const client = await db.clientSite.findUnique({
      where: { apiKey }
    });

    if (!client) {
      return NextResponse.json({ success: false, error: 'Invalid Client API Key' }, { status: 403, headers: corsHeaders });
    }

    if (!client.active) {
      return NextResponse.json({ success: false, error: 'Monitoring suspended for this client' }, { status: 403, headers: corsHeaders });
    }

    // ── Parse request payload ────────────────────────────────────────────────
    const body = await request.json().catch(() => ({}));
    const { level = 'info', message, stack, metadata = {} } = body;

    if (!message) {
      return NextResponse.json({ success: false, error: 'Log message is required' }, { status: 400, headers: corsHeaders });
    }

    // Resolve client IP and Geolocation headers from request
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || '127.0.0.1';
    const country = request.headers.get('x-vercel-ip-country') || null;
    const city = request.headers.get('x-vercel-ip-city') || null;
    const region = request.headers.get('x-vercel-ip-country-region') || null;

    // Build/enrich location metadata
    if (!metadata.location) {
      metadata.location = {
        ip: clientIp,
        city: city || 'Unknown',
        region: region || 'Unknown',
        country: country || 'Unknown',
        org: 'Server Geolocation'
      };
    } else {
      if (!metadata.location.ip || metadata.location.ip === 'Unknown') {
        metadata.location.ip = clientIp;
      }
    }

    // ── Write log to database ────────────────────────────────────────────────
    const metaStr = JSON.stringify(metadata);
    const newLog = await db.clientLog.create({
      data: {
        clientId: client.id,
        level,
        message,
        stack,
        metadata: metaStr,
      }
    });

    // ── Handle error alerts ──────────────────────────────────────────────────
    if ((level === 'error' || level === 'fatal') && client.webhookUrl) {
      // Async trigger webhook alert (do not block client request response)
      sendWebhookAlert(
        client.webhookUrl,
        client.name,
        client.url,
        level,
        message,
        stack || undefined
      );
    }

    return NextResponse.json({ success: true, logId: newLog.id }, { status: 200, headers: corsHeaders });
  } catch (error: any) {
    console.error('Log Ingestion Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}
