import Link from "next/link";
import type { TermMeta } from "@/lib/terms";

export function RelatedTermsGraph({ terms }: { terms: TermMeta[] }) {
  if (terms.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
        관련 용어
      </h2>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {terms.map((term, index) => (
          <span key={term.slug} className="flex items-center gap-2">
            {index > 0 && (
              <span className="text-slate-300" aria-hidden="true">
                →
              </span>
            )}
            <Link
              href={`/terms/${term.slug}`}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-blue-950 hover:text-blue-950"
            >
              {term.title}
            </Link>
          </span>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-400">
        관련 용어를 따라가며 계속 탐색해보세요.
      </p>
    </section>
  );
}
