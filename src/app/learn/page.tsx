import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { CategoryPageHeader } from "@/components/ui/CategoryPageHeader";
import { PostCard } from "@/components/ui/PostCard";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { CollectionPageJsonLd } from "@/components/CollectionPageJsonLd";
import { getAllPostsMeta } from "@/lib/posts";
import { LEARN_TOPICS } from "@/lib/site";
import { ogImageUrl } from "@/lib/og";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}): Promise<Metadata> {
  const { topic } = await searchParams;
  const activeTopic = LEARN_TOPICS.find((t) => t.slug === topic);
  const title = activeTopic ? `${activeTopic.label} | 경제 공부` : "경제 공부";
  const description = activeTopic
    ? activeTopic.description
    : "기초 개념부터 차근차근, 카테고리별로 정리했습니다.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImageUrl(title, "learn"), width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl(title, "learn")],
    },
  };
}

export default async function LearnPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { topic } = await searchParams;
  const allPosts = getAllPostsMeta("learn");
  const posts = topic ? allPosts.filter((post) => post.topic === topic) : allPosts;
  const activeTopic = LEARN_TOPICS.find((t) => t.slug === topic);

  const pageTitle = activeTopic ? `${activeTopic.label} | 경제 공부` : "경제 공부";
  const pageDescription = activeTopic
    ? activeTopic.description
    : "기초 개념부터 차근차근, 카테고리별로 정리했습니다.";
  const breadcrumbItems = [
    { label: "홈", href: "/" },
    { label: "경제 공부", href: "/learn" },
    ...(activeTopic
      ? [{ label: activeTopic.label, href: `/learn?topic=${activeTopic.slug}` }]
      : []),
  ];

  return (
    <Container className="flex flex-col gap-10 py-20">
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <CollectionPageJsonLd
        name={pageTitle}
        description={pageDescription}
        url={activeTopic ? `/learn?topic=${activeTopic.slug}` : "/learn"}
        posts={posts}
      />
      <Breadcrumbs items={breadcrumbItems} />
      <CategoryPageHeader
        category="learn"
        title="경제 공부"
        description="기초 개념부터 차근차근, 카테고리별로 정리했습니다."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {LEARN_TOPICS.map((t) => (
          <CategoryCard key={t.slug} topic={t} />
        ))}
      </div>

      <div className="flex flex-col gap-6 border-t border-slate-200 pt-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-slate-900">
            {activeTopic ? `${activeTopic.emoji} ${activeTopic.label}` : "전체 글"}
          </h3>
          {topic && (
            <Link
              href="/learn"
              className="text-sm font-semibold text-purple-600 hover:text-purple-700"
            >
              전체 보기 ✕
            </Link>
          )}
        </div>

        {posts.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-slate-400">아직 등록된 글이 없습니다.</p>
        )}
      </div>
    </Container>
  );
}
