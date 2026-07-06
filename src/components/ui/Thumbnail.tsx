import { CATEGORY_LABELS, CATEGORY_THEME } from "@/lib/site";
import type { Category } from "@/lib/types";

const PLACEHOLDER_BG: Record<Category, string> = {
  today: "bg-blue-100",
  invest: "bg-green-100",
  learn: "bg-purple-100",
  terms: "bg-gray-100",
  blog: "bg-orange-100",
};

export function Thumbnail({
  image,
  category,
  alt,
  className = "",
}: {
  image?: string;
  category: Category;
  alt: string;
  className?: string;
}) {
  if (image) {
    return (
      <div className={`overflow-hidden ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    );
  }

  const theme = CATEGORY_THEME[category];

  return (
    <div
      className={`flex items-center justify-center ${PLACEHOLDER_BG[category]} ${className}`}
    >
      <span
        className={`text-xs font-bold uppercase tracking-widest ${theme.text} opacity-70`}
      >
        {CATEGORY_LABELS[category]}
      </span>
    </div>
  );
}
