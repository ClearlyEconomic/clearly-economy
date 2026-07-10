import type { ContentEngineInput } from "@/lib/content-engine";

/** slug로 사용 가능한 형식인지(영문/숫자/한글/하이픈만) 검사합니다. */
export function isValidSlugFormat(slug: string): boolean {
  return /^[a-z0-9가-힣]+(-[a-z0-9가-힣]+)*$/.test(slug);
}

/**
 * 저장 전 필수 필드를 검사합니다. Content Engine은 입력을 그대로 신뢰하고
 * MDX로 변환만 하므로, "필수 필드가 채워졌는가"는 Repository 계층의 책임입니다.
 * 발견된 문제를 전부 모아서 반환합니다 — 한 번에 하나씩 고치게 하지 않기 위함입니다.
 */
export function validateRequiredFields(slug: string, input: ContentEngineInput): string[] {
  const issues: string[] = [];

  if (!slug.trim()) issues.push("slug를 입력하세요.");
  else if (!isValidSlugFormat(slug)) issues.push("slug는 영문/숫자/한글과 하이픈만 사용할 수 있습니다.");

  if (!input.title.trim()) issues.push("제목을 입력하세요.");
  if (!input.description.trim()) issues.push("설명을 입력하세요.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) issues.push("작성일은 YYYY-MM-DD 형식이어야 합니다.");
  if (!input.sections.some((section) => section.blocks.length > 0)) {
    issues.push("본문 내용을 하나 이상 입력하세요.");
  }
  if (input.difficulty !== undefined && (input.difficulty < 1 || input.difficulty > 5)) {
    issues.push("난이도는 1~5 사이여야 합니다.");
  }

  if (input.category === "study" && !input.topic.trim()) {
    issues.push("철도기술사 글은 분야(topic)를 선택해야 합니다.");
  }

  return issues;
}
