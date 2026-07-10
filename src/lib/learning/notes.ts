import { readLocalJSON, writeLocalJSON } from "@/lib/local-storage";
import type { NoteEntry } from "./types";
import type { Category } from "@/lib/types";

const NOTES_KEY = "seoki-hyeon:learning:notes";

function key(category: string, slug: string): string {
  return `${category}/${slug}`;
}

type NotesMap = Record<string, NoteEntry>;

function getMap(): NotesMap {
  return readLocalJSON<NotesMap>(NOTES_KEY, {});
}

export function getNote(category: Category, slug: string): string {
  return getMap()[key(category, slug)]?.content ?? "";
}

export function saveNote(category: Category, slug: string, content: string): void {
  const map = getMap();
  const k = key(category, slug);
  if (!content.trim()) {
    delete map[k];
  } else {
    map[k] = { category, slug, content, updatedAt: Date.now() };
  }
  writeLocalJSON(NOTES_KEY, map);
}

export function getAllNotes(): NoteEntry[] {
  return Object.values(getMap()).sort((a, b) => b.updatedAt - a.updatedAt);
}
