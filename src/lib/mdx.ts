import { compileMDX } from "next-mdx-remote/rsc";
import { getPostRawSource } from "./posts";
import { rehypeSectionCards } from "./rehype-section-cards";
import {
  MemoryTip,
  ExamAlert,
  DesignStandard,
  PracticeTip,
} from "@/components/mdx/Callouts";
import { Figure } from "@/components/mdx/Figure";
import type { Category } from "./types";

type Frontmatter = {
  title: string;
  date: string;
  description: string;
  topic?: string;
  tags?: string[];
  image?: string;
  summary?: string[];
  examPoints?: string[];
};

const MDX_COMPONENTS = {
  MemoryTip,
  ExamAlert,
  DesignStandard,
  PracticeTip,
  Figure,
};

export async function compilePost(category: Category, slug: string) {
  const source = getPostRawSource(category, slug);
  return compileMDX<Frontmatter>({
    source,
    components: MDX_COMPONENTS,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        rehypePlugins: [rehypeSectionCards],
      },
    },
  });
}

/**
 * 파일로 저장하기 전에, 실제로 게시글이 사용하는 것과 동일한 파이프라인으로
 * MDX 원문이 컴파일되는지 검증합니다. 실패하면 에러를 그대로 던집니다.
 */
export async function compileMdxSource(source: string) {
  return compileMDX<Frontmatter>({
    source,
    components: MDX_COMPONENTS,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        rehypePlugins: [rehypeSectionCards],
      },
    },
  });
}
