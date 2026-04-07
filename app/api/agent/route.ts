import { NextResponse } from 'next/server';
import { runAgent } from '@/scripts/agent';

/**
 * POST /api/agent
 * Body: { url?: string }
 * Header: Authorization: Bearer <AGENT_SECRET>
 *
 * Secured with AGENT_SECRET env var to prevent unauthorized triggering.
 * In production, set this in Vercel environment variables.
 */
export async function POST(request: Request) {
  // ── Auth check ─────────────────────────────────────────────────────────────
  const secret = process.env.PASSWORD;
  if (secret) {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '').trim();
    if (token !== secret) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
  } else {
    return NextResponse.json({ success: false, error: 'Server not configured (PASSWORD missing)' }, { status: 500 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { url } = body as { url?: string };

    // ── Production: Trigger GitHub Action ─────────────────────────────────────
    if (process.env.NODE_ENV !== 'development' || process.env.FORCE_DISPATCH === 'true') {
      const GH_TOKEN = process.env.GITHUB_TOKEN;
      const GH_REPO = process.env.GITHUB_REPO; // e.g. "username/repo"

      if (!GH_TOKEN || !GH_REPO) {
        return NextResponse.json({ 
          success: false, 
          error: 'Production credentials missing (GITHUB_TOKEN or GITHUB_REPO). Please check environment variables.' 
        }, { status: 500 });
      }

      console.log(`🚀 Production mode: Dispatching workflow for ${GH_REPO}...`);

      const res = await fetch(`https://api.github.com/repos/${GH_REPO}/actions/workflows/agent.yml/dispatches`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GH_TOKEN}`,
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        body: JSON.stringify({
          ref: 'main', // or your primary branch
          inputs: { url: url || '' }
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`GitHub API Error: ${res.status} - ${JSON.stringify(errorData)}`);
      }

      return NextResponse.json({ 
        success: true, 
        result: { 
          message: 'Workflow triggered! Your blog post will be live in a few minutes once the GitHub Action finishes and Vercel redeploys.',
          status: 'dispatched'
        } 
      });
    }

    // ── Local Development: Run locally ────────────────────────────────────────
    console.log('💻 Local mode: Running agent locally...');
    const result = await runAgent(url);
    return NextResponse.json({ success: true, result });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Agent API Error:', msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
