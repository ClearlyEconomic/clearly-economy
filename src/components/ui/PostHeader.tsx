import { CategoryBadge } from "./Badge";
import { TagList } from "./TagList";
import { formatDate } from "@/lib/format";
import type { Category } from "@/lib/types";

export function PostHeader({
  category,
  title,
  date,
  description,
  readingMinutes,
  tags,
}: {
  category: Category;
  title: string;
  date: string;
  description?: string;
  readingMinutes: number;
  tags?: string[];
}) {
  return (
    <header className="mb-10 border-b border-slate-200 pb-8">
      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
        <CategoryBadge category={category} />
        <span>·</span>
        <time dateTime={date}>{formatDate(date)}</time>
        <span>·</span>
        <span>{readingMinutes}분 읽기</span>
      </div>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="mt-4 text-lg text-slate-500">{description}</p>
      )}
      <div className="mt-5">
        <TagList tags={tags} />
      </div>
    </header>
  );
}
