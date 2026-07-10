import type { Category } from "./types";

export const CATEGORY_LABELS: Record<Category, string> = {
  news: "철도뉴스",
  study: "철도기술사",
  case: "시공사례",
  terms: "철도용어",
  resource: "기술자료",
  standard: "설계기준",
};

export type CategoryTheme = {
  soft: string;
  softBorder: string;
  text: string;
  textStrong: string;
  textHover: string;
  groupHoverText: string;
  border: string;
  borderHover: string;
  accentBorderL: string;
};

// 모든 카테고리가 동일한 Navy / White / Gray 톤을 공유합니다.
// (경제 사이트 특유의 카테고리별 무지개 색상 구분을 제거하고,
//  철도 설계도면처럼 단일 톤의 전문적인 인상을 주기 위함입니다.)
const NAVY_THEME: CategoryTheme = {
  soft: "bg-slate-50",
  softBorder: "border-slate-200",
  text: "text-blue-950",
  textStrong: "text-blue-950",
  textHover: "hover:text-blue-800",
  groupHoverText: "group-hover:text-blue-950",
  border: "border-slate-200",
  borderHover: "hover:border-slate-400",
  accentBorderL: "border-l-blue-950",
};

export const CATEGORY_THEME: Record<Category, CategoryTheme> = {
  news: NAVY_THEME,
  study: NAVY_THEME,
  case: NAVY_THEME,
  terms: NAVY_THEME,
  resource: NAVY_THEME,
  standard: NAVY_THEME,
};

export const SITE = {
  name: "서기(현)",
  nameEn: "SEOKI(HYEON)",
  tagline: "철도를 기록하다.",
  description:
    "철도기술사, 철도공학, 설계기준, 시공사례, 철도용어를 체계적으로 정리하는 철도 전문 아카이브",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};

export type NavItem = {
  label: string;
  href: string;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "학습센터", href: "/learning" },
  { label: "철도기술사", href: "/study" },
  { label: "철도용어", href: "/terms" },
  { label: "설계기준", href: "/standard" },
  { label: "시공사례", href: "/case" },
  { label: "기술자료", href: "/resource" },
  { label: "철도뉴스", href: "/news" },
  { label: "AI 질의응답", href: "/ai-qna" },
  { label: "소개", href: "/about" },
  { label: "관리자", href: "/admin" },
];

export type Topic = {
  slug: string;
  label: string;
  description: string;
  emoji: string;
};

export const RAIL_TOPICS: Topic[] = [
  {
    slug: "alignment",
    label: "선형",
    description: "평면곡선·종단곡선과 완화곡선의 원리",
    emoji: "\u{1F4D0}",
  },
  {
    slug: "track",
    label: "궤도",
    description: "궤도구조, 궤도틀림, 궤도역학의 기초",
    emoji: "\u{1F6E4}\u{FE0F}",
  },
  {
    slug: "roadbed",
    label: "노반",
    description: "노반 지지력과 다짐, 배수 설계",
    emoji: "\u{1F3D4}\u{FE0F}",
  },
  {
    slug: "rail",
    label: "레일",
    description: "레일 규격, 마모, 용접과 체결장치",
    emoji: "\u{1F6E4}\u{FE0F}",
  },
  {
    slug: "turnout",
    label: "분기기",
    description: "분기기의 구조, 종류와 유지관리",
    emoji: "\u{1F500}",
  },
  {
    slug: "sleeper",
    label: "침목",
    description: "PC침목·목침목 등 침목의 역할과 설계",
    emoji: "\u{1FAB5}",
  },
  {
    slug: "ballast",
    label: "도상",
    description: "자갈도상과 콘크리트궤도의 특성 비교",
    emoji: "\u{1F9F1}",
  },
  {
    slug: "bridge",
    label: "교량",
    description: "철도교량의 형식과 설계 하중",
    emoji: "\u{1F309}",
  },
  {
    slug: "tunnel",
    label: "터널",
    description: "터널 공법(NATM 등)과 환기·방재 설계",
    emoji: "\u{1F573}\u{FE0F}",
  },
  {
    slug: "electrification",
    label: "전철",
    description: "전차선로와 급전 시스템의 구성",
    emoji: "\u{26A1}",
  },
  {
    slug: "signaling",
    label: "신호",
    description: "열차제어와 신호보안 시스템",
    emoji: "\u{1F6A6}",
  },
  {
    slug: "maintenance",
    label: "유지보수",
    description: "선로 점검, 보수 주기와 안전관리",
    emoji: "\u{1F527}",
  },
];
