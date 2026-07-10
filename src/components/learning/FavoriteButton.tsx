"use client";

import { useEffect, useState } from "react";
import { isFavorite, toggleFavorite } from "@/lib/learning/favorites";
import type { ContentRef } from "@/lib/learning/types";

export function FavoriteButton({ category, slug, title }: ContentRef) {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    setFavorite(isFavorite(category, slug));
  }, [category, slug]);

  return (
    <button
      type="button"
      onClick={() => setFavorite(toggleFavorite({ category, slug, title }))}
      aria-pressed={favorite}
      className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-semibold transition-colors ${
        favorite
          ? "border-blue-950 bg-blue-950 text-white"
          : "border-slate-300 text-slate-600 hover:border-slate-400"
      }`}
    >
      <span aria-hidden="true">{favorite ? "⭐" : "☆"}</span>
      {favorite ? "즐겨찾기됨" : "즐겨찾기"}
    </button>
  );
}
