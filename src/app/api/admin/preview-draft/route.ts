import { generateMdx } from "@/lib/content-engine";
import { compileMdxSource } from "@/lib/mdx";
import {
  buildContentEngineInput,
  friendlyMdxError,
  saveDraft,
  type AdminSavePayload,
} from "@/lib/content-repository";
import { CATEGORIES, type Category } from "@/lib/types";

export const dynamic = "force-dynamic";

function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function strArray(value: unknown): string[] | undefined {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : undefined;
}

/**
 * 저장 API와 달리, 미리보기는 사용자가 아직 입력 중인 불완전한 상태도
 * 그대로 렌더링해야 하므로 필드 누락에 에러를 던지지 않고 관대하게 채웁니다.
 */
function parsePreviewPayload(body: Record<string, unknown>): AdminSavePayload {
  const category = CATEGORIES.includes(body.category as Category) ? (body.category as Category) : "study";

  return {
    category,
    slug: str(body.slug),
    title: str(body.title),
    description: str(body.description),
    date: str(body.date) || new Date().toISOString().slice(0, 10),
    tags: strArray(body.tags),
    difficulty: typeof body.difficulty === "number" ? body.difficulty : undefined,
    image: str(body.image) || undefined,
    summary: strArray(body.summary),
    examPoints: strArray(body.examPoints),
    body: str(body.body),
    english: str(body.english) || undefined,
    abbreviation: str(body.abbreviation) || undefined,
    field: str(body.field) || undefined,
    relatedTerms: strArray(body.relatedTerms),
    designStandard: str(body.designStandard) || undefined,
    examRelevant: Boolean(body.examRelevant) || undefined,
    topic: str(body.topic) || undefined,
  };
}

export async function POST(request: Request) {
  const json = await request.json().catch(() => ({}));
  const raw = (typeof json === "object" && json !== null ? json : {}) as Record<string, unknown>;
  const { token: existingToken, ...rest } = raw;

  const payload = parsePreviewPayload(rest);
  const input = buildContentEngineInput(payload);
  const mdx = generateMdx(input);

  try {
    // 실제 게시글(compilePost)과 완전히 동일한 파이프라인으로 유효성만 확인합니다.
    // 렌더링 자체는 admin/preview/[token] 페이지(Server Component)가 담당합니다 —
    // next-mdx-remote/rsc의 컴파일 결과는 react-dom/server로 직접 문자열화할 수
    // 없기 때문입니다(react-server 조건과 충돌).
    await compileMdxSource(mdx);
    const token = saveDraft(payload, typeof existingToken === "string" ? existingToken : null);
    return Response.json({ token, error: null });
  } catch (err) {
    return Response.json({ token: null, error: friendlyMdxError(err) });
  }
}
