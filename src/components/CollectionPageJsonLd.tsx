import { SITE } from "@/lib/site";
import type { PostMeta } from "@/lib/types";

export function CollectionPageJsonLd({
  name,
  description,
  url,
  posts,
}: {
  name: string;
  description: string;
  url: string;
  posts: PostMeta[];
}) {
  const json = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: `${SITE.url}${url}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE.url}/${post.category}/${post.slug}`,
        name: post.title,
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
