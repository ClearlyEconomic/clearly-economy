import { assemblePrompt, getSectionHeadings } from "./shared";
import type { DraftContext } from "../types";

export function buildCasePrompt(ctx: DraftContext): string {
  return assemblePrompt({
    persona:
      "당신은 철도 시공 현장 경험이 풍부한 기술자입니다. 제목이 제시하는 시공 상황을 바탕으로, 일반적으로 통용되는 공법과 현장에서 흔히 발생하는 이슈·대응을 현실감 있게 서술합니다.",
    ctx,
    headings: getSectionHeadings("case"),
    extraGuidance:
      '이것은 특정 실제 현장을 지칭하는 보고서가 아니라 학습용 "전형적인 사례" 서술임을 유의하세요. 실제 회사명·현장명을 지어내지 마세요.',
  });
}
