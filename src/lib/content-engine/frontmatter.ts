function isEmptyValue(value: unknown): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

function toScalarYaml(value: string | number | boolean): string {
  if (typeof value !== "string") return String(value);
  // JSON 문자열 이스케이프(따옴표/백슬래시/줄바꿈 등)는 YAML 이중따옴표 문자열과
  // 호환되므로, 별도의 YAML 이스케이퍼 없이 안전하게 재사용합니다.
  return JSON.stringify(value);
}

/**
 * 값이 있는 필드만 출력하는 frontmatter 빌더입니다. 빈 문자열/빈 배열/undefined는
 * 조용히 생략됩니다. 필드 순서는 입력 객체의 키 순서를 그대로 따르므로,
 * 각 Generator가 원하는 필드 순서를 그대로 넘기면 됩니다.
 */
export function buildFrontmatter(fields: Record<string, unknown>): string {
  const lines: string[] = ["---"];

  for (const [key, rawValue] of Object.entries(fields)) {
    if (isEmptyValue(rawValue)) continue;

    if (Array.isArray(rawValue)) {
      const items = rawValue.filter((item) => !isEmptyValue(item));
      if (items.length === 0) continue;
      lines.push(`${key}:`);
      for (const item of items) {
        lines.push(`  - ${toScalarYaml(item as string)}`);
      }
      continue;
    }

    lines.push(`${key}: ${toScalarYaml(rawValue as string | number | boolean)}`);
  }

  lines.push("---");
  return lines.join("\n");
}
