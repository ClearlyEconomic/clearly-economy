export type AIProviderErrorCode =
  | "MISSING_API_KEY"
  | "AUTH_FAILED"
  | "RATE_LIMITED"
  | "OVERLOADED"
  | "TIMEOUT"
  | "NETWORK_ERROR"
  | "UNKNOWN";

const DEFAULT_MESSAGES: Record<AIProviderErrorCode, string> = {
  MISSING_API_KEY: "AI API 키가 설정되지 않았습니다. .env.local에 API 키를 추가해주세요.",
  AUTH_FAILED: "AI API 키가 올바르지 않습니다. .env.local의 값을 확인해주세요.",
  RATE_LIMITED: "요청 한도(Quota/Rate limit)를 초과했습니다. 잠시 후 다시 시도해주세요.",
  OVERLOADED: "AI 서비스가 일시적으로 과부하 상태입니다. 잠시 후 다시 시도해주세요.",
  TIMEOUT: "AI 응답 시간이 초과되었습니다.",
  NETWORK_ERROR: "AI 서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.",
  UNKNOWN: "AI 초안 생성 중 알 수 없는 오류가 발생했습니다.",
};

export class AIProviderError extends Error {
  code: AIProviderErrorCode;

  constructor(code: AIProviderErrorCode, message?: string) {
    super(message ?? DEFAULT_MESSAGES[code]);
    this.name = "AIProviderError";
    this.code = code;
  }
}

export type GenerateStreamParams = {
  prompt: string;
  signal?: AbortSignal;
};

/**
 * 모든 AI 공급자가 구현해야 하는 공통 인터페이스입니다. Draft Engine과
 * 관리자 UI는 이 인터페이스에만 의존하므로, 나중에 OpenAI/Gemini/로컬
 * LLM Provider를 새로 만들어 providers/index.ts의 분기만 추가하면
 * 나머지 코드는 전혀 손댈 필요가 없습니다.
 */
export interface AIProvider {
  readonly id: string;
  generateStream(params: GenerateStreamParams): AsyncGenerator<string, void, unknown>;
}
