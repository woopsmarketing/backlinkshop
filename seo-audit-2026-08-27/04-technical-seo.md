# 기술 SEO — robots / sitemap / 정규화 / 성능

**조사일: 2026-08-27** · 출처: `[실측]` curl (Googlebot UA), `[소스]` 커밋 `f773f8d`

---

## 4-1. robots.txt — 🔴 **404 (부재)**

```
GET https://www.backlinkshop.co.kr/robots.txt  →  404
```

`[소스]` 확인 결과 `app/robots.ts`도 `public/robots.txt`도 **존재하지 않습니다**. Next.js는 둘 중 하나가 없으면 robots.txt를 생성하지 않습니다.

### 경쟁사 대비 `[실측]`

| 도메인                 | `/robots.txt` |
| ---------------------- | ------------- |
| **backlinkshop.co.kr** | 🔴 **404**    |
| linkauthority.kr       | ✅ 200        |
| backlinkpro.kr         | ✅ 200        |
| backlinkhigh.shop      | ✅ 200        |
| greenbacklink.co.kr    | ✅ 200        |
| subbot.kr              | ✅ 200        |
| serporum.com           | ✅ 200        |
| nodelix.kr             | ✅ 200        |
| wari.kr                | ✅ 200        |
| indeedseo.com          | ✅ 200        |

**조사한 경쟁사 9곳 전부 robots.txt가 있고, backlinkshop만 없습니다.**

### 영향

robots.txt 부재 자체가 색인을 막지는 않습니다(없으면 "전부 허용"으로 간주). 실제 손실은 다음입니다.

| #   | 손실                       | 설명                                                                                                                                            |
| --- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Sitemap 자동 발견 불가** | `Sitemap:` 지시문이 없어 크롤러가 사이트맵을 스스로 찾지 못함. GSC 수동 제출에만 의존                                                           |
| 2   | **크롤 예산 낭비**         | `/api/*`(11개 라우트), `/admin/*`, `/analyze/[domain]`(무한 URL 공간), `/products/category/{임의값}`(전부 307)을 차단할 수단이 없음             |
| 3   | **AI 크롤러 제어 불가**    | GPTBot·ClaudeBot·PerplexityBot 등의 접근 정책을 명시할 수 없음. `/lp/ai` 페이지에서 GEO(생성형 AI 노출)를 상품으로 파는 사업이므로 **자기모순** |
| 4   | **내부 페이지 노출**       | `/email-preview`가 `/admin/emails/test` 링크를 공개 노출 중                                                                                     |

### 권장 robots.txt

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard
Disallow: /credits
Disallow: /orders
Disallow: /analyze/
Disallow: /lp/
Disallow: /email-preview
Disallow: /login

Sitemap: https://www.backlinkshop.co.kr/sitemap.xml
```

> Next.js App Router에서는 `app/robots.ts`로 생성하는 것이 권장됩니다.

---

## 4-2. sitemap.xml — 🔴 **6개 중 5개가 리다이렉트**

```
GET https://www.backlinkshop.co.kr/sitemap.xml  →  200  (application/xml)
GET https://www.backlinkshop.co.kr/sitemap_index.xml  →  404  (사이트 규모상 정상)
```

`[실측]` 사이트맵에 포함된 전체 URL과 실제 응답:

| #   | `<loc>`                          | priority | 실제 응답 | 최종 URL | 판정 |
| --- | -------------------------------- | -------: | --------- | -------- | ---- |
| 1   | `https://www.backlinkshop.co.kr` |      1.0 | **200**   | —        | ✅   |
| 2   | `.../products`                   |      0.9 | **307**   | `/login` | 🔴   |
| 3   | `.../products/category/plan`     |      0.8 | **307**   | `/login` | 🔴   |
| 4   | `.../products/category/pbn`      |      0.8 | **307**   | `/login` | 🔴   |
| 5   | `.../products/category/seo`      |      0.8 | **307**   | `/login` | 🔴   |
| 6   | `.../products/category/content`  |      0.7 | **307**   | `/login` | 🔴   |

**사이트맵 URL의 83%(5/6)가 색인 불가 리다이렉트입니다.**

### Sitemap URL vs 실제 Indexable URL의 차이

| 구분                          | URL                                                                |
| ----------------------------- | ------------------------------------------------------------------ |
| 사이트맵에 있으나 색인 불가   | `/products`, `/products/category/{plan,pbn,seo,content}` — **5개** |
| 색인 가능하나 사이트맵에 없음 | `/services`, `/pricing`, `/faq`, `/cases` — **4개**                |
| 양쪽 다 정상                  | `/` — **1개**                                                      |

**정확히 반대로 되어 있습니다.** 색인 가능한 4개는 빠져 있고, 색인 불가한 5개가 들어 있습니다.

### 추가 문제

| 항목          | 값                                         | 평가                                                                                                                     |
| ------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `lastmod`     | `2026-06-22T02:28:12.731Z` (전체 URL 동일) | ⚠️ `[소스]` `app/sitemap.ts`가 `new Date()`를 쓰므로 **빌드 시각**이 찍힘. 실제 콘텐츠 수정일이 아니어서 신호로서 무의미 |
| `changefreq`  | `daily` / `weekly`                         | ⚠️ Google은 이 값을 무시한다고 공식 문서에 명시. 무해하나 의미 없음                                                      |
| `priority`    | 0.7~1.0                                    | ⚠️ Google 무시. 무해                                                                                                     |
| 누락 카테고리 | `domain`, `hosting`                        | `[소스]` `lib/product-categories.ts`에 정의됐으나 사이트맵 미등록                                                        |

---

## 4-3. 도메인 · 프로토콜 정규화 `[실측]` — ✅ 대체로 양호

| 요청 URL                          | 응답    | 최종                              |
| --------------------------------- | ------- | --------------------------------- |
| `http://backlinkshop.co.kr/`      | **308** | `https://backlinkshop.co.kr/`     |
| `https://backlinkshop.co.kr/`     | **307** | `https://www.backlinkshop.co.kr/` |
| `http://www.backlinkshop.co.kr/`  | **308** | `https://www.backlinkshop.co.kr/` |
| `https://www.backlinkshop.co.kr/` | **200** | — ✅ 정본                         |

**정본 도메인: `https://www.backlinkshop.co.kr` ✅** — http→https, non-www→www 모두 정상 리다이렉트됩니다.

⚠️ **개선 여지 1건**: non-www → www 리다이렉트가 **307(임시)** 입니다. 도메인 정규화는 영구 이전이므로 **308 또는 301(영구)** 이 적절합니다. 307은 Google에게 "이건 임시니까 원래 URL을 계속 확인하라"는 신호를 줍니다. Vercel 도메인 설정에서 Permanent Redirect로 변경 가능합니다. (우선순위: Low — Google이 반복 관찰로 정본을 학습하므로 실질 피해는 작음)

### Trailing slash `[실측]` — ✅ 정상

| 요청         | 응답    | 최종        |
| ------------ | ------- | ----------- |
| `/faq`       | 200     | —           |
| `/faq/`      | **308** | `/faq`      |
| `/services/` | **308** | `/services` |

**정책: trailing slash 없음(no-slash)으로 통일** ✅ Next.js 기본 동작이며 일관됩니다.

### HSTS

```
strict-transport-security: max-age=63072000
```

✅ 2년 HSTS 적용됨.

---

## 4-4. 🔴🔴 Canonical — 최대 결함

**모든 페이지가 홈페이지를 canonical로 지정하고 있습니다.**

`[실측]` 각 페이지의 `<link rel="canonical">` 실측값:

| URL              | 실제 canonical                   |        자기참조?         |
| ---------------- | -------------------------------- | :----------------------: |
| `/`              | `https://www.backlinkshop.co.kr` |            ✅            |
| `/services`      | `https://www.backlinkshop.co.kr` |            🔴            |
| `/pricing`       | `https://www.backlinkshop.co.kr` |            🔴            |
| `/faq`           | `https://www.backlinkshop.co.kr` |            🔴            |
| `/cases`         | `https://www.backlinkshop.co.kr` |            🔴            |
| `/login`         | `https://www.backlinkshop.co.kr` |            🔴            |
| `/email-preview` | `https://www.backlinkshop.co.kr` |            🔴            |
| `/lp/seo`        | `https://www.backlinkshop.co.kr` | 🔴 (noindex라 영향 없음) |
| `/lp/backlink`   | `https://www.backlinkshop.co.kr` | 🔴 (noindex라 영향 없음) |

### 원인 `[소스]`

`app/layout.tsx:37-39`

```ts
export const metadata: Metadata = {
  // ...
  alternates: {
    canonical: 'https://www.backlinkshop.co.kr',   // ← 하드코딩된 절대 URL
  },
```

Next.js App Router의 메타데이터는 **부모 세그먼트에서 자식으로 상속**됩니다. 자식 페이지가 `alternates`를 재정의하지 않으면 루트 레이아웃 값이 그대로 내려갑니다. `/services`, `/pricing`, `/faq`, `/cases`의 `metadata` export를 확인한 결과 **`title`과 `description`만 정의하고 `alternates`는 정의하지 않았습니다** → 전부 홈페이지 canonical을 상속.

### 영향

Canonical은 Google에게 보내는 **가장 강한 중복 신호**입니다. `/services`가 "나의 정본은 홈페이지다"라고 선언하면 Google은:

1. `/services`를 색인에서 제외 (GSC: **"대체 페이지(적절한 표준 태그 있음)"**)
2. `/services`가 받은 링크 가치를 홈페이지로 이전
3. `/services`의 고유 콘텐츠(SEO 서비스 소개)를 **평가 대상에서 제외**

`/services`, `/pricing`, `/faq`, `/cases`는 이미 사이트맵에도 없고 홈에서 링크도 없는데, **canonical까지 홈을 가리켜 3중으로 무력화**되어 있습니다.

### 수정 방법

각 페이지에 자기참조 canonical을 추가하거나, 루트 레이아웃에 `metadataBase`를 설정하고 페이지별 상대 canonical을 지정합니다.

```ts
// app/layout.tsx — 루트에서는 canonical 하드코딩 제거
export const metadata: Metadata = {
  metadataBase: new URL('https://www.backlinkshop.co.kr'),
  alternates: { canonical: '/' },
  // ...
}

// app/services/page.tsx — 각 페이지에서 자기참조
export const metadata = {
  title: 'SEO 서비스 소개 | 백링크샵',
  description: '...',
  alternates: { canonical: '/services' },
}
```

**이 한 가지 수정만으로 색인 가능 페이지가 1개 → 5개가 됩니다.** 우선순위 Critical.

---

## 4-5. 색인 제어 (meta robots) `[실측]`

| URL                                    | meta robots                     | 적정성                         |
| -------------------------------------- | ------------------------------- | ------------------------------ |
| `/`                                    | `index, follow`                 | ✅                             |
| `/services` `/pricing` `/faq` `/cases` | `index, follow`                 | ✅ (canonical만 고치면 됨)     |
| `/login`                               | 🔴 `index, follow`              | **`noindex` 필요**             |
| `/email-preview`                       | 🔴 `index, follow`              | **`noindex` + 접근 차단 필요** |
| `/lp/*` (7개)                          | ✅ `noindex, nofollow`          | ✅ 의도적 — 올바름             |
| `/analyze/[domain]`                    | ✅ `noindex, nofollow, nocache` | ✅ 의도적 — 올바름             |

`X-Robots-Tag` 응답 헤더는 사용되지 않습니다 `[실측]`.

### Google 사이트 소유 확인 ✅

`[소스]` `app/layout.tsx` — `verification.google: 'j32wzFaswXxA6-7Fh5R-J8V2o7xQ4b-eb0-u37ywSYg'`

**Google Search Console에 사이트가 등록되어 있습니다.** 즉 [09-search-console.md](09-search-console.md)에서 "데이터 필요"로 표시한 항목들은 **소유자가 GSC에 로그인하면 바로 확보 가능**합니다.

---

## 4-6. Canonical 오류 · Soft 404 · 404 점검

| 점검 항목                   | 결과                                                                                                                     |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Canonical 오류              | 🔴 **6개 페이지**에서 잘못된 canonical (4-4 참조)                                                                        |
| 잘못된 Redirect URL         | 🔴 사이트맵 내 **5개** URL이 307 리다이렉트                                                                              |
| 404 URL                     | `/robots.txt`, `/signup`, `/terms`, `/privacy`, `/refund`, `/blog`, `/sitemap_index.xml`                                 |
| Soft 404                    | ⚠️ **`/login`이 사실상 soft 404 역할** — 사이트맵 URL 5개가 전부 여기 착지하는데 본문 55자·헤딩 0개·링크 0개             |
| 존재하지 않는 카테고리 처리 | 🔴 `/products/category/{임의값}` → **307**(정상은 404). 미들웨어가 라우트보다 먼저 실행되어 `notFound()`에 도달하지 못함 |
| 존재하지 않는 LP 처리       | ✅ `/lp/nonexistent` → **404** 정상                                                                                      |

---

## 4-7. 성능 · Core Web Vitals

### ⚠️ Lighthouse / CWV 점수 — **확인 불가**

PageSpeed Insights API 호출이 **일일 쿼터 초과**로 실패했습니다.

```
Quota exceeded for quota metric 'Queries' and limit 'Queries per day'
of service 'pagespeedonline.googleapis.com'
```

따라서 프롬프트가 요구한 다음 항목은 **확인 불가**입니다.

- Lighthouse Performance / Accessibility / SEO / Best Practices 점수 (Mobile·Desktop)
- LCP, INP, CLS 실측값
- CrUX 실사용자 데이터

**확보 방법**: https://pagespeed.web.dev 에서 URL 직접 입력(웹 UI는 별도 쿼터), 또는 GSC의 Core Web Vitals 보고서.

### ✅ 직접 측정 가능한 지표 `[실측]`

| 지표                  | 값                                             | 평가                                |
| --------------------- | ---------------------------------------------- | ----------------------------------- |
| **TTFB (홈)**         | **90ms**                                       | ✅ 매우 우수                        |
| TTFB (`/services`)    | 83ms                                           | ✅                                  |
| TTFB (`/faq`)         | 85ms                                           | ✅                                  |
| TTFB (`/lp/seo`)      | 77ms                                           | ✅                                  |
| 전체 응답시간 (홈)    | 113ms                                          | ✅                                  |
| HTML 크기 (홈)        | 130 KB                                         | ⚠️ 다소 큼 (권장 <100KB)            |
| HTML 크기 (`/lp/seo`) | 146 KB                                         | ⚠️                                  |
| DOM 요소 수 (홈)      | 624                                            | ✅ 우수 (Lighthouse 경고 기준 800+) |
| `<script>` 태그       | 44개 (외부 src 11개)                           | ⚠️ 확인 필요                        |
| stylesheet            | 1개                                            | ✅                                  |
| `<img>` 태그          | **0개**                                        | ✅ 이미지 로딩 병목 없음            |
| preload/preconnect    | 2개                                            | ✅ 사용 중                          |
| 엣지 캐시             | `x-vercel-cache: HIT`, `x-nextjs-prerender: 1` | ✅ 정적 프리렌더 + 엣지 캐시        |

### 렌더링 방식 `[소스]`

| 페이지                                         | 렌더링               | SEO 관점                           |
| ---------------------------------------------- | -------------------- | ---------------------------------- |
| `/`, `/services`, `/pricing`, `/faq`, `/cases` | `force-static` (SSG) | ✅ 최적 — JS 없이 완전한 HTML 제공 |
| `/lp/[keyword]`                                | `force-dynamic`      | ⚠️ noindex라 무관                  |
| `/analyze/[domain]`                            | `force-dynamic`      | ⚠️ noindex라 무관                  |
| `/products/*`                                  | 서버 컴포넌트 (동적) | 🔴 어차피 로그인 차단              |

**JS 렌더링 문제: 없음 ✅** — 색인 대상 페이지가 전부 SSG라 Googlebot이 JS 실행 없이 전체 콘텐츠를 받습니다. `[실측]`으로 curl 응답 HTML에서 본문·헤딩·JSON-LD가 모두 확인되었습니다.

### 이미지 최적화

| 항목                    | 상태                                                         |
| ----------------------- | ------------------------------------------------------------ |
| 페이지 내 `<img>`       | **0개** — 최적화 이슈 없음 ✅                                |
| `next.config.mjs`       | `formats: ['image/avif','image/webp']` ✅ 설정됨             |
| `public/logo.png`       | 🔴 **285 KB** — favicon(`icons.icon`)이자 og:image로 사용 중 |
| `public/campaign-1.png` | ⚠️ 761 KB (페이지에서 미사용)                                |
| `public/campaign-2.png` | ⚠️ 927 KB (페이지에서 미사용)                                |

**개선 1건**: 285KB PNG를 favicon으로 쓰는 것은 비효율적입니다. favicon용 32×32 ICO/PNG(수 KB)와 og:image용 1200×630 이미지를 분리하는 것이 좋습니다. 우선순위 Low.

### 폰트 로딩

`[소스]` `next/font` 미사용, `app/globals.css`에서 처리. 시스템 폰트 스택을 쓰는 것으로 보이며 웹폰트 로딩 병목은 관찰되지 않았습니다 (stylesheet 1개, preload 2개).

---

## 4-8. HTML Semantic 구조 / 헤딩 계층 `[실측]`

| 페이지           |    H1 |  H2 |  H3 | 계층 정상 | 비고                                              |
| ---------------- | ----: | --: | --: | :-------: | ------------------------------------------------- |
| `/`              |     1 |   9 |  41 |    ✅     | `<main>`, `<nav>`, `<header>`, `<footer>` 사용 ✅ |
| `/services`      |     1 |   6 |   0 |    ✅     |                                                   |
| `/pricing`       |     1 |   2 |   3 |    ✅     |                                                   |
| `/faq`           |     1 |   1 |   6 |    ✅     |                                                   |
| `/cases`         |     1 |   1 |   0 |    ⚠️     | 사례 5건이 헤딩 없이 나열 — H3 부여 권장          |
| `/login`         | **0** |   0 |   0 |    🔴     | H1 없음                                           |
| `/email-preview` | **2** |   1 |   2 |    🔴     | **H1 중복**                                       |

시맨틱 태그: `<main>` ✅, `<nav>` ✅(1개, `aria-label="메인 네비게이션"` 포함), `<header>` ✅, `<footer>` ✅, `lang="ko"` ✅, `viewport` ✅.

전반적으로 시맨틱 마크업은 양호합니다. `/cases`의 헤딩 부재와 `/email-preview`의 H1 중복만 수정하면 됩니다.

---

## 4-9. 모바일 반응형

`[소스]` Tailwind CSS 기반, 전 페이지에 `md:`, `lg:` breakpoint 사용 확인. `viewport` 메타태그 존재 ✅.

⚠️ 실기기/에뮬레이터 검증은 수행하지 못했습니다. **Lighthouse Mobile 점수와 함께 확인 필요** (4-7 참조).

---

## 4-10. 기술 SEO 개선 항목 — Critical / High / Medium / Low

| 심각도          | 항목                                          | 현재                               | 조치                                                  |
| --------------- | --------------------------------------------- | ---------------------------------- | ----------------------------------------------------- |
| 🔴 **Critical** | 전 페이지 canonical이 홈 지정                 | 6개 페이지 무력화                  | 루트 `alternates.canonical` 제거 + 페이지별 자기참조  |
| 🔴 **Critical** | `/products/*` 로그인 리다이렉트               | 사이트맵 5개 URL 색인 불가         | `middleware.ts` `protectedPaths`에서 `/products` 제거 |
| 🔴 **Critical** | `robots.txt` 404                              | 사이트맵 자동 발견 불가            | `app/robots.ts` 신설                                  |
| 🔴 **Critical** | 사이트맵 내용 오류                            | 색인 가능 4개 누락 / 불가 5개 포함 | `app/sitemap.ts` 재작성                               |
| 🟠 **High**     | `/login` 색인 허용 + 홈 title 중복            | 중복 콘텐츠                        | `noindex` 적용                                        |
| 🟠 **High**     | `/email-preview` 공개 + 색인 허용             | 내부 페이지 노출                   | `noindex` + 인증 게이팅                               |
| 🟠 **High**     | 정책 페이지 3종 부재                          | E-E-A-T · 법적 리스크              | `/terms` `/privacy` `/refund` 신설                    |
| 🟠 **High**     | `/signup` 404 (Google Ads 대상)               | 광고 예산 낭비                     | 라우트 신설 또는 광고 URL 변경                        |
| 🟡 **Medium**   | Title/Description 표시 한계 초과              | 48자 / 117자                       | 30자 / 80자 이내로 축약                               |
| 🟡 **Medium**   | `WebSite.SearchAction`이 없는 기능 지정       | 스키마 오류                        | `potentialAction` 제거                                |
| 🟡 **Medium**   | `Offer`에 가격 없음                           | 리치 결과 손실                     | `price`/`priceCurrency` 추가                          |
| 🟡 **Medium**   | `/products/category/{임의값}` → 307           | 무한 URL 공간                      | 미들웨어 매처 정교화 또는 404 우선 처리               |
| 🟡 **Medium**   | `sitemap.lastmod`가 빌드 시각                 | 신호 무의미                        | 실제 수정일 사용                                      |
| 🟡 **Medium**   | `/cases` 헤딩 부재 / `/email-preview` H1 중복 | 헤딩 계층                          | H3 부여 / H1 단일화                                   |
| 🔵 **Low**      | non-www → www가 307(임시)                     | 약한 정규화 신호                   | 308/301로 변경                                        |
| 🔵 **Low**      | `<br>` 단어 병합 (`위한고품질`)               | 토큰화 위험                        | CSS 줄바꿈으로 대체                                   |
| 🔵 **Low**      | `logo.png` 285KB를 favicon으로 사용           | 불필요한 전송                      | favicon/og 이미지 분리                                |
| 🔵 **Low**      | `campaign-1/2.png` 1.7MB 미사용               | 저장소 낭비                        | 제거 또는 압축                                        |
| 🔵 **Low**      | `Organization`에 사업자정보·`sameAs` 없음     | 신뢰 신호 부족                     | 주소·SNS 추가                                         |

> Lighthouse/CWV 점수 기반 항목은 **데이터 확보 후 재평가 필요** (4-7 참조).
