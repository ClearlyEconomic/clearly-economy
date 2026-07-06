import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { CategoryPageHeader } from "@/components/ui/CategoryPageHeader";
import { PostCard } from "@/components/ui/PostCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { CollectionPageJsonLd } from "@/components/CollectionPageJsonLd";
import { getAllPostsMeta } from "@/lib/posts";
import { ogImageUrl } from "@/lib/og";

const TITLE = "투자 분석";
const DESCRIPTION = "데이터에 기반한 담백한 투자 분석을 전합니다.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: ogImageUrl(TITLE, "invest"), width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [ogImageUrl(TITLE, "invest")],
  },
};

const BREADCRUMB_ITEMS = [
  { label: "홈", href: "/" },
  { label: TITLE, href: "/invest" },
];

export default function InvestPage() {
  const posts = getAllPostsMeta("invest");

  return (
    <Container className="flex flex-col gap-10 py-20">
      <BreadcrumbJsonLd items={BREADCRUMB_ITEMS} />
      <CollectionPageJsonLd
        name={TITLE}
        description={DESCRIPTION}
        url="/invest"
        posts={posts}
      />
      <Breadcrumbs items={BREADCRUMB_ITEMS} />
      <CategoryPageHeader
        category="invest"
        title="투자 분석"
        description="데이터에 기반한 담백한 투자 분석을 전합니다."
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </Container>
  );
}
