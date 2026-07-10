"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getFavorites } from "@/lib/learning/favorites";
import type { FavoriteEntry } from "@/lib/learning/types";

const GENERAL_CATEGORIES = new Set(["study", "case", "standard", "news"]);

type Groups = {
  posts: FavoriteEntry[];
  terms: FavoriteEntry[];
  resources: FavoriteEntry[];
};

function EntryList({ entries }: { entries: FavoriteEntry[] }) {
  if (entries.length === 0) {
    return <p className="text-sm text-slate-400">즐겨찾기한 항목이 없습니다.</p>;
  }
  return (
    <div className="flex flex-col divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
      {entries.map((entry) => (
        <Link
          key={`${entry.category}-${entry.slug}`}
          href={`/${entry.category}/${entry.slug}`}
          className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          <span aria-hidden="true">⭐</span>
          {entry.title}
        </Link>
      ))}
    </div>
  );
}

export function FavoritesOverview() {
  const [groups, setGroups] = useState<Groups | null>(null);

  useEffect(() => {
    const all = getFavorites();
    setGroups({
      posts: all.filter((e) => GENERAL_CATEGORIES.has(e.category)),
      terms: all.filter((e) => e.category === "terms"),
      resources: all.filter((e) => e.category === "resource"),
    });
  }, []);

  if (!groups) return null;

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          즐겨찾기한 글
        </h3>
        <EntryList entries={groups.posts} />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          즐겨찾기한 용어
        </h3>
        <EntryList entries={groups.terms} />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          즐겨찾기한 기술자료
        </h3>
        <EntryList entries={groups.resources} />
      </div>
    </div>
  );
}
