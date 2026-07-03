import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// ── GET /api/github/projects → Return all visible repos for public homepage ──
export async function GET() {
  try {
    const projects = await db.githubProject.findMany({
      where: { visible: true },
      orderBy: [
        { pinnedOrder: "asc" },
        { lastPushedAt: "desc" },
        { stars: "desc" },
      ],
    });

    return NextResponse.json({ success: true, projects });
  } catch (err: any) {
    console.error("GitHub projects fetch error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
