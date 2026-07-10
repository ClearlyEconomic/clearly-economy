"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { searchTerms, type TermSearchEntry } from "@/lib/terms-search";

let cachedIndex: TermSearchEntry[] | null = null;

async function loadIndex(): Promise<TermSearchEntry[]> {
  if (cachedIndex) return cachedIndex;
  const res = await fetch("/api/terms-search");
  const data = (await res.json()) as TermSearchEntry[];
  cachedIndex = data;
  return data;
}

export function GlobalSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<TermSearchEntry[] | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = index ? searchTerms(index, query, 8) : [];

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (isShortcut) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  useEffect(() => {
    if (!open) return;
    loadIndex().then(setIndex);
    setQuery("");
    setActiveIndex(0);
    const focusTimer = setTimeout(() => inputRef.current?.focus(), 10);
    return () => clearTimeout(focusTimer);
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  function goToTerm(slug: string) {
    setOpen(false);
    router.push(`/terms/${slug}`);
  }

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const target = results[activeIndex];
      if (target) goToTerm(target.slug);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-500 transition-colors hover:border-slate-400 hover:text-slate-700"
      >
        <span aria-hidden="true">🔍</span>
        <span className="hidden sm:inline">용어 검색</span>
        <kbd className="hidden rounded border border-slate-300 bg-slate-50 px-1.5 py-0.5 text-xs font-semibold text-slate-400 sm:inline">
          Ctrl K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 px-4 pt-24"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="철도용어 검색"
            className="w-full max-w-xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
              <span aria-hidden="true" className="text-slate-400">
                🔍
              </span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="용어, 약어, 태그로 검색 (예: CWR, 캔트, 궤도)"
                className="flex-1 text-sm outline-none placeholder:text-slate-400"
              />
              <kbd className="rounded border border-slate-300 px-1.5 py-0.5 text-xs text-slate-400">
                Esc
              </kbd>
            </div>

            <ul className="max-h-80 overflow-y-auto py-2">
              {results.length === 0 && query.trim() && (
                <li className="px-4 py-6 text-center text-sm text-slate-400">
                  검색 결과가 없습니다.
                </li>
              )}
              {results.length === 0 && !query.trim() && (
                <li className="px-4 py-6 text-center text-sm text-slate-400">
                  제목, 본문, 태그, 관련 용어, 약어를 모두 검색합니다.
                </li>
              )}
              {results.map((result, i) => (
                <li key={result.slug}>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => goToTerm(result.slug)}
                    className={`flex w-full flex-col gap-0.5 px-4 py-2.5 text-left ${
                      activeIndex === i ? "bg-slate-100" : ""
                    }`}
                  >
                    <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                      {result.title}
                      {result.abbreviation && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                          {result.abbreviation}
                        </span>
                      )}
                    </span>
                    <span className="line-clamp-1 text-xs text-slate-500">
                      {result.description}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="border-t border-slate-200 px-4 py-2 text-xs text-slate-400">
              ↑↓ 이동 · Enter 선택 · Esc 닫기
            </div>
          </div>
        </div>
      )}
    </>
  );
}
