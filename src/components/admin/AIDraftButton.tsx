"use client";

import { useRef, useState } from "react";
import type { DraftContext } from "@/lib/ai-draft";
import { AI_ERROR_MARKER } from "@/lib/ai-draft/stream-protocol";

/**
 * AdminEditor의 본문 입력을 대신 채워주는 버튼입니다. 이 컴포넌트는 어떻게
 * body 상태를 갱신할지 전혀 모르고, `onStart`/`onChunk`/`onDone` 콜백을
 * 통해서만 AdminEditor와 통신합니다 — AI가 결과를 직접 저장하지 않고,
 * Live Editor(본문 textarea)에만 반영한 뒤 사용자가 검토·수정 후 저장 버튼을
 * 눌러야 실제로 저장되는 구조를 지키기 위함입니다.
 */
export function AIDraftButton({
  context,
  onStart,
  onChunk,
  onDone,
}: {
  context: DraftContext;
  onStart: () => void;
  onChunk: (text: string) => void;
  onDone: () => void;
}) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  async function handleGenerate() {
    setError(null);
    setGenerating(true);
    onStart();

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const response = await fetch("/api/admin/ai-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(context),
        signal: controller.signal,
      });

      if (!response.ok) {
        const json = await response.json().catch(() => null);
        throw new Error(json?.error?.message ?? `AI 초안 생성 요청이 실패했습니다 (HTTP ${response.status}).`);
      }
      if (!response.body) throw new Error("AI 응답을 받을 수 없습니다.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (value) buffer += decoder.decode(value, { stream: true });

        // 오류 구분자는 마지막 read에만 등장하는 게 아니라, 스트림 도중의
        // 아무 read에나 (이전 청크와 함께) 섞여 도착할 수 있습니다. 매
        // 반복마다 확인해야지, done일 때만 확인하면 구분자+JSON이 일반
        // 텍스트처럼 그대로 본문에 흘러들어가는 버그가 생깁니다.
        const markerIndex = buffer.indexOf(AI_ERROR_MARKER);
        if (markerIndex !== -1) {
          const jsonPart = buffer.slice(markerIndex + AI_ERROR_MARKER.length);
          let parsedError: { message?: string } | null = null;
          try {
            parsedError = JSON.parse(jsonPart);
          } catch {
            // JSON이 아직 전부 도착하지 않았을 수 있습니다 — done이거나 더 읽을 게
            // 없을 때만 포기하고, 그 전까지는 버퍼를 유지한 채 다음 read를 기다립니다.
          }

          if (parsedError || done) {
            const before = buffer.slice(0, markerIndex);
            if (before) onChunk(before);
            throw new Error(parsedError?.message ?? "AI 초안 생성 중 오류가 발생했습니다.");
          }
          continue;
        }

        if (done) {
          if (buffer) onChunk(buffer);
          break;
        }

        // 오류 구분자가 청크 경계에서 잘릴 수 있으므로, 구분자 길이만큼은
        // 항상 버퍼에 남겨두고 그 앞부분만 안전하게 흘려보냅니다.
        const safeLength = Math.max(0, buffer.length - AI_ERROR_MARKER.length);
        if (safeLength > 0) {
          onChunk(buffer.slice(0, safeLength));
          buffer = buffer.slice(safeLength);
        }
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        // 사용자가 취소한 경우 — 오류로 표시하지 않습니다.
      } else {
        setError(err instanceof Error ? err.message : "AI 초안 생성 중 알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setGenerating(false);
      controllerRef.current = null;
      onDone();
    }
  }

  function handleCancel() {
    controllerRef.current?.abort();
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating || !context.title.trim()}
          className="rounded-md border border-blue-950 px-4 py-2 text-sm font-semibold text-blue-950 transition-colors hover:bg-blue-950 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {generating ? "AI 초안 생성 중…" : "✨ AI 초안 생성"}
        </button>
        {generating && (
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-100"
          >
            취소
          </button>
        )}
        {!context.title.trim() && !generating && (
          <p className="text-xs text-slate-400">제목을 먼저 입력하면 AI 초안을 생성할 수 있습니다.</p>
        )}
      </div>
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div>
      )}
    </div>
  );
}
