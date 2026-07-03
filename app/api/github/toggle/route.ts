import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// ── POST /api/github/toggle → Admin: toggle visibility + update overrides ────
export async function POST(req: NextRequest) {
  // Require admin password
  const secret = req.headers.get("x-admin-secret");
  const adminPass = process.env.PASSWORD;
  if (!secret || secret !== adminPass) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { repoName, visible, displayTitle, displayDesc, displayTags, statusLabel, pinnedOrder } = body;

    if (!repoName) {
      return NextResponse.json({ error: "repoName is required" }, { status: 400 });
    }

    const updated = await db.githubProject.update({
      where: { repoName },
      data: {
        ...(visible !== undefined && { visible }),
        ...(displayTitle !== undefined && { displayTitle }),
        ...(displayDesc !== undefined && { displayDesc }),
        ...(displayTags !== undefined && { displayTags }),
        ...(statusLabel !== undefined && { statusLabel }),
        ...(pinnedOrder !== undefined && { pinnedOrder }),
      },
    });

    return NextResponse.json({ success: true, project: updated });
  } catch (err: any) {
    console.error("Toggle error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ── GET /api/github/toggle → Admin: fetch ALL repos (for admin panel) ────────
export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-admin-secret");
  const adminPass = process.env.PASSWORD;
  if (!secret || secret !== adminPass) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const projects = await db.githubProject.findMany({
      orderBy: [{ visible: "desc" }, { lastPushedAt: "desc" }],
    });
    return NextResponse.json({ success: true, projects });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
