import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SITE } from "@/lib/site";
import { ogImageUrl } from "@/lib/og";

const TITLE = "소개";

export const metadata: Metadata = {
  title: TITLE,
  description: SITE.description,
  openGraph: {
    title: `${SITE.name} 소개`,
    description: SITE.description,
    images: [{ url: ogImageUrl(TITLE), width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} 소개`,
    description: SITE.description,
    images: [ogImageUrl(TITLE)],
  },
};

const BREADCRUMB_ITEMS = [
  { label: "홈", href: "/" },
  { label: TITLE, href: "/about" },
];

export default function AboutPage() {
  return (
    <Container className="max-w-3xl py-20">
      <Breadcrumbs items={BREADCRUMB_ITEMS} />
      <p className="text-sm font-bold uppercase tracking-wider text-blue-950">
        ABOUT
      </p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        {SITE.name} 소개
      </h1>
      <p className="mt-2 text-sm text-slate-400">{SITE.nameEn}</p>

      <div className="prose prose-slate prose-lg mt-8 max-w-none leading-relaxed">
        <p>{SITE.description}</p>

        <h2>이름의 의미</h2>
        <p>
          &ldquo;서기(현)&rdquo;은 철도에서 노선의 거리를 표시할 때 기준이 되는
          지점인 &ldquo;서울기점&rdquo;에서 착안했습니다. &ldquo;(현)&rdquo;은
          현행 기준(Current Standard)을 뜻합니다. 즉, 이 아카이브는 지금 이
          순간의 철도 설계기준과 기술을 정확하게 기록하고, 시간이 지나 기준이
          바뀌어도 그 변화를 함께 따라가는 것을 목표로 합니다.
        </p>

        <h2>왜 만들었나</h2>
        <p>
          철도기술사 공부를 하면서 흩어져 있던 개념, 설계기준, 시공사례를
          한 곳에서 체계적으로 정리하고 싶었습니다. 단순히 정보를 나열하는
          블로그가 아니라, 정의부터 기출 포인트까지 시험 대비에 바로 쓸 수
          있는 형태로 구성된 &ldquo;철도 기술 아카이브&rdquo;를 지향합니다.
        </p>

        <h2>다루는 콘텐츠</h2>
        <ul>
          <li>
            <strong>철도기술사</strong> — 선형·궤도·노반·레일·분기기·침목·도상·
            교량·터널·전철·신호·유지보수 12개 분야를 정의부터 기출 포인트까지
          </li>
          <li>
            <strong>철도용어</strong> — 헷갈리는 철도 전문 용어를 한 곳에 정리
          </li>
          <li>
            <strong>설계기준</strong> — 철도설계기준의 핵심 수치와 규정
          </li>
          <li>
            <strong>시공사례</strong> — 실제 현장의 공법과 시공 시 유의사항
          </li>
          <li>
            <strong>기술자료</strong> — 학습법과 참고 자료
          </li>
          <li>
            <strong>철도뉴스</strong> — 철도 정책과 산업 동향
          </li>
        </ul>

        <h2>이런 분들께 도움이 됩니다</h2>
        <ul>
          <li>철도기술사 준비생</li>
          <li>철도 관련 전공자</li>
          <li>철도 현업 종사자</li>
          <li>철도에 관심 있는 일반인</li>
        </ul>
      </div>
    </Container>
  );
}
