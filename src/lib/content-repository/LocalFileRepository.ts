import fs from "fs";
import path from "path";
import type { ContentEngineInput } from "@/lib/content-engine";
import type { Category } from "@/lib/types";
import { ContentRepositoryError } from "./errors";
import { readRepositoryMetadata } from "./metadata";
import { assertCompiles, buildFinalMdx, conflictError, notFoundError, validateOrThrow } from "./prepare";
import type { ContentRepository, ContentRepositorySaveOptions, SaveResult } from "./types";

const CONTENT_ROOT = path.join(process.cwd(), "content");

/**
 * 로컬 파일 시스템(content/{category}/{slug}.mdx)에 저장하는 구현체입니다.
 * ContentRepository 인터페이스만 구현하므로, GitHubRepository 등 다른
 * 구현체를 추가할 때 이 파일의 로직을 참고할 필요 없이 같은 인터페이스를
 * 새로 구현하기만 하면 됩니다. 검증/조립/컴파일 검사는 prepare.ts의 공용
 * 함수를 함께 씁니다 — "무엇을 저장할지"는 모든 구현체가 동일해야 하고,
 * "어디에 어떻게 저장할지"만 구현체마다 다르기 때문입니다.
 */
export class LocalFileRepository implements ContentRepository {
  private filePath(category: Category, slug: string): string {
    return path.join(CONTENT_ROOT, category, `${slug}.mdx`);
  }

  private relativePath(category: Category, slug: string): string {
    return `content/${category}/${slug}.mdx`;
  }

  async exists(category: Category, slug: string): Promise<boolean> {
    return fs.existsSync(this.filePath(category, slug));
  }

  async create(
    slug: string,
    input: ContentEngineInput,
    options: ContentRepositorySaveOptions = {}
  ): Promise<SaveResult> {
    validateOrThrow(slug, input);

    if (await this.exists(input.category, slug)) {
      throw conflictError(input.category, slug);
    }

    const now = new Date().toISOString();
    const status = options.status ?? "draft";
    const finalMdx = buildFinalMdx(input, { status, createdAt: now, updatedAt: now, revision: 1 });
    await assertCompiles(finalMdx);

    const filePath = this.filePath(input.category, slug);
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });

    try {
      // 동시 요청 등으로 그 사이 파일이 생겼을 가능성까지 막기 위해 "wx" 플래그로
      // 기존 파일이 있으면 실패하도록 합니다 (덮어쓰기 방지의 마지막 안전장치).
      await fs.promises.writeFile(filePath, finalMdx, { encoding: "utf-8", flag: "wx" });
    } catch (err) {
      if (isFileExistsError(err)) throw conflictError(input.category, slug);
      throw new ContentRepositoryError("IO_ERROR", "파일을 저장하는 중 오류가 발생했습니다.");
    }

    const stat = await fs.promises.stat(filePath);
    return {
      path: this.relativePath(input.category, slug),
      category: input.category,
      slug,
      sizeBytes: stat.size,
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
    if (!fs.existsSync(filePath)) throw notFoundError(input.category, slug);

    const existing = readRepositoryMetadata(await fs.promises.readFile(filePath, "utf-8"));
    const now = new Date().toISOString();
    const createdAt = existing.createdAt ?? now;
    const revision = (existing.revision ?? 0) + 1;
    const status = options.status ?? existing.status ?? "draft";

    const finalMdx = buildFinalMdx(input, { status, createdAt, updatedAt: now, revision });
    await assertCompiles(finalMdx);

    try {
      await fs.promises.writeFile(filePath, finalMdx, "utf-8");
    } catch {
      throw new ContentRepositoryError("IO_ERROR", "파일을 저장하는 중 오류가 발생했습니다.");
    }

    const stat = await fs.promises.stat(filePath);
    return {
      path: this.relativePath(input.category, slug),
      category: input.category,
      slug,
      sizeBytes: stat.size,
      savedAt: now,
      createdAt,
      revision,
      status,
    };
  }
}

function isFileExistsError(err: unknown): boolean {
  return typeof err === "object" && err !== null && "code" in err && (err as { code: unknown }).code === "EEXIST";
}
