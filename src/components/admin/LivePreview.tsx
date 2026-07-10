"use client";

import { useEffect, useRef, useState } from "react";
import type { AdminSavePayload } from "@/lib/content-repository";

type FriendlyMdxError = {
  message: string;
  line?: number;
  column?: number;
  hint: string;
};

type DraftResponse = {
  token: string | null;
  error: FriendlyMdxError | null;
};

const DEBOUNCE_MS = 300;

/**
 * 관리자 폼(payload)을 실제 프로덕션 MDX 파이프라인으로 렌더링해 보여주는
 * 독립 컴포넌트입니다. AdminEditor의 내부 상태를 전혀 알지 못하고 오직
 * `payload` prop만 받으므로, 나중에 AI 초안 생성/PDF 분석 결과/GitHub에서
 * 불러온 콘텐츠를 미리보기할 때도 이 컴포넌트를 그대로 재사용할 수 있습니다.
 *
 * 렌더링은 iframe으로 실제 Server Component 페이지(admin/preview/[token])를
 * 띄우는 방식입니다 — next-mdx-remote/rsc가 만든 컴파일 결과는 react-server
 * 조건에 묶여 있어 react-dom/server로 직접 HTML 문자열화할 수 없기 때문에,
 * Next.js의 실제 렌더링 파이프라인을 그대로 타는 이 방식이 "실제 게시글과
 * 100% 동일한" 결과를 보장하는 유일한 방법입니다.
 */
export function LivePreview({ payload }: { payload: AdminSavePayload }) {
  const [error, setError] = useState<FriendlyMdxError | null>(null);
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const tokenRef = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);

  // payload는 매 렌더마다 새 객체 참조로 들어오므로, 실제 "내용"이 바뀔 때만
  // 재요청하도록 문자열로 직렬화해 의존성으로 사용합니다.
  const payloadKey = JSON.stringify(payload);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      const requestId = ++requestIdRef.current;
      setLoading(true);

      fetch("/api/admin/preview-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...JSON.parse(payloadKey), token: tokenRef.current }),
      })
        .then((res) => res.json())
        .then((data: DraftResponse) => {
          if (requestId !== requestIdRef.current) return; // 더 최신 요청이 이미 진행 중

          if (data.error || !data.token) {
            setError(data.error);
            return;
          }

          setError(null);
          tokenRef.current = data.token;
          setIframeSrc(`/admin/preview/${data.token}?v=${Date.now()}`);
        })
        .catch(() => {
          if (requestId !== requestIdRef.current) return;
          setError({
            message: "미리보기 요청에 실패했습니다.",
            hint: "네트워크 상태를 확인한 뒤 다시 시도해주세요.",
          });
        })
        .finally(() => {
          if (requestId === requestIdRef.current) setLoading(false);
        });
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payloadKey]);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          미리보기{" "}
          {loading && <span className="ml-1 font-normal normal-case text-slate-400">(컴파일 중…)</span>}
        </p>
        <p className="text-xs text-slate-400">
          /{payload.category}/{payload.slug || "..."}
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-bold">
            미리보기를 렌더링할 수 없습니다
            {error.line != null && ` — 약 ${error.line}번째 줄 부근`}
          </p>
          <p className="mt-2">{error.hint}</p>
          <details className="mt-3">
            <summary className="cursor-pointer text-xs text-red-400">원본 오류 메시지 보기</summary>
            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words text-xs text-red-500">
              {error.message}
            </pre>
          </details>
        </div>
      )}

      {!error && iframeSrc && (
        <iframe
          key={iframeSrc}
          src={iframeSrc}
          title="실시간 미리보기"
          className="h-[75vh] min-h-[500px] w-full rounded-xl border border-slate-200 bg-white"
        />
      )}

      {!error && !iframeSrc && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
          입력을 시작하면 실제 게시글과 동일한 모습으로 미리보기가 표시됩니다.
        </div>
      )}
    </div>
  );
}
