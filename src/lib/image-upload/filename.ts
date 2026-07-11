import { ALLOWED_IMAGE_MIME_TYPES } from "./validate";

/** "20260711-a1b2c3.png" 형태의 파일명을 만듭니다 — 날짜 + 임의 6자리 16진수. */
export function generateUploadFilename(mimeType: string): string {
  const ext = ALLOWED_IMAGE_MIME_TYPES[mimeType] ?? "bin";
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");

  const randomBytes = new Uint8Array(3);
  crypto.getRandomValues(randomBytes);
  const randomPart = Array.from(randomBytes, (b) => b.toString(16).padStart(2, "0")).join("");

  return `${datePart}-${randomPart}.${ext}`;
}
