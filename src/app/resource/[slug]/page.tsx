import type { Metadata } from "next";
import { getPostSlugs } from "@/lib/posts";
import { generatePostMetadata } from "@/lib/post-metadata";
import { PostDetail } from "@/components/PostDetail";

export function generateStaticParams() {
  return getPostSlugs("resource").map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return generatePostMetadata("resource", slug);
}

export default async function ResourcePostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PostDetail category="resource" slug={slug} />;
}
