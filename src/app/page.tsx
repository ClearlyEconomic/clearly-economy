import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PostCard } from "@/components/ui/PostCard";
import { PostRow } from "@/components/ui/PostRow";
import { RankedPostCard } from "@/components/ui/RankedPostCard";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { Thumbnail } from "@/components/ui/Thumbnail";
import { getAllPostsMeta, getLatestPosts } from "@/lib/posts";
import { CATEGORY_THEME, LEARN_TOPICS } from "@/lib/site";
import { formatDate } from "@/lib/format";

export default function Home() {
  const todayPosts = getAllPostsMeta("today");
  const hero = todayPosts[0];
  const top3 = todayPosts.slice(1, 4);
  const investPosts = getAllPostsMeta("invest").slice(0, 3);
  const latestPosts = getLatestPosts(8, ["invest", "learn", "terms", "blog"]);

  const investTheme = CATEGORY_THEME.invest;
  const learnTheme = CATEGORY_THEME.learn;

  return (
    <>
      {hero && (
        <section className="border-b border-slate-200 bg-gradient-to-b from-blue-50/70 to-white">
          <Container className="grid gap-10 py-20 sm:py-24 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-14">
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  오늘의 핵심 뉴스
                </span>
                <span className="text-xs text-slate-400">
                  {formatDate(hero.date)} · {hero.readingMinutes}분 읽기
                </span>
              </div>
              <Link href={`/today/${hero.slug}`} className="group">
                <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 group-hover:text-blue-700 sm:text-6xl">
                  {hero.title}
                </h1>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
                  {hero.description}
                </p>
                <span className="mt-7 inline-flex items-center gap-1 text-sm font-semibold text-blue-600">
                  자세히 보기 <span aria-hidden>→</span>
                </span>
              </Link>
            </div>
            <Link
              href={`/today/${hero.slug}`}
              className="group block overflow-hidden rounded-2xl shadow-xl shadow-blue-900/5"
            >
              <Thumbnail
                image={hero.image}
                category="today"
                alt={hero.title}
                className="aspect-[4/3] w-full lg:aspect-square"
              />
            </Link>
          </Container>
        </section>
      )}

      {top3.length > 0 && (
        <section className="py-20">
          <Container className="flex flex-col gap-10">
            <SectionHeading
              eyebrow="TODAY TOP 3"
              eyebrowClassName="text-blue-600"
              title="오늘의 경제 톱3"
              action={
                <Link
                  href="/today"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  전체 보기 →
                </Link>
              }
            />
            <div className="grid gap-5 lg:grid-cols-3">
              {top3.map((post, index) => (
                <RankedPostCard key={post.slug} post={post} rank={index + 1} />
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="border-t border-slate-200 bg-slate-50/50 py-20">
        <Container className="flex flex-col gap-10">
          <SectionHeading
            eyebrow="INVEST INSIGHT"
            eyebrowClassName={investTheme.text}
            title="투자 인사이트"
            action={
              <Link
                href="/invest"
                className={`text-sm font-semibold ${investTheme.text} ${investTheme.textHover}`}
              >
                전체 보기 →
              </Link>
            }
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {investPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container className="flex flex-col gap-10">
          <SectionHeading
            eyebrow="LEARN"
            eyebrowClassName={learnTheme.text}
            title="경제 공부 추천"
            action={
              <Link
                href="/learn"
                className={`text-sm font-semibold ${learnTheme.text} ${learnTheme.textHover}`}
              >
                전체 카테고리 →
              </Link>
            }
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {LEARN_TOPICS.map((topic) => (
              <CategoryCard key={topic.slug} topic={topic} />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-slate-200 bg-slate-50/50 py-20">
        <Container className="flex flex-col gap-6">
          <SectionHeading
            eyebrow="LATEST"
            eyebrowClassName="text-slate-500"
            title="최신 글"
            action={
              <Link
                href="/blog"
                className="text-sm font-semibold text-slate-600 hover:text-slate-900"
              >
                블로그 전체 보기 →
              </Link>
            }
          />
          <div className="flex flex-col rounded-xl border border-slate-200 bg-white px-2 sm:px-4 [&>a:last-child]:border-b-0">
            {latestPosts.map((post) => (
              <PostRow key={`${post.category}-${post.slug}`} post={post} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
