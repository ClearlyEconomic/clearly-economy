import type { ReadEntry, ReviewInterval, ReviewSuggestion } from "./types";

const DAY_MS = 86_400_000;

/**
 * 간단한(진짜 SM-2/Leitner가 아닌) 임계값 기반 복습 추천입니다.
 * 마지막으로 읽은 지 7/30/90일이 지난 글을 각 구간으로 분류합니다.
 * now를 주입 가능하게 만들어 순수 함수로 테스트할 수 있도록 했습니다.
 */
export function getDueForReview(
  entries: ReadEntry[],
  now: number = Date.now()
): ReviewSuggestion[] {
  return entries
    .map((entry) => {
      const daysSinceRead = Math.floor((now - entry.lastReadAt) / DAY_MS);
      const interval = pickInterval(daysSinceRead);
      if (!interval) return null;
      return {
        category: entry.category,
        slug: entry.slug,
        title: entry.title,
        interval,
        daysSinceRead,
      } satisfies ReviewSuggestion;
    })
    .filter((suggestion): suggestion is ReviewSuggestion => suggestion !== null)
    .sort((a, b) => b.daysSinceRead - a.daysSinceRead);
}

function pickInterval(daysSinceRead: number): ReviewInterval | null {
  if (daysSinceRead >= 90) return 90;
  if (daysSinceRead >= 30) return 30;
  if (daysSinceRead >= 7) return 7;
  return null;
}

export function groupByInterval(
  suggestions: ReviewSuggestion[]
): Record<ReviewInterval, ReviewSuggestion[]> {
  return {
    7: suggestions.filter((s) => s.interval === 7),
    30: suggestions.filter((s) => s.interval === 30),
    90: suggestions.filter((s) => s.interval === 90),
  };
}
