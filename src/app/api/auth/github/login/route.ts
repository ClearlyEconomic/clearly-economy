import { cookies } from "next/headers";
import { buildAuthorizeUrl } from "@/lib/auth/github-oauth";
import { randomState } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

const STATE_COOKIE_NAME = "oauth_state";

function redirectUriFor(request: Request): string {
  const url = new URL(request.url);
  return `${url.origin}/api/auth/github/callback`;
}

export async function GET(request: Request) {
  const state = randomState();

  const cookieStore = await cookies();
  cookieStore.set(STATE_COOKIE_NAME, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 600, // 10분 — 로그인 흐름이 끝나면 콜백에서 곧바로 삭제됩니다.
    path: "/",
  });

  const authorizeUrl = buildAuthorizeUrl(redirectUriFor(request), state);
  return Response.redirect(authorizeUrl);
}
