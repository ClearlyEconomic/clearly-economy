import { cookies } from "next/headers";
import { exchangeCodeForToken, fetchGitHubLogin } from "@/lib/auth/github-oauth";
import { isAllowedGitHubUser } from "@/lib/auth/allowlist";
import { createSessionCookieValue, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

const STATE_COOKIE_NAME = "oauth_state";

function redirectUriFor(request: Request): string {
  const url = new URL(request.url);
  return `${url.origin}/api/auth/github/callback`;
}

function toLogin(origin: string, error: string): Response {
  return Response.redirect(`${origin}/admin/login?error=${error}`);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const oauthError = url.searchParams.get("error");

  const cookieStore = await cookies();
  const expectedState = cookieStore.get(STATE_COOKIE_NAME)?.value;
  cookieStore.delete(STATE_COOKIE_NAME);

  if (oauthError) return toLogin(url.origin, "github_denied");
  if (!code || !state || !expectedState || state !== expectedState) {
    return toLogin(url.origin, "invalid_state");
  }

  try {
    const accessToken = await exchangeCodeForToken(code, redirectUriFor(request));
    const login = await fetchGitHubLogin(accessToken);

    if (!isAllowedGitHubUser(login)) {
      return toLogin(url.origin, "not_allowed");
    }

    const sessionValue = await createSessionCookieValue(login);
    cookieStore.set(SESSION_COOKIE_NAME, sessionValue, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: SESSION_MAX_AGE_SECONDS,
      path: "/",
    });

    return Response.redirect(`${url.origin}/admin`);
  } catch {
    return toLogin(url.origin, "unknown");
  }
}
