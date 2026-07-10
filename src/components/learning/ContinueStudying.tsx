"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getRecentlyRead } from "@/lib/learning/reading";
import type { ReadEntry } from "@/lib/learning/types";

const GENERAL_CATEGORIES = new Set(["study", "case", "standard"]);

type Groups = {
  general: ReadEntry[];
  terms: ReadEntry[];
  resource: ReadEntry[];
  news: ReadEntry[];
};

function EntryList({ entries }: { entries: ReadEntry[] }) {
  if (entries.length === 0) {
    return <p className="text-sm text-slate-400">아직 읽은 글이 없습니다.</p>;
  }
  return (
    <div className="flex flex-col divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
      {entries.map((entry) => (
        <Link
          key={`${entry.category}-${entry.slug}`}
          href={`/${entry.category}/${entry.slug}`}
          className="px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          {entry.title}
        </Link>
      ))}
    </div>
  );
}

export function ContinueStudying() {
  const [groups, setGroups] = useState<Groups | null>(null);

  useEffect(() => {
    const all = getRecentlyRead(undefined, 100);
    setGroups({
      general: all.filter((e) => GENERAL_CATEGORIES.has(e.category)).slice(0, 5),
      terms: getRecentlyRead("terms", 5),
      resource: getRecentlyRead("resource", 5),
      news: getRecentlyRead("news", 5),
    });
  }, []);

  if (!groups) return null;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          최근 읽은 글
        </h3>
        <EntryList entries={groups.general} />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          최근 본 용어
        </h3>
        <EntryList entries={groups.terms} />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          최근 기술자료
        </h3>
        <EntryList entries={groups.resource} />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          최근 뉴스
        </h3>
        <EntryList entries={groups.news} />
      </div>
    </div>
  );
}
