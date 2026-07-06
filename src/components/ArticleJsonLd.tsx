import { SITE } from "@/lib/site";
import type { PostMeta } from "@/lib/types";

export function ArticleJsonLd({ meta }: { meta: PostMeta }) {
  const url = `${SITE.url}/${meta.category}/${meta.slug}`;

  const json = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.description,
    datePublished: meta.date,
    dateModified: meta.date,
    keywords: meta.tags?.join(", "),
    author: { "@type": "Organization", name: SITE.name, url: SITE.url },
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
