# backlinkshop.co.kr 전면 리뉴얼 — 작업 결과 보고

**작업일 2026-08-27** (후속 수정 · 배포 2026-08-28) · 기준 커밋 `f773f8d` · 근거 자료 [seo-audit-2026-08-27/](seo-audit-2026-08-27/)

**배포 완료** — 리뉴얼 `4a6a904` · 병합 `1c439d5` → `origin/main` push · Vercel Production 반영 확인

리뉴얼 전 사이트의 병목은 콘텐츠 경쟁력이 아니라 **사이트 구조**였습니다. 색인 가능한 실질 페이지가 홈 1개뿐이었고, 존재하던 4개 정적 페이지는 canonical·사이트맵·내부링크 3중으로 차단되어 있었습니다. 이번 작업은 그 구조를 해체하고 의도별 랜딩 17개 + 아티클 5편으로 재구성한 것입니다.

> **2026-08-28 후속 수정** — 배포 직전 점검에서 `/backlink` 와 `/blog/what-is-backlink` 의 검색 의도가 겹쳐(cannibalization) 글을 필러 페이지로 합쳤습니다. `/signup` 리다이렉트 목적지도 `/login` 에서 홈으로 바꿨습니다. 상세는 각 절에 반영되어 있습니다.

## 검증 결과

| 항목                      | 결과                                       |
| ------------------------- | ------------------------------------------ |
| `next build`              | 통과 (오류 0)                              |
| `tsc --noEmit`            | 통과 (오류 0)                              |
| `next lint`               | 신규 코드 경고 0 (기존 파일 경고 1건 유지) |
| `vitest run`              | 132/132 통과                               |
| `node scripts/seo-qa.mjs` | 실패 0 · 경고 1 (21개 페이지 전수)         |
| 브라우저 콘솔 에러        | 데스크톱·모바일 10개 페이지 0건            |
| 모바일 가로 오버플로      | 0건 (390px 뷰포트)                         |

색인 가능 페이지 **1개 → 21개**.

### 배포 (2026-08-28)

리뉴얼 작업 중 `origin/main` 에 8개 커밋(텔레그램 중계 · 프로모션 스크립트 · 챗봇 GA4 이벤트)이 먼저 올라와 있었습니다. **force push 와 history rewrite 없이 merge 로 통합**했습니다.

| 항목        | 값                                                      |
| ----------- | ------------------------------------------------------- |
| 리뉴얼 커밋 | `4a6a904` feat: launch SEO-focused backlinkshop renewal |
| 병합 커밋   | `1c439d5` merge: origin/main 통합                       |
| 원격        | `origin` (woopsmarketing/backlinkshop) · branch `main`  |
| 배포        | Vercel 자동 배포 · Production 반영 확인 완료            |

충돌 2건은 다음과 같이 해소했습니다.

- **`lib/gtag.ts`** — 양쪽이 모두 파일 끝에 함수를 추가해 충돌했습니다. **둘 다 남겼습니다.** `trackTelegramCtaClick`(리뉴얼)과 `trackChatWidgetOpen`·`trackChatMessageSent`(원격)이 공존하며, `telegram_click` 이벤트 이름은 바뀌지 않았습니다.
- **`general.md`** — 작업 지시 메모 파일입니다. 원격 버전은 이전 메모이고 로컬이 현재 지시문이라 로컬을 택했습니다.

**Production 실측** (전부 `curl` 확인)

| 검사                                            | 결과                              |
| ----------------------------------------------- | --------------------------------- |
| 공개 페이지 18종 + `robots.txt` + `sitemap.xml` | 전부 200                          |
| `/blog/what-is-backlink` → `/backlink`          | 301 · 1홉                         |
| `/signup` → `/`                                 | 301 · 1홉                         |
| `/products*` → `/services*`                     | 301 · 1홉                         |
| 존재하지 않는 URL                               | 404                               |
| 사이트맵                                        | 21개 URL · `what-is-backlink` 0건 |
| GA4 `G-J142ZFLQX4` · GSC verification           | 홈에서 정상 로드                  |
| 홈 canonical · title · H1                       | 의도한 값 그대로                  |

`vercel-repo` 라는 두 번째 원격이 등록되어 있으나 `a41924d` 에 머물러 있는 오래된 미러이고 `origin/main` 의 조상입니다. 지시대로 `origin` 에만 push 했습니다.

---

## 1. 생성한 URL

전부 `force-static` 정적 생성 · self canonical · 고유 title/description/H1.

### Tier A — 내부링크가 집중되는 페이지

| URL                      | Primary keyword                          |    본문 |
| ------------------------ | ---------------------------------------- | ------: |
| `/`                      | 백링크 구매 · 고품질 백링크 · PBN 백링크 | 5,174자 |
| `/backlink`              | 백링크 (Pillar)                          | 9,710자 |
| `/backlink-agency`       | 백링크 업체                              | 7,627자 |
| `/pricing`               | 백링크 가격                              | 5,955자 |
| `/services/pbn-backlink` | PBN 백링크                               | 7,872자 |
| `/google-ranking`        | 구글 상위노출                            | 5,985자 |

### Tier B

| URL         | 역할                         |    본문 |
| ----------- | ---------------------------- | ------: |
| `/services` | 서비스 허브                  | 4,955자 |
| `/cases`    | 사례 공개 기준               | 4,741자 |
| `/faq`      | FAQ 전체 (6 카테고리 13문항) | 5,115자 |
| `/blog`     | 콘텐츠 허브                  | 3,844자 |

### Tier C

| URL                       | Primary keyword |    본문 |
| ------------------------- | --------------- | ------: |
| `/services/plan-backlink` | 플랜 백링크     | 5,713자 |
| `/services/onpage-seo`    | 온페이지 SEO    | 5,474자 |
| `/services/content-seo`   | 콘텐츠 SEO      | 4,962자 |

### 정책 3종 (신규 · 이전에는 전부 404)

`/terms` · `/privacy` · `/refund`

### 블로그 아티클 5편

| URL                                    | 타깃                     | 섹션 |
| -------------------------------------- | ------------------------ | ---: |
| `/blog/backlink-price-guide`           | 백링크 가격              |    9 |
| `/blog/how-to-choose-backlink-agency`  | 백링크 업체              |   10 |
| `/blog/what-is-pbn-backlink`           | PBN 백링크               |   10 |
| `/blog/high-quality-backlink-criteria` | 고품질 백링크 (Featured) |    9 |
| `/blog/link-building-guide`            | 링크빌딩                 |   10 |

`/blog/what-is-backlink` 는 `/backlink` 와 같은 검색 의도(`백링크`)를 놓고 경쟁했기 때문에 필러 페이지로 흡수했습니다. 글에만 있던 세 가지 — 백링크·내부링크·아웃바운드 링크의 방향 구분, dofollow 가 표준 속성값이 아니라는 점과 견적에서 확인할 항목, 직접 진행과 위탁을 가르는 판단 기준 — 을 `/backlink` 에 새 섹션으로 옮겼습니다(섹션 10 → 12개). 나머지 중복 문장은 옮기지 않았습니다.

각 글의 시작가 표기는 `config/pricing.ts` 의 `startingPrice()` 로 계산합니다. 본문에 금액을 적어두면 가격을 고쳐도 글이 남아 `/pricing` 과 어긋나기 때문입니다.

### 기타

`/robots.txt` (신규 · 이전 404) · `/sitemap.xml` (재작성) · `/not-found` (브랜드 404)

---

## 2. 삭제 / 비노출 처리한 기존 기능

### 삭제한 파일

| 파일                                                                      | 사유                                                                    |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `app/page.tsx` · `app/services` · `app/pricing` · `app/cases` · `app/faq` | 신규 페이지로 전면 재작성                                               |
| `app/components/StructuredData.tsx`                                       | 미검증 통계·경쟁사 비방 문구가 구조화 데이터로 Google에 제출되고 있었음 |
| `app/components/FAQList.tsx` · `FAQAccordion.tsx`                         | 같은 미검증 문구 포함                                                   |
| `app/components/ClientCTAButton.tsx`                                      | 공개 플로우에서 회원가입 CTA 제거                                       |
| `app/globals.css`                                                         | `styles/master.css` 로 이관 (애니메이션은 `utilities.css` 에 전부 보존) |
| `public/campaign-1.png` · `campaign-2.png`                                | 어디에서도 참조되지 않는 1.7MB                                          |

### 이동한 것

**`/products/*` → `/shop/*`** — 회원용 상품 구매 시스템을 삭제하지 않고 옮겼습니다. 로그인 뒤에서 기존과 동일하게 동작하며 `noindex` 입니다.

> `/products` 를 "비로그인일 때만 리다이렉트"하는 방식은 쓰지 않았습니다. 브라우저가 301을 캐시하면 로그인 후에도 상품 화면에 영구히 접근할 수 없게 됩니다. URL을 옮기고 옛 경로를 무조건 301하는 쪽이 안전합니다.

### noindex 처리 (robots.txt로 차단하지 않음)

`/login` `/shop` `/dashboard` `/credits` `/orders` `/admin` `/email-preview` `/analyze` `/lp`

각 세그먼트에 `layout.tsx` 를 두어 metadata로 처리했습니다. **차단이 아니라 noindex인 이유**: robots.txt로 크롤을 막으면 Google이 noindex 메타를 읽지 못해 오히려 색인에 남습니다.

### 공개 네비게이션에서 제거

로그인 · 회원가입 · 크레딧 · 장바구니 · 상품 구매 · 대시보드. 코드는 그대로 살아 있습니다.

### 보존한 것

- 홈 URL (`/`) — 1위 키워드 3개를 잡고 있는 유일한 자산
- `/lp/*` 광고 랜딩 7종 및 `?ref=` 분기 로직
- `/analyze/[domain]` 진단 결과 플로우
- GA4 태그 · Google Ads 전환 이벤트 이름 · Search Console 소유 확인 메타
- `/pricing` `/cases` `/faq` URL — Google Ads 사이트링크가 물려 있음

---

## 3. Redirect map

전부 **301**, 체인 없이 1홉. `curl` 로 전수 확인했습니다.

| 기존                         | 신규                      |
| ---------------------------- | ------------------------- |
| `/products`                  | `/services`               |
| `/products/category/plan`    | `/services/plan-backlink` |
| `/products/category/pbn`     | `/services/pbn-backlink`  |
| `/products/category/seo`     | `/services/onpage-seo`    |
| `/products/category/content` | `/services/content-seo`   |
| `/products/category/:slug`   | `/services`               |
| `/products/:id`              | `/services`               |
| `/signup`                    | `/`                       |
| `/blog/what-is-backlink`     | `/backlink`               |

`/products/:id` 는 URL만으로 상품 유형을 판별할 수 없어 가장 가까운 상위 페이지로 보냅니다.

**`/signup` 은 리뉴얼과 무관하게 지금 발생 중이던 손실입니다.** Google Ads 사이트링크 "20만 크레딧 무료 체험"과 항시 운영 프로모션의 final_url이 존재하지 않는 페이지를 가리키고 있었습니다. 새 공개 사이트의 전환은 Telegram 상담이고 회원가입 경로가 아니므로, 목적지는 로그인 화면이 아니라 홈입니다. 이 리다이렉트는 과거 광고 URL을 위한 fallback 이며 신규 UI 어디에서도 `/signup` 으로 링크하지 않습니다 (리포지토리 전수 검색으로 확인).

---

## 4. 새 component 목록

40개. 같은 기능의 컴포넌트를 중복 생성하지 않았습니다.

**layout** — `Header` `Footer` `Container`(+`Section`) `Breadcrumb` `NavLink`

**ui** — `Button` `Badge` `Card`(+`LinkCard` `CardTitle` `CardBody` `CardMeta` `BulletList`) `Accordion` `Tabs` `Stat`

**marketing** — `Hero` `SeoStrategyPanel` `SectionHead` `ProblemSection` `SituationSelector` `ServiceGrid`(+`ServiceCard`) `ProcessSteps` `PricingCard` `ComparisonTable` `CaseStudyCard` `FAQSection` `TelegramCTA` `TelegramCTABlock` `FinalCTA` `TrustSection`

**content** — `TableOfContents` `KeyTakeaways` `RelatedContent` `RelatedServices` `RelatedArticles` `ArticleCTA` `PolicyDocument`

**seo** — `JsonLd` `OrganizationSchema` `WebsiteSchema` `ServiceSchema` `ArticleSchema` `FaqSchema` `BreadcrumbSchema`

### JS 없이 동작하는 것

헤더 서비스 드롭다운(`:focus-within`), 모바일 메뉴(native `<details>`), FAQ 아코디언(native `<details>`), 카테고리 탭(앵커 이동). 덕분에 **하위 서비스 링크와 FAQ 답변이 접힌 상태에서도 HTML에 포함**됩니다.

`Stat` 컴포넌트는 `source`(산출 기준) 없이 성과 수치를 표시하지 못하도록 설계했습니다.

---

## 5. CSS architecture

```
styles/
  master.css      ← 루트 레이아웃에서 1회 import
  tokens.css      CSS 변수 (색·타이포·간격·모션)
  reset.css       Tailwind preflight 위에 얹는 기본값
  utilities.css   레이아웃/타이포 유틸 + 기존 LP 애니메이션 보존
  components.css  신규 사이트 컴포넌트 표면 전부
  blog.css        .blog-content 스코프 전용
```

- `postcss-import` 를 파이프라인에 추가해 Tailwind 처리 **전에** @import를 인라인합니다. 순서가 결정적입니다.
- 신규 페이지는 Tailwind 유틸을 쓰지 않고 `bl-` 접두사 클래스만 사용합니다. Tailwind는 레거시 화면(admin·dashboard·lp·analyze)을 위해 그대로 유지됩니다.
- 서비스 랜딩과 아티클 타이포그래피는 `.blog-content` 스코프로 완전히 분리됩니다.
- 색: Pure White 중심, 일부 섹션만 `--surface-subtle: #F8F9FB`. 전체 회색 배경 없음.
- 모션: 180–280ms, opacity/transform만. `prefers-reduced-motion` 지원.
- 표는 전부 자체 컨테이너에서 스크롤됩니다. grid/flex 자식의 `min-width: 0` 을 명시해 페이지가 가로로 밀리지 않게 했습니다.

---

## 6. SEO 변경사항

| #   | 이전                                                                                        | 이후                                                            |
| --- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| C1  | 루트 레이아웃의 하드코딩 canonical이 전 페이지에 상속 → 모든 페이지가 홈을 canonical로 지정 | 루트에서 제거, `metadataBase` + 페이지별 self canonical         |
| C2  | `/products/*` 전체가 Googlebot에게 307 → `/login`                                           | `/shop` 으로 이동, 옛 경로는 공개 서비스 페이지로 301           |
| C3  | `robots.txt` 404                                                                            | `app/robots.ts` 신설                                            |
| C4  | 사이트맵 6개 URL 중 5개가 리다이렉트, 색인 가능한 4개는 미등록                              | 200·indexable·canonical URL 21개만 등록                         |
| M7  | `lastmod` 가 빌드 시각                                                                      | `config/routes.ts` 의 실제 수정일, 아티클은 `updatedAt`         |
| M2  | Title 48자 / Description 117자                                                              | 전 페이지 60자 / 160자 이내                                     |
| L3  | 285KB `logo.png` 를 favicon으로 사용                                                        | favicon은 `app/icon.svg`, `logo.png` 는 OG 전용 + 18KB로 최적화 |
| L4  | 미사용 이미지 1.7MB                                                                         | 삭제                                                            |
| —   | `keywords` 메타에 19개 키워드 나열 (제공하지 않는 네이버 SEO 포함)                          | 제거                                                            |
| —   | 존재하지 않는 슬러그가 307로 리다이렉트                                                     | 실제 404 반환 + 브랜드 404 페이지                               |

### 홈 키워드 보존 (가장 중요)

`백링크 구매` · `고품질 백링크` · `PBN 백링크` 세 키워드는 현재 사이트의 유일한 SEO 성과입니다. 홈 URL을 고정하고 세 표현을 title·description·H1·본문에 전부 남겼습니다.

| 키워드        | 홈에서의 위치                                                      |
| ------------- | ------------------------------------------------------------------ |
| 백링크 구매   | title · description · **H1**                                       |
| 고품질 백링크 | title · description · 관련 글 카드                                 |
| PBN 백링크    | description · 서비스명 · 가격표 · FAQ 답변                         |
| 백링크 판매   | 본문 1회 (5위 키워드 보존용, 브랜드 포지셔닝과 충돌하지 않는 문맥) |

**출현 횟수는 목표가 아닙니다.** 초기 보고서에는 횟수가 적혀 있었지만, 그 숫자를 SEO 목표나 QA 기준으로 쓰면 카피가 사람이 아니라 카운터를 향하게 됩니다. `scripts/seo-qa.mjs` 와 테스트에는 키워드 최소 출현 횟수를 강제하는 로직이 없으며(전수 확인), 앞으로도 넣지 않습니다.

2026-08-28 사람이 읽는 관점으로 홈을 다시 검토했습니다. `PBN 백링크` 는 본문에 7회 나오는데 헤더 네비 · 모바일 메뉴 · 서비스 카드 제목 · 가격표 라벨 · 관련 글 제목 · FAQ 답변 한 문장 · 푸터로, 전부 이름표이거나 자연스러운 문장이었습니다. 산문에서 억지로 반복되는 자리는 없어 줄이지 않았습니다.

하위 페이지는 롱테일(`백링크 가격`, `백링크 업체`, `PBN 구성`)로 분화시켜 홈과 경쟁하지 않게 했습니다.

### 확인되지 않은 수치 전수 제거

이전 사이트의 핵심 수치 13개(59%)에 출처가 없었습니다. 전부 제거하고, `scripts/seo-qa.mjs` 가 재유입을 막습니다.

제거 대상: `1,247개 프로젝트` `재구매율 98%` `패널티 0건` `트래픽 327%` `ROI 892%` `환불률 0.8%` `95%의 업체는 스팸` `국내 최다 보유` `2~4주 내 상승` `47/50개 항목` `DA 20+/30+` `한 번 오른 순위는 유지`

대신 검증 가능한 것만 게시합니다 — 서비스 시작가(`config/pricing.ts`), 크레딧 환산율(1 크레딧 = 1원), 작업 방식, 리스크의 정직한 서술.

---

## 7. Structured Data

| 스키마           | 위치              | 비고                                                 |
| ---------------- | ----------------- | ---------------------------------------------------- |
| `Organization`   | 홈 1회만          | 사업자 정보는 값이 있을 때만 포함                    |
| `WebSite`        | 홈 1회만          | **`SearchAction` 제거** — 사이트 내 검색 기능이 없음 |
| `Service`        | 서비스 상세 4종   | `Offer` 에 실제 시작가(KRW) 포함                     |
| `Article`        | 아티클 5편        | `datePublished` / `dateModified`                     |
| `FAQPage`        | `/faq` 1회만      | `config/faq.ts` 의 answer 텍스트가 화면과 100% 동일  |
| `BreadcrumbList` | 홈 제외 전 페이지 | `<Breadcrumb />` 가 자동 출력                        |

`Review` · `AggregateRating` 은 생성하지 않았습니다. QA 스크립트가 이 두 타입과 `SearchAction` 의 재유입, 그리고 `Organization`/`WebSite` 중복 출력을 검사합니다.

---

## 8. Internal Linking system

`config/seo-graph.ts` 한 곳에서 관계를 정의하고, `RelatedContent` · `RelatedServices` · `RelatedArticles` 가 이를 읽습니다. **페이지 JSX에 내부링크 목록을 하드코딩하지 않습니다.**

```
Cluster = { pillar, moneyPage, relatedPages[], relatedArticles[] }
```

12개 클러스터(home / backlink / agency / pricing / services / pbnBacklink / planBacklink /
onpageSeo / contentSeo / googleRanking / cases / faq).

- `PAGE_REGISTRY` 가 링크 라벨과 설명을 관리 → 앵커 텍스트가 한 곳에서 통제됩니다.
- 아티클은 `articleLinkSet(slug)` 으로 **Pillar 1 + Money page 1 + 관련 글 2 (+ 문맥이 맞으면 보조 랜딩 1)** 을 받습니다.
- 본문 문맥 링크는 앵커 텍스트를 매번 다르게 변형했습니다. 아티클 5편의 본문 링크에서 앵커 중복은 0건이며, `/backlink` 로 향하는 9개 링크도 전부 서로 다른 문구를 씁니다.
- 필러 통합 후 `/backlink` 는 본문 기준 **15개 페이지**에서 인바운드 링크를 받습니다 (블로그 5편 전부 포함). Money page 링크 구조는 그대로입니다 — `/` 20, `/services/pbn-backlink` 16, `/pricing` 15, `/google-ranking` 13, `/backlink-agency` 8.
- 전역 Navigation은 `config/nav.ts` 에서 `config/services.ts` 를 파생시켜 생성 → 서비스가 추가되면 헤더·푸터·드롭다운·모바일 메뉴에 자동 반영됩니다.
- 깨진 내부링크 0건 (QA 전수 검사).

---

## 9. Telegram tracking

`config/site.ts` 의 `TELEGRAM_URL` 한 곳에서만 관리하고, `<TelegramCTA />` 가 모든 CTA를 담당합니다.

```tsx
<TelegramCTA source="pbn-backlink" position="hero" label="PBN 구성이 맞는지 상담하기" />
```

### 이벤트 이름을 바꾸지 않은 이유

GA4 이벤트는 기존 **`telegram_click`** 을 그대로 씁니다. 이 이벤트가 이미 GA4 주요 이벤트 → Google Ads 전환으로 import 되어 있어, 새 이름을 쓰면 전환 설정을 다시 하는 동안 전환이 유실됩니다. 대신 파라미터를 추가했습니다.

| 파라미터    | 값                                               |
| ----------- | ------------------------------------------------ |
| `placement` | `{source}:{position}` — 기존 리포트 호환         |
| `page`      | 발화한 경로                                      |
| `source`    | 문맥 (`pbn-backlink`, `pricing`, …)              |
| `position`  | `hero` `mid` `article` `final` `header` `footer` |
| `label`     | 실제 버튼 문구                                   |

### 문맥별 CTA 문구

| 페이지        | 문구                       |
| ------------- | -------------------------- |
| 기본          | 내 사이트 상황 상담하기    |
| PBN           | PBN 구성이 맞는지 상담하기 |
| 가격          | 예산에 맞는 구성 문의하기  |
| 구글 상위노출 | 목표 키워드 상담하기       |
| 백링크 업체   | 현재 SEO 상황 상담하기     |

보조 표시 "Telegram으로 연결됩니다" 를 함께 노출합니다. 모바일 화면을 지속적으로 가리는 sticky CTA는 넣지 않았습니다.

`app/components/TopNav.tsx` 의 `t.me/@goat82` 는 해석되지 않는 잘못된 URL이었습니다. 수정했습니다.

---

## 10. 남아 있는 TODO

전부 코드가 아니라 **운영자만 확정할 수 있는 값**입니다. 값을 채우면 화면에 자동 반영됩니다.

| #   | 파일                                 | 내용                                                                                                                     | 영향                                                                                                                                                                 |
| --- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `config/site.ts` `BUSINESS_INFO`     | 상호 · 대표자 · 사업자등록번호 · 통신판매업 신고번호 · 주소 · 고객센터 · 개인정보보호책임자                              | 🔴 전자상거래법 표시의무. 리포지토리 전체 검색 결과 0건이라 임의로 만들지 않고 비워 두었습니다. 채우면 Footer와 Organization 스키마에 자동 반영                      |
| 2   | `config/cases.ts` `PUBLISHED_CASES`  | 검증된 사례                                                                                                              | 의도적으로 빈 배열입니다. 같은 사례가 홈·`/cases`·광고에서 각각 다른 숫자로 적혀 있어 어느 값이 맞는지 판단 불가. 한 건만 넣어도 `/cases` 와 홈에 자동 렌더링됩니다  |
| 3   | `config/pricing.ts`                  | 운영 DB(`products` 테이블) 가격과 1회 대조                                                                               | 근거는 `scripts/seed-products.js` 와 `scripts/update-product-prices.js` (두 파일 값이 완전히 일치). DB가 다르면 이 파일만 고치면 전 페이지 반영                      |
| 4   | `config/policy.ts`                   | 환불 조건(작업 전 100% / 90일 내 변화 없으면 50%)이 현재도 유효한지 확인                                                 | 이전 FAQ와 구조화 데이터 두 곳에 동일하게 기록되어 있던 값을 정식 문서로 옮긴 것입니다. 새로 만든 조건이 아닙니다                                                    |
| 5   | `config/policy.ts`                   | 개인정보 보유기간 · 파기 절차를 실제 운영 기준으로 확정                                                                  | 현재 값은 전자상거래법·통신비밀보호법의 일반 기준                                                                                                                    |
| 6   | `config/policy.ts`                   | 분쟁 관할·준거법 조항 법률 검토                                                                                          |                                                                                                                                                                      |
| 7   | `config/site.ts` `POLICY_UPDATED_AT` | 실제 정책 시행일로 교체                                                                                                  | 현재는 문서 작성일                                                                                                                                                   |
| 8   | Vercel 설정                          | non-www → www 리다이렉트가 **307**(임시)                                                                                 | 308/301로 변경. 코드가 아니라 대시보드 설정입니다                                                                                                                    |
| 9   | Google Ads                           | 사이트링크 `/products` → `/services` 로 갱신 검토                                                                        | 301이 걸려 있어 당장 깨지지는 않지만 직접 지정이 낫습니다                                                                                                            |
| 10  | Google Ads                           | **`/signup` 을 final_url 로 쓰는 사이트링크·프로모션을 `/` 또는 적절한 신규 랜딩 URL로 직접 교체**                       | 🔴 광고 계정은 리포지토리 밖이라 코드로 고칠 수 없습니다. 301 fallback 이 걸려 있어 당장 깨지지는 않지만, 리다이렉트를 거치는 만큼 랜딩 속도와 품질평가에 불리합니다 |
| 11  | Google Search Console                | 신규 사이트맵 재제출 · `/blog/what-is-backlink` 색인 삭제 요청은 하지 않을 것 (301을 그대로 따라가게 두는 편이 낫습니다) |                                                                                                                                                                      |
| 12  | —                                    | Pretendard 웹폰트 CDN 로드 여부                                                                                          | 현재는 외부 요청 없이 시스템 폰트로 폴백합니다. Core Web Vitals를 우선한 선택이며, 브랜드 통일이 더 중요하면 CDN을 추가하면 됩니다                                   |

### 의도적으로 만들지 않은 것

- **무료 SEO Audit / Backlink Checker** — 지시에 따라 신규 구현하지 않았습니다.
- **`/tools` 디렉토리** — Navigation에 노출하지 않았습니다.
- **백링크 유형별 개별 페이지 9종** — 유형당 1,000자 이상의 고유 콘텐츠를 확보하기 전에는 얇은 페이지 9개가 될 위험이 큽니다. Tier 1·2가 색인된 뒤 착수를 권합니다.
- **`Tabs` 의 패널 숨김 방식** — 콘텐츠를 감추지 않는 앵커 이동형으로 구현했습니다. 모든 본문이 HTML에 남아야 하기 때문입니다.

---

## 11. 직접 검수해야 할 페이지

### 🔴 배포 직후 (당일)

| 확인                                           | 방법                                                                                      |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 리다이렉트 8종이 전부 301이고 체인이 없는가    | `curl -I`                                                                                 |
| 사이트맵 21개 URL 전수 200                     | GSC 또는 `node scripts/seo-qa.mjs`                                                        |
| Google Ads 전 애셋 final_url 200               | `/lp/seo?ref=audit` `/pricing` `/cases` `/faq` `/lp/seo?ref=agency` `/products` `/signup` |
| `/lp/*` 7종 정상 동작 및 `?ref=` 분기          | 실제 광고 링크로 접속                                                                     |
| 로그인 → `/shop` → 상품 상세 → 주문 플로우     | 실계정                                                                                    |
| 텔레그램 CTA 클릭 시 GA4 `telegram_click` 발화 | GA4 실시간 보고서                                                                         |

### 🟠 2~4주 주간 모니터링 (가장 중요)

**`백링크 구매` · `고품질 백링크` · `PBN 백링크` 3개 키워드 순위.** 이 3개가 현재 사이트의 유일한 SEO 성과입니다. 하락이 감지되면 홈 카피 변경분을 즉시 되돌릴 수 있도록 준비해 두세요.

함께 볼 것: GSC 색인 범위 보고서(21개 페이지가 색인되는지), `/products*` 의 301 처리 상태.

### 🟡 카피 검수 (사람이 읽어야 하는 것)

기계 검사로 잡히지 않는 어조와 사실관계입니다.

| 페이지                       | 확인할 것                                                                                                      |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `/services/pbn-backlink`     | PBN 리스크 서술의 수위. **"위험이 0인 링크 작업은 없다"** 고 명시했습니다. 영업상 이 표현을 유지할지 판단 필요 |
| `/cases`                     | 사례 0건 상태의 안내문이 사과문이 아니라 기준으로 읽히는지                                                     |
| `/refund`                    | 환불 조건이 실제 운영과 일치하는지 (TODO 4번)                                                                  |
| `/privacy`                   | 위탁 수탁자 6곳(Supabase · Vercel · Resend · Google · Telegram · OpenAI)이 실제와 맞는지                       |
| `/pricing`                   | 서비스별 시작가와 구성별 금액이 실제 판매가와 맞는지 (TODO 3번)                                                |
| `/blog/what-is-pbn-backlink` | "구글이 권장하는 방식이 아니다" 라는 서술의 수위                                                               |

### 🔵 기기 실측

PageSpeed Insights API 일일 쿼터 초과로 Lighthouse 점수를 받지 못했습니다. `pagespeed.web.dev` 에서 수동 실행을 권합니다.

직접 측정한 것: 모바일 390px 가로 오버플로 0건, 콘솔 에러 0건, 전 색인 페이지 정적 생성, 신규 페이지 First Load JS 345KB.

---

## 부록 — QA 스크립트

```bash
npx next build
node scripts/seo-qa.mjs
```

검사 항목: 라우트 정적 생성 · title/description/H1 고유성 · canonical 자기참조 ·
**확인되지 않은 수치 재유입** · 내부링크 유효성 · 사이트맵 정합성 · noindex 적용 ·
구조화 데이터 유효성 및 금지 타입.

콘텐츠를 수정할 때마다 돌리면 리뉴얼 이전의 문제가 다시 들어오는 것을 막을 수 있습니다.
