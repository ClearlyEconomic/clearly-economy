import { AIProviderError, type AIProvider, type GenerateStreamParams } from "./types";

const API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";
const DEFAULT_MODEL = "claude-sonnet-4-5-20250929";
const MAX_TOKENS = 4096;

function mapHttpError(status: number, bodyText: string): AIProviderError {
  if (status === 401) return new AIProviderError("AUTH_FAILED");
  if (status === 429) return new AIProviderError("RATE_LIMITED");
  if (status === 529 || status === 503) return new AIProviderError("OVERLOADED");
  if (status === 408) return new AIProviderError("TIMEOUT");
  return new AIProviderError("UNKNOWN", `AI 요청이 실패했습니다 (HTTP ${status}). ${bodyText.slice(0, 200)}`);
}

async function safeReadText(response: Response): Promise<string> {
  try {
    return await response.text();
  } catch {
    return "";
  }
}

/**
 * Anthropic Messages API를 raw fetch + SSE(Server-Sent Events) 파싱으로
 * 직접 호출합니다. 이 프로젝트가 지금까지 의존성을 최소로 유지해 온
 * 방식과 일관되게, 별도 SDK 없이 표준 fetch만으로 스트리밍을 구현했습니다.
 */
export class ClaudeProvider implements AIProvider {
  readonly id = "claude";
  private apiKey: string;
  private model: string;

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new AIProviderError("MISSING_API_KEY");
    this.apiKey = apiKey;
    this.model = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;
  }

  async *generateStream({ prompt, signal }: GenerateStreamParams): AsyncGenerator<string, void, unknown> {
    let response: Response;
    try {
      response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": this.apiKey,
          "anthropic-version": ANTHROPIC_VERSION,
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: MAX_TOKENS,
          stream: true,
          messages: [{ role: "user", content: prompt }],
        }),
        signal,
      });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") throw err;
      throw new AIProviderError("NETWORK_ERROR");
    }

    if (!response.ok) {
      throw mapHttpError(response.status, await safeReadText(response));
    }
    if (!response.body) throw new AIProviderError("UNKNOWN", "AI 응답 스트림을 받지 못했습니다.");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (!data || data === "[DONE]") continue;

          let event: Record<string, unknown>;
          try {
            event = JSON.parse(data);
          } catch {
            continue;
          }

          if (event.type === "content_block_delta") {
            const delta = event.delta as { type?: string; text?: string } | undefined;
            if (delta?.type === "text_delta" && typeof delta.text === "string") {
              yield delta.text;
            }
          } else if (event.type === "error") {
            const error = event.error as { type?: string; message?: string } | undefined;
            if (error?.type === "rate_limit_error") throw new AIProviderError("RATE_LIMITED");
            if (error?.type === "overloaded_error") throw new AIProviderError("OVERLOADED");
            if (error?.type === "authentication_error") throw new AIProviderError("AUTH_FAILED");
            throw new AIProviderError("UNKNOWN", error?.message);
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}
