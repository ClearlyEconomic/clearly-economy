import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ogImageUrl } from "@/lib/og";

const TITLE = "AI 질의응답";
const DESCRIPTION = "철도기술사 학습을 돕는 AI 질의응답 기능을 준비하고 있습니다.";

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

const BREADCRUMB_ITEMS = [
  { label: "홈", href: "/" },
  { label: TITLE, href: "/ai-qna" },
];

const SAMPLE_EXCHANGE = [
  {
    question: "완화곡선을 설치하는 목적이 뭔가요?",
    answer:
      "직선과 원곡선 사이의 곡률 변화를 점진적으로 완화해 원심가속도의 급격한 변화를 줄이고, 승차감과 주행 안전성을 확보하기 위해 설치합니다.",
  },
  {
    question: "자갈도상과 콘크리트궤도의 차이는 무엇인가요?",
    answer:
      "자갈도상은 시공비가 저렴하고 배수·소음 흡수에 유리하지만 유지보수 주기가 짧습니다. 콘크리트궤도는 초기 투자비가 높은 대신 궤도틀림이 적고 유지보수 빈도가 낮아 고속·대량수송 구간에 적합합니다.",
  },
];

export default function AiQnaPage() {
  return (
    <Container className="max-w-3xl py-20">
      <Breadcrumbs items={BREADCRUMB_ITEMS} />

      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-10 sm:px-10">
        <p className="text-sm font-bold uppercase tracking-wider text-blue-950">
          AI QNA
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {TITLE}
        </h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-slate-600">
          {DESCRIPTION} 궤도·선형·신호 등 철도기술사 전 분야에 대한 질문에
          아카이브 콘텐츠를 기반으로 답변하는 기능을 준비 중입니다.
        </p>
      </div>

      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          미리보기 (예시 화면)
        </p>

        <div className="mt-5 flex flex-col gap-4">
          {SAMPLE_EXCHANGE.map((exchange) => (
            <div key={exchange.question} className="flex flex-col gap-2">
              <div className="ml-auto max-w-[85%] rounded-xl rounded-tr-sm bg-blue-950 px-4 py-3 text-sm text-white">
                {exchange.question}
              </div>
              <div className="mr-auto max-w-[85%] rounded-xl rounded-tl-sm border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-700">
                {exchange.answer}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-2 border-t border-slate-200 pt-5">
          <input
            type="text"
            disabled
            placeholder="AI 질의응답 기능은 준비 중입니다"
            className="flex-1 cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-400 placeholder:text-slate-400"
          />
          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-lg bg-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-400"
          >
            질문하기
          </button>
        </div>
      </div>
    </Container>
  );
}
