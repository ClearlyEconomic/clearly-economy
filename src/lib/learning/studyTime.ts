import { readLocalJSON, writeLocalJSON } from "@/lib/local-storage";
import type { StudyTimeEntry } from "./types";

const STUDY_TIME_KEY = "seoki-hyeon:learning:study-time";

/** 한 번의 방문에서 기록할 수 있는 최대 시간(초). 탭을 켜둔 채 방치하는 경우를 방지합니다. */
const MAX_SESSION_SECONDS = 30 * 60;

function key(category: string, slug: string): string {
  return `${category}/${slug}`;
}

type StudyTimeMap = Record<string, StudyTimeEntry>;

function getMap(): StudyTimeMap {
  return readLocalJSON<StudyTimeMap>(STUDY_TIME_KEY, {});
}

export function addStudyTime(category: string, slug: string, seconds: number): void {
  const clamped = Math.max(0, Math.min(seconds, MAX_SESSION_SECONDS));
  if (clamped === 0) return;

  const map = getMap();
  const k = key(category, slug);
  const existing = map[k];
  map[k] = existing
    ? { ...existing, totalSeconds: existing.totalSeconds + clamped }
    : { category: category as StudyTimeEntry["category"], slug, totalSeconds: clamped };
  writeLocalJSON(STUDY_TIME_KEY, map);
}

export function getStudyTimeEntries(): StudyTimeEntry[] {
  return Object.values(getMap());
}

export function getTotalStudySeconds(): number {
  return getStudyTimeEntries().reduce((sum, entry) => sum + entry.totalSeconds, 0);
}

export function formatStudyDuration(totalSeconds: number): string {
  if (totalSeconds < 60) return "1분 미만";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours === 0) return `${minutes}분`;
  return `${hours}시간 ${minutes}분`;
}
