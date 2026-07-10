/**
 * 관리자 세션 쿠키를 서명/검증합니다. Web Crypto API(`crypto.subtle`)만
 * 사용합니다 — Node의 `crypto` 모듈과 달리 Edge 런타임(Next.js Middleware)과
 * Node 런타임(Route Handler) 양쪽에서 동일하게 동작하므로, 새 의존성이나
 * `runtime: "nodejs"` 선언 없이 미들웨어에서 그대로 재사용할 수 있습니다.
 */

const COOKIE_NAME = "admin_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7일

type SessionPayload = { login: string; exp: number };

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET이 설정되지 않았습니다. .env.local을 확인해주세요.");
  return secret;
}

async function getKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function toBase64Url(bytes: ArrayBuffer): string {
  const buf = new Uint8Array(bytes);
  let binary = "";
  buf.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(value.length + ((4 - (value.length % 4)) % 4), "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

export async function createSessionCookieValue(login: string): Promise<string> {
  const payload: SessionPayload = { login, exp: Date.now() + SESSION_TTL_MS };
  const encoded = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)).buffer as ArrayBuffer);
  const key = await getKey();
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(encoded));
  return `${encoded}.${toBase64Url(signature)}`;
}

export async function verifySessionCookieValue(value: string | undefined | null): Promise<SessionPayload | null> {
  if (!value) return null;
  const parts = value.split(".");
  if (parts.length !== 2) return null;
  const [encoded, signature] = parts;

  try {
    const key = await getKey();
    const signatureBytes = fromBase64Url(signature);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes.buffer as ArrayBuffer,
      new TextEncoder().encode(encoded)
    );
    if (!valid) return null;

    const decoded = new TextDecoder().decode(fromBase64Url(encoded));
    const payload = JSON.parse(decoded) as SessionPayload;
    if (typeof payload.login !== "string" || typeof payload.exp !== "number") return null;
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function randomState(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
export const SESSION_MAX_AGE_SECONDS = Math.floor(SESSION_TTL_MS / 1000);
