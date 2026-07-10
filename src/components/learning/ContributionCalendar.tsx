"use client";

import { useEffect, useState } from "react";
import { getActivityRange, type ActivityDay } from "@/lib/learning/calendar";

const WEEKS = 12;
const DAYS = WEEKS * 7;

function intensityClass(count: number): string {
  if (count === 0) return "bg-slate-100";
  if (count === 1) return "bg-blue-200";
  if (count <= 3) return "bg-blue-400";
  return "bg-blue-950";
}

export function ContributionCalendar() {
  const [days, setDays] = useState<ActivityDay[] | null>(null);

  useEffect(() => {
    setDays(getActivityRange(DAYS));
  }, []);

  if (!days) return null;

  // 7행(요일) × N열(주) 그리드로 배치
  const columns: ActivityDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    columns.push(days.slice(i, i + 7));
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1 overflow-x-auto pb-1">
        {columns.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day) => (
              <div
                key={day.date}
                title={`${day.date} · ${day.count}회 학습`}
                className={`h-3 w-3 rounded-sm ${intensityClass(day.count)}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <span>적음</span>
        <span className="h-3 w-3 rounded-sm bg-slate-100" />
        <span className="h-3 w-3 rounded-sm bg-blue-200" />
        <span className="h-3 w-3 rounded-sm bg-blue-400" />
        <span className="h-3 w-3 rounded-sm bg-blue-950" />
        <span>많음</span>
      </div>
    </div>
  );
}
