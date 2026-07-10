import type { Root, Element, ElementContent } from "hast";
import { SECTION_ICONS, DEFAULT_SECTION_ICON } from "./section-icons";

const CIRCLED_NUMBERS = [
  "①",
  "②",
  "③",
  "④",
  "⑤",
  "⑥",
  "⑦",
  "⑧",
  "⑨",
  "⑩",
  "⑪",
  "⑫",
];

function getText(node: ElementContent): string {
  if (node.type === "text") return node.value;
  if ("children" in node) {
    return node.children.map((child) => getText(child as ElementContent)).join("");
  }
  return "";
}

function slugify(text: string, fallbackIndex: number): string {
  const slug = text
    .trim()
    .replace(/[()"'.,·→!?]/g, "")
    .replace(/\s+/g, "-");
  return slug || `section-${fallbackIndex}`;
}

/**
 * h2로 시작하는 각 구간을 <section class="section-card">로 묶고,
 * 제목 앞에 아이콘 + 순번 배지를 붙입니다. h2 태그 자체는 그대로 유지되어
 * SEO 구조(heading hierarchy)에 영향이 없습니다.
 */
export function rehypeSectionCards() {
  return (tree: Root) => {
    const output: ElementContent[] = [];
    let current: Element | null = null;
    let index = 0;

    for (const node of tree.children as ElementContent[]) {
      if (node.type === "element" && node.tagName === "h2") {
        const text = getText(node);
        const id = slugify(text, index + 1);
        const icon = SECTION_ICONS[text] ?? DEFAULT_SECTION_ICON;
        const number = CIRCLED_NUMBERS[index] ?? `${index + 1}.`;
        index += 1;

        const badge: Element = {
          type: "element",
          tagName: "span",
          properties: { className: ["section-card-badge"], ariaHidden: "true" },
          children: [
            {
              type: "element",
              tagName: "span",
              properties: { className: ["section-card-icon"] },
              children: [{ type: "text", value: icon }],
            },
            {
              type: "element",
              tagName: "span",
              properties: { className: ["section-card-number"] },
              children: [{ type: "text", value: number }],
            },
          ],
        };
        const title: Element = {
          type: "element",
          tagName: "span",
          properties: { className: ["section-card-title"] },
          children: node.children,
        };
        node.children = [badge, title];

        current = {
          type: "element",
          tagName: "section",
          properties: { className: ["section-card"], id },
          children: [node],
        };
        output.push(current);
      } else if (current) {
        current.children.push(node);
      } else {
        output.push(node);
      }
    }

    tree.children = output;
  };
}
