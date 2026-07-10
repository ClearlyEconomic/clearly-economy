export type ContentRepositoryErrorCode =
  | "VALIDATION_FAILED"
  | "SLUG_CONFLICT"
  | "NOT_FOUND"
  | "COMPILE_FAILED"
  | "IO_ERROR";

const DEFAULT_MESSAGES: Record<ContentRepositoryErrorCode, string> = {
  VALIDATION_FAILED: "입력값을 다시 확인해주세요.",
  SLUG_CONFLICT: "이미 같은 slug의 글이 존재합니다.",
  NOT_FOUND: "수정하려는 글을 찾을 수 없습니다.",
  COMPILE_FAILED: "작성한 내용을 MDX로 컴파일하는 데 실패했습니다.",
  IO_ERROR: "파일을 저장하는 중 오류가 발생했습니다.",
};

/**
 * Repository 계층에서 발생하는 모든 오류를 감싸는 단일 에러 타입입니다.
 * API 라우트는 이 에러의 `code`만 보고 적절한 HTTP 상태를 고르면 되고,
 * `message`/`issues`는 그대로 관리자 UI에 노출해도 안전한 한국어 문장입니다.
 */
export class ContentRepositoryError extends Error {
  code: ContentRepositoryErrorCode;
  issues: string[];

  constructor(code: ContentRepositoryErrorCode, message?: string, issues: string[] = []) {
    super(message ?? DEFAULT_MESSAGES[code]);
    this.name = "ContentRepositoryError";
    this.code = code;
    this.issues = issues;
  }
}
