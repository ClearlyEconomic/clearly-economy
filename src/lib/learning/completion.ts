import { readLocalJSON, writeLocalJSON } from "@/lib/local-storage";
import type { ContentRef, CompletionEntry } from "./types";
import type { Category } from "@/lib/types";

const COMPLETION_KEY = "seoki-hyeon:learning:completed";

function key(category: string, slug: string): string {
  return `${category}/${slug}`;
}

type CompletionMap = Record<string, CompletionEntry>;

function getMap(): CompletionMap {
  return readLocalJSON<CompletionMap>(COMPLETION_KEY, {});
}

export function isCompleted(category: string, slug: string): boolean {
  return key(category, slug) in getMap();
}

/** "읽음"과는 별개로 관리되는 학습 완료 체크입니다. */
export function toggleCompletion(ref: ContentRef): boolean {
  const map = getMap();
  const k = key(ref.category, ref.slug);
  if (map[k]) {
    delete map[k];
    writeLocalJSON(COMPLETION_KEY, map);
    return false;
  }
  map[k] = { ...ref, completedAt: Date.now() };
  writeLocalJSON(COMPLETION_KEY, map);
  return true;
}

export function getCompletions(category?: Category): CompletionEntry[] {
  return Object.values(getMap())
    .filter((entry) => !category || entry.category === category)
    .sort((a, b) => b.completedAt - a.completedAt);
}
