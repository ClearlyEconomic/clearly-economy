import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PostCard } from "@/components/ui/PostCard";
import { PostRow } from "@/components/ui/PostRow";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { Thumbnail } from "@/components/ui/Thumbnail";
import { PopularResources } from "@/components/PopularResources";
import { RecentlyViewed } from "@/components/RecentlyViewed";
import { getAllPostsMeta } from "@/lib/posts";
import { RAIL_TOPICS, SITE } from "@/lib/site";
import { getDailyPicks } from "@/lib/daily-picks";

// 매일 자정 이후 첫 요청에서 다시 생성되어 "오늘의 학습" 추천이 갱신됩니다.
export const revalidate = 86400;

export default function Home() {
  const newsPosts = getAllPostsMeta("news");
  const heroPost = newsPosts[0];
  const recentNews = newsPosts.slice(0, 4);
  const resourcePosts = getAllPostsMeta("resource");
  const studyPosts = getAllPostsMeta("study");
  const dailyPicks = getDailyPicks(studyPosts, 3);
  const recentStudy = studyPosts.slice(0, 3);

  return (
    <>
      {/* ① Hero */}
      <section className="border-b border-slate-200 bg-slate-50">
        <Container className="grid gap-10 py-20 sm:py-24 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-14">
          <div className="flex flex-col gap-6">
            <p className="text-sm font-bold uppercase tracking-wider text-blue-950">
              {SITE.nameEn}
            </p>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              철도를 기록하다.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-slate-600">
              현행 기준으로 배우는 철도기술 아카이브.
              <br />
              정의부터 설계기준, 시공사례, 기출 포인트까지 체계적으로
              정리합니다.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/study"
                className="rounded-md bg-blue-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-900"
              >
                철도기술사 시작하기
              </Link>
              <Link
                href="/terms"
                className="rounded-md border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400"
              >
                철도용어 보기
              </Link>
            </div>
          </div>

          {heroPost && (
            <Link
              href={`/news/${heroPost.slug}`}
              className="block overflow-hidden rounded-2xl border border-slate-200"
            >
              <Thumbnail
                image={heroPost.image}
                category="news"
                alt={heroPost.title}
                className="aspect-[4/3] w-full lg:aspect-square"
              />
            </Link>
          )}
        </Container>
      </section>

      <RecentlyViewed />

      {/* ② 오늘의 학습 */}
      {dailyPicks.length > 0 && (
        <section className="py-16">
          <Container className="flex flex-col gap-8">
            <SectionHeading
              eyebrow="TODAY"
              title="오늘의 학습"
              action={
                <Link
                  href="/study"
                  className="text-sm font-semibold text-blue-950 hover:text-blue-800"
                >
                  전체 보기 →
                </Link>
              }
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {dailyPicks.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ③ 분야별 학습 */}
      <section className="border-t border-slate-200 bg-slate-50/60 py-16">
        <Container className="flex flex-col gap-8">
          <SectionHeading
            eyebrow="FIELD"
            title="분야별 학습"
            action={
              <Link
                href="/study"
                className="text-sm font-semibold text-blue-950 hover:text-blue-800"
              >
                전체 분야 →
              </Link>
            }
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {RAIL_TOPICS.map((topic) => (
              <CategoryCard key={topic.slug} topic={topic} />
            ))}
          </div>
        </Container>
      </section>

      {/* ④ 최근 기술사 정리 */}
      {recentStudy.length > 0 && (
        <section className="py-16">
          <Container className="flex flex-col gap-8">
            <SectionHeading
              eyebrow="STUDY"
              title="최근 기술사 정리"
              action={
                <Link
                  href="/study"
                  className="text-sm font-semibold text-blue-950 hover:text-blue-800"
                >
                  전체 보기 →
                </Link>
              }
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {recentStudy.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ⑤ 최신 철도뉴스 */}
      {recentNews.length > 0 && (
        <section className="border-t border-slate-200 bg-slate-50/60 py-16">
          <Container className="flex flex-col gap-6">
            <SectionHeading
              eyebrow="NEWS"
              title="최신 철도뉴스"
              action={
                <Link
                  href="/news"
                  className="text-sm font-semibold text-blue-950 hover:text-blue-800"
                >
                  전체 보기 →
                </Link>
              }
            />
            <div className="flex flex-col rounded-xl border border-slate-200 bg-white px-2 sm:px-4 [&>a:last-child]:border-b-0">
              {recentNews.map((post) => (
                <PostRow key={post.slug} post={post} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ⑥ 인기 기술자료 */}
      {resourcePosts.length > 0 && (
        <section className="py-16">
          <Container className="flex flex-col gap-8">
            <SectionHeading
              eyebrow="POPULAR"
              title="인기 기술자료"
              action={
                <Link
                  href="/resource"
                  className="text-sm font-semibold text-blue-950 hover:text-blue-800"
                >
                  전체 보기 →
                </Link>
              }
            />
            <PopularResources posts={resourcePosts} />
          </Container>
        </section>
      )}
    </>
  );
}
