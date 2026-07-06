import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/lib/types";
import { getAllPostsMeta } from "@/lib/posts";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE.url}/about`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const categoryEntries: MetadataRoute.Sitemap = CATEGORIES.map((category) => ({
    url: `${SITE.url}/${category}`,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const postEntries: MetadataRoute.Sitemap = CATEGORIES.flatMap((category) =>
    getAllPostsMeta(category).map((post) => ({
      url: `${SITE.url}/${category}/${post.slug}`,
      lastModified: post.date,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))
  );

  return [...staticEntries, ...categoryEntries, ...postEntries];
}
