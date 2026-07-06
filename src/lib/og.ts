import type { Category } from "./types";

export function ogImageUrl(title: string, category?: Category): string {
  const params = new URLSearchParams({ title });
  if (category) params.set("category", category);
  return `/og?${params.toString()}`;
}
