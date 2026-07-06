import { CATEGORY_LABELS, CATEGORY_THEME } from "@/lib/site";
import type { Category } from "@/lib/types";

export function CategoryPageHeader({
  category,
  title,
  description,
}: {
  category: Category;
  title: string;
  description: string;
}) {
  const theme = CATEGORY_THEME[category];

  return (
    <div className={`rounded-2xl border ${theme.softBorder} ${theme.soft} px-6 py-12 sm:px-10`}>
      <p className={`text-sm font-bold uppercase tracking-wider ${theme.text}`}>
        {CATEGORY_LABELS[category]}
      </p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-slate-600">{description}</p>
    </div>
  );
}
