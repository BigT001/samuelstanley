import { getAllPosts } from "@/lib/blog";
import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic";

export default function Home() {
  const posts = getAllPosts();
  return <HomeClient initialBlogs={posts} />;
}
