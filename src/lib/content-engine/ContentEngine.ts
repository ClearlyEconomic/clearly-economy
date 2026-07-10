import { generateStudyMdx } from "./generators/study";
import { generateTermMdx } from "./generators/terms";
import { generateStandardMdx } from "./generators/standard";
import { generateNewsMdx } from "./generators/news";
import { generateCaseMdx } from "./generators/case";
import { generateResourceMdx } from "./generators/resource";
import type { ContentEngineInput } from "./types";

/**
 * Content Engine의 단일 진입점입니다.
 *
 * 카테고리에 맞는 Generator로 위임할 뿐, 그 외의 어떤 부수효과(파일 저장,
 * 네트워크 호출 등)도 수행하지 않는 순수 함수입니다. 관리자 폼, AI 초안 생성,
 * PDF 분석 결과 등 입력 경로가 달라져도 이 함수 하나만 거치면 항상 동일한
 * 규칙으로 MDX 문자열이 만들어집니다.
 *
 *   StudyGenerator ─┐
 *   TermGenerator   ─┤
 *   StandardGenerator┼─▶ ContentEngine.generateMdx ─▶ MDX 문자열
 *   NewsGenerator   ─┤
 *   CaseGenerator   ─┤
 *   ResourceGenerator┘
 */
export function generateMdx(input: ContentEngineInput): string {
  switch (input.category) {
    case "study":
      return generateStudyMdx(input);
    case "terms":
      return generateTermMdx(input);
    case "standard":
      return generateStandardMdx(input);
    case "news":
      return generateNewsMdx(input);
    case "case":
      return generateCaseMdx(input);
    case "resource":
      return generateResourceMdx(input);
  }
}
