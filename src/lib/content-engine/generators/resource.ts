import { assembleMdx } from "../assemble";
import type { ResourceInput } from "../types";

export function generateResourceMdx(input: ResourceInput): string {
  return assembleMdx(
    {
      title: input.title,
      date: input.date,
      description: input.description,
      tags: input.tags,
      summary: input.summary,
      examPoints: input.examPoints,
      image: input.image,
    },
    input.sections
  );
}
