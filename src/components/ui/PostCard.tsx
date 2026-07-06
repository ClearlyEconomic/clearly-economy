import Link from "next/link";
import { CategoryBadge } from "./Badge";
import { Thumbnail } from "./Thumbnail";
import { formatDate } from "@/lib/format";
import { CATEGORY_THEME } from "@/lib/site";
import type { PostMeta } from "@/lib/types";

export function PostCard({ post }: { post: PostMeta }) {
  const theme = CATEGORY_THEME[post.category];

  return (
    <Link
      href={`/${post.category}/${post.slug}`}
      className={`group flex flex-col overflow-hidden rounded-xl border ${theme.border} border-l-4 ${theme.accentBorderL} bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${theme.borderHover}`}
    >
      <Thumbnail
        image={post.image}
        category={post.category}
        alt={post.title}
        className="aspect-[16/9] w-full"
      />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <CategoryBadge category={post.category} />
          <span>·</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>·</span>
          <span>{post.readingMinutes}분 읽기</span>
        </div>
        <h3
          className={`text-lg font-bold leading-snug text-slate-900 ${theme.groupHoverText}`}
        >
          {post.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-slate-500">
          {post.description}
        </p>
      </div>
    </Link>
  );
}
