import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendWebhookAlert, sendEmailAlert } from '@/lib/alerts';
import https from 'https';
import { URL } from 'url';

function checkAuth(request: Request): boolean {
  const secret = process.env.PASSWORD;
  if (!secret) return false;
  
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '').trim();
  return token === secret;
}

/**
 * Node HTTPS certificate resolver to check SSL validity
 */
function getSSLExpiry(urlString: string): Promise<Date | null> {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(urlString);
      if (parsed.protocol !== 'https:') return resolve(null);

      const options = {
        hostname: parsed.hostname,
        port: 443,
        method: 'GET',
        rejectUnauthorized: false, // fetch certificate details even if invalid/expired
        agent: false,
      };

      const req = https.request(options, (res) => {
        // Retrieve peer certificate info
        const cert = (res.socket as any).getPeerCertificate(true);
        if (cert && cert.valid_to) {
          resolve(new Date(cert.valid_to));
        } else {
          resolve(null);
        }
        res.resume(); // consume response stream to release socket
      });

      req.on('error', () => resolve(null));
      req.setTimeout(4000, () => {
        req.destroy();
        resolve(null);
      });
      req.end();
    } catch {
      resolve(null);
    }
  });
}

/**
 * Helper to ping a single website and fetch stats
 */
async function pingWebsite(client: { id: string; name: string; url: string; status: string; webhookUrl: string | null; notificationEmail: string | null }) {
  const startTime = Date.now();
  let status: 'up' | 'down' = 'down';
  let responseTime = 0;
  let sslExpiry: Date | null = null;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout limit

    const res = await fetch(client.url, {
      method: 'GET',
      headers: {
        'User-Agent': 'PROmonitor/1.0',
      },
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timeoutId);
    responseTime = Date.now() - startTime;

    // A response is considered up if it answers with standard codes, 5xx usually implies server-down issues.
    status = res.status >= 500 ? 'down' : 'up';
  } catch (error) {
    status = 'down';
    responseTime = Date.now() - startTime;
  }

  // Fetch SSL certificates only for HTTPS
  if (client.url.startsWith('https://')) {
    sslExpiry = await getSSLExpiry(client.url);
  }

  // Update Database
  const lastPing = new Date();
  const updatedClient = await db.clientSite.update({
    where: { id: client.id },
    data: {
      status,
      responseTime,
      lastPing,
      sslExpiry: sslExpiry || undefined,
    },
  });

  // ── Dispatch alert if status changed to DOWN ─────────────────────────────
  if (status === 'down' && client.status !== 'down') {
    // Site went down!
    await db.clientLog.create({
      data: {
        clientId: client.id,
        level: 'fatal',
        message: `Website went DOWN. Uptime checks failed. Response time: ${responseTime}ms.`,
      }
    });

    if (client.webhookUrl) {
      sendWebhookAlert(
        client.webhookUrl,
        client.name,
        client.url,
        'fatal',
        `🔴 Alert: Website is OFFLINE! Health check failed. Uptime monitor is unable to reach the page.`,
      );
    }
    if (client.notificationEmail) {
      sendEmailAlert(
        client.notificationEmail,
        client.name,
        client.url,
        'fatal',
        `🔴 Alert: Website is OFFLINE! Health check failed. Uptime monitor is unable to reach the page.`,
      );
    }
    
    // Query and trigger global permitted email alert channels
    db.alertEmail.findMany({
      where: {
        sites: {
          has: client.id
        }
      }
    }).then(emails => {
      emails.forEach(ae => {
        if (ae.email !== client.notificationEmail) {
          sendEmailAlert(
            ae.email,
            client.name,
            client.url,
            'fatal',
            `🔴 Alert: Website is OFFLINE! Health check failed. Uptime monitor is unable to reach the page.`,
          );
        }
      });
    }).catch(err => {
      console.error('Failed to query global alert emails for status DOWN:', err);
    });
  } else if (status === 'up' && client.status === 'down') {
    // Site recovered!
    await db.clientLog.create({
      data: {
        clientId: client.id,
        level: 'info',
        message: `Website recovered. Status is back to ONLINE. Response time: ${responseTime}ms.`,
      }
    });

    if (client.webhookUrl) {
      sendWebhookAlert(
        client.webhookUrl,
        client.name,
        client.url,
        'info',
        `🟢 Recovery: Website is back ONLINE! Health check succeeded in ${responseTime}ms.`,
      );
    }
    if (client.notificationEmail) {
      sendEmailAlert(
        client.notificationEmail,
        client.name,
        client.url,
        'info',
        `🟢 Recovery: Website is back ONLINE! Health check succeeded in ${responseTime}ms.`,
      );
    }
    
    // Query and trigger global permitted email alert channels
    db.alertEmail.findMany({
      where: {
        sites: {
          has: client.id
        }
      }
    }).then(emails => {
      emails.forEach(ae => {
        if (ae.email !== client.notificationEmail) {
          sendEmailAlert(
            ae.email,
            client.name,
            client.url,
            'info',
            `🟢 Recovery: Website is back ONLINE! Health check succeeded in ${responseTime}ms.`,
          );
        }
      });
    }).catch(err => {
      console.error('Failed to query global alert emails for status UP:', err);
    });
  }

  return updatedClient;
}

/**
 * GET /api/monitor/status
 * Fetches current health status of all sites (cached database state)
 */
export async function GET(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const sites = await db.clientSite.findMany({
      select: {
        id: true,
        name: true,
        url: true,
        active: true,
        status: true,
        lastPing: true,
        responseTime: true,
        sslExpiry: true,
        webhookUrl: true,
        apiKey: true,
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({ success: true, sites });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/monitor/status
 * Triggers an active health check ping for all active sites
 */
export async function POST(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const clients = await db.clientSite.findMany({
      where: { active: true }
    });

    if (clients.length === 0) {
      return NextResponse.json({ success: true, message: 'No active clients to ping', results: [] });
    }

    // Ping all sites concurrently
    const results = await Promise.all(
      clients.map((client) => pingWebsite(client))
    );

    return NextResponse.json({ success: true, message: `Pings executed for ${clients.length} websites`, results });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
