import type { Category } from "./types";

export const CATEGORY_LABELS: Record<Category, string> = {
  today: "오늘의 경제",
  learn: "경제 공부",
  invest: "투자 분석",
  terms: "경제 용어",
  blog: "블로그",
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

export const CATEGORY_THEME: Record<Category, CategoryTheme> = {
  today: {
    soft: "bg-blue-50",
    softBorder: "border-blue-100",
    text: "text-blue-600",
    textStrong: "text-blue-700",
    textHover: "hover:text-blue-700",
    groupHoverText: "group-hover:text-blue-600",
    border: "border-blue-200",
    borderHover: "hover:border-blue-400",
    accentBorderL: "border-l-blue-500",
  },
  invest: {
    soft: "bg-green-50",
    softBorder: "border-green-100",
    text: "text-green-600",
    textStrong: "text-green-700",
    textHover: "hover:text-green-700",
    groupHoverText: "group-hover:text-green-600",
    border: "border-green-200",
    borderHover: "hover:border-green-400",
    accentBorderL: "border-l-green-500",
  },
  learn: {
    soft: "bg-purple-50",
    softBorder: "border-purple-100",
    text: "text-purple-600",
    textStrong: "text-purple-700",
    textHover: "hover:text-purple-700",
    groupHoverText: "group-hover:text-purple-600",
    border: "border-purple-200",
    borderHover: "hover:border-purple-400",
    accentBorderL: "border-l-purple-500",
  },
  terms: {
    soft: "bg-gray-50",
    softBorder: "border-gray-100",
    text: "text-gray-600",
    textStrong: "text-gray-700",
    textHover: "hover:text-gray-700",
    groupHoverText: "group-hover:text-gray-600",
    border: "border-gray-200",
    borderHover: "hover:border-gray-400",
    accentBorderL: "border-l-gray-500",
  },
  blog: {
    soft: "bg-orange-50",
    softBorder: "border-orange-100",
    text: "text-orange-600",
    textStrong: "text-orange-700",
    textHover: "hover:text-orange-700",
    groupHoverText: "group-hover:text-orange-600",
    border: "border-orange-200",
    borderHover: "hover:border-orange-400",
    accentBorderL: "border-l-orange-500",
  },
};

export const SITE = {
  name: "분명한경제",
  tagline: "복잡한 경제를, 분명하게.",
  description:
    "오늘의 경제 이슈, 투자 분석, 경제 공부까지 — 분명한경제가 쉽고 명확하게 정리합니다.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};

export type NavItem = {
  label: string;
  href: string;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "오늘의 경제", href: "/today" },
  { label: "경제 공부", href: "/learn" },
  { label: "투자 분석", href: "/invest" },
  { label: "경제 용어", href: "/terms" },
  { label: "블로그", href: "/blog" },
  { label: "소개", href: "/about" },
];

export type Topic = {
  slug: string;
  label: string;
  description: string;
  emoji: string;
};

export const LEARN_TOPICS: Topic[] = [
  {
    slug: "stock",
    label: "주식투자",
    description: "주식시장의 기본 원리부터 첫 매수까지",
    emoji: "\u{1F4C8}",
  },
  {
    slug: "real-estate",
    label: "부동산",
    description: "내 집 마련과 부동산 시장 읽는 법",
    emoji: "\u{1F3E0}",
  },
  {
    slug: "rates-bonds",
    label: "금리·채권",
    description: "기준금리가 내 지갑에 미치는 영향",
    emoji: "\u{1F4B0}",
  },
  {
    slug: "tax",
    label: "세금·절세",
    description: "알면 돈이 되는 세금 상식",
    emoji: "\u{1F4C4}",
  },
  {
    slug: "indicators",
    label: "경제지표",
    description: "GDP, CPI, 환율까지 지표 완전정복",
    emoji: "\u{1F4CA}",
  },
  {
    slug: "global",
    label: "국제경제",
    description: "미국, 중국, 세계 경제 흐름 읽기",
    emoji: "\u{1F30D}",
  },
];
