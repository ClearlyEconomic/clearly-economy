import { NextRequest } from "next/server";
import { CATEGORIES, type Category } from "@/lib/types";
import {
  buildContentEngineInput,
  getContentRepository,
  ContentRepositoryError,
  type AdminSavePayload,
} from "@/lib/content-repository";

export const dynamic = "force-dynamic";

const STATUS_CODE_BY_ERROR: Record<string, number> = {
  VALIDATION_FAILED: 400,
  SLUG_CONFLICT: 409,
  NOT_FOUND: 404,
  COMPILE_FAILED: 422,
  IO_ERROR: 500,
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** 요청 바디를 신뢰하지 않고, Repository 계층에 넘기기 전 최소한의 형태만 확인합니다. */
function parsePayload(body: unknown): AdminSavePayload {
  if (!isPlainObject(body)) throw new ContentRepositoryError("VALIDATION_FAILED", "요청 형식이 올바르지 않습니다.");

  const category = body.category;
  if (typeof category !== "string" || !CATEGORIES.includes(category as Category)) {
    throw new ContentRepositoryError("VALIDATION_FAILED", "카테고리가 올바르지 않습니다.");
  }

  return {
    category: category as Category,
    slug: typeof body.slug === "string" ? body.slug : "",
    title: typeof body.title === "string" ? body.title : "",
    description: typeof body.description === "string" ? body.description : "",
    date: typeof body.date === "string" ? body.date : "",
    tags: Array.isArray(body.tags) ? body.tags.filter((t) => typeof t === "string") : undefined,
    difficulty: typeof body.difficulty === "number" ? body.difficulty : undefined,
    image: typeof body.image === "string" ? body.image : undefined,
    summary: Array.isArray(body.summary) ? body.summary.filter((s) => typeof s === "string") : undefined,
    examPoints: Array.isArray(body.examPoints)
      ? body.examPoints.filter((s) => typeof s === "string")
      : undefined,
    body: typeof body.body === "string" ? body.body : "",
    status:
      body.status === "draft" || body.status === "review" || body.status === "published"
        ? body.status
        : undefined,
    english: typeof body.english === "string" ? body.english : undefined,
    abbreviation: typeof body.abbreviation === "string" ? body.abbreviation : undefined,
    field: typeof body.field === "string" ? body.field : undefined,
    relatedTerms: Array.isArray(body.relatedTerms)
      ? body.relatedTerms.filter((s) => typeof s === "string")
      : undefined,
    designStandard: typeof body.designStandard === "string" ? body.designStandard : undefined,
    examRelevant: typeof body.examRelevant === "boolean" ? body.examRelevant : undefined,
    topic: typeof body.topic === "string" ? body.topic : undefined,
  };
}

export async function POST(request: NextRequest) {
  try {
    const json = await request.json().catch(() => {
      throw new ContentRepositoryError("VALIDATION_FAILED", "요청 본문을 읽을 수 없습니다.");
    });

    const payload = parsePayload(json);
    const input = buildContentEngineInput(payload);
    const repository = getContentRepository();

    const result = await repository.create(payload.slug, input, { status: payload.status });

    return Response.json({ result });
  } catch (err) {
    if (err instanceof ContentRepositoryError) {
      return Response.json(
        { error: { code: err.code, message: err.message, issues: err.issues } },
        { status: STATUS_CODE_BY_ERROR[err.code] ?? 500 }
      );
    }

    const message = err instanceof Error ? err.message : String(err);
    return Response.json(
      { error: { code: "IO_ERROR", message: `예상치 못한 오류가 발생했습니다: ${message}`, issues: [] } },
      { status: 500 }
    );
  }
}
