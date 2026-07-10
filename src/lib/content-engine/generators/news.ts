import { assembleMdx } from "../assemble";
import type { NewsInput } from "../types";

export function generateNewsMdx(input: NewsInput): string {
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
