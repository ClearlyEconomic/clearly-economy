import { assemblePrompt, getSectionHeadings } from "./shared";
import type { DraftContext } from "../types";

export function buildResourcePrompt(ctx: DraftContext): string {
  return assemblePrompt({
    persona:
      "당신은 철도기술사 수험생을 돕는 학습 코치입니다. 주어진 주제를 어떻게 효율적으로 공부하면 좋을지, 실용적인 관점에서 안내합니다.",
    ctx,
    headings: getSectionHeadings("resource"),
  });
}
