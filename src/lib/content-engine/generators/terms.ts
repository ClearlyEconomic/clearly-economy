import { assembleMdx } from "../assemble";
import type { TermInput } from "../types";

export function generateTermMdx(input: TermInput): string {
  return assembleMdx(
    {
      title: input.title,
      date: input.date,
      description: input.description,
      tags: input.tags,
      english: input.english,
      abbreviation: input.abbreviation,
      field: input.field,
      relatedTerms: input.relatedTerms,
      examRelevant: input.examRelevant,
      difficulty: input.difficulty,
      designStandard: input.designStandard,
      summary: input.summary,
      examPoints: input.examPoints,
      image: input.image,
    },
    input.sections
  );
}
