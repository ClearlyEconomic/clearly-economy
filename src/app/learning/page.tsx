import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { OverallProgress } from "@/components/learning/OverallProgress";
import { ContinueStudying } from "@/components/learning/ContinueStudying";
import { TodayPicks } from "@/components/learning/TodayPicks";
import { FavoritesOverview } from "@/components/learning/FavoritesOverview";
import { CategoryProgressList } from "@/components/learning/CategoryProgressList";
import { ContributionCalendar } from "@/components/learning/ContributionCalendar";
import { StatsCards } from "@/components/learning/StatsCards";
import { ReviewSuggestions } from "@/components/learning/ReviewSuggestions";
import { getAllPostsMeta } from "@/lib/posts";
import { getAllTermsMeta } from "@/lib/terms";
import { getDailyPicks } from "@/lib/daily-picks";
import { CATEGORIES } from "@/lib/types";
import { ogImageUrl } from "@/lib/og";

const TITLE = "학습센터";
const DESCRIPTION = "오늘 어디까지 공부했는지, 무엇을 읽었는지, 무엇을 다시 봐야 하는지 한눈에 확인합니다.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: ogImageUrl(TITLE), width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [ogImageUrl(TITLE)],
  },
};

// 매일 자정 이후 "오늘의 학습" 추천이 갱신되도록 하루 주기로 재생성합니다.
export const revalidate = 86400;

const BREADCRUMB_ITEMS = [
  { label: "홈", href: "/" },
  { label: TITLE, href: "/learning" },
];

export default function LearningCenterPage() {
  const postCountByCategory = Object.fromEntries(
    CATEGORIES.map((category) => [category, getAllPostsMeta(category).length])
  ) as Record<(typeof CATEGORIES)[number], number>;
  const totalPostCount = Object.values(postCountByCategory).reduce((a, b) => a + b, 0);

  const studyPosts = getAllPostsMeta("study");
  const generalPosts = [
    ...getAllPostsMeta("case"),
    ...getAllPostsMeta("standard"),
    ...getAllPostsMeta("resource"),
  ];
  const terms = getAllTermsMeta();

  const studyPick = getDailyPicks(studyPosts, 1)[0] ?? null;
  const generalPick = getDailyPicks(generalPosts, 1)[0] ?? null;
  const termPick = getDailyPicks(terms, 1)[0] ?? null;

  return (
    <Container className="flex flex-col gap-14 py-16">
      <Breadcrumbs items={BREADCRUMB_ITEMS} />

      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-blue-950">
          LEARNING CENTER
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {TITLE}
        </h1>
        <p className="mt-3 max-w-2xl text-slate-500">{DESCRIPTION}</p>
      </div>

      <OverallProgress totalPostCount={totalPostCount} />

      <section className="flex flex-col gap-6">
        <SectionHeading eyebrow="CONTINUE" title="이어서 공부하기" />
        <ContinueStudying />
      </section>

      <section className="flex flex-col gap-6">
        <SectionHeading eyebrow="TODAY" title="오늘의 학습" />
        <TodayPicks studyPost={studyPick} term={termPick} generalPost={generalPick} />
      </section>

      <section className="flex flex-col gap-6">
        <SectionHeading eyebrow="FAVORITES" title="즐겨찾기" />
        <FavoritesOverview />
      </section>

      <section className="flex flex-col gap-6">
        <SectionHeading eyebrow="PROGRESS" title="카테고리별 진도율" />
        <CategoryProgressList postCountByCategory={postCountByCategory} />
      </section>

      <section className="flex flex-col gap-6">
        <SectionHeading eyebrow="CALENDAR" title="학습 캘린더" />
        <ContributionCalendar />
      </section>

      <section className="flex flex-col gap-6">
        <SectionHeading eyebrow="STATS" title="학습 통계" />
        <StatsCards />
      </section>

      <section className="flex flex-col gap-6">
        <SectionHeading eyebrow="REVIEW" title="복습이 필요한 글" />
        <ReviewSuggestions />
      </section>
    </Container>
  );
}
