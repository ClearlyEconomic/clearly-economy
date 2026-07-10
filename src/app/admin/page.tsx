import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "관리자",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const QUICK_CREATE = [
  { category: "study", label: "새 글", description: "철도기술사 학습 자료 작성", icon: "📖" },
  { category: "terms", label: "새 용어", description: "철도용어 사전 항목 작성", icon: "📚" },
  { category: "news", label: "새 뉴스", description: "철도뉴스 브리핑 작성", icon: "📰" },
  { category: "standard", label: "새 설계기준", description: "설계기준 항목 작성", icon: "📐" },
] as const;

const OTHER_CATEGORIES = [
  { category: "case", label: "시공사례", icon: "🏗️" },
  { category: "resource", label: "기술자료", icon: "🗂️" },
] as const;

export default function AdminPage() {
  return (
    <Container className="flex flex-col gap-10 py-16">
      <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        ⚠ 개발 전용 관리자 페이지입니다. 로그인 보호가 없으니 배포 전 반드시 인증을 추가하세요.
      </div>

      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-blue-950">ADMIN</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          관리자
        </h1>
        <p className="mt-2 text-slate-500">
          새 콘텐츠를 작성하고 MDX 파일로 저장하는 CMS입니다.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK_CREATE.map((item) => (
          <Link
            key={item.category}
            href={`/admin/new/${item.category}`}
            className="rounded-xl border border-slate-200 border-l-4 border-l-blue-950 bg-white p-5 transition-colors hover:border-slate-400"
          >
            <span className="text-2xl">{item.icon}</span>
            <h3 className="mt-2 font-bold text-slate-900">{item.label}</h3>
            <p className="mt-1 text-sm text-slate-500">{item.description}</p>
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-6 text-sm">
        <span className="text-slate-400">그 외 카테고리:</span>
        {OTHER_CATEGORIES.map((item) => (
          <Link
            key={item.category}
            href={`/admin/new/${item.category}`}
            className="rounded-md border border-slate-200 px-3 py-1.5 text-slate-600 transition-colors hover:border-slate-400"
          >
            {item.icon} {item.label} 작성
          </Link>
        ))}
      </div>
    </Container>
  );
}
