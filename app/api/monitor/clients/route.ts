import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import crypto from 'crypto';

// Auth helper
function checkAuth(request: Request): boolean {
  const secret = process.env.PASSWORD;
  if (!secret) return false;
  
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '').trim();
  return token === secret;
}

/**
 * GET /api/monitor/clients
 * Returns all monitored websites
 */
export async function GET(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const clients = await db.clientSite.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { logs: true }
        }
      }
    });
    return NextResponse.json({ success: true, clients });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/monitor/clients
 * Creates or updates a client website
 */
export async function POST(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { id, name, url, active, webhookUrl } = body;

    if (!id && (!name || !url)) {
      return NextResponse.json({ success: false, error: 'Name and URL are required for creation' }, { status: 400 });
    }

    if (url && !/^https?:\/\//i.test(url)) {
      return NextResponse.json({ success: false, error: 'URL must start with http:// or https://' }, { status: 400 });
    }

    if (id) {
      // Update existing
      const updated = await db.clientSite.update({
        where: { id },
        data: {
          name,
          url,
          active: active !== undefined ? active : undefined,
          webhookUrl: webhookUrl !== undefined ? webhookUrl : undefined,
        }
      });
      return NextResponse.json({ success: true, client: updated });
    } else {
      // Create new client site
      const apiKey = `cs_${crypto.randomBytes(24).toString('hex')}`;
      const newClient = await db.clientSite.create({
        data: {
          name,
          url,
          apiKey,
          active: true,
          status: 'unknown',
        }
      });
      return NextResponse.json({ success: true, client: newClient });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * DELETE /api/monitor/clients
 * Removes a client site and cascades deletion of its logs
 */
export async function DELETE(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await request.json().catch(() => ({}));
    if (!id) {
      return NextResponse.json({ success: false, error: 'Client ID is required' }, { status: 400 });
    }

    await db.clientSite.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Client deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
