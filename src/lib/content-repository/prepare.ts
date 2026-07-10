import { generateMdx, type ContentEngineInput } from "@/lib/content-engine";
import { compileMdxSource } from "@/lib/mdx";
import { ContentRepositoryError } from "./errors";
import { injectRepositoryMetadata, type RepositoryMetadata } from "./metadata";
import { validateRequiredFields } from "./validate";

/**
 * 모든 ContentRepository 구현체(LocalFileRepository, GitHubRepository, ...)가
 * 공유하는 저장 전 준비 단계입니다. "어디에 쓸지"는 각 구현체가 다르지만
 * "무엇을 쓸지 만들고 검증하는 방법"은 항상 동일해야 하므로 한 곳에 모았습니다.
 */

export function validateOrThrow(slug: string, input: ContentEngineInput): void {
  const issues = validateRequiredFields(slug, input);
  if (issues.length > 0) {
    throw new ContentRepositoryError("VALIDATION_FAILED", undefined, issues);
  }
}

export function buildFinalMdx(input: ContentEngineInput, meta: RepositoryMetadata): string {
  // Content Engine은 절대 건드리지 않습니다 — generateMdx가 만든 순수 콘텐츠
  // MDX에, 저장(운영) 메타데이터만 이 계층에서 덧붙입니다.
  const mdx = generateMdx(input);
  return injectRepositoryMetadata(mdx, meta);
}

export async function assertCompiles(mdx: string): Promise<void> {
  try {
    await compileMdxSource(mdx);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new ContentRepositoryError("COMPILE_FAILED", `MDX 컴파일에 실패해 저장을 중단했습니다: ${message}`);
  }
}

export function conflictError(category: string, slug: string): ContentRepositoryError {
  return new ContentRepositoryError(
    "SLUG_CONFLICT",
    `"/${category}/${slug}"에 이미 글이 존재합니다. 다른 slug를 사용하거나 기존 글을 수정하세요.`
  );
}

export function notFoundError(category: string, slug: string): ContentRepositoryError {
  return new ContentRepositoryError("NOT_FOUND", `"/${category}/${slug}" 글을 찾을 수 없어 수정할 수 없습니다.`);
}
