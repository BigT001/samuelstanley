import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/blog';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const secret = searchParams.get('secret');

    const expected = (process.env.AGENT_SECRET || '').trim();
    const received = (secret || '').trim();

    // Security Check
    if (received !== expected) {
      console.error('❌ AUTH ERROR (LIST):', { 
        receivedLength: received.length, 
        expectedLength: expected.length,
        receivedFirst: received[0],
        expectedFirst: expected[0],
        receivedLast: received[received.length - 1],
        expectedLast: expected[expected.length - 1]
      });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const posts = getAllPosts();
    console.log(`🔍 [API/LIST] Found ${posts.length} posts in folder.`);
    
    // Return a simplified list for management
    const managed = posts.map(p => ({
      slug:      p.slug,
      title:     p.title,
      date:      p.date,
      category:  p.category
    }));
    
    return NextResponse.json({ success: true, posts: managed });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
