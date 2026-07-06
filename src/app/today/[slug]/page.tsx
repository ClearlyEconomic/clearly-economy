import type { Metadata } from "next";
import { getPostSlugs } from "@/lib/posts";
import { generatePostMetadata } from "@/lib/post-metadata";
import { PostDetail } from "@/components/PostDetail";

export function generateStaticParams() {
  return getPostSlugs("today").map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return generatePostMetadata("today", slug);
}

export default async function TodayPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PostDetail category="today" slug={slug} />;
}
