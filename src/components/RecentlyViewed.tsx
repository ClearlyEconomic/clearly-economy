"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getRecentlyRead } from "@/lib/learning/reading";
import type { ReadEntry } from "@/lib/learning/types";

export function RecentlyViewed() {
  const [entries, setEntries] = useState<ReadEntry[]>([]);

  useEffect(() => {
    setEntries(getRecentlyRead("terms"));
  }, []);

  if (entries.length === 0) return null;

  return (
    <section className="border-b border-slate-200 bg-white py-10">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          이어서 보기
        </p>
        <h2 className="mt-1 text-lg font-extrabold text-slate-900">최근 본 용어</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {entries.map((entry) => (
            <Link
              key={entry.slug}
              href={`/terms/${entry.slug}`}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 transition-colors hover:border-slate-400"
            >
              {entry.title}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
