export const CATEGORIES = [
  "news",
  "study",
  "case",
  "terms",
  "resource",
  "standard",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type PostMeta = {
  slug: string;
  category: Category;
  title: string;
  date: string;
  description: string;
  topic?: string;
  tags?: string[];
  image?: string;
  readingMinutes: number;
};
