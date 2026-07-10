import { buildStudyPrompt } from "./study";
import { buildTermsPrompt } from "./terms";
import { buildStandardPrompt } from "./standard";
import { buildNewsPrompt } from "./news";
import { buildCasePrompt } from "./case";
import { buildResourcePrompt } from "./resource";
import type { DraftContext } from "../types";

/**
 * 카테고리별로 완전히 다른 프롬프트 파일을 쓰기 위한 단일 진입점입니다.
 * 프롬프트 본문은 이 파일이 아니라 각 카테고리 파일(study.ts 등)에
 * 있습니다 — 코드에 하드코딩하지 않고 파일로 분리해 달라는 요구사항에
 * 따른 구조입니다.
 */
export function buildPrompt(ctx: DraftContext): string {
  switch (ctx.category) {
    case "study":
      return buildStudyPrompt(ctx);
    case "terms":
      return buildTermsPrompt(ctx);
    case "standard":
      return buildStandardPrompt(ctx);
    case "news":
      return buildNewsPrompt(ctx);
    case "case":
      return buildCasePrompt(ctx);
    case "resource":
      return buildResourcePrompt(ctx);
  }
}
