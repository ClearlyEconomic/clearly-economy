import type { Category } from "@/lib/types";
import type { ContentEngineInput } from "@/lib/content-engine";

export type PublishStatus = "draft" | "review" | "published";

export type ContentRepositorySaveOptions = {
  /** 지정하지 않으면 "draft"로 저장됩니다. */
  status?: PublishStatus;
};

export type SaveResult = {
  /** 저장소 루트 기준 상대 경로 (예: "content/study/slack.mdx") */
  path: string;
  category: Category;
  slug: string;
  sizeBytes: number;
  savedAt: string;
  createdAt: string;
  revision: number;
  status: PublishStatus;
};

/**
 * 콘텐츠 저장을 담당하는 계층의 공통 인터페이스입니다.
 * Content Engine이 만든 MDX 문자열을 "어디에 어떻게" 저장할지는
 * 전적으로 이 인터페이스의 구현체(Local/GitHub/Database)가 결정합니다.
 * 지금은 LocalFileRepository만 존재하지만, 나중에 새 구현체를 추가하고
 * getContentRepository()가 반환하는 인스턴스만 바꾸면 나머지 코드는
 * 그대로 재사용할 수 있도록 설계되어 있습니다.
 */
export interface ContentRepository {
  /** 해당 카테고리에 slug가 이미 존재하는지 확인합니다. */
  exists(category: Category, slug: string): Promise<boolean>;

  /**
   * 새 글을 저장합니다. 같은 slug가 이미 있으면 SLUG_CONFLICT 오류를 던지며,
   * 절대 기존 파일을 덮어쓰지 않습니다. revision은 1로 시작합니다.
   */
  create(
    slug: string,
    input: ContentEngineInput,
    options?: ContentRepositorySaveOptions
  ): Promise<SaveResult>;

  /**
   * 기존 글을 갱신합니다. createdAt은 최초 저장 시점을 그대로 유지하고,
   * revision을 1 증가시키며, updatedAt을 현재 시각으로 갱신합니다.
   * 대상 slug가 없으면 NOT_FOUND 오류를 던집니다.
   * (관리자 UI의 "수정" 기능은 이후 단계에서 연결될 예정이며, 지금은
   * Repository 인터페이스 차원에서 구조만 미리 마련해 둡니다.)
   */
  update(
    slug: string,
    input: ContentEngineInput,
    options?: ContentRepositorySaveOptions
  ): Promise<SaveResult>;
}
