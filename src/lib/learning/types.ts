import type { Category } from "@/lib/types";

/**
 * 학습 데이터 전반에서 공유하는 기본 타입.
 * 지금은 전부 localStorage 기반이지만, 이 파일의 타입들이
 * 곧 향후 DB 스키마의 초안이 되도록 설계했습니다.
 */
export type ContentRef = {
  category: Category;
  slug: string;
  title: string;
};

export type ReadEntry = ContentRef & {
  firstReadAt: number;
  lastReadAt: number;
  viewCount: number;
};

export type FavoriteEntry = ContentRef & {
  favoritedAt: number;
};

export type CompletionEntry = ContentRef & {
  completedAt: number;
};

export type NoteEntry = {
  category: Category;
  slug: string;
  content: string;
  updatedAt: number;
};

export type StudyTimeEntry = {
  category: Category;
  slug: string;
  totalSeconds: number;
};

export type ReviewInterval = 7 | 30 | 90;

export type ReviewSuggestion = ContentRef & {
  interval: ReviewInterval;
  daysSinceRead: number;
};
