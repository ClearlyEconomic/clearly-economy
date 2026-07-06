import type { Metadata } from "next";
import { getPostMeta } from "./posts";
import { ogImageUrl } from "./og";
import type { Category } from "./types";

export function generatePostMetadata(category: Category, slug: string): Metadata {
  const meta = getPostMeta(category, slug);
  const image = meta.image ?? ogImageUrl(meta.title, category);

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      type: "article",
      title: meta.title,
      description: meta.description,
      publishedTime: meta.date,
      tags: meta.tags,
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [image],
    },
  };
}
