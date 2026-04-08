import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { slug, secret } = await req.json();

    // 1. Security Check
    if (secret?.trim() !== process.env.AGENT_SECRET?.trim()) {
      return NextResponse.json({ error: 'Unauthorized: Invalid AGENT_SECRET' }, { status: 401 });
    }

    if (!slug) {
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
    }

    // 2. Locate File
    const filePath = path.join(process.cwd(), 'content', 'blog', `${slug}.md`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // 3. Delete File
    fs.unlinkSync(filePath);
    console.log(`🗑️ Deleted blog post: ${slug}`);

    return NextResponse.json({ 
      success: true, 
      message: `Successfully deleted: ${slug}` 
    });

  } catch (error: any) {
    console.error('✗ Deletion failed:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
