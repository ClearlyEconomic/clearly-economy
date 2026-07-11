import { commitGitHubFile, bytesToBase64, GitHubApiError, loadGitHubConfig } from "@/lib/github/client";
import { generateUploadFilename } from "./filename";
import { ImageUploadError, type UploadedImage } from "./types";
import { assertValidImage } from "./validate";

const UPLOAD_ROOT = "public/uploads";

/**
 * 이미지를 GitHub Contents API로 커밋해 public/uploads/{category}/{파일명}에
 * 저장합니다. 새 Repository 클래스를 만들지 않고, GitHubRepository(콘텐츠 저장)와
 * 동일한 src/lib/github/client.ts 저수준 클라이언트를 그대로 재사용합니다 —
 * "GitHub에 파일을 커밋한다"는 동작 자체는 콘텐츠든 이미지든 같기 때문입니다.
 */
export async function uploadImageToGitHub(params: {
  category: string;
  mimeType: string;
  bytes: Uint8Array;
}): Promise<UploadedImage> {
  assertValidImage(params.mimeType, params.bytes.byteLength);

  const filename = generateUploadFilename(params.mimeType);
  const safeCategory = params.category.replace(/[^a-z0-9-]/gi, "").toLowerCase() || "misc";
  const path = `${UPLOAD_ROOT}/${safeCategory}/${filename}`;

  let config;
  try {
    config = loadGitHubConfig();
  } catch (err) {
    throw new ImageUploadError("IO_ERROR", err instanceof Error ? err.message : "GitHub 설정을 불러오지 못했습니다.");
  }

  try {
    await commitGitHubFile(config, path, bytesToBase64(params.bytes), `upload: ${safeCategory}/${filename} 이미지 추가`);
  } catch (err) {
    throw new ImageUploadError("IO_ERROR", mapErrorMessage(err));
  }

  return {
    path,
    publicUrl: `/uploads/${safeCategory}/${filename}`,
    sizeBytes: params.bytes.byteLength,
  };
}

function mapErrorMessage(err: unknown): string {
  if (!(err instanceof GitHubApiError)) return "이미지를 업로드하는 중 알 수 없는 오류가 발생했습니다.";

  switch (err.status) {
    case 401:
      return "GitHub 인증에 실패했습니다. GITHUB_TOKEN을 확인해주세요.";
    case 403:
      return "GitHub 저장소에 쓰기 권한이 없습니다. 토큰 권한(Contents: Read and write)을 확인해주세요.";
    case 404:
      return "GitHub 저장소 또는 브랜치를 찾을 수 없습니다. GITHUB_OWNER/GITHUB_REPO/GITHUB_BRANCH 설정을 확인해주세요.";
    case 422:
      return `GitHub 요청이 거부되었습니다: ${err.message}`;
    case 0:
      return err.message;
    default:
      return `GitHub 업로드 중 오류가 발생했습니다 (HTTP ${err.status}): ${err.message}`;
  }
}
