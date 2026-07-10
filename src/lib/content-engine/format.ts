/**
 * Prettier 없이도 결과물이 깔끔하도록 줄바꿈/공백을 정리합니다.
 * - 줄 끝 공백 제거
 * - 빈 줄이 3줄 이상 이어지면 1줄로 축소
 * - 문서 맨 앞 빈 줄 제거
 * - 파일 끝은 항상 개행 1개로 통일
 */
export function formatMdx(source: string): string {
  return source
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/g, ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^\n+/, "")
    .replace(/\n*$/, "\n");
}
