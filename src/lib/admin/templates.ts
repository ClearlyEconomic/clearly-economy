import type { Category } from "@/lib/types";

/**
 * 카테고리별 본문(MDX body) 스켈레톤입니다.
 * `summary`(핵심 요약)와 `examPoints`(기술사 기출 포인트)는 본문 소제목이 아니라
 * frontmatter 배열 필드이므로(SummaryBox/ExamPointBox) 여기 포함하지 않습니다.
 */
const BODY_TEMPLATES: Record<Category, string> = {
  study: [
    "## 정의",
    "",
    "",
    "## 목적",
    "",
    "",
    "## 특징",
    "",
    "",
    "## 원리",
    "",
    "",
    "## 설계기준",
    "",
    "",
    "## 시공 시 주의사항",
    "",
    "",
    "## 유지관리",
    "",
    "",
  ].join("\n"),
  terms: ["## 정의", "", "", "## 왜 중요한가", "", "", "## 함께 보면 좋은 개념", "", ""].join(
    "\n"
  ),
  standard: [
    "## 목적",
    "",
    "",
    "## 적용범위",
    "",
    "",
    "## 기준값",
    "",
    "",
    "## 계산식",
    "",
    "",
    "## 참고도면",
    "",
    "",
    "## 관련 규정",
    "",
    "",
  ].join("\n"),
  case: ["## 개요", "", "", "## 적용 공법", "", "", "## 특징", "", "", "## 시공 중 이슈와 대응", "", ""].join(
    "\n"
  ),
  news: ["## 오늘의 핵심", "", "", "## 왜 중요한가", "", "", "## 서기(현)의 시각", "", ""].join(
    "\n"
  ),
  resource: ["## 개요", "", "", "## 핵심 내용", "", ""].join("\n"),
};

export function getBodyTemplate(category: Category): string {
  return BODY_TEMPLATES[category];
}
