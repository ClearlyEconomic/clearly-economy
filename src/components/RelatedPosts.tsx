import Link from "next/link";
import { CategoryBadge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/format";
import type { PostMeta } from "@/lib/types";

export function RelatedPosts({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 border-t border-slate-200 pt-10">
      <h2 className="text-lg font-bold text-slate-900">관련 글</h2>
      <div className="mt-5 grid gap-5 sm:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={`${post.category}-${post.slug}`}
            href={`/${post.category}/${post.slug}`}
            className="group rounded-xl border border-slate-200 p-4 transition-colors duration-150 hover:border-slate-400"
          >
            <CategoryBadge category={post.category} />
            <h3 className="mt-2 line-clamp-2 text-sm font-bold text-slate-900 group-hover:text-slate-600">
              {post.title}
            </h3>
            <time className="mt-2 block text-xs text-slate-400" dateTime={post.date}>
              {formatDate(post.date)}
            </time>
          </Link>
        ))}
      </div>
    </section>
  );
}
