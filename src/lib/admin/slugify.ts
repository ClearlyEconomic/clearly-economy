/**
 * 제목에서 URL slug를 생성합니다. 영문이 포함되어 있으면(예: "캔트 (Cant)")
 * 영문 부분을 우선 사용하고, 없으면 한글을 그대로 kebab-case로 변환합니다.
 * 자동 생성된 값은 항상 사용자가 직접 수정할 수 있습니다.
 */
export function slugify(title: string): string {
  const asciiMatches = title.match(/[A-Za-z0-9][A-Za-z0-9\s-]*/g);
  const asciiPart = asciiMatches?.join(" ").trim() ?? "";
  const base = asciiPart.length >= 2 ? asciiPart : title;

  return base
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** slug로 사용 가능한 형식인지(영문/숫자/한글/하이픈만) 검사합니다. */
export function isValidSlugFormat(slug: string): boolean {
  return /^[a-z0-9가-힣]+(-[a-z0-9가-힣]+)*$/.test(slug);
}
