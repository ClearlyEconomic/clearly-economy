"use client";

import { useEffect, useRef, useState } from "react";
import { getNote, saveNote } from "@/lib/learning/notes";
import type { Category } from "@/lib/types";

/**
 * 아주 가벼운 마크다운 미리보기입니다. 본문 렌더링에 쓰는 MDX 파이프라인과는
 * 별개로, 개인 메모용으로 굵게/기울임/제목/목록/링크 정도만 지원합니다.
 */
function renderNotePreview(markdown: string): string {
  const escaped = markdown
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped
    .split("\n")
    .map((line) => {
      if (/^### /.test(line)) return `<h4>${line.slice(4)}</h4>`;
      if (/^## /.test(line)) return `<h3>${line.slice(3)}</h3>`;
      if (/^# /.test(line)) return `<h2>${line.slice(2)}</h2>`;
      if (/^[-*] /.test(line)) return `<li>${line.slice(2)}</li>`;
      if (!line.trim()) return "<br/>";
      return `<p>${line}</p>`;
    })
    .join("\n")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

export function NoteEditor({ category, slug }: { category: Category; slug: string }) {
  const [content, setContent] = useState("");
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setContent(getNote(category, slug));
  }, [category, slug]);

  function handleChange(value: string) {
    setContent(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      saveNote(category, slug, value);
      setSavedAt(Date.now());
    }, 600);
  }

  return (
    <section className="mt-10 rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          📝 내 메모
        </h2>
        <div className="flex gap-1 rounded-md border border-slate-200 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setMode("edit")}
            className={`rounded px-2 py-1 font-semibold ${
              mode === "edit" ? "bg-slate-100 text-slate-900" : "text-slate-400"
            }`}
          >
            편집
          </button>
          <button
            type="button"
            onClick={() => setMode("preview")}
            className={`rounded px-2 py-1 font-semibold ${
              mode === "preview" ? "bg-slate-100 text-slate-900" : "text-slate-400"
            }`}
          >
            미리보기
          </button>
        </div>
      </div>

      {mode === "edit" ? (
        <textarea
          value={content}
          onChange={(event) => handleChange(event.target.value)}
          placeholder="이 글에 대한 나만의 메모를 마크다운으로 남겨보세요. (**굵게**, *기울임*, # 제목, - 목록)"
          rows={6}
          className="mt-3 w-full resize-y rounded-lg border border-slate-200 p-3 text-sm leading-relaxed text-slate-700 outline-none focus:border-slate-400"
        />
      ) : (
        <div
          className="prose prose-sm mt-3 max-w-none rounded-lg border border-slate-100 bg-slate-50 p-3"
          dangerouslySetInnerHTML={{
            __html: content.trim()
              ? renderNotePreview(content)
              : "<p class='text-slate-400'>작성된 메모가 없습니다.</p>",
          }}
        />
      )}

      <p className="mt-2 text-xs text-slate-400">
        {savedAt
          ? `자동 저장됨 · ${new Date(savedAt).toLocaleTimeString("ko-KR")}`
          : "이 브라우저에만 저장됩니다."}
      </p>
    </section>
  );
}
