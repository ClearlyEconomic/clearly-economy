import type { Category } from "@/lib/types";

/**
 * AI Draft Engine에 들어가는 입력입니다. AdminEditor 폼에서 사용자가 이미
 * 입력한 값(제목/카테고리/태그/난이도/출제빈도/기술사 중요도/요약 등)을
 * 그대로 모아 전달합니다 — AI는 이 맥락을 바탕으로 본문(MDX body)만
 * 생성하고, frontmatter 조립은 여전히 Content Engine의 몫입니다.
 */
export type DraftContext = {
  category: Category;
  title: string;
  description: string;
  tags: string[];
  difficulty: number;
  examFrequency: string;
  examImportance: string;
  summary: string[];
  // study 전용
  topic?: string;
  // terms 전용
  english?: string;
  abbreviation?: string;
  field?: string;
};
