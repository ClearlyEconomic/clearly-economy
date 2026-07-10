import fs from "fs";
import os from "os";
import path from "path";
import { randomUUID } from "crypto";
import type { AdminSavePayload } from "./build-input";

type DraftEntry = { payload: AdminSavePayload; expiresAt: number };

const TTL_MS = 10 * 60 * 1000;
const DRAFT_DIR = path.join(os.tmpdir(), "seoki-hyeon-preview-drafts");

/**
 * Live Editor 초안을 잠깐 보관하는 저장소입니다.
 *
 * 처음에는 프로세스 메모리(Map)로 구현했지만, Next.js 개발 서버가 API
 * 라우트와 페이지 렌더링을 서로 다른 워커 프로세스로 나눠 처리할 수 있어
 * (실제로 이 문제 때문에 미리보기가 "찾을 수 없음"으로 계속 실패했습니다),
 * 프로세스 경계와 무관하게 공유되는 OS 임시 디렉터리의 파일로 저장하도록
 * 바꿨습니다. content/ 폴더와는 완전히 분리되어 있어 실제 콘텐츠에는
 * 영향이 없습니다. 이 CMS 자체가 배포 전 개발 환경 전용 도구이므로 로컬
 * 파일시스템으로 충분하며, 여러 서버 인스턴스로 배포할 경우에는 Redis 등
 * 공유 저장소로 교체하면 됩니다.
 */
function filePath(token: string): string {
  return path.join(DRAFT_DIR, `${token}.json`);
}

function ensureDir() {
  fs.mkdirSync(DRAFT_DIR, { recursive: true });
}

export function saveDraft(payload: AdminSavePayload, existingToken?: string | null): string {
  ensureDir();

  const token = existingToken && /^[a-f0-9-]{36}$/.test(existingToken) ? existingToken : randomUUID();
  const entry: DraftEntry = { payload, expiresAt: Date.now() + TTL_MS };
  fs.writeFileSync(filePath(token), JSON.stringify(entry), "utf-8");
  return token;
}

export function loadDraft(token: string): AdminSavePayload | null {
  try {
    const raw = fs.readFileSync(filePath(token), "utf-8");
    const entry = JSON.parse(raw) as DraftEntry;
    if (entry.expiresAt < Date.now()) {
      fs.unlinkSync(filePath(token));
      return null;
    }
    return entry.payload;
  } catch {
    return null;
  }
}
