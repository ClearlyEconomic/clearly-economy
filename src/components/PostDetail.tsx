import { notFound } from "next/navigation";
import { getPostSlugs, getPostMeta, getRelatedPosts } from "@/lib/posts";
import { compilePost } from "@/lib/mdx";
import { PostHeader } from "@/components/ui/PostHeader";
import { MDXArticle } from "@/components/ui/MDXArticle";
import { SummaryBox } from "@/components/ui/SummaryBox";
import { RelatedPosts } from "@/components/RelatedPosts";
import { ArticleJsonLd } from "@/components/ArticleJsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { Container } from "@/components/layout/Container";
import { CATEGORY_LABELS } from "@/lib/site";
import type { Category } from "@/lib/types";

export async function PostDetail({
  category,
  slug,
}: {
  category: Category;
  slug: string;
}) {
  if (!getPostSlugs(category).includes(slug)) notFound();

  const meta = getPostMeta(category, slug);
  const { content, frontmatter } = await compilePost(category, slug);
  const related = getRelatedPosts(meta, 3);

  const breadcrumbItems = [
    { label: "홈", href: "/" },
    { label: CATEGORY_LABELS[category], href: `/${category}` },
    { label: frontmatter.title, href: `/${category}/${slug}` },
  ];

  return (
    <Container className="max-w-3xl py-16">
      <ArticleJsonLd meta={meta} />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <Breadcrumbs items={breadcrumbItems} />
      <PostHeader
        category={category}
        title={frontmatter.title}
        date={frontmatter.date}
        description={frontmatter.description}
        readingMinutes={meta.readingMinutes}
        tags={meta.tags}
      />
      {frontmatter.summary && frontmatter.summary.length > 0 && (
        <SummaryBox category={category} points={frontmatter.summary} />
      )}
      <MDXArticle>{content}</MDXArticle>
      <RelatedPosts posts={related} />
    </Container>
  );
}
