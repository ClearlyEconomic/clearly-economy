import { assembleMdx } from "../assemble";
import type { StudyInput } from "../types";

export function generateStudyMdx(input: StudyInput): string {
  return assembleMdx(
    {
      title: input.title,
      date: input.date,
      description: input.description,
      topic: input.topic,
      tags: input.tags,
      difficulty: input.difficulty,
      summary: input.summary,
      examPoints: input.examPoints,
      image: input.image,
    },
    input.sections
  );
}
