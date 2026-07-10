import { getTermsSearchIndex } from "@/lib/terms";

// 콘텐츠는 빌드 시점에 고정되므로 정적으로 생성합니다.
// 용어가 수천 개로 늘어나도 이 응답은 CDN에서 캐시된 채로 서빙됩니다.
export const dynamic = "force-static";

export async function GET() {
  return Response.json(getTermsSearchIndex());
}
