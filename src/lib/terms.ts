import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { estimateReadingMinutes } from "./reading-time";
import type { TermSearchEntry } from "./terms-search";

const TERMS_DIR = path.join(process.cwd(), "content", "terms");

export type TermMeta = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  english?: string;
  abbreviation?: string;
  field?: string;
  relatedTerms: string[];
  examRelevant: boolean;
  difficulty: number;
  designStandard?: string;
  readingMinutes: number;
};

export function getAllTermSlugs(): string[] {
  if (!fs.existsSync(TERMS_DIR)) return [];
  return fs
    .readdirSync(TERMS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

function readTermFile(slug: string) {
  const filePath = path.join(TERMS_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf8");
  return matter(raw);
}

export function getTermMeta(slug: string): TermMeta {
  const { data, content } = readTermFile(slug);
  return {
    slug,
    title: data.title,
    date: data.date,
    description: data.description,
    tags: data.tags ?? [],
    english: data.english,
    abbreviation: data.abbreviation,
    field: data.field,
    relatedTerms: data.relatedTerms ?? [],
    examRelevant: Boolean(data.examRelevant),
    difficulty: data.difficulty ?? 1,
    designStandard: data.designStandard,
    readingMinutes: estimateReadingMinutes(content),
  };
}

export function getAllTermsMeta(): TermMeta[] {
  return getAllTermSlugs()
    .map((slug) => getTermMeta(slug))
    .sort((a, b) => a.title.localeCompare(b.title, "ko"));
}

export function resolveRelatedTerms(term: TermMeta, allTerms: TermMeta[]): TermMeta[] {
  const bySlug = new Map(allTerms.map((t) => [t.slug, t]));
  return term.relatedTerms
    .map((slug) => bySlug.get(slug))
    .filter((t): t is TermMeta => Boolean(t));
}

export function getRandomTermSlug(): string | null {
  const slugs = getAllTermSlugs();
  if (slugs.length === 0) return null;
  return slugs[Math.floor(Math.random() * slugs.length)];
}

function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[.*?\]\(.*?\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*_>~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * 검색용 경량 인덱스. 원문 MDX 전체가 아니라 텍스트만 추출해 담아
 * 용어가 많아져도 클라이언트로 전달되는 데이터 크기를 억제합니다.
 */
export function getTermsSearchIndex(): TermSearchEntry[] {
  return getAllTermSlugs().map((slug) => {
    const { data, content } = readTermFile(slug);
    return {
      slug,
      title: data.title,
      titleLower: (data.title as string).toLowerCase(),
      description: data.description ?? "",
      english: data.english,
      abbreviation: data.abbreviation,
      tags: data.tags ?? [],
      relatedTerms: data.relatedTerms ?? [],
      field: data.field,
      difficulty: data.difficulty ?? 1,
      bodyLower: stripMarkdown(content).toLowerCase(),
    };
  });
}
