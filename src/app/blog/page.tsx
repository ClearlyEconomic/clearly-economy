import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { CategoryPageHeader } from "@/components/ui/CategoryPageHeader";
import { PostCard } from "@/components/ui/PostCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { CollectionPageJsonLd } from "@/components/CollectionPageJsonLd";
import { getAllPostsMeta } from "@/lib/posts";
import { ogImageUrl } from "@/lib/og";

const TITLE = "블로그";
const DESCRIPTION = "분명한경제의 생각과 이야기를 자유롭게 전합니다.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: ogImageUrl(TITLE, "blog"), width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [ogImageUrl(TITLE, "blog")],
  },
};

const BREADCRUMB_ITEMS = [
  { label: "홈", href: "/" },
  { label: TITLE, href: "/blog" },
];

export default function BlogPage() {
  const posts = getAllPostsMeta("blog");

  return (
    <Container className="flex flex-col gap-10 py-20">
      <BreadcrumbJsonLd items={BREADCRUMB_ITEMS} />
      <CollectionPageJsonLd
        name={TITLE}
        description={DESCRIPTION}
        url="/blog"
        posts={posts}
      />
      <Breadcrumbs items={BREADCRUMB_ITEMS} />
      <CategoryPageHeader
        category="blog"
        title="블로그"
        description="분명한경제의 생각과 이야기를 자유롭게 전합니다."
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </Container>
  );
}
