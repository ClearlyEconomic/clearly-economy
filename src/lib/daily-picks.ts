export function getDailyPicks<T>(items: T[], count: number, date = new Date()): T[] {
  if (items.length === 0) return [];

  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / 86_400_000);
  const start = dayOfYear % items.length;

  const picks: T[] = [];
  for (let i = 0; i < Math.min(count, items.length); i++) {
    picks.push(items[(start + i) % items.length]);
  }
  return picks;
}
