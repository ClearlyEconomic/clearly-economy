import { compileMDX } from "next-mdx-remote/rsc";
import { generateMdx, textSection, calloutBlock, figureBlock } from "@/lib/content-engine";
import type { ContentEngineInput } from "@/lib/content-engine";
import { rehypeSectionCards } from "@/lib/rehype-section-cards";
import {
  MemoryTip,
  ExamAlert,
  DesignStandard,
  PracticeTip,
} from "@/components/mdx/Callouts";
import { Figure } from "@/components/mdx/Figure";

export const dynamic = "force-dynamic";

const SAMPLES: { label: string; input: ContentEngineInput }[] = [
  {
    label: "철도기술사 (study)",
    input: {
      category: "study",
      title: "슬랙(Slack)의 정의와 산정 원리",
      date: "2026-07-10",
      description: "곡선 구간에서 궤간을 넓히는 슬랙의 정의와 산정 방법을 정리합니다.",
      topic: "alignment",
      tags: ["슬랙", "곡선", "궤간"],
      difficulty: 3,
      summary: [
        "슬랙은 곡선부에서 궤간을 의도적으로 넓히는 것",
        "곡선반경이 작을수록 슬랙량이 커짐",
      ],
      examPoints: ["슬랙 산정식과 적용 범위를 구분해서 설명할 수 있어야 한다"],
      sections: [
        textSection(
          "정의",
          "슬랙(slack)이란 곡선 구간에서 고정축거를 가진 차량이 원활하게 통과하도록 궤간을 표준보다 넓히는 것이다."
        ),
        textSection("목적", "차륜과 레일 사이의 마찰·마모를 줄이고 탈선 위험을 낮추기 위함이다."),
        {
          heading: "특징",
          blocks: [
            { type: "markdown", text: "곡선반경이 작을수록 슬랙량이 커진다." },
            calloutBlock(
              "memory",
              "슬랙은 **곡선반경에 반비례**한다는 것만 기억하면 산정식을 쉽게 떠올릴 수 있다."
            ),
          ],
        },
        textSection("원리", "차량 고정축거와 곡선반경의 기하학적 관계로부터 슬랙량이 유도된다."),
        {
          heading: "설계기준",
          blocks: [
            { type: "markdown", text: "곡선반경별 슬랙 표준값은 궤도 설계기준에서 규정한다." },
            figureBlock("표", "곡선반경별 슬랙 표준값 (예시)"),
          ],
        },
        textSection("시공 시 주의사항", "슬랙은 완화곡선 구간에서 점진적으로 체감·체증시켜 시공해야 한다."),
        textSection("유지관리", "슬랙 과다·과소는 궤간틀림으로 이어지므로 정기 검측이 필요하다."),
      ],
    },
  },
  {
    label: "철도용어 (terms)",
    input: {
      category: "terms",
      title: "궤간가변대차",
      date: "2026-07-10",
      description: "서로 다른 궤간의 노선을 직결 운행할 수 있도록 궤간을 바꿔주는 대차입니다.",
      english: "Gauge Changeable Bogie",
      abbreviation: "GCB",
      field: "rail",
      tags: ["궤간가변대차", "궤간", "직결운행"],
      relatedTerms: ["gauge"],
      examRelevant: true,
      designStandard: "궤간 변환 구간의 설비 규격은 관련 국제 규정 및 자체 설계기준에서 정한다.",
      difficulty: 4,
      summary: [
        "궤간이 다른 두 노선을 환적 없이 직결 운행하게 해주는 장치",
        "궤간 변환 구간에서 자동으로 차륜 간격이 바뀜",
      ],
      sections: [
        textSection(
          "정의",
          "궤간가변대차(GCB)는 궤간이 다른 두 노선 사이를 열차가 정차나 환적 없이 통과할 수 있도록, 궤간 변환 구간을 지나며 좌우 차륜 간격이 자동으로 바뀌는 대차이다."
        ),
        textSection(
          "왜 중요한가",
          "국경을 넘나드는 국제철도처럼 궤간이 다른 구간을 오갈 때 환적 비용과 시간을 절감할 수 있다."
        ),
        textSection(
          "함께 보면 좋은 개념",
          "궤간(gauge) 문서에서 표준궤/광궤/협궤의 개념을 먼저 확인하면 이해가 쉽다."
        ),
      ],
    },
  },
  {
    label: "설계기준 (standard) — 이스케이프 테스트 포함",
    input: {
      category: "standard",
      title: "곡선부 슬랙 기준값",
      date: "2026-07-10",
      description: "곡선반경 구간별 슬랙 기준값과 계산식을 정리합니다.",
      tags: ["슬랙", "설계기준"],
      sections: [
        textSection("목적", "곡선 통과 시 차량과 궤도 간 간섭을 방지하기 위한 슬랙 기준을 정한다."),
        textSection("적용범위", "본선 및 측선의 모든 곡선 구간에 적용한다."),
        // 의도적으로 '{', '}', 줄 맨 앞 '#'을 포함시켜 이스케이프 로직을 검증합니다.
        textSection(
          "기준값",
          "곡선반경 R(단위: {m})에 따라 슬랙량이 달라진다.\n# 주의: 이 줄은 원본 자료의 메모이며 소제목이 아니다.\n최대 허용값은 {30mm}이다."
        ),
        textSection("계산식", "슬랙(mm) = 2400 / R (R: 곡선반경, m)"),
        {
          heading: "참고도면",
          blocks: [figureBlock("도면", "곡선부 슬랙 적용 개념도")],
        },
        textSection("관련 규정", "궤도 설계기준 제O장 곡선부 궤도 편을 참고한다."),
      ],
    },
  },
  {
    label: "철도뉴스 (news)",
    input: {
      category: "news",
      title: "동해선 궤도 개량공사 완료, 운행속도 상향",
      date: "2026-07-10",
      description: "동해선 일부 구간의 궤도 개량공사가 완료되어 운행속도가 상향 조정되었습니다.",
      tags: ["동해선", "궤도개량"],
      sections: [
        textSection("오늘의 핵심", "동해선 일부 구간의 궤도 개량공사가 완료되어 최고속도가 상향 조정되었다."),
        textSection("왜 중요한가", "궤도 상태 개선으로 운행시간이 단축되고 승차감이 향상된다."),
        textSection(
          "서기(현)의 시각",
          "궤도 개량은 도상·침목·레일을 함께 손보는 종합 공사인 경우가 많아, 관련 개념을 함께 짚어보면 좋다."
        ),
      ],
    },
  },
  {
    label: "시공사례 (case)",
    input: {
      category: "case",
      title: "곡선구간 슬랙 재설정 시공사례",
      date: "2026-07-10",
      description: "슬랙 과다로 궤간틀림이 발생한 곡선구간의 재설정 시공사례입니다.",
      tags: ["슬랙", "궤간틀림", "시공사례"],
      sections: [
        textSection("개요", "정기 검측에서 슬랙 과다가 확인된 곡선구간의 재설정 시공사례이다."),
        textSection("적용 공법", "궤도틀림 보수장비를 투입해 슬랙량을 기준치로 재조정했다."),
        textSection("특징", "완화곡선 구간의 체감 구배를 함께 재검토했다."),
        textSection("시공 중 이슈와 대응", "재설정 직후 일시적으로 궤간틀림이 재발해 다짐 작업을 추가했다."),
      ],
    },
  },
  {
    label: "기술자료 (resource)",
    input: {
      category: "resource",
      title: "슬랙 관련 자료 찾는 법",
      date: "2026-07-10",
      description: "슬랙과 관련된 설계기준·용어·기술사 자료를 빠르게 찾는 법을 정리합니다.",
      tags: ["학습법"],
      sections: [
        textSection("개요", "슬랙은 여러 카테고리에 흩어져 있어 함께 찾아보는 것이 효율적이다."),
        textSection(
          "핵심 내용",
          "철도용어의 슬랙 문서 → 관련 용어(궤간) → 철도기술사 문서 순으로 확장해서 학습하면 좋다."
        ),
      ],
    },
  },
];

export async function GET() {
  const results = [];

  for (const sample of SAMPLES) {
    const mdx = generateMdx(sample.input);
    let compiled = false;
    let error: string | null = null;

    try {
      // 실제 프로덕션(src/lib/mdx.ts)과 동일한 파이프라인으로 컴파일해
      // 생성된 MDX가 진짜로 유효한지 검증합니다.
      await compileMDX({
        source: mdx,
        components: { MemoryTip, ExamAlert, DesignStandard, PracticeTip, Figure },
        options: {
          parseFrontmatter: true,
          mdxOptions: { rehypePlugins: [rehypeSectionCards] },
        },
      });
      compiled = true;
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
    }

    results.push({ label: sample.label, category: sample.input.category, mdx, compiled, error });
  }

  return Response.json({ results });
}
