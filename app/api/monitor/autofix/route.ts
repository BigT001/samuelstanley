import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

/**
 * POST /api/monitor/autofix
 * Authenticated endpoint to automate code replacement and open GitHub PR.
 */
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.substring(7);
    if (token !== process.env.MONITOR_SECRET) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { logId, repo, filePath, targetCode, replacementCode } = body;

    if (!logId || !repo || !filePath || !targetCode || !replacementCode) {
      return NextResponse.json({ success: false, error: 'Missing required parameters (logId, repo, filePath, targetCode, replacementCode)' }, { status: 400 });
    }

    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      return NextResponse.json({ success: false, error: 'GITHUB_TOKEN is not configured on the server. Please add it to your .env file.' }, { status: 500 });
    }

    // 1. Get default branch & repository configuration
    const repoInfoRes = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'PROmonitor-SRE'
      }
    });

    if (!repoInfoRes.ok) {
      const errText = await repoInfoRes.text();
      return NextResponse.json({ success: false, error: `Failed to fetch repo info: ${errText}. Ensure the repo path is correct and your token has permission.` }, { status: 400 });
    }
    const repoInfo = await repoInfoRes.json();
    const defaultBranch = repoInfo.default_branch || 'main';

    // Get default branch commit SHA
    const refRes = await fetch(`https://api.github.com/repos/${repo}/git/ref/heads/${defaultBranch}`, {
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'PROmonitor-SRE'
      }
    });
    if (!refRes.ok) {
      return NextResponse.json({ success: false, error: `Failed to fetch default branch reference for '${defaultBranch}'` }, { status: 400 });
    }
    const refData = await refRes.json();
    const baseSha = refData.object.sha;

    // 2. Create a new branch
    const branchName = `promonitor-fix-${logId.substring(0, 8)}-${Math.floor(Math.random() * 1000)}`;
    const createBranchRes = await fetch(`https://api.github.com/repos/${repo}/git/refs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'PROmonitor-SRE'
      },
      body: JSON.stringify({
        ref: `refs/heads/${branchName}`,
        sha: baseSha
      })
    });
    if (!createBranchRes.ok) {
      const errText = await createBranchRes.text();
      return NextResponse.json({ success: false, error: `Branch creation failed: ${errText}` }, { status: 400 });
    }

    // 3. Get target file content & SHA from the newly created branch
    const fileRes = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}?ref=${branchName}`, {
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'PROmonitor-SRE'
      }
    });
    if (!fileRes.ok) {
      return NextResponse.json({ success: false, error: `File not found in repository branch: ${filePath}` }, { status: 404 });
    }
    const fileData = await fileRes.json();
    const fileSha = fileData.sha;
    const currentContent = Buffer.from(fileData.content, 'base64').toString('utf8');

    // 4. Perform code replacement
    if (!currentContent.includes(targetCode)) {
      return NextResponse.json({
        success: false,
        error: 'The target code block was not found in the repository file. The codebase may have changed since this error log was generated.'
      }, { status: 400 });
    }

    const updatedContent = currentContent.replace(targetCode, replacementCode);
    const updatedContentBase64 = Buffer.from(updatedContent, 'utf8').toString('base64');

    // 5. Commit & push file changes
    const commitRes = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'PROmonitor-SRE'
      },
      body: JSON.stringify({
        message: `fix: resolve runtime log issue ${logId.substring(0, 8)}`,
        content: updatedContentBase64,
        sha: fileSha,
        branch: branchName
      })
    });
    if (!commitRes.ok) {
      const errText = await commitRes.text();
      return NextResponse.json({ success: false, error: `Commit failed: ${errText}` }, { status: 400 });
    }

    // 6. Open Pull Request on GitHub
    const prRes = await fetch(`https://api.github.com/repos/${repo}/pulls`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'PROmonitor-SRE'
      },
      body: JSON.stringify({
        title: `🤖 PROmonitor: Autofix for Log #${logId.substring(0, 8)}`,
        body: `### 🤖 PROmonitor Automated Bug Fix\nThis Pull Request was opened automatically by **PROmonitor SRE AI** in response to log issue **#${logId}**.\n\n**Issue File:** \`${filePath}\`\n\n#### Suggested Change:\n\`\`\`diff\n- ${targetCode.split('\n').join('\n- ')}\n+ ${replacementCode.split('\n').join('\n+ ')}\n\`\`\``,
        head: branchName,
        base: defaultBranch
      })
    });

    if (!prRes.ok) {
      const errText = await prRes.text();
      return NextResponse.json({ success: false, error: `Pull Request creation failed: ${errText}` }, { status: 400 });
    }

    const prData = await prRes.json();
    return NextResponse.json({ success: true, prUrl: prData.html_url, branchName });

  } catch (error: any) {
    console.error('Autofix Endpoint Exception:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
