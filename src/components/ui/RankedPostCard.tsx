import Link from "next/link";
import { Thumbnail } from "./Thumbnail";
import { formatDate } from "@/lib/format";
import type { PostMeta } from "@/lib/types";

export function RankedPostCard({
  post,
  rank,
}: {
  post: PostMeta;
  rank: number;
}) {
  return (
    <Link
      href={`/${post.category}/${post.slug}`}
      className="group flex gap-4 overflow-hidden rounded-xl border border-blue-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-blue-400 hover:shadow-xl"
    >
      <span className="text-3xl font-extrabold text-blue-100 transition-colors group-hover:text-blue-200">
        {rank}
      </span>
      <Thumbnail
        image={post.image}
        category="today"
        alt={post.title}
        className="hidden h-20 w-20 shrink-0 rounded-lg sm:flex"
      />
      <div className="flex flex-col gap-2">
        <time className="text-xs font-semibold text-blue-600" dateTime={post.date}>
          {formatDate(post.date)}
        </time>
        <h3 className="font-bold leading-snug text-slate-900 group-hover:text-blue-700">
          {post.title}
        </h3>
        <p className="line-clamp-2 text-sm text-slate-500">
          {post.description}
        </p>
      </div>
    </Link>
  );
}
