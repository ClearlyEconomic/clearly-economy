# 서기(현) 콘텐츠 가이드

이 폴더(`/content`)는 서기(현) 사이트의 모든 글을 MDX 파일로 저장하는 곳입니다.
데이터베이스나 CMS 없이, 이 폴더에 `.mdx` 파일을 추가하는 것만으로 새 글이 사이트에 반영됩니다.

## 1. 폴더 구조

```
content/
  study/     → 철도기술사 (topic 필드로 12개 분야 필터링, 정의~기출포인트 전체 구조)
  terms/     → 철도용어 (용어 사전)
  standard/  → 설계기준
  case/      → 시공사례
  resource/  → 기술자료 (학습법 등)
  news/      → 철도뉴스
```

- 카테고리는 이 6개 폴더가 전부입니다. 새 카테고리를 추가하려면 코드 변경이 필요합니다
  (루트 [README.md §2.4 카테고리 확장 방법](../README.md) 참고).
- **파일 이름이 곧 URL 슬러그**가 됩니다. 예: `content/case/natm-long-tunnel.mdx`
  → `/case/natm-long-tunnel`
- 파일명은 영문 kebab-case 권장 (`my-first-post.mdx`). 한글 파일명은 URL이 지저분해지므로 피하세요.

## 2. Frontmatter 스키마 (필수/선택 필드)

모든 글은 파일 맨 위에 `---`로 감싼 frontmatter가 있어야 합니다.

| 필드          | 타입       | 필수 여부                          | 설명                                                             |
| ------------- | ---------- | ----------------------------------- | ------------------------------------------------------------------ |
| `title`       | string     | **필수**                            | 글 제목. 목록/상세/OG 이미지/JSON-LD에 모두 사용됩니다.             |
| `date`        | string     | **필수**                            | `YYYY-MM-DD` 형식. 정렬, 사이트맵 `lastModified`에 사용됩니다.      |
| `description` | string     | **필수**                            | 목록 카드, meta description, OG description에 사용되는 한 줄 요약.  |
| `tags`        | string[]   | **필수**                            | 태그 UI, 관련 글 추천 알고리즘, JSON-LD keywords에 사용됩니다.      |
| `topic`       | string     | `study` 카테고리만 **필수**          | `src/lib/site.ts`의 `RAIL_TOPICS` 슬러그 중 하나와 정확히 일치해야 토픽 필터에 노출됩니다 (`alignment`, `track`, `roadbed`, `rail`, `turnout`, `sleeper`, `ballast`, `bridge`, `tunnel`, `electrification`, `signaling`, `maintenance`). |
| `summary`     | string[]   | 권장 (2~4개)                        | 상세 페이지 상단 "핵심 요약" 박스에 불릿으로 표시됩니다.             |
| `examPoints`  | string[]   | `study` 권장 (2~4개)                | "기술사 기출 포인트" 박스에 표시됩니다. 시험 대비 핵심 체크포인트를 적습니다. |
| `image`       | string     | 선택                                 | 카드/히어로 썸네일 이미지 경로 또는 URL. 없으면 회색 플레이스홀더가 표시됩니다. |

> `readingMinutes`(읽는 시간)는 frontmatter에 넣지 않습니다. 본문 글자 수를 기준으로
> `src/lib/reading-time.ts`가 자동 계산합니다.

### 2.1 `terms`(철도용어) 전용 추가 필드

`terms` 카테고리는 위키형 상세 페이지(`src/components/terms/TermDetail.tsx`)를 사용하며,
아래 필드를 추가로 지원합니다. 전부 선택 사항이지만 채울수록 검색·탐색 품질이 좋아집니다.

| 필드             | 타입     | 설명                                                                 |
| ---------------- | -------- | ---------------------------------------------------------------------- |
| `english`        | string   | 영문명 (예: `"Continuous Welded Rail"`). 상세 페이지 제목 아래 표시.     |
| `abbreviation`   | string   | 약어 (예: `"CWR"`). 검색 대상에 포함되며 카드/상세에 배지로 표시.        |
| `field`          | string   | 관련 분야. `RAIL_TOPICS` 슬러그와 일치해야 카테고리 필터(`/terms?field=`)에 노출됩니다. |
| `relatedTerms`   | string[] | **같은 `terms` 폴더 내 다른 슬러그** 배열. "관련 용어" 체인 탐색에 사용됩니다(예: `["cwr", "rail"]`). |
| `examRelevant`   | boolean  | 기술사 기출 여부. `true`면 상세 페이지에 "🎓 기술사 기출" 배지가 표시됩니다. |
| `difficulty`     | number   | 난이도 1~5. 카드/상세에 `★` 개수로 표시됩니다.                          |
| `designStandard` | string   | 관련 설계기준을 한두 문장으로 요약. 있으면 상세 페이지에 전용 박스로 표시됩니다. |

`relatedTerms`는 **파일명(슬러그) 기준**으로 적어야 합니다 — 용어 제목이 아닙니다.
서로 다른 카테고리의 글(예: `study`의 관련 글)은 이 필드가 아니라 `tags`를 일치시켜
자동 관련 글 추천([internal-linking.md](../docs/internal-linking.md))에 맡기세요.

## 3. 새 글 추가 방법 (단계별)

1. 카테고리 폴더를 고릅니다 (`content/{study|terms|standard|case|resource|news}/`).
2. 아래 템플릿을 참고해 `내-글-슬러그.mdx` 파일을 만듭니다.
3. frontmatter를 채웁니다. `title`, `date`, `description`, `tags`는 반드시 채우고,
   `study` 카테고리라면 `topic`도 반드시 채웁니다.
4. `summary`(핵심 요약)와, `study` 글이라면 `examPoints`(기출 포인트)도 채웁니다.
5. 본문을 마크다운으로 작성합니다. `study` 카테고리는 아래 §4 템플릿의 9개 소제목 구조를
   그대로 따르는 것을 권장합니다.
6. `npm run dev`로 로컬에서 `http://localhost:3000/{category}/{슬러그}`에 접속해 확인합니다.
7. 문제없으면 커밋 후 배포합니다. 별도 빌드 스텝 없이 파일 추가만으로 `generateStaticParams`가
   해당 글을 정적 페이지로 생성하고, `sitemap.xml`에도 자동으로 포함됩니다.

## 4. 글쓰기 템플릿

### 4.1 철도기술사(`study`) — 시험 대비 전체 구조

```mdx
---
title: "글 제목을 입력하세요"
date: "2026-07-10"
description: "목록 카드와 검색엔진에 노출될 한 줄 요약."
topic: "track" # RAIL_TOPICS 슬러그와 일치해야 함
tags: ["태그1", "태그2"]
summary:
  - "핵심 요점 1"
  - "핵심 요점 2"
  - "핵심 요점 3"
examPoints:
  - "자주 출제되는 포인트 1"
  - "자주 출제되는 포인트 2"
---

## 정의

이 개념이 무엇인지 한 문단으로 정의합니다.

## 목적

이 개념/설비/공법이 왜 필요한지 설명합니다.

## 원리

동작 원리나 구성 요소를 설명합니다.

## 특징

주요 특징을 목록으로 정리합니다.

## 장단점

장점과 단점을 균형 있게 서술합니다.

## 설계기준

관련 설계기준의 핵심 개념을 설명합니다. 구체적 수치는 최신 공식 기준을 반드시 확인하세요.

## 시공 시 주의사항

시공 단계에서 주의해야 할 점을 정리합니다.

## 유지관리

준공 이후 점검·보수 시 고려사항을 정리합니다.
```

### 4.2 그 외 카테고리(`news`/`case`/`terms`/`resource`/`standard`)

`study`만큼 엄격한 구조는 아니지만, 각 카테고리 성격에 맞는 흐름을 권장합니다.

- **news**: 오늘의 핵심 → 왜 중요한가 → 서기(현)의 시각
- **case**: 개요 → 적용 공법 → 특징 → 시공 중 이슈와 대응 → 서기(현)의 시각
- **terms**: 정의 → 왜 중요한가 → 함께 보면 좋은 개념
- **resource / standard**: 자유 형식. 다만 `summary`(핵심 요약)는 꼭 채우는 것을 권장합니다.

## 5. 카테고리별 유의사항

- **study**: `topic` 필드가 `RAIL_TOPICS`(12개 슬러그)와 일치하지 않으면 카테고리 카드
  필터(`/study?topic=...`)에서 해당 글이 보이지 않습니다. 오탈자에 주의하세요.
- **terms**: 용어 사전 성격이므로 `title`은 용어 자체(예: "캔트 (Cant)"), `description`은
  한 줄 정의로 작성하는 것을 권장합니다.
- **news**: 홈페이지 히어로(최신 글 1개)와 "최근 철도뉴스" 목록은 `date`가 가장
  최근인 순서로 자동 결정됩니다. 별도 설정이 필요 없습니다.
- **관련 글 추천**: 카테고리와 무관하게 `tags`가 많이 겹치는 글이 최우선으로 추천되고,
  같은 카테고리 여부는 보조 가중치로만 작동합니다(`src/lib/posts.ts`의 `getRelatedPosts`,
  토픽 클러스터 방식 — 자세한 설계는 [../docs/internal-linking.md](../docs/internal-linking.md) 참고).
  관련 글이 잘 뜨길 원한다면 태그를 일관되게 재사용하세요.

## 6. 이미지(썸네일) 추가 방법

`image` frontmatter 필드에 이미지 경로 또는 URL을 넣으면 카드/히어로에 실제 이미지가 표시됩니다.
값을 비워두면 회색 플레이스홀더가 자동으로 표시되므로, 이미지가 아직 없어도 글을
발행하는 데 문제는 없습니다.

1. 이미지 파일을 `public/images/posts/` 폴더에 넣습니다 (폴더가 없다면 새로 만듭니다).
   예: `public/images/posts/natm-long-tunnel.jpg`
2. frontmatter에 **`public` 기준 절대경로**로 적습니다 (앞에 `/public`은 붙이지 않습니다).
   ```yaml
   image: "/images/posts/natm-long-tunnel.jpg"
   ```
3. 외부에 이미 올려둔 이미지가 있다면 URL을 그대로 적어도 됩니다.
   ```yaml
   image: "https://images.example.com/xxx.jpg"
   ```
4. 권장 비율은 **16:9** (카드/목록용), 최소 가로 800px 이상을 권장합니다. 너무 무거운 원본 파일은
   업로드 전에 압축(TinyPNG, Squoosh 등)해서 넣는 것이 로딩 속도에 유리합니다.
5. 이미지는 `src/components/ui/Thumbnail.tsx`가 렌더링합니다. 카드 목록/히어로 등
   모든 곳에서 같은 프론트매터 값을 재사용하므로, 한 번만 넣으면 전 지면에 자동 반영됩니다.
