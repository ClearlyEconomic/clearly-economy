/**
 * Content Engine의 입출력 타입입니다.
 * 이 엔진은 앞으로 관리자 폼, AI 초안 생성, PDF 분석 결과 등
 * 서로 다른 입력 경로가 전부 이 타입을 거쳐 동일한 방식으로 MDX를
 * 생성하도록 하는 공통 계약(contract)입니다.
 */

export type CalloutVariant = "memory" | "examAlert" | "designStandard" | "practiceTip";

export type ContentBlock =
  | { type: "markdown"; text: string }
  | { type: "callout"; variant: CalloutVariant; text: string }
  | { type: "figure"; figureType: "도면" | "사진" | "표"; caption?: string };

export type ContentSection = {
  heading: string;
  blocks: ContentBlock[];
};

type BaseContentFields = {
  title: string;
  date: string;
  description: string;
  tags?: string[];
  image?: string;
  summary?: string[];
  examPoints?: string[];
  difficulty?: number;
  sections: ContentSection[];
};

export type StudyInput = BaseContentFields & {
  category: "study";
  topic: string;
};

export type TermInput = BaseContentFields & {
  category: "terms";
  english?: string;
  abbreviation?: string;
  field?: string;
  relatedTerms?: string[];
  designStandard?: string;
  examRelevant?: boolean;
};

export type StandardInput = BaseContentFields & { category: "standard" };
export type NewsInput = BaseContentFields & { category: "news" };
export type CaseInput = BaseContentFields & { category: "case" };
export type ResourceInput = BaseContentFields & { category: "resource" };

export type ContentEngineInput =
  | StudyInput
  | TermInput
  | StandardInput
  | NewsInput
  | CaseInput
  | ResourceInput;
