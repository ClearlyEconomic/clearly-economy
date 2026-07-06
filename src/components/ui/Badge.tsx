import { CATEGORY_LABELS, CATEGORY_THEME } from "@/lib/site";
import type { Category } from "@/lib/types";

export function CategoryBadge({ category }: { category: Category }) {
  const theme = CATEGORY_THEME[category];
  return (
    <span
      className={`inline-flex items-center rounded-full ${theme.soft} px-2.5 py-1 text-xs font-semibold ${theme.textStrong}`}
    >
      {CATEGORY_LABELS[category]}
    </span>
  );
}
