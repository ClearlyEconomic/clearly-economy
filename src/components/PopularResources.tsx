"use client";

import { useEffect, useState } from "react";
import { PostCard } from "@/components/ui/PostCard";
import { sortByReadCount } from "@/lib/learning/reading";
import type { PostMeta } from "@/lib/types";

export function PopularResources({ posts }: { posts: PostMeta[] }) {
  const [ordered, setOrdered] = useState(posts);
  const [hasViewData, setHasViewData] = useState(false);

  useEffect(() => {
    const sorted = sortByReadCount(posts);
    setOrdered(sorted);
    setHasViewData(sorted !== posts);
    // posts identity is stable per render from the server; only re-run on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-slate-400">
        {hasViewData
          ? "이 브라우저에서 많이 읽은 글 기준입니다."
          : "글을 읽을수록 이 순서가 방문 기록에 맞춰 바뀝니다."}
      </p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {ordered.slice(0, 3).map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
