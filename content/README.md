# 분명한경제 콘텐츠 가이드

이 폴더(`/content`)는 분명한경제 사이트의 모든 글을 MDX 파일로 저장하는 곳입니다.
데이터베이스나 CMS 없이, 이 폴더에 `.mdx` 파일을 추가하는 것만으로 새 글이 사이트에 반영됩니다.

## 1. 폴더 구조

```
content/
  today/   → 오늘의 경제 (매일 발행되는 짧은 이슈 브리핑)
  learn/   → 경제 공부 (기초 개념, topic 필드 필수)
  invest/  → 투자 분석
  terms/   → 경제 용어 (용어 사전)
  blog/    → 블로그 (자유 주제)
```

- 카테고리는 이 5개 폴더가 전부입니다. 새 카테고리를 추가하려면 코드 변경이 필요합니다
  (`src/lib/types.ts`의 `CATEGORIES`, `src/lib/site.ts`의 `CATEGORY_LABELS` / `CATEGORY_THEME`).
- **파일 이름이 곧 URL 슬러그**가 됩니다. 예: `content/invest/dividend-stock-analysis.mdx`
  → `/invest/dividend-stock-analysis`
- 파일명은 영문 kebab-case 권장 (`my-first-post.mdx`). 한글 파일명은 URL이 지저분해지므로 피하세요.
- `today` 카테고리는 파일명 앞에 날짜를 붙이는 것을 권장합니다 (`2026-07-06-fed-rate-decision.mdx`).
  정렬은 파일명이 아니라 frontmatter의 `date` 값 기준이지만, 날짜 접두사가 있으면 폴더에서 찾기 쉽습니다.

## 2. Frontmatter 스키마 (필수/선택 필드)

모든 글은 파일 맨 위에 `---`로 감싼 frontmatter가 있어야 합니다.

| 필드          | 타입       | 필수 여부                          | 설명                                                             |
| ------------- | ---------- | ----------------------------------- | ------------------------------------------------------------------ |
| `title`       | string     | **필수**                            | 글 제목. 목록/상세/OG 이미지/JSON-LD에 모두 사용됩니다.             |
| `date`        | string     | **필수**                            | `YYYY-MM-DD` 형식. 정렬, 사이트맵 `lastModified`에 사용됩니다.      |
| `description` | string     | **필수**                            | 목록 카드, meta description, OG description에 사용되는 한 줄 요약.  |
| `tags`        | string[]   | **필수**                            | 태그 UI, 관련 글 추천 알고리즘, JSON-LD keywords에 사용됩니다.      |
| `topic`       | string     | `learn` 카테고리만 **필수**          | `src/lib/site.ts`의 `LEARN_TOPICS` 슬러그 중 하나와 정확히 일치해야 토픽 필터에 노출됩니다 (`stock`, `real-estate`, `rates-bonds`, `tax`, `indicators`, `global`). |
| `summary`     | string[]   | 권장 (2~4개)                        | 상세 페이지 상단 "한눈에 보기" 요약 박스에 불릿으로 표시됩니다. 없으면 박스가 표시되지 않습니다. |
| `image`       | string     | 선택                                 | 카드/히어로 썸네일 이미지 경로 또는 URL. 없으면 카테고리 색상의 기본 플레이스홀더가 표시됩니다. |

> `readingMinutes`(읽는 시간)는 frontmatter에 넣지 않습니다. 본문 글자 수를 기준으로
> `src/lib/reading-time.ts`가 자동 계산합니다.

## 3. 새 글 추가 방법 (단계별)

1. 카테고리 폴더를 고릅니다 (`content/{today|learn|invest|terms|blog}/`).
2. 아래 템플릿을 참고해 `내-글-슬러그.mdx` 파일을 만듭니다.
3. frontmatter를 채웁니다. `title`, `date`, `description`, `tags`는 반드시 채우고,
   `learn` 카테고리라면 `topic`도 반드시 채웁니다.
4. `summary`에 이 글의 핵심을 2~4줄로 정리합니다 (요약 박스에 그대로 노출됩니다).
5. 본문을 일반 마크다운(`##` 소제목, 목록, 표 등)으로 작성합니다. MDX이므로 필요하면
   React 컴포넌트도 사용할 수 있지만, 현재는 순수 마크다운만으로도 충분합니다.
6. `npm run dev`로 로컬에서 `http://localhost:3000/{category}/{슬러그}`에 접속해 확인합니다.
7. 문제없으면 커밋 후 배포합니다. 별도 빌드 스텝 없이 파일 추가만으로 `generateStaticParams`가
   해당 글을 정적 페이지로 생성하고, `sitemap.xml`에도 자동으로 포함됩니다.

## 4. 글쓰기 템플릿

```mdx
---
title: "글 제목을 입력하세요"
date: "2026-07-10"
description: "목록 카드와 검색엔진에 노출될 한 줄 요약."
tags: ["태그1", "태그2"]
topic: "stock" # learn 카테고리에서만 필수. LEARN_TOPICS 슬러그와 일치해야 함
summary:
  - "핵심 요점 1"
  - "핵심 요점 2"
  - "핵심 요점 3"
---

## 소제목

본문 내용을 작성합니다.

## 왜 중요한가

- 핵심 포인트를 목록으로 정리하면 가독성이 좋습니다.
- 표, 인용, 굵은 글씨 등 일반 마크다운 문법을 자유롭게 사용하세요.

## 분명한경제의 시각

마무리 코멘트나 시사점으로 글을 정리합니다.
```

## 5. 카테고리별 유의사항

- **today**: 홈페이지 히어로(최신 글 1개)와 "오늘의 경제 톱3"(그다음 3개)는 `date`가 가장
  최근인 순서로 자동 결정됩니다. 별도 설정이 필요 없습니다.
- **learn**: `topic` 필드가 `LEARN_TOPICS`(6개 슬러그)와 일치하지 않으면 카테고리 카드
  필터(`/learn?topic=...`)에서 해당 글이 보이지 않습니다. 오탈자에 주의하세요.
- **terms**: 용어 사전 성격이므로 `title`은 용어 자체(예: "기준금리"), `description`은
  한 줄 정의로 작성하는 것을 권장합니다.
- **관련 글 추천**: 카테고리와 무관하게 `tags`가 많이 겹치는 글이 최우선으로 추천되고,
  같은 카테고리 여부는 보조 가중치로만 작동합니다(`src/lib/posts.ts`의 `getRelatedPosts`,
  토픽 클러스터 방식 — 자세한 설계는 [../docs/internal-linking.md](../docs/internal-linking.md) 참고).
  관련 글이 잘 뜨길 원한다면 태그를 일관되게 재사용하세요.

## 6. 이미지(썸네일) 추가 방법

`image` frontmatter 필드에 이미지 경로 또는 URL을 넣으면 카드/히어로에 실제 이미지가 표시됩니다.
값을 비워두면 카테고리 색상의 플레이스홀더가 자동으로 표시되므로, 이미지가 아직 없어도 글을
발행하는 데 문제는 없습니다.

1. 이미지 파일을 `public/images/posts/` 폴더에 넣습니다 (폴더가 없다면 새로 만듭니다).
   예: `public/images/posts/fed-rate-decision.jpg`
2. frontmatter에 **`public` 기준 절대경로**로 적습니다 (앞에 `/public`은 붙이지 않습니다).
   ```yaml
   image: "/images/posts/fed-rate-decision.jpg"
   ```
3. 외부에 이미 올려둔 이미지가 있다면 URL을 그대로 적어도 됩니다.
   ```yaml
   image: "https://images.example.com/xxx.jpg"
   ```
4. 권장 비율은 **16:9** (카드/목록용), 최소 가로 800px 이상을 권장합니다. 너무 무거운 원본 파일은
   업로드 전에 압축(TinyPNG, Squoosh 등)해서 넣는 것이 로딩 속도에 유리합니다.
5. 이미지는 `src/components/ui/Thumbnail.tsx`가 렌더링합니다. 카드 목록/히어로/랭킹 카드 등
   모든 곳에서 같은 프론트매터 값을 재사용하므로, 한 번만 넣으면 전 지면에 자동 반영됩니다.
