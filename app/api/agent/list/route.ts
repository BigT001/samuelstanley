import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/blog';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const secret = searchParams.get('secret');

    // Security Check
    if (secret?.trim() !== process.env.AGENT_SECRET?.trim()) {
      console.error('❌ Unauthorized list attempt:', { received: secret?.trim(), expected: process.env.AGENT_SECRET?.trim() });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const posts = getAllPosts();
    
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
