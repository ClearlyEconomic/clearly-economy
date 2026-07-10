import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "관리자 로그인",
  robots: { index: false, follow: false },
};

const ERROR_MESSAGES: Record<string, string> = {
  github_denied: "GitHub 로그인이 취소되었습니다.",
  invalid_state: "로그인 요청이 만료되었거나 올바르지 않습니다. 다시 시도해주세요.",
  not_allowed: "이 GitHub 계정은 관리자로 등록되어 있지 않습니다.",
  unknown: "로그인 중 오류가 발생했습니다. 다시 시도해주세요.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const message = error ? (ERROR_MESSAGES[error] ?? ERROR_MESSAGES.unknown) : null;

  return (
    <Container className="flex min-h-[60vh] max-w-md flex-col items-center justify-center py-16 text-center">
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">관리자 로그인</h1>
      <p className="mt-3 text-sm text-slate-500">허용된 GitHub 계정으로만 관리자 페이지에 접근할 수 있습니다.</p>

      {message && (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{message}</p>
      )}

      <a
        href="/api/auth/github/login"
        className="mt-8 inline-flex items-center gap-2 rounded-md bg-blue-950 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-900"
      >
        GitHub로 로그인
      </a>
    </Container>
  );
}
