import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionCookieValue } from "@/lib/auth/session";

// /admin/login과 /api/auth/*는 로그인 흐름 자체이므로 인증 검사에서 제외합니다.
const PUBLIC_ADMIN_PATHS = new Set(["/admin/login"]);
const PUBLIC_API_AUTH_PREFIX = "/api/auth/";

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ADMIN_PATHS.has(pathname) || pathname.startsWith(PUBLIC_API_AUTH_PREFIX)) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionCookieValue(cookie);

  if (!session) {
    if (pathname.startsWith("/api/admin/")) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "로그인이 필요합니다." } },
        { status: 401 }
      );
    }
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
