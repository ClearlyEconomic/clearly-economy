import { notFound } from "next/navigation";
import {
  getAllTermSlugs,
  getAllTermsMeta,
  getTermMeta,
  resolveRelatedTerms,
} from "@/lib/terms";
import { getPostMeta, getRelatedPosts } from "@/lib/posts";
import { compilePost } from "@/lib/mdx";
import { MDXArticle } from "@/components/ui/MDXArticle";
import { SummaryBox } from "@/components/ui/SummaryBox";
import { TagList } from "@/components/ui/TagList";
import { RelatedPosts } from "@/components/RelatedPosts";
import { RelatedTermsGraph } from "./RelatedTermsGraph";
import { DifficultyStars } from "./DifficultyStars";
import { FavoriteButton } from "@/components/learning/FavoriteButton";
import { CompletionButton } from "@/components/learning/CompletionButton";
import { NoteEditor } from "@/components/learning/NoteEditor";
import { ArticleJsonLd } from "@/components/ArticleJsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { PageActivityTracker } from "@/components/learning/PageActivityTracker";
import { TableOfContents } from "@/components/TableOfContents";
import { Container } from "@/components/layout/Container";
import { formatDate } from "@/lib/format";
import { RAIL_TOPICS } from "@/lib/site";

const ARTICLE_CONTAINER_ID = "term-article";

export async function TermDetail({ slug }: { slug: string }) {
  if (!getAllTermSlugs().includes(slug)) notFound();

  const term = getTermMeta(slug);
  const meta = getPostMeta("terms", slug);
  const { content, frontmatter } = await compilePost("terms", slug);
  const allTerms = getAllTermsMeta();
  const relatedTerms = resolveRelatedTerms(term, allTerms);
  const relatedPosts = getRelatedPosts(meta, 3);
  const fieldLabel = RAIL_TOPICS.find((topic) => topic.slug === term.field)?.label;

  const breadcrumbItems = [
    { label: "홈", href: "/" },
    { label: "철도용어", href: "/terms" },
    { label: term.title, href: `/terms/${slug}` },
  ];

  return (
    <Container className="max-w-6xl py-16">
      <PageActivityTracker category="terms" slug={slug} title={term.title} />
      <ArticleJsonLd meta={meta} />
      <BreadcrumbJsonLd items={breadcrumbItems} />

      <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start lg:gap-12">
        <TableOfContents containerId={ARTICLE_CONTAINER_ID} />

        <div className="mx-auto w-full max-w-3xl">
          <Breadcrumbs items={breadcrumbItems} />

          <header className="mb-8 border-b border-slate-200 pb-8">
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
              <span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold text-blue-950">
                철도용어
              </span>
              <span>·</span>
              <time dateTime={term.date}>{formatDate(term.date)}</time>
              <span>·</span>
              <span>{term.readingMinutes}분 읽기</span>
              {term.examRelevant && (
                <span className="rounded-full bg-blue-950 px-2.5 py-1 text-xs font-semibold text-white">
                  🎓 기술사 기출
                </span>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                  {term.title}
                </h1>
                {term.english && (
                  <p className="mt-1 text-lg text-slate-400">{term.english}</p>
                )}
              </div>
              <div className="flex gap-2">
                <FavoriteButton category="terms" slug={slug} title={term.title} />
                <CompletionButton category="terms" slug={slug} title={term.title} />
              </div>
            </div>

            <p className="mt-4 text-lg text-slate-500">{frontmatter.description}</p>

            <dl className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm sm:grid-cols-4">
              {term.abbreviation && (
                <div>
                  <dt className="text-xs font-semibold uppercase text-slate-400">약어</dt>
                  <dd className="mt-1 font-semibold text-slate-900">{term.abbreviation}</dd>
                </div>
              )}
              {fieldLabel && (
                <div>
                  <dt className="text-xs font-semibold uppercase text-slate-400">관련 분야</dt>
                  <dd className="mt-1 font-semibold text-slate-900">{fieldLabel}</dd>
                </div>
              )}
              <div>
                <dt className="text-xs font-semibold uppercase text-slate-400">난이도</dt>
                <dd className="mt-1">
                  <DifficultyStars level={term.difficulty} />
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase text-slate-400">기술사 기출</dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {term.examRelevant ? "있음" : "없음"}
                </dd>
              </div>
            </dl>

            <div className="mt-5">
              <TagList tags={term.tags} />
            </div>
          </header>

          {frontmatter.summary && frontmatter.summary.length > 0 && (
            <SummaryBox category="terms" points={frontmatter.summary} />
          )}

          {term.designStandard && (
            <div className="mb-10 rounded-xl border border-slate-200 bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-950">
                📐 설계기준
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">
                {term.designStandard}
              </p>
            </div>
          )}

          <div id={ARTICLE_CONTAINER_ID}>
            <MDXArticle>{content}</MDXArticle>
          </div>

          <RelatedTermsGraph terms={relatedTerms} />
          <RelatedPosts posts={relatedPosts} />
          <NoteEditor category="terms" slug={slug} />
        </div>
      </div>
    </Container>
  );
}
