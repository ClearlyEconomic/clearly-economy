import Link from "next/link";
import { CategoryBadge } from "./Badge";
import { Thumbnail } from "./Thumbnail";
import { formatDate } from "@/lib/format";
import type { PostMeta } from "@/lib/types";

export function PostRow({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/${post.category}/${post.slug}`}
      className="group flex items-center gap-4 border-b border-slate-100 py-4 transition-colors duration-150 hover:bg-slate-50 sm:rounded-lg sm:px-3"
    >
      <Thumbnail
        image={post.image}
        category={post.category}
        alt={post.title}
        className="hidden h-16 w-16 shrink-0 rounded-lg sm:flex"
      />
      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex flex-wrap items-center gap-3">
          <CategoryBadge category={post.category} />
          <h3 className="font-semibold text-slate-900 group-hover:text-slate-600">
            {post.title}
          </h3>
        </div>
        <div className="flex shrink-0 items-center gap-2 text-xs text-slate-400">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>·</span>
          <span>{post.readingMinutes}분</span>
        </div>
      </div>
    </Link>
  );
}
