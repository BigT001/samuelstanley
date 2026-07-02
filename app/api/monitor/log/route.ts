import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendWebhookAlert, sendEmailAlert } from '@/lib/alerts';

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

function parseUserAgent(ua: string) {
  let browser = 'Unknown Browser';
  let os = 'Unknown OS';

  if (!ua) return { browser, os };

  // OS detection
  if (/Windows/i.test(ua)) os = 'Windows';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
  else if (/Mac/i.test(ua)) os = 'macOS';
  else if (/Linux/i.test(ua)) os = 'Linux';
  else if (/CrOS/i.test(ua)) os = 'ChromeOS';

  // Browser detection
  if (/Chrome/i.test(ua) && !/Edge/i.test(ua) && !/OPR/i.test(ua)) browser = 'Chrome';
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
  else if (/Firefox/i.test(ua)) browser = 'Firefox';
  else if (/Edge|Edg/i.test(ua)) browser = 'Edge';
  else if (/OPR|Opera/i.test(ua)) browser = 'Opera';
  else if (/MSIE|Trident/i.test(ua)) browser = 'Internet Explorer';

  return { browser, os };
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
    
    // Parse browser and OS on server side if missing
    const userAgent = request.headers.get('user-agent') || metadata.userAgent || '';
    const parsedAgent = parseUserAgent(userAgent);
    if (!metadata.os) metadata.os = parsedAgent.os;
    if (!metadata.browser) metadata.browser = parsedAgent.browser;

    // Build/enrich location metadata
    if (!metadata.location || metadata.location.city === 'Unknown' || metadata.location.country === 'Unknown') {
      let resolvedCountry = request.headers.get('x-vercel-ip-country') || null;
      let resolvedCity = request.headers.get('x-vercel-ip-city') || null;
      let resolvedRegion = request.headers.get('x-vercel-ip-country-region') || null;
      let resolvedOrg = 'Server Geolocation';

      // Fallback: If Vercel headers did not resolve detailed city/region, query ip-api.com server-side
      if ((!resolvedCity || resolvedCity === 'Unknown') && clientIp !== '127.0.0.1' && clientIp !== '::1') {
        try {
          const geoRes = await fetch(`http://ip-api.com/json/${clientIp}`);
          const geoData = await geoRes.json();
          if (geoData && geoData.status === 'success') {
            resolvedCity = geoData.city;
            resolvedRegion = geoData.regionName;
            resolvedCountry = geoData.country;
            resolvedOrg = geoData.isp;
          }
        } catch (e) {
          console.warn("Server-side IP lookup warning:", e);
        }
      }

      metadata.location = {
        ip: clientIp,
        city: resolvedCity || metadata.location?.city || 'Unknown',
        region: resolvedRegion || metadata.location?.region || 'Unknown',
        country: resolvedCountry || metadata.location?.country || 'Unknown',
        org: resolvedOrg
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
    if (level === 'error' || level === 'fatal' || level === 'warn') {
      if (client.webhookUrl && (level === 'error' || level === 'fatal')) {
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
      if (client.notificationEmail) {
        // Async trigger email alert (do not block client request response)
        sendEmailAlert(
          client.notificationEmail,
          client.name,
          client.url,
          level,
          message,
          stack || undefined
        );
      }
    }

    return NextResponse.json({ success: true, logId: newLog.id }, { status: 200, headers: corsHeaders });
  } catch (error: any) {
    console.error('Log Ingestion Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}
