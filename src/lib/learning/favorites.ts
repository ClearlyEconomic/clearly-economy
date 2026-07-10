import { readLocalJSON, writeLocalJSON } from "@/lib/local-storage";
import type { ContentRef, FavoriteEntry } from "./types";
import type { Category } from "@/lib/types";

const FAVORITES_KEY = "seoki-hyeon:learning:favorites";

function key(category: string, slug: string): string {
  return `${category}/${slug}`;
}

type FavoritesMap = Record<string, FavoriteEntry>;

function getMap(): FavoritesMap {
  return readLocalJSON<FavoritesMap>(FAVORITES_KEY, {});
}

export function isFavorite(category: string, slug: string): boolean {
  return key(category, slug) in getMap();
}

export function toggleFavorite(ref: ContentRef): boolean {
  const map = getMap();
  const k = key(ref.category, ref.slug);
  if (map[k]) {
    delete map[k];
    writeLocalJSON(FAVORITES_KEY, map);
    return false;
  }
  map[k] = { ...ref, favoritedAt: Date.now() };
  writeLocalJSON(FAVORITES_KEY, map);
  return true;
}

export function getFavorites(category?: Category): FavoriteEntry[] {
  return Object.values(getMap())
    .filter((entry) => !category || entry.category === category)
    .sort((a, b) => b.favoritedAt - a.favoritedAt);
}
