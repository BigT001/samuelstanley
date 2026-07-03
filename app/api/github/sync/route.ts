import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "BigT001";
const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET!;

// ── Verify GitHub webhook signature ─────────────────────────────────────────
function verifyWebhookSignature(body: string, signature: string): boolean {
  if (!WEBHOOK_SECRET || !signature) return false;
  const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET);
  hmac.update(body);
  const digest = `sha256=${hmac.digest("hex")}`;
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

// ── Fetch all repos from GitHub API ─────────────────────────────────────────
async function fetchAllRepos() {
  const repos: any[] = [];
  let page = 1;
  while (true) {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&page=${page}&sort=pushed`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "samuelstanley-portfolio",
        },
      }
    );
    if (!res.ok) break;
    const data = await res.json();
    if (!data.length) break;
    repos.push(...data);
    page++;
  }
  return repos;
}

// ── Upsert a single repo into the database ───────────────────────────────────
async function upsertRepo(repo: any) {
  return db.githubProject.upsert({
    where: { repoName: repo.name },
    update: {
      fullName: repo.full_name,
      stars: repo.stargazers_count ?? 0,
      forks: repo.forks_count ?? 0,
      language: repo.language ?? null,
      repoUrl: repo.html_url,
      homepage: repo.homepage ?? null,
      isPrivate: repo.private ?? false,
      lastPushedAt: repo.pushed_at ? new Date(repo.pushed_at) : null,
    },
    create: {
      repoName: repo.name,
      fullName: repo.full_name,
      visible: false,
      stars: repo.stargazers_count ?? 0,
      forks: repo.forks_count ?? 0,
      language: repo.language ?? null,
      repoUrl: repo.html_url,
      homepage: repo.homepage ?? null,
      isPrivate: repo.private ?? false,
      lastPushedAt: repo.pushed_at ? new Date(repo.pushed_at) : null,
    },
  });
}

// ── GET /api/github/sync → Manual full sync ──────────────────────────────────
export async function GET(req: NextRequest) {
  // Require admin session
  const secret = req.headers.get("x-admin-secret");
  const adminPass = process.env.PASSWORD;
  if (!secret || secret !== adminPass) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const repos = await fetchAllRepos();
    const results = await Promise.all(repos.map(upsertRepo));
    return NextResponse.json({ success: true, synced: results.length });
  } catch (err: any) {
    console.error("GitHub sync error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ── POST /api/github/sync → Webhook handler ──────────────────────────────────
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-hub-signature-256") ?? "";

  // Verify webhook signature
  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = req.headers.get("x-github-event");
  const payload = JSON.parse(rawBody);

  // Handle push and repository events
  if ((event === "push" || event === "repository") && payload.repository) {
    try {
      await upsertRepo(payload.repository);
      return NextResponse.json({ success: true, event, repo: payload.repository.name });
    } catch (err: any) {
      console.error("Webhook upsert error:", err);
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true, event, message: "Event ignored" });
}
