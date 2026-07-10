import { buildFrontmatter } from "./frontmatter";
import { formatMdx } from "./format";
import { renderSections } from "./sections";
import type { ContentSection } from "./types";

/**
 * 모든 Generator가 공유하는 최종 조립 단계입니다.
 * frontmatter 필드 매핑만 Generator마다 다르고, 나머지 조립 로직은 여기 한 곳에만 있습니다.
 */
export function assembleMdx(
  frontmatterFields: Record<string, unknown>,
  sections: ContentSection[]
): string {
  const frontmatter = buildFrontmatter(frontmatterFields);
  const body = renderSections(sections);
  return formatMdx(`${frontmatter}\n\n${body}\n`);
}
