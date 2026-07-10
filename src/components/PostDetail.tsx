import { notFound } from "next/navigation";
import { getPostSlugs, getPostMeta, getRelatedPosts } from "@/lib/posts";
import { compilePost } from "@/lib/mdx";
import { PostHeader } from "@/components/ui/PostHeader";
import { MDXArticle } from "@/components/ui/MDXArticle";
import { SummaryBox } from "@/components/ui/SummaryBox";
import { ExamPointBox } from "@/components/ui/ExamPointBox";
import { RelatedPosts } from "@/components/RelatedPosts";
import { ArticleJsonLd } from "@/components/ArticleJsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { PageActivityTracker } from "@/components/learning/PageActivityTracker";
import { FavoriteButton } from "@/components/learning/FavoriteButton";
import { CompletionButton } from "@/components/learning/CompletionButton";
import { NoteEditor } from "@/components/learning/NoteEditor";
import { TableOfContents } from "@/components/TableOfContents";
import { Container } from "@/components/layout/Container";
import { CATEGORY_LABELS } from "@/lib/site";
import type { Category } from "@/lib/types";

const ARTICLE_CONTAINER_ID = "post-article";

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
    <Container className="max-w-6xl py-16">
      <PageActivityTracker category={category} slug={slug} title={frontmatter.title} />
      <ArticleJsonLd meta={meta} />
      <BreadcrumbJsonLd items={breadcrumbItems} />

      <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start lg:gap-12">
        <TableOfContents containerId={ARTICLE_CONTAINER_ID} />

        <div className="mx-auto w-full max-w-3xl">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="flex items-start justify-between gap-4">
            <PostHeader
              category={category}
              title={frontmatter.title}
              date={frontmatter.date}
              description={frontmatter.description}
              readingMinutes={meta.readingMinutes}
              tags={meta.tags}
            />
          </div>
          <div className="-mt-4 mb-8 flex flex-wrap gap-2">
            <FavoriteButton category={category} slug={slug} title={frontmatter.title} />
            <CompletionButton category={category} slug={slug} title={frontmatter.title} />
          </div>
          {frontmatter.summary && frontmatter.summary.length > 0 && (
            <SummaryBox category={category} points={frontmatter.summary} />
          )}
          {frontmatter.examPoints && frontmatter.examPoints.length > 0 && (
            <ExamPointBox points={frontmatter.examPoints} />
          )}
          <div id={ARTICLE_CONTAINER_ID}>
            <MDXArticle>{content}</MDXArticle>
          </div>
          <RelatedPosts posts={related} />
          <NoteEditor category={category} slug={slug} />
        </div>
      </div>
    </Container>
  );
}
