import { ImageUploadError } from "./types";

/** MIME 타입 → 저장할 확장자. jpg/jpeg/png/gif/webp만 허용합니다. */
export const ALLOWED_IMAGE_MIME_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
};

/** 5MB "이상"은 금지 — 5MB 미만만 허용합니다. */
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export function assertValidImage(mimeType: string, sizeBytes: number): void {
  if (!ALLOWED_IMAGE_MIME_TYPES[mimeType]) {
    throw new ImageUploadError("INVALID_FILE_TYPE", "jpg, jpeg, png, gif, webp 형식만 업로드할 수 있습니다.");
  }
  if (sizeBytes <= 0) {
    throw new ImageUploadError("EMPTY_FILE", "빈 파일은 업로드할 수 없습니다.");
  }
  if (sizeBytes >= MAX_IMAGE_SIZE_BYTES) {
    throw new ImageUploadError("FILE_TOO_LARGE", "파일 크기는 5MB 미만이어야 합니다.");
  }
}
