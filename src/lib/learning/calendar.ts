import { readLocalJSON, writeLocalJSON } from "@/lib/local-storage";

const ACTIVITY_KEY = "seoki-hyeon:learning:activity";

type ActivityMap = Record<string, number>; // "YYYY-MM-DD" -> count

export type ActivityDay = {
  date: string;
  count: number;
};

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** 오늘 날짜에 학습 활동 1회를 기록합니다. */
export function recordActivity(date: Date = new Date()): void {
  const map = readLocalJSON<ActivityMap>(ACTIVITY_KEY, {});
  const key = toDateKey(date);
  map[key] = (map[key] ?? 0) + 1;
  writeLocalJSON(ACTIVITY_KEY, map);
}

export function getActivityMap(): ActivityMap {
  return readLocalJSON<ActivityMap>(ACTIVITY_KEY, {});
}

/** 오늘부터 과거 days일 구간을 날짜순으로 반환합니다(활동 없는 날은 count 0). */
export function getActivityRange(days: number, today: Date = new Date()): ActivityDay[] {
  const map = getActivityMap();
  const result: ActivityDay[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = toDateKey(d);
    result.push({ date: key, count: map[key] ?? 0 });
  }
  return result;
}

export function getActiveDaysInRange(days: number, today: Date = new Date()): number {
  return getActivityRange(days, today).filter((day) => day.count > 0).length;
}
