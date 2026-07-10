import type { ContentEngineInput, ContentSection } from "@/lib/content-engine";
import type { Category } from "@/lib/types";

/**
 * 관리자 글쓰기 폼(AdminEditor)이 보내는 원시 JSON입니다.
 * `body`는 Content Engine의 구조화된 sections이 아니라, 사람이 "## 제목"
 * 형태로 직접 쓰는 평문 마크다운입니다 — 폼이 다루기 훨씬 단순하기 때문입니다.
 */
export type AdminSavePayload = {
  category: Category;
  slug: string;
  title: string;
  description: string;
  date: string;
  tags?: string[];
  difficulty?: number;
  image?: string;
  summary?: string[];
  examPoints?: string[];
  body: string;
  status?: "draft" | "review" | "published";
  // terms 전용
  english?: string;
  abbreviation?: string;
  field?: string;
  relatedTerms?: string[];
  designStandard?: string;
  examRelevant?: boolean;
  // study 전용
  topic?: string;
};

/**
 * 폼의 평문 본문("## 제목" 라인으로 구분된 텍스트)을 Content Engine이
 * 요구하는 ContentSection[]로 변환합니다. 이 파싱 로직은 관리자 폼 전용
 * 어댑터이므로 Content Engine 안에는 두지 않았습니다.
 */
export function parseBodyToSections(body: string): ContentSection[] {
  const sections: ContentSection[] = [];
  let current: { heading: string; lines: string[] } | null = null;

  for (const line of body.split("\n")) {
    const heading = line.match(/^##\s+(.*)$/);
    if (heading) {
      if (current) sections.push(finalizeSection(current));
      current = { heading: heading[1].trim(), lines: [] };
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) sections.push(finalizeSection(current));

  return sections;
}

function finalizeSection(section: { heading: string; lines: string[] }): ContentSection {
  const text = section.lines.join("\n").trim();
  return {
    heading: section.heading,
    blocks: text ? [{ type: "markdown", text }] : [],
  };
}

function cleanList(items?: string[]): string[] | undefined {
  const cleaned = items?.map((item) => item.trim()).filter(Boolean);
  return cleaned && cleaned.length > 0 ? cleaned : undefined;
}

/** 관리자 폼 원시 JSON을 Content Engine의 입력 타입으로 조립합니다. */
export function buildContentEngineInput(payload: AdminSavePayload): ContentEngineInput {
  const base = {
    title: payload.title,
    date: payload.date,
    description: payload.description,
    tags: cleanList(payload.tags),
    image: payload.image?.trim() || undefined,
    summary: cleanList(payload.summary),
    examPoints: cleanList(payload.examPoints),
    difficulty: payload.difficulty,
    sections: parseBodyToSections(payload.body),
  };

  switch (payload.category) {
    case "study":
      return { ...base, category: "study", topic: payload.topic ?? "" };
    case "terms":
      return {
        ...base,
        category: "terms",
        english: payload.english?.trim() || undefined,
        abbreviation: payload.abbreviation?.trim() || undefined,
        field: payload.field?.trim() || undefined,
        relatedTerms: cleanList(payload.relatedTerms),
        designStandard: payload.designStandard?.trim() || undefined,
        examRelevant: payload.examRelevant || undefined,
      };
    case "standard":
      return { ...base, category: "standard" };
    case "news":
      return { ...base, category: "news" };
    case "case":
      return { ...base, category: "case" };
    case "resource":
      return { ...base, category: "resource" };
  }
}
