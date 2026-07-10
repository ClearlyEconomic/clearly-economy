import Link from "next/link";
import { DifficultyStars } from "./DifficultyStars";
import { RAIL_TOPICS } from "@/lib/site";
import type { TermMeta } from "@/lib/terms";

export function TermCard({ term }: { term: TermMeta }) {
  const fieldLabel = RAIL_TOPICS.find((topic) => topic.slug === term.field)?.label;

  return (
    <Link
      href={`/terms/${term.slug}`}
      className="group flex flex-col gap-2 rounded-xl border border-slate-200 border-l-4 border-l-blue-950 bg-white p-5 transition-colors hover:border-slate-400"
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-bold text-slate-900 group-hover:text-blue-950">
          {term.title}
        </h3>
        {term.abbreviation && (
          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
            {term.abbreviation}
          </span>
        )}
      </div>
      <p className="line-clamp-2 text-sm text-slate-500">{term.description}</p>
      <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
        {fieldLabel && <span>카테고리 · {fieldLabel}</span>}
        <DifficultyStars level={term.difficulty} />
      </div>
    </Link>
  );
}
