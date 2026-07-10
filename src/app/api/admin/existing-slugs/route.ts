import { CATEGORIES } from "@/lib/types";
import { getPostSlugs } from "@/lib/posts";

// 관리자 페이지에서 새 글을 만들 때마다 최신 slug 목록을 확인해야 하므로 동적으로 처리합니다.
export const dynamic = "force-dynamic";

export async function GET() {
  const data = Object.fromEntries(
    CATEGORIES.map((category) => [category, getPostSlugs(category)])
  );
  return Response.json(data);
}
