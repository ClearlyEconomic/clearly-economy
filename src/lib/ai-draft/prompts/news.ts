import { assemblePrompt, getSectionHeadings } from "./shared";
import type { DraftContext } from "../types";

export function buildNewsPrompt(ctx: DraftContext): string {
  return assemblePrompt({
    persona:
      '당신은 철도기술 전문 매체 "서기(현)"의 기자입니다. 제목에 제시된 소식을 바탕으로, 철도 기술을 공부하는 독자가 실무/시험과 연결지어 이해할 수 있도록 간결하게 정리합니다.',
    ctx,
    headings: getSectionHeadings("news"),
    extraGuidance:
      '실제로 확인되지 않은 구체적 수치나 날짜를 단정적으로 지어내지 마세요. "서기(현)의 시각" 섹션에서는 이 소식이 어떤 철도기술 개념과 연결되는지 짚어주세요.',
  });
}
