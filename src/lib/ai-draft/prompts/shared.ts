import { getBodyTemplate } from "@/lib/admin/templates";
import type { Category } from "@/lib/types";
import type { DraftContext } from "../types";

/** "## 제목" 템플릿에서 섹션 제목만 순서대로 뽑아냅니다 — 관리자 폼의 본문 템플릿과
 * AI 프롬프트가 항상 같은 섹션 구조를 쓰도록 단일 출처(getBodyTemplate)를 공유합니다. */
export function getSectionHeadings(category: Category): string[] {
  return getBodyTemplate(category)
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => line.slice(3).trim());
}

export const MDX_COMPONENT_GUIDE = `사용 가능한 강조 컴포넌트 (본문 안에서 필요한 곳에만 선택적으로 사용하세요. 남용하지 마세요):
- <MemoryTip>내용</MemoryTip> : 시험 전 반드시 기억해야 할 핵심 암기 포인트
- <ExamAlert>내용</ExamAlert> : 기출 빈도가 높은 포인트를 강조
- <DesignStandard>내용</DesignStandard> : 설계기준 수치·규정 보충 설명
- <PracticeTip>내용</PracticeTip> : 현장/실무 관점의 참고 사항
- <Figure type="도면" caption="설명" /> : 도면/사진/표 자리 표시(실제 이미지는 없으므로 자리만 남깁니다. type은 "도면"/"사진"/"표" 중 하나)`;

export const OUTPUT_RULES = `출력 규칙 (반드시 지키세요):
- frontmatter(---로 감싸인 메타데이터, title/date 등)는 절대 포함하지 마세요. 본문만 출력하세요.
- 제목을 다시 "# 제목"처럼 h1으로 쓰지 마세요. 첫 줄부터 바로 "## 첫 번째 섹션 제목"으로 시작하세요.
- 아래 지정된 섹션 제목을 정확히 그 글자 그대로, 주어진 순서대로 모두 사용하세요.
- 각 섹션은 최소 2~4문장 이상, 개조식이 아닌 서술형 기술 문서체(평서문)로 작성하세요.
- 마크다운 표(| --- | 형식)는 사용하지 마세요. 현재 렌더링 파이프라인이 표를 지원하지 않습니다.
- 본문에 중괄호 {, }를 직접 쓰지 마세요. 필요하면 "약 30 mm" 처럼 단위를 풀어서 쓰세요.
- 코드 예시가 필요하면 \`\`\` 코드블록을 사용해도 됩니다.
- 한국 철도 실무/기술사 시험에서 통용되는 정확한 용어를 사용하세요. 근거 없는 수치를 단정적으로 제시하지 마세요.`;

function contextLines(ctx: DraftContext): string {
  const lines = [
    `[제목] ${ctx.title || "(제목 없음)"}`,
    `[카테고리] ${ctx.category}`,
    `[설명] ${ctx.description || "없음"}`,
    `[태그] ${ctx.tags.length ? ctx.tags.join(", ") : "없음"}`,
    `[난이도] ${ctx.difficulty}/5`,
    `[출제빈도] ${ctx.examFrequency}`,
    `[기술사 중요도] ${ctx.examImportance}`,
    `[핵심 요약] ${ctx.summary.length ? ctx.summary.join(" / ") : "없음"}`,
  ];
  if (ctx.topic) lines.push(`[분야] ${ctx.topic}`);
  if (ctx.english) lines.push(`[영문명] ${ctx.english}`);
  if (ctx.abbreviation) lines.push(`[약어] ${ctx.abbreviation}`);
  if (ctx.field) lines.push(`[관련 분야] ${ctx.field}`);
  return lines.join("\n");
}

/** 카테고리별 프롬프트 파일이 공통으로 쓰는 조립 함수입니다. */
export function assemblePrompt(params: {
  persona: string;
  ctx: DraftContext;
  headings: string[];
  extraGuidance?: string;
}): string {
  const { persona, ctx, headings, extraGuidance } = params;

  return `${persona}

다음은 이번에 작성할 글의 정보입니다:
${contextLines(ctx)}

다음 섹션을 정확히 이 순서로, 각각 "## 섹션 제목" 형태로 작성하세요:
${headings.map((h) => `## ${h}`).join("\n")}

${MDX_COMPONENT_GUIDE}

${OUTPUT_RULES}
${extraGuidance ? `\n${extraGuidance}` : ""}`;
}
