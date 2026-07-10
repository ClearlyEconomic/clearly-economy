import { LocalFileRepository } from "./LocalFileRepository";
import { GitHubRepository } from "./GitHubRepository";
import type { ContentRepository } from "./types";

/**
 * 저장소 구현체를 고르는 단일 지점입니다. `CONTENT_REPOSITORY` 환경변수로
 * 전환하며, 기본값은 "local"입니다. 나중에 DatabaseRepository가 생기면
 * 여기에 분기 한 줄만 추가하면 되고, API 라우트/관리자 UI는 전혀 손댈
 * 필요가 없습니다.
 */
export function getContentRepository(): ContentRepository {
  const backend = process.env.CONTENT_REPOSITORY ?? "local";

  switch (backend) {
    case "local":
      return new LocalFileRepository();
    case "github":
      return new GitHubRepository();
    // case "database":
    //   return new DatabaseRepository();
    default:
      throw new Error(`지원하지 않는 CONTENT_REPOSITORY입니다: "${backend}"`);
  }
}

export { ContentRepositoryError } from "./errors";
export type { ContentRepositoryErrorCode } from "./errors";
export type { ContentRepository, PublishStatus, SaveResult, ContentRepositorySaveOptions } from "./types";
export { buildContentEngineInput, parseBodyToSections } from "./build-input";
export type { AdminSavePayload } from "./build-input";
export { friendlyMdxError } from "./preview-error";
export type { FriendlyMdxError } from "./preview-error";
export { saveDraft, loadDraft } from "./preview-store";
