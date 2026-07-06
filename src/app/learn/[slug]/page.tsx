import type { Metadata } from "next";
import { getPostSlugs } from "@/lib/posts";
import { generatePostMetadata } from "@/lib/post-metadata";
import { PostDetail } from "@/components/PostDetail";

export function generateStaticParams() {
  return getPostSlugs("learn").map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return generatePostMetadata("learn", slug);
}

export default async function LearnPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PostDetail category="learn" slug={slug} />;
}
