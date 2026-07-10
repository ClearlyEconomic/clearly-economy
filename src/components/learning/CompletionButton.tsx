"use client";

import { useEffect, useState } from "react";
import { isCompleted, toggleCompletion } from "@/lib/learning/completion";
import type { ContentRef } from "@/lib/learning/types";

export function CompletionButton({ category, slug, title }: ContentRef) {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setCompleted(isCompleted(category, slug));
  }, [category, slug]);

  return (
    <button
      type="button"
      onClick={() => setCompleted(toggleCompletion({ category, slug, title }))}
      aria-pressed={completed}
      className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-semibold transition-colors ${
        completed
          ? "border-slate-700 bg-slate-700 text-white"
          : "border-slate-300 text-slate-600 hover:border-slate-400"
      }`}
    >
      <span aria-hidden="true">{completed ? "☑" : "☐"}</span>
      {completed ? "학습 완료" : "공부 완료"}
    </button>
  );
}
