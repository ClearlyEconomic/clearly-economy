"use client";

export type ToastState = {
  kind: "success" | "error";
  title: string;
  description?: string;
};

export function Toast({ toast, onClose }: { toast: ToastState; onClose: () => void }) {
  const isSuccess = toast.kind === "success";

  return (
    <div
      role="status"
      className={`fixed bottom-6 right-6 z-50 w-full max-w-sm rounded-xl border px-4 py-3 shadow-lg ${
        isSuccess ? "border-blue-950 bg-blue-950 text-white" : "border-red-300 bg-red-50 text-red-800"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold">{toast.title}</p>
          {toast.description && (
            <p className={`mt-1 text-xs ${isSuccess ? "text-blue-100" : "text-red-600"}`}>
              {toast.description}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className={`text-xs ${isSuccess ? "text-blue-200 hover:text-white" : "text-red-400 hover:text-red-700"}`}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
