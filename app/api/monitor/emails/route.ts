import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Auth helper
function checkAuth(request: Request): boolean {
  const secret = process.env.PASSWORD;
  if (!secret) return false;
  
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '').trim();
  return token === secret;
}

/**
 * GET /api/monitor/emails
 * Returns all registered alert email addresses
 */
export async function GET(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const emails = await db.alertEmail.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, emails });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/monitor/emails
 * Registers a new email address, or updates the linked site list for an existing email
 */
export async function POST(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { id, email, sites } = body;

    if (id) {
      // Update link permissions (toggling checkboxes)
      if (!Array.isArray(sites)) {
        return NextResponse.json({ success: false, error: 'Sites must be an array of IDs' }, { status: 400 });
      }

      const updated = await db.alertEmail.update({
        where: { id },
        data: {
          sites: {
            set: sites
          }
        }
      });
      return NextResponse.json({ success: true, email: updated });
    } else {
      // Add a new email address
      if (!email || !email.includes('@')) {
        return NextResponse.json({ success: false, error: 'A valid email address is required' }, { status: 400 });
      }

      // Check if email already exists
      const existing = await db.alertEmail.findUnique({
        where: { email: email.toLowerCase() }
      });

      if (existing) {
        return NextResponse.json({ success: false, error: 'This email is already registered.' }, { status: 400 });
      }

      const newEmail = await db.alertEmail.create({
        data: {
          email: email.toLowerCase(),
          sites: []
        }
      });
      return NextResponse.json({ success: true, email: newEmail });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * DELETE /api/monitor/emails
 * Deletes an alert email recipient
 */
export async function DELETE(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await request.json().catch(() => ({}));
    if (!id) {
      return NextResponse.json({ success: false, error: 'Email ID is required' }, { status: 400 });
    }

    await db.alertEmail.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Email deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
