export type FriendlyMdxError = {
  message: string;
  line?: number;
  column?: number;
  hint: string;
};

/**
 * next-mdx-remote/acorn/unified이 던지는 원본 에러 메시지는 개발자용입니다.
 * Live Editor에서 관리자가 바로 이해할 수 있도록, 자주 발생하는 패턴별로
 * 한국어 설명을 붙이고 (가능하면) 줄/열 위치를 함께 추출합니다.
 */
export function friendlyMdxError(err: unknown): FriendlyMdxError {
  const raw = err instanceof Error ? err : new Error(String(err));
  const positioned = raw as unknown as {
    line?: number;
    column?: number;
    position?: { start?: { line?: number; column?: number } };
  };
  const line = positioned.line ?? positioned.position?.start?.line;
  const column = positioned.column ?? positioned.position?.start?.column;
  const message = raw.message;

  let hint = "MDX 문법을 다시 확인해주세요.";
  if (/Could not parse expression with acorn/i.test(message)) {
    hint =
      "본문에 '{' 또는 '}' 문자가 그대로 들어있을 수 있습니다. MDX는 중괄호를 코드로 해석하므로, 문장 중간에 직접 쓰면 이 오류가 발생합니다.";
  } else if (/Expected a closing tag|Unexpected end of file/i.test(message)) {
    hint =
      "여는 태그와 짝이 맞는 닫는 태그가 없습니다. 예: <Figure ... />처럼 슬래시(/)로 잘 닫았는지 확인해주세요.";
  } else if (/Unexpected character|Unexpected token/i.test(message)) {
    hint = "잘못된 JSX 문법이 있을 수 있습니다. 태그 이름이나 속성 표기(따옴표 등)를 확인해주세요.";
  } else if (/yaml|frontmatter/i.test(message)) {
    hint = "Frontmatter(제목/날짜 등 상단 메타데이터) 형식이 올바르지 않습니다.";
  } else if (/Could not parse import\/exports/i.test(message)) {
    hint = "MDX 안에 지원되지 않는 import/export 구문이 포함되어 있습니다.";
  }

  return { message, line, column, hint };
}
