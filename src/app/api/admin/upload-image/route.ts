import { uploadImageToGitHub, ImageUploadError, type ImageUploadErrorCode } from "@/lib/image-upload";
import { CATEGORIES, type Category } from "@/lib/types";

export const dynamic = "force-dynamic";

const ERROR_STATUS: Record<ImageUploadErrorCode, number> = {
  INVALID_FILE_TYPE: 400,
  FILE_TOO_LARGE: 413,
  EMPTY_FILE: 400,
  IO_ERROR: 500,
};

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json(
      { error: { code: "INVALID_FILE_TYPE", message: "요청 형식이 올바르지 않습니다(multipart/form-data 필요)." } },
      { status: 400 }
    );
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return Response.json(
      { error: { code: "INVALID_FILE_TYPE", message: "업로드할 파일이 없습니다." } },
      { status: 400 }
    );
  }

  const categoryRaw = formData.get("category");
  const category =
    typeof categoryRaw === "string" && CATEGORIES.includes(categoryRaw as Category) ? categoryRaw : "misc";

  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const result = await uploadImageToGitHub({ category, mimeType: file.type, bytes });
    return Response.json({ result });
  } catch (err) {
    const uploadError =
      err instanceof ImageUploadError ? err : new ImageUploadError("IO_ERROR", "이미지 업로드 중 알 수 없는 오류가 발생했습니다.");
    return Response.json(
      { error: { code: uploadError.code, message: uploadError.message } },
      { status: ERROR_STATUS[uploadError.code] }
    );
  }
}
