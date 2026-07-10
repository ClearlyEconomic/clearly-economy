"use client";

import { useEffect, useState } from "react";
import { getLearningStats, type LearningStats } from "@/lib/learning/progress";
import { formatStudyDuration } from "@/lib/learning/studyTime";

export function StatsCards() {
  const [stats, setStats] = useState<LearningStats | null>(null);

  useEffect(() => {
    setStats(getLearningStats());
  }, []);

  if (!stats) return null;

  const cards = [
    { label: "총 공부 시간", value: formatStudyDuration(stats.totalStudySeconds) },
    { label: "읽은 글 수", value: `${stats.readCount}개` },
    { label: "완료한 글 수", value: `${stats.completedCount}개` },
    { label: "즐겨찾기 수", value: `${stats.favoriteCount}개` },
    { label: "최근 7일 활동", value: `${stats.activeDaysLast7}일` },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-slate-200 bg-white p-4 text-center"
        >
          <p className="text-xl font-extrabold text-slate-900">{card.value}</p>
          <p className="mt-1 text-xs text-slate-400">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
