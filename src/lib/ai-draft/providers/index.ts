import { ClaudeProvider } from "./claude";
import { AIProviderError, type AIProvider } from "./types";

/**
 * 사용할 AI Provider를 고르는 단일 지점입니다. `AI_PROVIDER` 환경변수로
 * 전환하며, 지금은 "claude"만 구현되어 있습니다. OpenAI/Gemini/로컬 LLM을
 * 추가할 때는:
 *   1. providers/openai.ts 등에 AIProvider 인터페이스를 구현하고
 *   2. 아래 switch에 분기 한 줄만 추가하면 됩니다.
 * Draft Engine, Route Handler, 관리자 UI 어느 것도 수정할 필요가 없습니다.
 */
export function getAIProvider(): AIProvider {
  const providerId = process.env.AI_PROVIDER ?? "claude";

  switch (providerId) {
    case "claude":
      return new ClaudeProvider();
    // case "openai":
    //   return new OpenAIProvider();
    // case "gemini":
    //   return new GeminiProvider();
    // case "local":
    //   return new LocalLLMProvider();
    default:
      throw new AIProviderError("UNKNOWN", `지원하지 않는 AI_PROVIDER입니다: "${providerId}"`);
  }
}

export { AIProviderError };
export type { AIProvider, AIProviderErrorCode, GenerateStreamParams } from "./types";
