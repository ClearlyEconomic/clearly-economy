import { buildPrompt } from "./prompts";
import { getAIProvider } from "./providers";
import type { AIProvider } from "./providers/types";
import type { DraftContext } from "./types";

/**
 * AdminEditor → AI Draft Engine → AI Provider → (Claude/OpenAI/Gemini/Local) 구조의
 * 가운데 계층입니다. 폼 컨텍스트로 프롬프트를 조립하고, 선택된 Provider에게
 * 스트리밍을 위임할 뿐 — 어떤 Provider를 쓸지, 프롬프트를 어떻게 만들지는
 * 각각 providers/prompts 모듈의 책임입니다.
 *
 * prepareDraft와 streamDraft를 분리한 이유: API 키 누락처럼 스트림을 시작하기도
 * 전에 알 수 있는 오류는 Route Handler가 일반 JSON 오류 응답으로 즉시 돌려줄 수
 * 있어야 하기 때문입니다(스트림이 이미 시작된 뒤에는 HTTP 상태 코드를 바꿀 수 없음).
 */
export function prepareDraft(context: DraftContext): { prompt: string; provider: AIProvider } {
  const prompt = buildPrompt(context);
  const provider = getAIProvider();
  return { prompt, provider };
}

export function streamDraft(
  prompt: string,
  provider: AIProvider,
  signal?: AbortSignal
): AsyncGenerator<string, void, unknown> {
  return provider.generateStream({ prompt, signal });
}
