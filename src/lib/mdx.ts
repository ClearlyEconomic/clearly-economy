import { compileMDX } from "next-mdx-remote/rsc";
import { getPostRawSource } from "./posts";
import type { Category } from "./types";

type Frontmatter = {
  title: string;
  date: string;
  description: string;
  topic?: string;
  tags?: string[];
  image?: string;
  summary?: string[];
};

export async function compilePost(category: Category, slug: string) {
  const source = getPostRawSource(category, slug);
  return compileMDX<Frontmatter>({
    source,
    options: { parseFrontmatter: true },
  });
}
