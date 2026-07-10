# 서기(현) SEOKI(HYEON)

철도를 기록하다. 현행 기준으로 배우는 철도기술 아카이브입니다.
Next.js(App Router) + TypeScript + Tailwind CSS + MDX로 만들어졌고, 데이터베이스나 CMS 없이
`content/` 폴더의 `.mdx` 파일만으로 운영되는 **정적 생성(SSG) 기반 아카이브 시스템**입니다.

이 문서는 "개발이 끝난 상태"가 아니라 **혼자서 계속 운영할 수 있는 상태**를 만들기 위한
최종 마무리 문서입니다. 더 깊은 내용은 각 섹션에서 링크하는 `docs/` 문서를 참고하세요.

```
docs/
  content-strategy.md   → 무엇을 쓸지 (콘텐츠 전략, 초기 20개 주제, 카테고리 비율)
  internal-linking.md   → 글을 어떻게 서로 연결할지 (토픽 클러스터, 관련 글 알고리즘)
  deployment.md         → 어떻게 배포하고 검색엔진에 등록할지
  maintenance.md         → 글이 늘어날 때 무엇을 점검할지
content/README.md        → 글을 어떻게 쓸지 (frontmatter 규칙, 템플릿, 이미지)
```

---

## 1. 프로젝트 아키텍처 요약

### 1.1 전체 폴더 구조

```
seoki-hyeon/
├── content/                    # 모든 글 원문 (MDX). 이 폴더가 곧 "데이터베이스"
│   ├── study/                  # 철도기술사 (topic 필드로 12개 분야 필터링)
│   ├── terms/                  # 철도용어 (사전형)
│   ├── standard/               # 설계기준
│   ├── case/                   # 시공사례
│   ├── resource/               # 기술자료 (학습법 등)
│   ├── news/                   # 철도뉴스
│   └── README.md               # 글쓰기 규칙 문서
├── src/
│   ├── app/                    # 라우트 (App Router)
│   │   ├── page.tsx             # 홈
│   │   ├── {category}/page.tsx        # 카테고리 허브(목록) 페이지 × 6
│   │   ├── {category}/[slug]/page.tsx # 글 상세 페이지 × 6
│   │   ├── ai-qna/page.tsx      # AI 질의응답 (현재는 준비중 플레이스홀더)
│   │   ├── about/page.tsx       # 소개
│   │   ├── og/route.tsx         # 동적 OG 이미지 생성 API
│   │   ├── sitemap.ts           # sitemap.xml 자동 생성
│   │   ├── robots.ts            # robots.txt 자동 생성
│   │   └── layout.tsx           # 공통 레이아웃 + 전역 메타데이터 + GA
│   ├── components/
│   │   ├── layout/              # Header / Footer / Container
│   │   ├── ui/                  # PostCard, Badge, Thumbnail, ExamPointBox 등
│   │   ├── PostDetail.tsx        # 글 상세 페이지 본문 조립 (6개 상세 라우트가 공유)
│   │   ├── RelatedPosts.tsx      # 관련 글 섹션
│   │   └── *JsonLd.tsx           # 구조화 데이터(SEO) 컴포넌트들
│   └── lib/
│       ├── posts.ts             # content/ 파일시스템 읽기 · 정렬 · 관련 글 계산
│       ├── mdx.ts                # MDX 컴파일 (frontmatter + 본문)
│       ├── types.ts              # Category, PostMeta 타입 정의
│       ├── site.ts               # 사이트 정보, 카테고리 라벨/컬러 테마, 내비게이션, RAIL_TOPICS
│       ├── og.ts / post-metadata.ts  # OG 이미지·메타데이터 생성 헬퍼
│       └── reading-time.ts       # 읽는 시간 자동 계산
├── public/                      # 정적 파일 (이미지 등)
└── docs/                        # 운영/성장 전략 문서 (이 README가 가리키는 문서들)
```

### 1.2 MDX 콘텐츠 시스템

글은 DB가 아니라 **파일**입니다. 흐름은 다음과 같습니다.

1. `content/{category}/{slug}.mdx` 파일에 frontmatter(YAML) + 마크다운 본문을 작성합니다.
2. 목록 페이지는 `gray-matter`로 frontmatter만 빠르게 읽어(`getAllPostsMeta`) 카드 목록을 그립니다.
3. 상세 페이지는 `next-mdx-remote/rsc`의 `compileMDX`로 frontmatter + 본문 전체를 컴파일해
   React 서버 컴포넌트로 렌더링합니다(`compilePost`).
4. 빌드 시 `generateStaticParams`가 `content/` 폴더의 파일 목록을 읽어 모든 글을 정적 HTML로
   미리 생성합니다(SSG). 즉, **새 글을 추가하고 배포하면 자동으로 새 정적 페이지가 생깁니다** —
   코드를 건드릴 필요가 없습니다.

### 1.3 카테고리 구조

카테고리는 6개로 고정되어 있고, 모두 **Navy(`blue-950`) · White · Gray(`slate`)** 톤을
공유합니다. 경제 미디어 사이트 특유의 카테고리별 무지개 색상 구분 대신, 철도 설계도면처럼
단일 톤의 전문적인 인상을 주는 것이 디자인 원칙입니다.

| 카테고리   | 경로         | 성격                                          |
| ---------- | ------------ | ----------------------------------------------- |
| study      | `/study`     | 철도기술사 (topic 필터: 선형/궤도/노반/레일/분기기/침목/도상/교량/터널/전철/신호/유지보수) |
| terms      | `/terms`     | 철도용어 사전                                    |
| standard   | `/standard`  | 설계기준                                         |
| case       | `/case`      | 시공사례                                         |
| resource   | `/resource`  | 기술자료                                         |
| news       | `/news`      | 철도뉴스                                         |

카테고리를 가로지르는 "토픽 클러스터"(태그 기반 관련 글 연결) 개념은
[docs/internal-linking.md](./docs/internal-linking.md)에서 다룹니다.

### 1.4 SEO 구조

- **sitemap.xml / robots.txt**: `src/app/sitemap.ts`, `src/app/robots.ts`가 빌드마다 `content/`를
  다시 읽어 자동 생성. 손으로 관리하는 파일이 없습니다.
- **OpenGraph / Twitter 메타**: 모든 페이지에 `title`/`description`/`openGraph`/`twitter` 완비.
  글 상세 페이지의 OG 이미지는 `src/app/og/route.tsx`가 Navy 톤 + 제목을 넣어 요청마다
  실시간 생성합니다(한글 폰트는 Google Fonts에서 런타임에 로드).
- **구조화 데이터(JSON-LD)**: 글 상세 페이지에 `Article` + `BreadcrumbList`, 카테고리 허브
  페이지에 `CollectionPage`(+`ItemList`) + `BreadcrumbList`가 삽입됩니다.
- **검증 태그**: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` 환경변수를 설정하면 Search Console
  소유권 확인 meta 태그가 자동으로 삽입됩니다.
- **기본 메타**: 기본 타이틀은 `서기(현) | 철도기술 아카이브`, 설명은 `src/lib/site.ts`의
  `SITE.description`으로 관리합니다.

---

## 2. 운영 매뉴얼

### 2.1 새로운 글 추가 방법 (요약)

1. `content/{study|terms|standard|case|resource|news}/` 중 하나에 `새-글-슬러그.mdx` 파일을 만듭니다.
2. frontmatter에 `title`/`date`/`description`/`tags`를 채웁니다(`study`는 `topic`도 필수).
3. 본문을 마크다운으로 작성하고, `npm run dev`로 `/{category}/{슬러그}`에서 확인합니다.
4. 커밋 후 push하면 끝입니다. 정적 페이지 생성과 사이트맵 반영이 자동으로 따라옵니다.

> 전체 규칙(필수/선택 필드, 카테고리별 유의사항)과 글쓰기 템플릿은
> **[content/README.md](./content/README.md)**에 있습니다. 글을 쓸 때마다 이 문서를 펴놓고 쓰세요.

### 2.2 MDX 작성 규칙 (요약)

- 필수 필드: `title`, `date`(YYYY-MM-DD), `description`, `tags`
- `study` 카테고리는 `topic` 필수 (`RAIL_TOPICS` 슬러그와 정확히 일치)
- `summary`(2~4개 배열)를 넣으면 상세 페이지 상단에 "핵심 요약" 박스가 자동 생성됩니다
- `examPoints`(2~4개 배열)를 넣으면 "기술사 기출 포인트" 박스가 자동 생성됩니다 (`study` 권장)
- `study` 카테고리는 **정의 → 목적 → 원리 → 특징 → 장단점 → 설계기준 → 시공 시 주의사항 →
  유지관리** 9단계 구조를 본문 소제목으로 따르는 것을 권장합니다. 자세한 스키마 표와 템플릿은
  [content/README.md §2, §4](./content/README.md)를 참고하세요.

### 2.3 이미지 추가 방법 (요약)

1. 이미지 파일을 `public/images/posts/`에 넣습니다.
2. frontmatter에 `image: "/images/posts/파일명.jpg"`로 경로를 적습니다 (외부 URL도 가능).
3. 이미지를 넣지 않아도 회색 플레이스홀더가 자동으로 표시되므로, 이미지 없이 먼저 발행하고
   나중에 추가해도 됩니다.

> 권장 비율, 압축 방법 등 자세한 내용은 [content/README.md §6](./content/README.md#6-이미지썸네일-추가-방법)을 참고하세요.

### 2.4 카테고리 확장 방법

새 카테고리(예: `interview` — 현업 인터뷰)를 추가하려면, 콘텐츠만으로는 안 되고
**코드 수정이 필요**합니다. 아래 순서를 그대로 따르세요.

1. **콘텐츠 폴더 생성**: `content/interview/`를 만들고 샘플 `.mdx` 파일을 1개 넣습니다.
2. **타입 등록**: `src/lib/types.ts`의 `CATEGORIES` 배열에 `"interview"`를 추가합니다.
   ```ts
   export const CATEGORIES = ["news", "study", "case", "terms", "resource", "standard", "interview"] as const;
   ```
3. **라벨/컬러/내비게이션 등록**: `src/lib/site.ts`에서
   - `CATEGORY_LABELS`에 `interview: "현업 인터뷰"` 추가
   - `CATEGORY_THEME`에 `interview: NAVY_THEME` 추가 (모든 카테고리가 동일한 Navy 톤을
     공유하므로, 다른 카테고리처럼 `NAVY_THEME` 상수를 그대로 매핑하면 됩니다)
   - `NAV_ITEMS`에 `{ label: "현업 인터뷰", href: "/interview" }` 추가
4. **라우트 생성**: `src/app/interview/page.tsx`와 `src/app/interview/[slug]/page.tsx`를 만듭니다.
   기존 `src/app/case/page.tsx`, `src/app/case/[slug]/page.tsx`를 복사한 뒤
   `category="case"` → `category="interview"`, 관련 문자열만 바꾸면 됩니다.
5. **빌드 확인**: `npm run build`로 `/interview`, `/interview/{슬러그}`가 정상 생성되는지 확인합니다.
   `sitemap.ts`/`robots.ts`는 `CATEGORIES` 배열을 그대로 순회하므로 **추가 수정이 필요 없습니다**.

---

## 3. 배포 체크리스트

빠르게 훑는 체크리스트입니다. 각 단계의 화면별 상세 설명은
**[docs/deployment.md](./docs/deployment.md)**를 참고하세요.

- [ ] **GitHub push**
  ```bash
  git init && git add . && git commit -m "Initial commit"
  git branch -M main
  git remote add origin <저장소 URL>
  git push -u origin main
  ```
- [ ] **Vercel 배포**: [vercel.com](https://vercel.com)에서 저장소 Import → Framework Preset
  `Next.js` 자동 인식 → Deploy
- [ ] **환경변수 설정** (Vercel Project → Settings → Environment Variables, `.env.example` 참고)
  | 변수 | 값 |
  | --- | --- |
  | `NEXT_PUBLIC_SITE_URL` | 실제 배포 도메인 (`https://example.com`) |
  | `NEXT_PUBLIC_GA_ID` | GA4 측정 ID (`G-XXXXXXXXXX`) |
  | `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console HTML 태그의 `content` 값 |
- [ ] **도메인 연결**: Vercel Project → Settings → Domains에서 도메인 추가 → 안내된 DNS 레코드
  등록 → `NEXT_PUBLIC_SITE_URL` 갱신 후 Redeploy
- [ ] **Search Console 등록**: 속성 추가(URL 접두어) → HTML 태그 확인 → 위 환경변수에 값 입력 →
  Redeploy → 확인 → Sitemaps에 `sitemap.xml` 제출
- [ ] **GA4 설치**: 속성 생성 → 측정 ID 발급 → `NEXT_PUBLIC_GA_ID`에 입력 → Redeploy →
  실시간 리포트에서 방문 집계 확인

---

## 4. 유지보수 가이드 (요약)

글이 쌓일수록 아래 3가지를 순서대로 점검하세요. 전체 내용은
**[docs/maintenance.md](./docs/maintenance.md)**에 있습니다.

- **글 30~50개**: 카테고리 목록 페이지가 한 화면에 전부 나오는 구조라, 이 시점부터 페이지네이션을
  검토하세요.
- **글 100개**: `tags`가 자유 입력이라 비슷한 태그가 흩어지기 쉽습니다. 한 번 전체를 훑어
  동의어 태그를 통일하면 관련 글 추천 품질이 유지됩니다.
- **꾸준히**: `terms`/`standard`처럼 시간이 지나면 내용이 달라지는 글은 내용을 고칠 때 frontmatter
  `date`도 함께 갱신하세요(검색엔진에 "최신화됨" 신호를 줍니다). 글의 **슬러그(파일명)는 절대
  바꾸지 마세요** — 내부 링크와 검색엔진에 등록된 URL이 함께 깨집니다.

성능 관점에서는 이 사이트가 DB 없는 정적 생성 구조라 글 수백 개까지는 별다른 튜닝이 필요
없습니다. 이미지가 많아지는 시점의 최적화 방향은 [docs/maintenance.md §2](./docs/maintenance.md)를 참고하세요.

---

## 부록: AI 질의응답 기능 현황

`/ai-qna` 페이지는 현재 **UI 목업만 구현된 준비중 플레이스홀더**입니다. 실제 LLM 백엔드
연동(질문 입력 → AI 응답)은 되어 있지 않습니다. 나중에 실제로 연동하려면:

1. API 라우트(`src/app/api/ai-qna/route.ts` 등)를 새로 만들어 원하는 LLM 제공자의 API를 호출합니다.
2. `src/app/ai-qna/page.tsx`의 입력창(`disabled` 상태)을 클라이언트 컴포넌트로 바꿔 실제
   입력·전송 로직을 연결합니다.
3. API 키 발급, 비용 정책, 응답 컨텍스트로 사용할 콘텐츠 범위(예: `content/study/**`만 참고)를
   먼저 정한 뒤 구현하는 것을 권장합니다.
