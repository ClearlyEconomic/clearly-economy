import Link from "next/link";
import { CATEGORY_THEME } from "@/lib/site";
import type { Topic } from "@/lib/site";

const theme = CATEGORY_THEME.learn;

export function CategoryCard({ topic }: { topic: Topic }) {
  return (
    <Link
      href={`/learn?topic=${topic.slug}`}
      className={`group flex flex-col gap-2 rounded-xl border ${theme.border} border-l-4 ${theme.accentBorderL} bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${theme.borderHover}`}
    >
      <span className="text-2xl">{topic.emoji}</span>
      <h3 className={`font-bold text-slate-900 ${theme.groupHoverText}`}>
        {topic.label}
      </h3>
      <p className="text-sm text-slate-500">{topic.description}</p>
    </Link>
  );
}
