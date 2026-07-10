import { assembleMdx } from "../assemble";
import type { CaseInput } from "../types";

export function generateCaseMdx(input: CaseInput): string {
  return assembleMdx(
    {
      title: input.title,
      date: input.date,
      description: input.description,
      tags: input.tags,
      difficulty: input.difficulty,
      summary: input.summary,
      examPoints: input.examPoints,
      image: input.image,
    },
    input.sections
  );
}
