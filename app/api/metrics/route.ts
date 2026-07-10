import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const metrics = await db.postMetric.findMany();
    const result: Record<string, { likes: number; shares: number; comments: any[] }> = {};
    
    // Default values for global metrics if not in database
    let globalVisits = 712;
    let globalFollowers = 80;

    metrics.forEach((m) => {
      if (m.slug === "global-visits") {
        globalVisits = m.likes;
        return;
      }
      if (m.slug === "global-followers") {
        globalFollowers = m.likes;
        return;
      }

      let parsedComments = [];
      try {
        parsedComments = JSON.parse(m.comments || "[]");
      } catch (e) {
        parsedComments = [];
      }
      result[m.slug] = {
        likes: m.likes,
        shares: m.shares,
        comments: parsedComments,
      };
    });
    
    // Seed global metrics in background if they don't exist yet
    const visitsExist = metrics.some(m => m.slug === "global-visits");
    if (!visitsExist) {
      await db.postMetric.upsert({
        where: { slug: "global-visits" },
        create: { slug: "global-visits", likes: 712 },
        update: {}
      }).catch(() => {});
    }

    const followersExist = metrics.some(m => m.slug === "global-followers");
    if (!followersExist) {
      await db.postMetric.upsert({
        where: { slug: "global-followers" },
        create: { slug: "global-followers", likes: 80 },
        update: {}
      }).catch(() => {});
    }

    return NextResponse.json({ 
      success: true, 
      metrics: result,
      globalVisits,
      globalFollowers
    });
  } catch (err: any) {
    console.error("GET metrics error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slug, action, comment, likeChange } = body;

    if (!slug) {
      return NextResponse.json({ success: false, error: "Missing slug" }, { status: 400 });
    }

    // Global Metrics actions
    if (slug === "global") {
      if (action === "visit") {
        const metric = await db.postMetric.findUnique({ where: { slug: "global-visits" } });
        const currentVisits = metric?.likes ?? 712;
        const updated = await db.postMetric.upsert({
          where: { slug: "global-visits" },
          create: { slug: "global-visits", likes: currentVisits + 1 },
          update: { likes: currentVisits + 1 }
        });
        return NextResponse.json({ success: true, visits: updated.likes });
      }
      
      if (action === "follow") {
        const metric = await db.postMetric.findUnique({ where: { slug: "global-followers" } });
        const currentFollowers = metric?.likes ?? 80;
        const updated = await db.postMetric.upsert({
          where: { slug: "global-followers" },
          create: { slug: "global-followers", likes: currentFollowers + 1 },
          update: { likes: currentFollowers + 1 }
        });
        return NextResponse.json({ success: true, followers: updated.likes });
      }
      return NextResponse.json({ success: false, error: "Invalid global action" }, { status: 400 });
    }

    // Find existing metrics to update
    const metric = await db.postMetric.findUnique({
      where: { slug }
    });

    const currentLikes = metric?.likes ?? 0;
    const currentShares = metric?.shares ?? 0;
    const currentCommentsStr = metric?.comments ?? "[]";

    if (action === "like") {
      const change = typeof likeChange === "number" ? likeChange : 1;
      const newLikes = Math.max(0, currentLikes + change);
      
      const updated = await db.postMetric.upsert({
        where: { slug },
        create: { slug, likes: newLikes },
        update: { likes: newLikes }
      });
      
      return NextResponse.json({ success: true, likes: updated.likes });
    }

    if (action === "share") {
      const newShares = currentShares + 1;
      const updated = await db.postMetric.upsert({
        where: { slug },
        create: { slug, shares: newShares },
        update: { shares: newShares }
      });
      return NextResponse.json({ success: true, shares: updated.shares });
    }

    if (action === "comment") {
      if (!comment || typeof comment !== "object") {
        return NextResponse.json({ success: false, error: "Missing comment payload" }, { status: 400 });
      }
      
      let commentsList = [];
      try {
        commentsList = JSON.parse(currentCommentsStr);
      } catch (e) {
        commentsList = [];
      }

      commentsList.push(comment);

      const updated = await db.postMetric.upsert({
        where: { slug },
        create: { slug, comments: JSON.stringify(commentsList) },
        update: { comments: JSON.stringify(commentsList) }
      });

      return NextResponse.json({ success: true, comments: commentsList });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    console.error("POST metrics error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
