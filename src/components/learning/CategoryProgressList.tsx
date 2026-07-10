"use client";

import { useEffect, useState } from "react";
import { ProgressBar } from "./ProgressBar";
import { getCategoryProgress, type CategoryProgress } from "@/lib/learning/progress";
import { CATEGORY_LABELS } from "@/lib/site";
import type { Category } from "@/lib/types";

export function CategoryProgressList({
  postCountByCategory,
}: {
  postCountByCategory: Record<Category, number>;
}) {
  const [progress, setProgress] = useState<CategoryProgress[] | null>(null);

  useEffect(() => {
    setProgress(getCategoryProgress(postCountByCategory));
    // postCountByCategory는 서버에서 한 번 계산되어 내려오는 고정 값입니다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!progress) return null;

  return (
    <div className="flex flex-col gap-3">
      {progress.map((entry) => (
        <ProgressBar
          key={entry.category}
          label={CATEGORY_LABELS[entry.category]}
          percent={entry.percent}
        />
      ))}
    </div>
  );
}
