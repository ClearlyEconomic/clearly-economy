const GITHUB_API_BASE = "https://api.github.com";

export type GitHubConfig = {
  owner: string;
  repo: string;
  branch: string;
  token: string;
};

/** GitHub REST API 호출 실패를 감싸는 범용 에러입니다. 상위 계층(콘텐츠 저장/이미지
 * 업로드)이 각자의 도메인 에러 타입으로 다시 감싸 사용합니다. */
export class GitHubApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "GitHubApiError";
    this.status = status;
  }
}

export function loadGitHubConfig(): GitHubConfig {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;

  if (!owner || !repo || !token) {
    throw new GitHubApiError(
      0,
      "GitHub 저장소 설정이 없습니다. .env.local에 GITHUB_OWNER / GITHUB_REPO / GITHUB_TOKEN을 추가해주세요."
    );
  }

  return { owner, repo, token, branch: process.env.GITHUB_BRANCH || "main" };
}

function apiUrl(config: GitHubConfig, filePath: string): string {
  return `${GITHUB_API_BASE}/repos/${config.owner}/${config.repo}/contents/${filePath}`;
}

function headers(config: GitHubConfig): HeadersInit {
  return {
    Authorization: `Bearer ${config.token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };
}

async function toApiError(response: Response): Promise<GitHubApiError> {
  const body = await response.json().catch(() => null);
  const message =
    body && typeof body === "object" && "message" in body ? String((body as { message: unknown }).message) : undefined;
  return new GitHubApiError(response.status, message ?? `GitHub API 요청이 실패했습니다 (HTTP ${response.status}).`);
}

export type GitHubFile = { sha: string; contentBase64: string };

/** 파일이 없으면 null을 반환합니다(404는 정상적인 "아직 없음" 상태). */
export async function getGitHubFile(config: GitHubConfig, filePath: string): Promise<GitHubFile | null> {
  let response: Response;
  try {
    response = await fetch(`${apiUrl(config, filePath)}?ref=${config.branch}`, { headers: headers(config) });
  } catch {
    throw new GitHubApiError(0, "GitHub에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.");
  }

  if (response.status === 404) return null;
  if (!response.ok) throw await toApiError(response);

  const json = (await response.json()) as { sha: string; content: string };
  return { sha: json.sha, contentBase64: json.content };
}

/** 파일을 생성/수정하는 커밋 하나를 만듭니다. sha를 주면 기존 파일 수정, 안 주면 새 파일 생성입니다. */
export async function commitGitHubFile(
  config: GitHubConfig,
  filePath: string,
  contentBase64: string,
  message: string,
  sha?: string
): Promise<void> {
  let response: Response;
  try {
    response = await fetch(apiUrl(config, filePath), {
      method: "PUT",
      headers: headers(config),
      body: JSON.stringify({ message, content: contentBase64, branch: config.branch, ...(sha ? { sha } : {}) }),
    });
  } catch {
    throw new GitHubApiError(0, "GitHub에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.");
  }

  if (!response.ok) throw await toApiError(response);
}

export function utf8ToBase64(text: string): string {
  return Buffer.from(text, "utf-8").toString("base64");
}

export function base64ToUtf8(base64: string): string {
  return Buffer.from(base64, "base64").toString("utf-8");
}

export function bytesToBase64(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("base64");
}

export function byteLength(text: string): number {
  return Buffer.byteLength(text, "utf-8");
}
