import type { ReactNode } from "react";

type FigureType = "도면" | "사진" | "표";

const TYPE_ICON: Record<FigureType, string> = {
  도면: "📐",
  사진: "🖼️",
  표: "📋",
};

export function Figure({
  type = "사진",
  caption,
  children,
}: {
  type?: FigureType;
  caption?: string;
  children?: ReactNode;
}) {
  return (
    <figure className="not-prose my-8">
      <div className="flex aspect-video w-full items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-slate-400">
        {children ?? (
          <span className="flex flex-col items-center gap-2 text-sm">
            <span className="text-2xl" aria-hidden="true">
              {TYPE_ICON[type]}
            </span>
            {type} 자리
          </span>
        )}
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-slate-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
