"use client";

import { useEffect } from "react";
import { recordRead } from "@/lib/learning/reading";
import { addStudyTime } from "@/lib/learning/studyTime";
import type { ContentRef } from "@/lib/learning/types";

/**
 * 상세 페이지에 마운트되는 보이지 않는 트래커입니다.
 * - 마운트 시 조회 기록(읽음 처리 + 캘린더 활동 1틱)을 남깁니다.
 * - 언마운트(페이지 이탈) 또는 탭 전환/종료 시점에 체류시간을 학습 시간으로 누적합니다.
 */
export function PageActivityTracker({ category, slug, title }: ContentRef) {
  useEffect(() => {
    recordRead({ category, slug, title });

    const startedAt = Date.now();
    let flushed = false;

    function flush() {
      if (flushed) return;
      flushed = true;
      const seconds = Math.round((Date.now() - startedAt) / 1000);
      addStudyTime(category, slug, seconds);
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") flush();
    }

    window.addEventListener("beforeunload", flush);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      flush();
      window.removeEventListener("beforeunload", flush);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
    // category/slug/title은 페이지 진입마다 한 번씩만 기록하면 되므로 마운트 시 1회만 실행합니다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
