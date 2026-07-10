import matter from "gray-matter";
import type { Metadata } from "next";
import { generateMdx } from "@/lib/content-engine";
import { compileMdxSource } from "@/lib/mdx";
import { buildContentEngineInput, loadDraft } from "@/lib/content-repository";
import { estimateReadingMinutes } from "@/lib/reading-time";
import { Container } from "@/components/layout/Container";
import { TableOfContents } from "@/components/TableOfContents";
import { PostHeader } from "@/components/ui/PostHeader";
import { SummaryBox } from "@/components/ui/SummaryBox";
import { ExamPointBox } from "@/components/ui/ExamPointBox";
import { MDXArticle } from "@/components/ui/MDXArticle";

export const metadata: Metadata = {
  title: "미리보기",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const ARTICLE_CONTAINER_ID = "admin-preview-article";

/**
 * Live Editor(AdminEditor + LivePreview)가 iframe으로 띄우는 실제 렌더링
 * 페이지입니다. PostDetail과 똑같이 compileMdxSource + PostHeader/SummaryBox/
 * ExamPointBox/MDXArticle/TableOfContents를 그대로 사용하므로, 저장하지 않은
 * 초안이라도 실제 게시글과 100% 동일한 파이프라인으로 보여줍니다. 아직 저장된
 * slug가 없는 초안이므로 RelatedPosts/NoteEditor/즐겨찾기처럼 "저장된 글"을
 * 전제로 하는 기능은 여기서는 의미가 없어 제외했습니다.
 */
export default async function AdminPreviewPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const payload = loadDraft(token);

  if (!payload) {
    return (
      <Container className="max-w-3xl py-24 text-center text-sm text-slate-400">
        미리보기가 만료되었거나 찾을 수 없습니다. 편집기로 돌아가 다시 입력해주세요.
      </Container>
    );
  }

  const input = buildContentEngineInput(payload);
  const mdx = generateMdx(input);

  try {
    const { content, frontmatter } = await compileMdxSource(mdx);
    const readingMinutes = estimateReadingMinutes(matter(mdx).content);

    return (
      <Container className="max-w-6xl py-16">
        <div className="lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:items-start lg:gap-10">
          <TableOfContents containerId={ARTICLE_CONTAINER_ID} />
          <div className="mx-auto w-full max-w-3xl">
            <PostHeader
              category={payload.category}
              title={frontmatter.title || "(제목 없음)"}
              date={frontmatter.date || payload.date}
              description={frontmatter.description}
              readingMinutes={readingMinutes}
              tags={frontmatter.tags}
            />
            {frontmatter.summary && frontmatter.summary.length > 0 && (
              <SummaryBox category={payload.category} points={frontmatter.summary} />
            )}
            {frontmatter.examPoints && frontmatter.examPoints.length > 0 && (
              <ExamPointBox points={frontmatter.examPoints} />
            )}
            <div id={ARTICLE_CONTAINER_ID}>
              <MDXArticle>{content}</MDXArticle>
            </div>
          </div>
        </div>
      </Container>
    );
  } catch {
    return (
      <Container className="max-w-3xl py-24 text-center text-sm text-red-500">
        미리보기를 렌더링하는 중 오류가 발생했습니다. 편집기의 오류 메시지를 확인해주세요.
      </Container>
    );
  }
}
