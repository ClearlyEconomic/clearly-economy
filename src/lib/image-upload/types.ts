export type UploadedImage = {
  /** 저장소 루트 기준 경로 (예: "public/uploads/study/20260711-abcdef.png") */
  path: string;
  /** 사이트에서 바로 쓸 수 있는 공개 URL (예: "/uploads/study/20260711-abcdef.png") */
  publicUrl: string;
  sizeBytes: number;
};

export type ImageUploadErrorCode = "INVALID_FILE_TYPE" | "FILE_TOO_LARGE" | "EMPTY_FILE" | "IO_ERROR";

export class ImageUploadError extends Error {
  code: ImageUploadErrorCode;

  constructor(code: ImageUploadErrorCode, message: string) {
    super(message);
    this.name = "ImageUploadError";
    this.code = code;
  }
}
