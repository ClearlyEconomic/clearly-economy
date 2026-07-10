import { escapeAttribute, escapeMdxBody } from "./escape";
import type { CalloutVariant, ContentBlock, ContentSection } from "./types";

const CALLOUT_TAGS: Record<CalloutVariant, string> = {
  memory: "MemoryTip",
  examAlert: "ExamAlert",
  designStandard: "DesignStandard",
  practiceTip: "PracticeTip",
};

function hasContent(block: ContentBlock): boolean {
  if (block.type === "figure") return true;
  return block.text.trim().length > 0;
}

function renderBlock(block: ContentBlock): string {
  switch (block.type) {
    case "markdown":
      return escapeMdxBody(block.text.trim());
    case "callout": {
      const tag = CALLOUT_TAGS[block.variant];
      return `<${tag}>\n${escapeMdxBody(block.text.trim())}\n</${tag}>`;
    }
    case "figure": {
      const caption = block.caption ? ` caption="${escapeAttribute(block.caption)}"` : "";
      return `<Figure type="${block.figureType}"${caption} />`;
    }
  }
}

/**
 * 섹션 배열을 `## 제목` + 본문 블록들로 렌더링합니다.
 * 블록이 하나도 채워지지 않은 섹션(전부 빈 텍스트)은 결과물에서 생략됩니다 —
 * frontmatter의 "빈 값은 출력하지 않는다" 원칙을 본문에도 동일하게 적용한 것입니다.
 */
export function renderSections(sections: ContentSection[]): string {
  return sections
    .filter((section) => section.blocks.some(hasContent))
    .map((section) => {
      const body = section.blocks.filter(hasContent).map(renderBlock).join("\n\n");
      return `## ${section.heading}\n\n${body}`;
    })
    .join("\n\n");
}

/** 가장 흔한 경우(순수 텍스트 한 덩어리)를 위한 편의 헬퍼입니다. */
export function textSection(heading: string, text: string): ContentSection {
  return { heading, blocks: [{ type: "markdown", text }] };
}

export function calloutBlock(variant: CalloutVariant, text: string): ContentBlock {
  return { type: "callout", variant, text };
}

export function figureBlock(
  figureType: "도면" | "사진" | "표",
  caption?: string
): ContentBlock {
  return { type: "figure", figureType, caption };
}
