"use client";

import { useRef, useState } from "react";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

type UploadResult = { path: string; publicUrl: string; sizeBytes: number };

/**
 * 이미지를 선택해 GitHub에 업로드하는 버튼입니다. body textarea를 직접 알지
 * 못하고 `onInsertMarkdown` 콜백으로만 AdminEditor와 통신합니다 — AIDraftButton/
 * LivePreview와 같은 패턴입니다.
 */
export function ImageUploadButton({
  category,
  onInsertMarkdown,
}: {
  category: string;
  onInsertMarkdown: (markdown: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [lastUpload, setLastUpload] = useState<UploadResult | null>(null);
  const [copied, setCopied] = useState(false);

  function handlePickClick() {
    inputRef.current?.click();
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    event.target.value = ""; // 같은 파일을 다시 선택해도 change 이벤트가 발생하도록 초기화합니다.
    if (!file) return;

    setError(null);
    setLastUpload(null);
    setCopied(false);

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setError("jpg, jpeg, png, gif, webp 형식만 업로드할 수 있습니다.");
      return;
    }
    if (file.size >= MAX_SIZE_BYTES) {
      setError("파일 크기는 5MB 미만이어야 합니다.");
      return;
    }

    upload(file);
  }

  function upload(file: File) {
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);

    // fetch는 업로드 진행률을 알려주지 않으므로, 진행률 표시가 필요한 이
    // 업로드만 XMLHttpRequest를 씁니다(프로젝트 전반은 fetch를 사용).
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/upload-image");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) setProgress(Math.round((event.loaded / event.total) * 100));
    };

    xhr.onload = () => {
      setUploading(false);

      let json: { result?: UploadResult; error?: { message?: string } } | null = null;
      try {
        json = JSON.parse(xhr.responseText);
      } catch {
        // 응답이 JSON이 아닌 경우 아래 status 기반 메시지로 대체합니다.
      }

      if (xhr.status >= 200 && xhr.status < 300 && json?.result) {
        setLastUpload(json.result);
        navigator.clipboard
          ?.writeText(json.result.publicUrl)
          .then(() => setCopied(true))
          .catch(() => setCopied(false));
      } else {
        setError(json?.error?.message ?? `업로드에 실패했습니다 (HTTP ${xhr.status}).`);
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      setError("네트워크 오류로 업로드에 실패했습니다.");
    };

    xhr.send(formData);
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_MIME_TYPES.join(",")}
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handlePickClick}
          disabled={uploading}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {uploading ? `업로드 중… ${progress}%` : "🖼 이미지 업로드"}
        </button>

        {uploading && (
          <div className="h-1.5 w-32 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full bg-blue-950 transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <p className="text-xs text-slate-400">jpg/jpeg/png/gif/webp, 5MB 미만</p>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div>
      )}

      {lastUpload && (
        <div className="flex flex-wrap items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
          <span className="truncate font-mono">{lastUpload.publicUrl}</span>
          <span className="text-slate-400">{copied ? "클립보드에 복사됨" : "복사 실패 — 직접 복사해주세요"}</span>
          <button
            type="button"
            onClick={() => onInsertMarkdown(`![](${lastUpload.publicUrl})`)}
            className="ml-auto shrink-0 font-semibold text-blue-950 hover:underline"
          >
            본문에 삽입
          </button>
        </div>
      )}
    </div>
  );
}
