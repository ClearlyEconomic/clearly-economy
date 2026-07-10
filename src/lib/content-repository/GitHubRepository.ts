import type { ContentEngineInput } from "@/lib/content-engine";
import type { Category } from "@/lib/types";
import { ContentRepositoryError } from "./errors";
import { readRepositoryMetadata } from "./metadata";
import { assertCompiles, buildFinalMdx, conflictError, notFoundError, validateOrThrow } from "./prepare";
import type { ContentRepository, ContentRepositorySaveOptions, SaveResult } from "./types";

const GITHUB_API_BASE = "https://api.github.com";

type GitHubConfig = {
  owner: string;
  repo: string;
  branch: string;
  token: string;
  contentRoot: string;
};

function loadConfig(): GitHubConfig {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;

  if (!owner || !repo || !token) {
    throw new ContentRepositoryError(
      "IO_ERROR",
      "GitHub 저장소 설정이 없습니다. .env.local에 GITHUB_OWNER / GITHUB_REPO / GITHUB_TOKEN을 추가해주세요."
    );
  }

  return {
    owner,
    repo,
    token,
    branch: process.env.GITHUB_BRANCH || "main",
    contentRoot: process.env.GITHUB_CONTENT_PATH || "content",
  };
}

type GitHubFile = { sha: string; contentBase64: string };

/**
 * GitHub 저장소에 커밋하는 방식으로 저장하는 구현체입니다. LocalFileRepository와
 * 마찬가지로 ContentRepository 인터페이스만 구현하므로, getContentRepository()가
 * 반환하는 인스턴스만 바꾸면 save-content API 라우트/관리자 UI는 전혀 손댈
 * 필요가 없습니다. GitHub REST Contents API를 별도 SDK 없이 fetch로 직접
 * 호출합니다(이 프로젝트가 지금까지 유지해 온 의존성 최소화 방식과 일관됨).
 *
 * 참고: 이 Repository는 "쓰기(저장)" 경로만 GitHub를 사용합니다. 사이트가
 * 실제로 글을 읽어 렌더링하는 경로(src/lib/posts.ts 등)는 여전히 로컬
 * 파일시스템을 기준으로 하므로, 커밋된 내용이 사이트에 반영되려면 배포
 * 파이프라인이 그 커밋을 pull해서 다시 빌드해야 합니다 (Git 기반 headless
 * CMS의 일반적인 동작 방식 — Netlify CMS/Decap CMS와 동일한 패턴).
 */
export class GitHubRepository implements ContentRepository {
  private config: GitHubConfig;

  constructor() {
    this.config = loadConfig();
  }

  private filePath(category: Category, slug: string): string {
    return `${this.config.contentRoot}/${category}/${slug}.mdx`;
  }

  private apiUrl(filePath: string): string {
    return `${GITHUB_API_BASE}/repos/${this.config.owner}/${this.config.repo}/contents/${filePath}`;
  }

  private headers(): HeadersInit {
    return {
      Authorization: `Bearer ${this.config.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    };
  }

  private async getFile(filePath: string): Promise<GitHubFile | null> {
    let response: Response;
    try {
      response = await fetch(`${this.apiUrl(filePath)}?ref=${this.config.branch}`, {
        headers: this.headers(),
      });
    } catch {
      throw new ContentRepositoryError("IO_ERROR", "GitHub에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.");
    }

    if (response.status === 404) return null;
    if (!response.ok) throw await this.mapError(response);

    const json = (await response.json()) as { sha: string; content: string };
    return { sha: json.sha, contentBase64: json.content };
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

  private async commitFile(filePath: string, content: string, message: string, sha?: string): Promise<void> {
    const body = {
      message,
      content: utf8ToBase64(content),
      branch: this.config.branch,
      ...(sha ? { sha } : {}),
    };

    let response: Response;
    try {
      response = await fetch(this.apiUrl(filePath), {
        method: "PUT",
        headers: this.headers(),
        body: JSON.stringify(body),
      });
    } catch {
      throw new ContentRepositoryError("IO_ERROR", "GitHub에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.");
    }

    if (!response.ok) throw await this.mapError(response);
  }

  private async mapError(response: Response): Promise<ContentRepositoryError> {
    const body = await response.json().catch(() => null);
    const message = body && typeof body === "object" && "message" in body ? String(body.message) : undefined;

    switch (response.status) {
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
        return new ContentRepositoryError(
          "VALIDATION_FAILED",
          message ? `GitHub 요청이 거부되었습니다: ${message}` : "GitHub 요청이 거부되었습니다."
        );
      default:
        return new ContentRepositoryError(
          "IO_ERROR",
          `GitHub 저장 중 오류가 발생했습니다 (HTTP ${response.status})${message ? `: ${message}` : ""}`
        );
    }
  }
}

function utf8ToBase64(text: string): string {
  return Buffer.from(text, "utf-8").toString("base64");
}

function base64ToUtf8(base64: string): string {
  return Buffer.from(base64, "base64").toString("utf-8");
}

function byteLength(text: string): number {
  return Buffer.byteLength(text, "utf-8");
}
