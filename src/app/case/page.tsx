import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { CategoryPageHeader } from "@/components/ui/CategoryPageHeader";
import { PostCard } from "@/components/ui/PostCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { CollectionPageJsonLd } from "@/components/CollectionPageJsonLd";
import { getAllPostsMeta } from "@/lib/posts";
import { ogImageUrl } from "@/lib/og";

const TITLE = "시공사례";
const DESCRIPTION = "실제 철도 시공 현장의 공법과 시공 시 유의사항을 정리합니다.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: ogImageUrl(TITLE, "case"), width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [ogImageUrl(TITLE, "case")],
  },
};

const BREADCRUMB_ITEMS = [
  { label: "홈", href: "/" },
  { label: TITLE, href: "/case" },
];

export default function CasePage() {
  const posts = getAllPostsMeta("case");

  return (
    <Container className="flex flex-col gap-10 py-20">
      <BreadcrumbJsonLd items={BREADCRUMB_ITEMS} />
      <CollectionPageJsonLd
        name={TITLE}
        description={DESCRIPTION}
        url="/case"
        posts={posts}
      />
      <Breadcrumbs items={BREADCRUMB_ITEMS} />
      <CategoryPageHeader
        category="case"
        title={TITLE}
        description={DESCRIPTION}
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </Container>
  );
}
