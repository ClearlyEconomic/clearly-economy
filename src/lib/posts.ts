import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { CATEGORIES, type Category, type PostMeta } from "./types";
import { estimateReadingMinutes } from "./reading-time";

const CONTENT_DIR = path.join(process.cwd(), "content");

function categoryDir(category: Category) {
  return path.join(CONTENT_DIR, category);
}

export function getPostSlugs(category: Category): string[] {
  const dir = categoryDir(category);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getPostMeta(category: Category, slug: string): PostMeta {
  const filePath = path.join(categoryDir(category), `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    category,
    title: data.title,
    date: data.date,
    description: data.description,
    topic: data.topic,
    tags: data.tags,
    image: data.image,
    readingMinutes: estimateReadingMinutes(content),
  };
}

export function getAllPostsMeta(category: Category): PostMeta[] {
  return getPostSlugs(category)
    .map((slug) => getPostMeta(category, slug))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getLatestPosts(
  limit: number,
  categories: Category[] = [...CATEGORIES]
): PostMeta[] {
  return categories
    .flatMap((category) => getAllPostsMeta(category))
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, limit);
}

export function getPostRawSource(category: Category, slug: string): string {
  const filePath = path.join(categoryDir(category), `${slug}.mdx`);
  return fs.readFileSync(filePath, "utf8");
}

export function getRelatedPosts(current: PostMeta, limit = 3): PostMeta[] {
  const pool = CATEGORIES.flatMap((category) => getAllPostsMeta(category)).filter(
    (post) => !(post.category === current.category && post.slug === current.slug)
  );

  return pool
    .map((post) => {
      const tagOverlap = (post.tags ?? []).filter((tag) =>
        current.tags?.includes(tag)
      ).length;
      const sameCategory = post.category === current.category ? 1 : 0;
      return { post, score: tagOverlap * 2 + sameCategory };
    })
    .sort((a, b) => b.score - a.score || (a.post.date < b.post.date ? 1 : -1))
    .slice(0, limit)
    .map(({ post }) => post);
}
