// 클라이언트에서도 안전하게 import 가능한 순수 함수 모음입니다.
// fs 등 서버 전용 API를 사용하지 않습니다 (src/lib/terms.ts와 분리한 이유).

export type TermSearchEntry = {
  slug: string;
  title: string;
  titleLower: string;
  description: string;
  english?: string;
  abbreviation?: string;
  tags: string[];
  relatedTerms: string[];
  field?: string;
  difficulty: number;
  bodyLower: string;
};

function scoreTerm(entry: TermSearchEntry, query: string): number {
  const q = query.toLowerCase().trim();
  if (!q) return 0;

  let score = 0;

  if (entry.titleLower === q) score += 100;
  else if (entry.titleLower.startsWith(q)) score += 60;
  else if (entry.titleLower.includes(q)) score += 40;

  const abbr = entry.abbreviation?.toLowerCase();
  if (abbr) {
    if (abbr === q) score += 90;
    else if (abbr.includes(q)) score += 30;
  }

  if (entry.english?.toLowerCase().includes(q)) score += 25;
  if (entry.tags.some((tag) => tag.toLowerCase().includes(q))) score += 20;
  if (entry.relatedTerms.some((term) => term.toLowerCase().includes(q))) score += 15;
  if (entry.description.toLowerCase().includes(q)) score += 15;
  if (entry.bodyLower.includes(q)) score += 5;

  return score;
}

/**
 * 제목/본문/태그/관련용어/약어를 모두 대상으로 하는 클라이언트 사이드 검색.
 * 용어가 수천 개로 늘어나면 이 함수를 그대로 서버 API 파라미터 처리로
 * 옮기거나 flexsearch 등 인덱싱 라이브러리로 교체할 수 있도록
 * 입출력을 순수 함수 형태로 유지했습니다.
 */
export function searchTerms(
  index: TermSearchEntry[],
  query: string,
  limit = 20
): TermSearchEntry[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  return index
    .map((entry) => ({ entry, score: scoreTerm(entry, trimmed) }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((result) => result.entry);
}
