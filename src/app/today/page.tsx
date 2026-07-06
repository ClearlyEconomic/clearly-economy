import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { CategoryPageHeader } from "@/components/ui/CategoryPageHeader";
import { PostCard } from "@/components/ui/PostCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { CollectionPageJsonLd } from "@/components/CollectionPageJsonLd";
import { getAllPostsMeta } from "@/lib/posts";
import { ogImageUrl } from "@/lib/og";

const TITLE = "오늘의 경제";
const DESCRIPTION = "매일 핵심 경제 이슈를 짧고 명확하게 정리합니다.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: ogImageUrl(TITLE, "today"), width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [ogImageUrl(TITLE, "today")],
  },
};

const BREADCRUMB_ITEMS = [
  { label: "홈", href: "/" },
  { label: TITLE, href: "/today" },
];

export default function TodayPage() {
  const posts = getAllPostsMeta("today");

  return (
    <Container className="flex flex-col gap-10 py-20">
      <BreadcrumbJsonLd items={BREADCRUMB_ITEMS} />
      <CollectionPageJsonLd
        name={TITLE}
        description={DESCRIPTION}
        url="/today"
        posts={posts}
      />
      <Breadcrumbs items={BREADCRUMB_ITEMS} />
      <CategoryPageHeader
        category="today"
        title="오늘의 경제"
        description="매일 핵심 경제 이슈를 짧고 명확하게 정리합니다."
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </Container>
  );
}
