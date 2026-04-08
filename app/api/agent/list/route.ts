import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/blog';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const secret = searchParams.get('secret');

    const expected = (process.env.AGENT_SECRET || '').trim();
    const received = (secret || '').trim();

    // Security Check - REMOVED AT USER REQUEST
    // if (received !== expected) { ... }

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
