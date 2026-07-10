"use client";

import { useEffect, useState } from "react";
import { TermCard } from "./TermCard";
import { getFavorites } from "@/lib/learning/favorites";
import type { TermMeta } from "@/lib/terms";

export function FavoriteTermsList({ allTerms }: { allTerms: TermMeta[] }) {
  const [favorites, setFavorites] = useState<TermMeta[] | null>(null);

  useEffect(() => {
    const slugs = getFavorites("terms").map((entry) => entry.slug);
    setFavorites(allTerms.filter((term) => slugs.includes(term.slug)));
  }, [allTerms]);

  if (!favorites || favorites.length === 0) return null;

  return (
    <section className="flex flex-col gap-5">
      <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
        ⭐ 즐겨찾기한 용어
      </h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {favorites.map((term) => (
          <TermCard key={term.slug} term={term} />
        ))}
      </div>
    </section>
  );
}
