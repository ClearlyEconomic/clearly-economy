import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { CategoryPageHeader } from "@/components/ui/CategoryPageHeader";
import { PostCard } from "@/components/ui/PostCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { CollectionPageJsonLd } from "@/components/CollectionPageJsonLd";
import { getAllPostsMeta } from "@/lib/posts";
import { ogImageUrl } from "@/lib/og";

const TITLE = "경제 용어";
const DESCRIPTION = "헷갈리는 경제 용어를 한 곳에서 명확하게 정리했습니다.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: ogImageUrl(TITLE, "terms"), width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [ogImageUrl(TITLE, "terms")],
  },
};

const BREADCRUMB_ITEMS = [
  { label: "홈", href: "/" },
  { label: TITLE, href: "/terms" },
];

export default function TermsPage() {
  const posts = getAllPostsMeta("terms");

  return (
    <Container className="flex flex-col gap-10 py-20">
      <BreadcrumbJsonLd items={BREADCRUMB_ITEMS} />
      <CollectionPageJsonLd
        name={TITLE}
        description={DESCRIPTION}
        url="/terms"
        posts={posts}
      />
      <Breadcrumbs items={BREADCRUMB_ITEMS} />
      <CategoryPageHeader
        category="terms"
        title="경제 용어"
        description="헷갈리는 경제 용어를 한 곳에서 명확하게 정리했습니다."
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </Container>
  );
}
