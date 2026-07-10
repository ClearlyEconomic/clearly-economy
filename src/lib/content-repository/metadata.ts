import type { PublishStatus } from "./types";

export type RepositoryMetadata = {
  status: PublishStatus;
  createdAt: string;
  updatedAt: string;
  revision: number;
};

const FRONTMATTER_BLOCK = /^---\n([\s\S]*?)\n---\n/;

/**
 * Content Engine이 만든 MDX는 title/date/description 등 "콘텐츠" frontmatter만
 * 가지고 있습니다. status/createdAt/updatedAt/revision은 저장(운영) 시점에만
 * 의미가 생기는 값이라 Content Engine의 스키마에 넣지 않고, 이 함수가 저장
 * 직전에 frontmatter 블록 끝에 이어붙입니다. Content Engine 자체는 이 값들의
 * 존재를 전혀 모릅니다.
 */
export function injectRepositoryMetadata(mdx: string, meta: RepositoryMetadata): string {
  const match = mdx.match(FRONTMATTER_BLOCK);
  if (!match) {
    throw new Error("생성된 MDX에서 frontmatter 블록을 찾을 수 없습니다.");
  }

  const metadataLines = [
    `status: ${JSON.stringify(meta.status)}`,
    `createdAt: ${JSON.stringify(meta.createdAt)}`,
    `updatedAt: ${JSON.stringify(meta.updatedAt)}`,
    `revision: ${meta.revision}`,
  ].join("\n");

  const rest = mdx.slice(match[0].length);
  return `---\n${match[1]}\n${metadataLines}\n---\n${rest}`;
}

/** 기존 파일의 frontmatter에서 createdAt/revision을 읽어옵니다 (update 시 사용). */
export function readRepositoryMetadata(mdx: string): Partial<RepositoryMetadata> {
  const match = mdx.match(FRONTMATTER_BLOCK);
  if (!match) return {};

  const block = match[1];
  const createdAt = block.match(/^createdAt:\s*"([^"]*)"/m)?.[1];
  const revisionRaw = block.match(/^revision:\s*(\d+)/m)?.[1];
  const status = block.match(/^status:\s*"([^"]*)"/m)?.[1] as PublishStatus | undefined;

  return {
    createdAt,
    revision: revisionRaw ? Number(revisionRaw) : undefined,
    status,
  };
}
