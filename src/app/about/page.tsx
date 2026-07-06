import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
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

export default function AboutPage() {
  return (
    <Container className="max-w-3xl py-20">
      <p className="text-sm font-semibold text-blue-600">ABOUT</p>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        {SITE.name} 소개
      </h1>
      <div className="prose prose-slate mt-8 max-w-none">
        <p>{SITE.description}</p>
        <p>
          분명한경제는 복잡한 경제 뉴스와 데이터를 누구나 이해할 수 있는 언어로
          정리합니다. 매일의 이슈부터 투자 분석, 기초 개념, 용어 정리까지 —
          경제를 읽는 가장 분명한 방법을 제안합니다.
        </p>
        <h2>다루는 콘텐츠</h2>
        <ul>
          <li>
            <strong>오늘의 경제</strong> — 매일 핵심 이슈를 짧고 명확하게
          </li>
          <li>
            <strong>경제 공부</strong> — 주식, 부동산, 금리, 세금 등 기초 개념
          </li>
          <li>
            <strong>투자 분석</strong> — 데이터 기반의 담백한 투자 분석
          </li>
          <li>
            <strong>경제 용어</strong> — 헷갈리는 용어를 한 곳에 정리
          </li>
          <li>
            <strong>블로그</strong> — 그 밖의 생각과 이야기
          </li>
        </ul>
      </div>
    </Container>
  );
}
