import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

function checkAuth(request: Request): boolean {
  const secret = process.env.PASSWORD;
  if (!secret) return false;
  
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '').trim();
  return token === secret;
}

/**
 * GET /api/monitor/logs
 * Retrieves logs for a specific client site with filters
 * Params:
 *  - clientId: string (required)
 *  - level: string (optional)
 *  - search: string (optional)
 *  - limit: number (optional, default 50)
 */
export async function GET(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const level = searchParams.get('level');
    const search = searchParams.get('search');
    const visitorId = searchParams.get('visitorId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 1000);

    if (!clientId) {
      return NextResponse.json({ success: false, error: 'Client ID is required' }, { status: 400 });
    }

    const whereClause: any = { clientId };
    
    if (level) {
      whereClause.level = level;
    }
    
    if (search) {
      whereClause.message = {
        contains: search,
        mode: 'insensitive', // Case-insensitive search
      };
    }

    if (visitorId) {
      whereClause.metadata = {
        contains: `"visitorId":"${visitorId}"`,
      };
    }

    if (startDate || endDate) {
      whereClause.timestamp = {};
      if (startDate) {
        whereClause.timestamp.gte = new Date(startDate + 'T00:00:00.000Z');
      }
      if (endDate) {
        whereClause.timestamp.lte = new Date(endDate + 'T23:59:59.999Z');
      }
    }

    const logs = await db.clientLog.findMany({
      where: whereClause,
      orderBy: { timestamp: 'desc' },
      take: limit,
    });

    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
