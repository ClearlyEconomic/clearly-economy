import { assemblePrompt, getSectionHeadings } from "./shared";
import type { DraftContext } from "../types";

export function buildStudyPrompt(ctx: DraftContext): string {
  return assemblePrompt({
    persona:
      "당신은 대한민국 철도기술사 자격시험 출제위원 수준의 전문가입니다. 수험생이 실제 시험 답안으로 참고할 수 있는 수준의 정확하고 체계적인 기술 정리 글을 작성합니다.",
    ctx,
    headings: getSectionHeadings("study"),
    extraGuidance:
      '"설계기준" 섹션에는 실제 궤도/선로 설계기준에서 통용되는 수치·기준의 일반적인 형태를 제시하되, 특정 수치를 단정할 수 없다면 "설계기준에서 규정하는 범위 내에서 적용한다" 식으로 서술하세요. "기술사 기출 포인트"에 해당하는 핵심 문장은 <MemoryTip> 또는 <ExamAlert>로 강조하세요.',
  });
}
