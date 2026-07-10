import { ImageResponse } from "next/og";
import { CATEGORY_LABELS, SITE } from "@/lib/site";
import type { Category } from "@/lib/types";

export const runtime = "edge";

const ACCENT: Record<Category, string> = {
  news: "#172554",
  study: "#172554",
  case: "#172554",
  terms: "#172554",
  resource: "#172554",
  standard: "#172554",
};

async function loadNotoSansKrBold(text: string): Promise<ArrayBuffer> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700&text=${encodeURIComponent(
    text
  )}`;
  const css = await (await fetch(cssUrl)).text();
  const match = css.match(/src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/);
  if (!match) throw new Error("font source not found");
  const fontRes = await fetch(match[1]);
  return fontRes.arrayBuffer();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") ?? SITE.name).slice(0, 80);
  const categoryParam = searchParams.get("category") as Category | null;
  const color = categoryParam && ACCENT[categoryParam] ? ACCENT[categoryParam] : ACCENT.news;
  const label = categoryParam ? CATEGORY_LABELS[categoryParam] : SITE.tagline;

  const fontData = await loadNotoSansKrBold(`${SITE.name}${label}${title}`);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#ffffff",
          padding: "72px",
          fontFamily: "Noto Sans KR",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              backgroundColor: color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 26,
            }}
          >
            서
          </div>
          <div style={{ fontSize: 26, color: "#0f172a" }}>{SITE.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 22,
              color,
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            {label}
          </div>
          <div style={{ fontSize: 54, color: "#0f172a", lineHeight: 1.3 }}>
            {title}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "Noto Sans KR", data: fontData, weight: 700, style: "normal" }],
    }
  );
}
