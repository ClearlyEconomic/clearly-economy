const CHARS_PER_MINUTE = 500;

export function estimateReadingMinutes(text: string): number {
  const charCount = text.replace(/\s/g, "").length;
  return Math.max(1, Math.ceil(charCount / CHARS_PER_MINUTE));
}
