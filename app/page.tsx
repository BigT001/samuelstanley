import { getAllPosts } from "@/lib/blog";
import { getAllInsights } from "@/lib/insight";
import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic";

export default function Home() {
  const posts = getAllPosts();
  const insights = getAllInsights();
  return <HomeClient initialBlogs={posts} initialInsights={insights} />;
}
