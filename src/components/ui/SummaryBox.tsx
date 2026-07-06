import { CATEGORY_THEME } from "@/lib/site";
import type { Category } from "@/lib/types";

export function SummaryBox({
  category,
  points,
}: {
  category: Category;
  points: string[];
}) {
  const theme = CATEGORY_THEME[category];

  return (
    <div className={`mb-10 rounded-xl border ${theme.softBorder} ${theme.soft} p-6`}>
      <p className={`text-xs font-bold uppercase tracking-wider ${theme.text}`}>
        한눈에 보기
      </p>
      <ul className="mt-3 space-y-2">
        {points.map((point) => (
          <li key={point} className="flex gap-2 text-sm text-slate-700">
            <span className={`mt-0.5 ${theme.text}`}>•</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
