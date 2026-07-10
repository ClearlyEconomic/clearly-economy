"use client";

import { useEffect, useState } from "react";
import { ProgressBar } from "./ProgressBar";
import { getOverallProgress, type OverallProgress as OverallProgressData } from "@/lib/learning/progress";

export function OverallProgress({ totalPostCount }: { totalPostCount: number }) {
  const [progress, setProgress] = useState<OverallProgressData | null>(null);

  useEffect(() => {
    setProgress(getOverallProgress(totalPostCount));
  }, [totalPostCount]);

  if (!progress) return null;

  const cells = [
    { label: "전체 글", value: progress.total },
    { label: "읽은 글", value: progress.read },
    { label: "즐겨찾기", value: progress.favorited },
    { label: "완료한 글", value: progress.completed },
  ];

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-white p-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cells.map((cell) => (
          <div key={cell.label} className="text-center">
            <p className="text-2xl font-extrabold text-slate-900">{cell.value}</p>
            <p className="mt-1 text-xs text-slate-400">{cell.label}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2 border-t border-slate-100 pt-4">
        <ProgressBar percent={progress.percentRead} label="읽음" />
        <ProgressBar percent={progress.percentCompleted} label="완료" />
      </div>
    </div>
  );
}
