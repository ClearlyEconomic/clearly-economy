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
import { RAIL_TOPICS } from "@/lib/site";
import { ogImageUrl } from "@/lib/og";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}): Promise<Metadata> {
  const { topic } = await searchParams;
  const activeTopic = RAIL_TOPICS.find((t) => t.slug === topic);
  const title = activeTopic ? `${activeTopic.label} | 철도기술사` : "철도기술사";
  const description = activeTopic
    ? activeTopic.description
    : "정의부터 설계기준, 기출 포인트까지 — 철도기술사 시험을 위한 체계적인 학습 아카이브입니다.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImageUrl(title, "study"), width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl(title, "study")],
    },
  };
}

export default async function StudyPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { topic } = await searchParams;
  const allPosts = getAllPostsMeta("study");
  const posts = topic ? allPosts.filter((post) => post.topic === topic) : allPosts;
  const activeTopic = RAIL_TOPICS.find((t) => t.slug === topic);

  const pageTitle = activeTopic ? `${activeTopic.label} | 철도기술사` : "철도기술사";
  const pageDescription = activeTopic
    ? activeTopic.description
    : "정의부터 설계기준, 기출 포인트까지 — 철도기술사 시험을 위한 체계적인 학습 아카이브입니다.";
  const breadcrumbItems = [
    { label: "홈", href: "/" },
    { label: "철도기술사", href: "/study" },
    ...(activeTopic
      ? [{ label: activeTopic.label, href: `/study?topic=${activeTopic.slug}` }]
      : []),
  ];

  return (
    <Container className="flex flex-col gap-10 py-20">
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <CollectionPageJsonLd
        name={pageTitle}
        description={pageDescription}
        url={activeTopic ? `/study?topic=${activeTopic.slug}` : "/study"}
        posts={posts}
      />
      <Breadcrumbs items={breadcrumbItems} />
      <CategoryPageHeader
        category="study"
        title="철도기술사"
        description="정의부터 설계기준, 기출 포인트까지 — 철도기술사 시험을 위한 체계적인 학습 아카이브입니다."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {RAIL_TOPICS.map((t) => (
          <CategoryCard key={t.slug} topic={t} />
        ))}
      </div>

      <div className="flex flex-col gap-6 border-t border-slate-200 pt-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-slate-900">
            {activeTopic ? `${activeTopic.emoji} ${activeTopic.label}` : "전체 자료"}
          </h3>
          {topic && (
            <Link
              href="/study"
              className="text-sm font-semibold text-blue-950 hover:text-blue-800"
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
          <p className="text-slate-400">아직 등록된 자료가 없습니다.</p>
        )}
      </div>
    </Container>
  );
}
