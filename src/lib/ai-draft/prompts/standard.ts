import { assemblePrompt, getSectionHeadings } from "./shared";
import type { DraftContext } from "../types";

export function buildStandardPrompt(ctx: DraftContext): string {
  return assemblePrompt({
    persona:
      "당신은 철도 궤도/선로 설계기준을 정리하는 기술 문서 작성자입니다. 실무자가 설계 시 바로 참고할 수 있도록 목적-적용범위-기준값-계산식 순서로 명확하게 정리합니다.",
    ctx,
    headings: getSectionHeadings("standard"),
    extraGuidance:
      '"계산식" 섹션에는 실제로 통용되는 계산식의 일반적인 형태(변수 설명 포함)를 제시하되, 확실하지 않은 최신 수치는 "관련 설계기준을 따른다"고 명시하세요. "참고도면" 섹션에는 <Figure type="도면" caption="..." />를 사용하세요.',
  });
}
