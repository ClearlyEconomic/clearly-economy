# 배포 가이드

서기(현)를 실제 인터넷에 띄우고, 검색엔진에 등록하고, 방문자 데이터를 수집하기까지의
전체 과정입니다. 순서대로 진행하세요.

## 1. Vercel 배포

1. [vercel.com](https://vercel.com)에 가입하고, GitHub 계정을 연동합니다.
2. 이 프로젝트를 GitHub 저장소로 push합니다 (아직 안 했다면):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <본인 GitHub 저장소 URL>
   git push -u origin main
   ```
3. Vercel 대시보드에서 **Add New → Project**를 클릭하고, 방금 push한 저장소를 선택합니다.
4. Framework Preset은 **Next.js**가 자동으로 감지됩니다. 빌드 설정은 변경할 필요 없습니다
   (`next build`가 기본값).
5. **Environment Variables** 단계에서 아래 값을 입력합니다 (`.env.example` 참고):
   - `NEXT_PUBLIC_SITE_URL` → 아직 도메인이 없다면 일단 비워두고, 배포 후 Vercel이 주는
     `https://프로젝트명.vercel.app` 주소로 채워도 됩니다. 도메인 연결 후에는 3단계에서 반드시
     실제 도메인으로 갱신하세요.
   - `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` → 3~4단계에서 발급받은 뒤 채웁니다.
     지금은 비워둬도 됩니다.
6. **Deploy**를 클릭합니다. 2~3분 내에 배포가 끝나고 `*.vercel.app` 주소가 발급됩니다.
7. 이후 `main` 브랜치에 push할 때마다 자동으로 재배포됩니다(별도 설정 불필요).

## 2. 도메인 연결

1. 도메인이 없다면 가비아, Cloudflare Registrar 등에서 원하는 도메인을 구매합니다.
2. Vercel 프로젝트 → **Settings → Domains**에서 도메인을 입력하고 추가합니다.
3. Vercel이 안내하는 DNS 레코드(A 또는 CNAME)를 도메인 구입처의 DNS 설정에 등록합니다.
   - 루트 도메인(`example.com`): `A` 레코드를 Vercel이 안내하는 IP로 설정
   - `www` 서브도메인: `CNAME` 레코드를 `cname.vercel-dns.com`으로 설정
   - 반영까지 최대 몇 시간 걸릴 수 있습니다 (보통 몇 분~수십 분).
4. 도메인이 연결되면 Vercel 프로젝트의 **Environment Variables**에서
   `NEXT_PUBLIC_SITE_URL`을 실제 도메인(`https://example.com`)으로 설정하고 **Redeploy**합니다.
   - 이 값은 `sitemap.xml`, `robots.txt`, OpenGraph 이미지 URL 생성에 전부 사용되므로
     실제 도메인과 다르면 검색엔진에 잘못된 URL이 등록됩니다. 반드시 갱신 후 재배포하세요.

## 3. Google Search Console 등록

1. [Google Search Console](https://search.google.com/search-console)에 접속해 로그인합니다.
2. **속성 추가 → URL 접두어** 방식으로 실제 도메인(`https://example.com`)을 입력합니다.
   (도메인 전체 방식은 DNS 인증이 필요해 더 복잡하므로, URL 접두어 + HTML 태그 방식을 권장합니다.)
3. 소유권 확인 방법 중 **HTML 태그**를 선택하면 아래와 같은 태그를 보여줍니다.
   ```html
   <meta name="google-site-verification" content="이 부분의 값" />
   ```
4. `content="..."` 안의 값만 복사해서, Vercel 프로젝트의 환경변수
   `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`에 붙여넣고 Redeploy합니다.
   (이 값은 `src/app/layout.tsx`의 `metadata.verification.google`로 자동 삽입됩니다.)
5. 재배포가 끝나면 Search Console로 돌아가 **확인** 버튼을 클릭합니다.
6. 확인이 끝나면 좌측 메뉴 **Sitemaps**에서 `sitemap.xml`을 제출합니다.
   (전체 주소가 아니라 `sitemap.xml`만 입력하면 됩니다. 이 사이트는 `/sitemap.xml`이
   빌드 시 자동 생성되므로 별도 파일을 만들 필요가 없습니다.)
7. 이후 **URL 검사** 도구로 주요 페이지(`/`, `/study`, `/terms` 등)의 색인 생성을 요청하면
   초기 노출 속도를 높일 수 있습니다.

## 4. Google Analytics(GA4) 설치

1. [Google Analytics](https://analytics.google.com)에 접속해 계정을 만듭니다.
2. **속성 만들기**로 새 GA4 속성을 생성하고, 웹 스트림으로 방금 연결한 도메인을 등록합니다.
3. 스트림 설정 화면에서 **측정 ID**(`G-XXXXXXXXXX` 형식)를 복사합니다.
4. Vercel 프로젝트 환경변수 `NEXT_PUBLIC_GA_ID`에 이 값을 붙여넣고 Redeploy합니다.
   - 이 값이 설정되면 `src/app/layout.tsx`가 `GoogleAnalytics` 컴포넌트를 자동으로 렌더링해
     `gtag.js` 스크립트를 모든 페이지에 삽입합니다. 코드를 추가로 수정할 필요는 없습니다.
5. 배포된 실제 사이트에 접속해 페이지를 몇 번 이동한 뒤, GA4 대시보드의
   **보고서 → 실시간**에서 방문이 집계되는지 확인합니다 (반영까지 1~2분 소요될 수 있습니다).

## 5. 로컬 개발 환경 설정

로컬에서 프로덕션과 동일한 환경변수를 쓰려면 프로젝트 루트에 `.env.local` 파일을 만들고
`.env.example`의 값을 채워 넣습니다 (`.env.local`은 git에 커밋되지 않습니다).

```bash
cp .env.example .env.local
```

로컬 개발 중에는 `NEXT_PUBLIC_GA_ID`를 비워두는 것을 권장합니다. 그래야 개발 중 발생하는
트래픽이 실제 Analytics 데이터에 섞이지 않습니다.

## 6. 배포 후 체크리스트

- [ ] `NEXT_PUBLIC_SITE_URL`이 실제 도메인과 정확히 일치하는가 (`https://`, `www` 유무 포함)
- [ ] `https://your-domain.com/sitemap.xml` 접속 시 전체 글 목록이 보이는가
- [ ] `https://your-domain.com/robots.txt`에 `Sitemap:` 라인이 실제 도메인으로 나오는가
- [ ] Search Console에 사이트맵이 제출되어 있는가
- [ ] GA4 실시간 보고서에 방문이 집계되는가
- [ ] 카카오톡/슬랙 등에 글 링크를 붙여넣었을 때 OG 이미지·제목·설명이 정상적으로 보이는가
      (안 보이면 [OpenGraph 디버거](https://developers.facebook.com/tools/debug/)로 캐시를 새로고침)
