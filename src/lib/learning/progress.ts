import { getReadEntries } from "./reading";
import { getFavorites } from "./favorites";
import { getCompletions } from "./completion";
import { getTotalStudySeconds } from "./studyTime";
import { getActiveDaysInRange } from "./calendar";
import type { Category } from "@/lib/types";

export type OverallProgress = {
  total: number;
  read: number;
  favorited: number;
  completed: number;
  percentRead: number;
  percentCompleted: number;
};

export function getOverallProgress(totalPostCount: number): OverallProgress {
  const read = getReadEntries().length;
  const favorited = getFavorites().length;
  const completed = getCompletions().length;

  return {
    total: totalPostCount,
    read,
    favorited,
    completed,
    percentRead: totalPostCount > 0 ? Math.round((read / totalPostCount) * 100) : 0,
    percentCompleted: totalPostCount > 0 ? Math.round((completed / totalPostCount) * 100) : 0,
  };
}

export type CategoryProgress = {
  category: Category;
  total: number;
  completed: number;
  percent: number;
};

export function getCategoryProgress(
  postCountByCategory: Record<Category, number>
): CategoryProgress[] {
  const completions = getCompletions();
  const completedByCategory = completions.reduce<Partial<Record<Category, number>>>(
    (acc, entry) => {
      acc[entry.category] = (acc[entry.category] ?? 0) + 1;
      return acc;
    },
    {}
  );

  return (Object.keys(postCountByCategory) as Category[]).map((category) => {
    const total = postCountByCategory[category];
    const completed = completedByCategory[category] ?? 0;
    return {
      category,
      total,
      completed,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  });
}

export type LearningStats = {
  totalStudySeconds: number;
  readCount: number;
  completedCount: number;
  favoriteCount: number;
  activeDaysLast7: number;
};

export function getLearningStats(): LearningStats {
  return {
    totalStudySeconds: getTotalStudySeconds(),
    readCount: getReadEntries().length,
    completedCount: getCompletions().length,
    favoriteCount: getFavorites().length,
    activeDaysLast7: getActiveDaysInRange(7),
  };
}
