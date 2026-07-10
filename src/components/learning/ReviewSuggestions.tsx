"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getReadEntries } from "@/lib/learning/reading";
import { getDueForReview, groupByInterval } from "@/lib/learning/spacedRepetition";
import type { ReviewInterval, ReviewSuggestion } from "@/lib/learning/types";

const INTERVAL_LABELS: Record<ReviewInterval, string> = {
  7: "7일 복습",
  30: "30일 복습",
  90: "90일 복습",
};

export function ReviewSuggestions() {
  const [suggestions, setSuggestions] = useState<ReviewSuggestion[] | null>(null);

  useEffect(() => {
    setSuggestions(getDueForReview(getReadEntries()));
  }, []);

  if (!suggestions) return null;

  if (suggestions.length === 0) {
    return (
      <p className="text-sm text-slate-400">
        아직 복습할 항목이 없습니다. 글을 읽은 지 7일이 지나면 이곳에 복습 추천이 표시됩니다.
      </p>
    );
  }

  const grouped = groupByInterval(suggestions);

  return (
    <div className="flex flex-col gap-6">
      {([7, 30, 90] as ReviewInterval[]).map((interval) => {
        const items = grouped[interval];
        if (items.length === 0) return null;
        return (
          <div key={interval} className="flex flex-col gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {INTERVAL_LABELS[interval]} ({items.length})
            </h3>
            <div className="flex flex-col divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
              {items.map((item) => (
                <Link
                  key={`${item.category}-${item.slug}`}
                  href={`/${item.category}/${item.slug}`}
                  className="flex items-center justify-between gap-4 px-4 py-3 text-sm transition-colors hover:bg-slate-50"
                >
                  <span className="font-medium text-slate-900">{item.title}</span>
                  <span className="shrink-0 text-xs text-slate-400">
                    {item.daysSinceRead}일 전 읽음
                  </span>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
