import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { CategoryPageHeader } from "@/components/ui/CategoryPageHeader";
import { TermCard } from "@/components/terms/TermCard";
import { RandomTermButton } from "@/components/terms/RandomTermButton";
import { FavoriteTermsList } from "@/components/terms/FavoriteTermsList";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { CollectionPageJsonLd } from "@/components/CollectionPageJsonLd";
import { getAllPostsMeta } from "@/lib/posts";
import { getAllTermsMeta } from "@/lib/terms";
import { RAIL_TOPICS } from "@/lib/site";
import { ogImageUrl } from "@/lib/og";

const TITLE = "철도용어";
const DESCRIPTION = "헷갈리는 철도 전문 용어를 검색하고, 관련 용어를 따라 탐색하는 위키입니다.";

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

export default async function TermsPage({
  searchParams,
}: {
  searchParams: Promise<{ field?: string }>;
}) {
  const { field } = await searchParams;
  const allTerms = getAllTermsMeta();
  const terms = field ? allTerms.filter((term) => term.field === field) : allTerms;
  const activeField = RAIL_TOPICS.find((topic) => topic.slug === field);
  const postsForJsonLd = getAllPostsMeta("terms");

  return (
    <Container className="flex flex-col gap-10 py-20">
      <BreadcrumbJsonLd items={BREADCRUMB_ITEMS} />
      <CollectionPageJsonLd
        name={TITLE}
        description={DESCRIPTION}
        url="/terms"
        posts={postsForJsonLd}
      />
      <Breadcrumbs items={BREADCRUMB_ITEMS} />
      <CategoryPageHeader category="terms" title={TITLE} description={DESCRIPTION} />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/terms"
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              !activeField
                ? "border-blue-950 bg-blue-950 text-white"
                : "border-slate-200 text-slate-500 hover:border-slate-400"
            }`}
          >
            전체
          </Link>
          {RAIL_TOPICS.map((topic) => (
            <Link
              key={topic.slug}
              href={`/terms?field=${topic.slug}`}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeField?.slug === topic.slug
                  ? "border-blue-950 bg-blue-950 text-white"
                  : "border-slate-200 text-slate-500 hover:border-slate-400"
              }`}
            >
              {topic.emoji} {topic.label}
            </Link>
          ))}
        </div>
        <RandomTermButton slugs={allTerms.map((term) => term.slug)} />
      </div>

      <FavoriteTermsList allTerms={allTerms} />

      <div className="flex flex-col gap-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          {activeField ? `${activeField.label} 용어` : "전체 용어"} ({terms.length})
        </h2>
        {terms.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {terms.map((term) => (
              <TermCard key={term.slug} term={term} />
            ))}
          </div>
        ) : (
          <p className="text-slate-400">아직 등록된 용어가 없습니다.</p>
        )}
      </div>
    </Container>
  );
}
