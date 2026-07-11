import type { ContentEngineInput } from "@/lib/content-engine";
import type { Category } from "@/lib/types";
import {
  base64ToUtf8,
  byteLength,
  commitGitHubFile,
  getGitHubFile,
  GitHubApiError,
  loadGitHubConfig,
  utf8ToBase64,
  type GitHubConfig,
} from "@/lib/github/client";
import { ContentRepositoryError } from "./errors";
import { readRepositoryMetadata } from "./metadata";
import { assertCompiles, buildFinalMdx, conflictError, notFoundError, validateOrThrow } from "./prepare";
import type { ContentRepository, ContentRepositorySaveOptions, SaveResult } from "./types";

/**
 * GitHub 저장소에 커밋하는 방식으로 저장하는 구현체입니다. LocalFileRepository와
 * 마찬가지로 ContentRepository 인터페이스만 구현하므로, getContentRepository()가
 * 반환하는 인스턴스만 바꾸면 save-content API 라우트/관리자 UI는 전혀 손댈
 * 필요가 없습니다. 실제 GitHub REST API 호출은 src/lib/github/client.ts의 공용
 * 클라이언트를 그대로 씁니다 — 이미지 업로드(8단계)도 같은 클라이언트를
 * 재사용하므로, "GitHub에 파일을 커밋한다"는 로직이 두 곳에 따로 존재하지
 * 않습니다.
 *
 * 참고: 이 Repository는 "쓰기(저장)" 경로만 GitHub를 사용합니다. 사이트가
 * 실제로 글을 읽어 렌더링하는 경로(src/lib/posts.ts 등)는 여전히 로컬
 * 파일시스템을 기준으로 하므로, 커밋된 내용이 사이트에 반영되려면 배포
 * 파이프라인이 그 커밋을 pull해서 다시 빌드해야 합니다 (Git 기반 headless
 * CMS의 일반적인 동작 방식 — Netlify CMS/Decap CMS와 동일한 패턴).
 */
export class GitHubRepository implements ContentRepository {
  private config: GitHubConfig;
  private contentRoot: string;

  constructor() {
    this.config = loadGitHubConfig();
    this.contentRoot = process.env.GITHUB_CONTENT_PATH || "content";
  }

  private filePath(category: Category, slug: string): string {
    return `${this.contentRoot}/${category}/${slug}.mdx`;
  }

  async exists(category: Category, slug: string): Promise<boolean> {
    return (await this.getFile(this.filePath(category, slug))) !== null;
  }

  async create(
    slug: string,
    input: ContentEngineInput,
    options: ContentRepositorySaveOptions = {}
  ): Promise<SaveResult> {
    validateOrThrow(slug, input);

    const filePath = this.filePath(input.category, slug);
    if (await this.getFile(filePath)) throw conflictError(input.category, slug);

    const now = new Date().toISOString();
    const status = options.status ?? "draft";
    const finalMdx = buildFinalMdx(input, { status, createdAt: now, updatedAt: now, revision: 1 });
    await assertCompiles(finalMdx);

    await this.commitFile(filePath, finalMdx, `content: ${input.category}/${slug} 새 글 추가`);

    return {
      path: filePath,
      category: input.category,
      slug,
      sizeBytes: byteLength(finalMdx),
      savedAt: now,
      createdAt: now,
      revision: 1,
      status,
    };
  }

  async update(
    slug: string,
    input: ContentEngineInput,
    options: ContentRepositorySaveOptions = {}
  ): Promise<SaveResult> {
    validateOrThrow(slug, input);

    const filePath = this.filePath(input.category, slug);
    const file = await this.getFile(filePath);
    if (!file) throw notFoundError(input.category, slug);

    const existingContent = base64ToUtf8(file.contentBase64);
    const existingMeta = readRepositoryMetadata(existingContent);

    const now = new Date().toISOString();
    const createdAt = existingMeta.createdAt ?? now;
    const revision = (existingMeta.revision ?? 0) + 1;
    const status = options.status ?? existingMeta.status ?? "draft";

    const finalMdx = buildFinalMdx(input, { status, createdAt, updatedAt: now, revision });
    await assertCompiles(finalMdx);

    await this.commitFile(filePath, finalMdx, `content: ${input.category}/${slug} 수정 (rev ${revision})`, file.sha);

    return {
      path: filePath,
      category: input.category,
      slug,
      sizeBytes: byteLength(finalMdx),
      savedAt: now,
      createdAt,
      revision,
      status,
    };
  }

  private async getFile(filePath: string) {
    try {
      return await getGitHubFile(this.config, filePath);
    } catch (err) {
      throw this.toRepositoryError(err);
    }
  }

  private async commitFile(filePath: string, content: string, message: string, sha?: string): Promise<void> {
    try {
      await commitGitHubFile(this.config, filePath, utf8ToBase64(content), message, sha);
    } catch (err) {
      throw this.toRepositoryError(err);
    }
  }

  private toRepositoryError(err: unknown): ContentRepositoryError {
    if (!(err instanceof GitHubApiError)) {
      return new ContentRepositoryError("IO_ERROR", "GitHub 저장 중 알 수 없는 오류가 발생했습니다.");
    }

    switch (err.status) {
      case 401:
        return new ContentRepositoryError("IO_ERROR", "GitHub 인증에 실패했습니다. GITHUB_TOKEN을 확인해주세요.");
      case 403:
        return new ContentRepositoryError(
          "IO_ERROR",
          "GitHub 저장소에 쓰기 권한이 없습니다. 토큰 권한(Contents: Read and write)을 확인해주세요."
        );
      case 404:
        return new ContentRepositoryError(
          "IO_ERROR",
          "GitHub 저장소 또는 브랜치를 찾을 수 없습니다. GITHUB_OWNER/GITHUB_REPO/GITHUB_BRANCH 설정을 확인해주세요."
        );
      case 409:
        return new ContentRepositoryError("SLUG_CONFLICT", "저장하는 사이 파일이 변경되었습니다. 다시 시도해주세요.");
      case 422:
        return new ContentRepositoryError("VALIDATION_FAILED", `GitHub 요청이 거부되었습니다: ${err.message}`);
      case 0:
        return new ContentRepositoryError("IO_ERROR", err.message);
      default:
        return new ContentRepositoryError("IO_ERROR", `GitHub 저장 중 오류가 발생했습니다 (HTTP ${err.status}): ${err.message}`);
    }
  }
}
