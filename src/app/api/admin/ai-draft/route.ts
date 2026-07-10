import { prepareDraft, streamDraft, AIProviderError } from "@/lib/ai-draft";
import type { DraftContext } from "@/lib/ai-draft";
import { AI_ERROR_MARKER } from "@/lib/ai-draft/stream-protocol";
import { CATEGORIES, type Category } from "@/lib/types";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function strArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function parseContext(body: unknown): DraftContext {
  const b = (typeof body === "object" && body !== null ? body : {}) as Record<string, unknown>;
  const category = CATEGORIES.includes(b.category as Category) ? (b.category as Category) : "study";

  return {
    category,
    title: str(b.title),
    description: str(b.description),
    tags: strArray(b.tags),
    difficulty: typeof b.difficulty === "number" ? b.difficulty : 2,
    examFrequency: str(b.examFrequency) || "보통",
    examImportance: str(b.examImportance) || "보통",
    summary: strArray(b.summary),
    topic: str(b.topic) || undefined,
    english: str(b.english) || undefined,
    abbreviation: str(b.abbreviation) || undefined,
    field: str(b.field) || undefined,
  };
}

export async function POST(request: Request) {
  const json = await request.json().catch(() => ({}));
  const context = parseContext(json);

  // API 키 누락처럼 스트림을 시작하기도 전에 알 수 있는 오류는 일반 JSON
  // 오류 응답으로 즉시 돌려줍니다(스트림 시작 후에는 상태 코드를 바꿀 수 없음).
  let prepared: ReturnType<typeof prepareDraft>;
  try {
    prepared = prepareDraft(context);
  } catch (err) {
    const providerErr =
      err instanceof AIProviderError
        ? err
        : new AIProviderError("UNKNOWN", "AI 초안 생성을 준비하는 중 오류가 발생했습니다.");
    return Response.json(
      { error: { code: providerErr.code, message: providerErr.message } },
      { status: providerErr.code === "MISSING_API_KEY" ? 500 : 400 }
    );
  }

  const { prompt, provider } = prepared;
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of streamDraft(prompt, provider, request.signal)) {
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          // 사용자가 취소한 경우 — 정상 종료로 처리합니다.
        } else {
          const providerErr =
            err instanceof AIProviderError
              ? err
              : new AIProviderError("UNKNOWN", "AI 초안 생성 중 오류가 발생했습니다.");
          controller.enqueue(
            encoder.encode(
              `${AI_ERROR_MARKER}${JSON.stringify({ code: providerErr.code, message: providerErr.message })}`
            )
          );
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
