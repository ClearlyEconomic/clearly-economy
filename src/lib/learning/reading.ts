import { readLocalJSON, writeLocalJSON } from "@/lib/local-storage";
import { recordActivity } from "./calendar";
import type { ContentRef, ReadEntry } from "./types";
import type { PostMeta } from "@/lib/types";
import type { Category } from "@/lib/types";

const READ_KEY = "seoki-hyeon:learning:read";
const MAX_RECENT = 5;

type ReadMap = Record<string, ReadEntry>; // "category/slug" -> entry

function key(category: string, slug: string): string {
  return `${category}/${slug}`;
}

function getReadMap(): ReadMap {
  return readLocalJSON<ReadMap>(READ_KEY, {});
}

/** 글 조회를 기록합니다. 조회수 누적 + 캘린더 활동 1틱을 함께 처리합니다. */
export function recordRead(ref: ContentRef): void {
  const map = getReadMap();
  const k = key(ref.category, ref.slug);
  const now = Date.now();
  const existing = map[k];

  map[k] = existing
    ? { ...existing, title: ref.title, lastReadAt: now, viewCount: existing.viewCount + 1 }
    : { ...ref, firstReadAt: now, lastReadAt: now, viewCount: 1 };

  writeLocalJSON(READ_KEY, map);
  recordActivity();
}

export function getReadEntries(): ReadEntry[] {
  return Object.values(getReadMap());
}

export function isRead(category: string, slug: string): boolean {
  return key(category, slug) in getReadMap();
}

export function getRecentlyRead(category?: Category, limit = MAX_RECENT): ReadEntry[] {
  return getReadEntries()
    .filter((entry) => !category || entry.category === category)
    .sort((a, b) => b.lastReadAt - a.lastReadAt)
    .slice(0, limit);
}

/** 이 브라우저에서 많이 읽은 순서로 후보 목록을 재정렬합니다. 방문 기록이 없으면 원래 순서를 유지합니다. */
export function sortByReadCount<T extends PostMeta>(posts: T[]): T[] {
  const map = getReadMap();
  const hasAnyData = Object.keys(map).length > 0;
  if (!hasAnyData) return posts;

  return [...posts].sort(
    (a, b) =>
      (map[key(b.category, b.slug)]?.viewCount ?? 0) -
      (map[key(a.category, a.slug)]?.viewCount ?? 0)
  );
}
