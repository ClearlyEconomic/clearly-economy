const AUTHORIZE_URL = "https://github.com/login/oauth/authorize";
const TOKEN_URL = "https://github.com/login/oauth/access_token";
const USER_URL = "https://api.github.com/user";

function config(): { clientId: string; clientSecret: string } {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("GITHUB_OAUTH_CLIENT_ID / GITHUB_OAUTH_CLIENT_SECRET이 설정되지 않았습니다.");
  }
  return { clientId, clientSecret };
}

export function buildAuthorizeUrl(redirectUri: string, state: string): string {
  const { clientId } = config();
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "read:user",
    state,
    allow_signup: "false",
  });
  return `${AUTHORIZE_URL}?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string, redirectUri: string): Promise<string> {
  const { clientId, clientSecret } = config();

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code, redirect_uri: redirectUri }),
  });

  if (!response.ok) {
    throw new Error(`GitHub 토큰 교환에 실패했습니다 (HTTP ${response.status}).`);
  }

  const json = (await response.json()) as { access_token?: string; error?: string; error_description?: string };
  if (json.error || !json.access_token) {
    throw new Error(json.error_description ?? "GitHub 토큰 교환에 실패했습니다.");
  }
  return json.access_token;
}

export async function fetchGitHubLogin(accessToken: string): Promise<string> {
  const response = await fetch(USER_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub 사용자 정보 조회에 실패했습니다 (HTTP ${response.status}).`);
  }

  const json = (await response.json()) as { login?: string };
  if (!json.login) throw new Error("GitHub 사용자 정보에 로그인 아이디가 없습니다.");
  return json.login;
}
