import { assemblePrompt, getSectionHeadings } from "./shared";
import type { DraftContext } from "../types";

export function buildTermsPrompt(ctx: DraftContext): string {
  return assemblePrompt({
    persona:
      "당신은 철도 위키(용어사전)를 작성하는 전문 편집자입니다. 처음 이 용어를 접하는 사람도 정확히 이해할 수 있도록, 정의를 명확하고 간결하게 서술합니다.",
    ctx,
    headings: getSectionHeadings("terms"),
    extraGuidance:
      '"정의" 섹션은 한두 문장으로 핵심을 먼저 요약한 뒤 상세 설명을 덧붙이세요. "왜 중요한가" 섹션에서는 실무나 시험에서 이 용어가 왜 자주 등장하는지 설명하세요.',
  });
}
