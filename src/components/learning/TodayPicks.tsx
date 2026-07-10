import Link from "next/link";
import { DifficultyStars } from "@/components/terms/DifficultyStars";
import type { PostMeta } from "@/lib/types";
import type { TermMeta } from "@/lib/terms";

export function TodayPicks({
  studyPost,
  term,
  generalPost,
}: {
  studyPost: PostMeta | null;
  term: TermMeta | null;
  generalPost: PostMeta | null;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-3">
      <div className="rounded-xl border border-slate-200 border-l-4 border-l-blue-950 bg-white p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          오늘의 추천 기술사 주제
        </p>
        {studyPost ? (
          <Link
            href={`/study/${studyPost.slug}`}
            className="mt-2 block font-bold text-slate-900 hover:text-blue-950"
          >
            {studyPost.title}
          </Link>
        ) : (
          <p className="mt-2 text-sm text-slate-400">추천할 주제가 없습니다.</p>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 border-l-4 border-l-blue-950 bg-white p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          오늘의 추천 용어
        </p>
        {term ? (
          <>
            <Link
              href={`/terms/${term.slug}`}
              className="mt-2 block font-bold text-slate-900 hover:text-blue-950"
            >
              {term.title}
            </Link>
            <div className="mt-1">
              <DifficultyStars level={term.difficulty} />
            </div>
          </>
        ) : (
          <p className="mt-2 text-sm text-slate-400">추천할 용어가 없습니다.</p>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 border-l-4 border-l-blue-950 bg-white p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          오늘의 추천 글
        </p>
        {generalPost ? (
          <Link
            href={`/${generalPost.category}/${generalPost.slug}`}
            className="mt-2 block font-bold text-slate-900 hover:text-blue-950"
          >
            {generalPost.title}
          </Link>
        ) : (
          <p className="mt-2 text-sm text-slate-400">추천할 글이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
