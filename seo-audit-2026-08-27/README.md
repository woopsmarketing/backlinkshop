# backlinkshop.co.kr 전면 SEO·사이트 구조 조사 보고서

**조사 기준일: 2026-08-27**
**조사 대상: https://www.backlinkshop.co.kr**
**조사 코드베이스 커밋: `f773f8d` (main)**

---

## 이 보고서를 읽는 순서

리뉴얼 의사결정을 위해 급한 순서대로 읽으려면:

1. **[10-priority-issues.md](10-priority-issues.md)** — 지금 사이트가 왜 검색에서 안 보이는지 (Critical 5건)
2. **[13-recommendations.md](13-recommendations.md)** — 조사 결과에 근거한 권장 방향
3. 나머지는 근거 자료

---

## 파일 목록

| 파일                                                       | 대응 산출물 | 내용                                                            |
| ---------------------------------------------------------- | ----------- | --------------------------------------------------------------- |
| [01-url-inventory.md](01-url-inventory.md)                 | **A**       | 전체 URL 인벤토리 (28개 URL 실측)                               |
| [02-site-structure.md](02-site-structure.md)               | **B, C**    | 사이트 구조 트리 · 페이지 역할 분류 · 페이지별 타깃 키워드 추정 |
| [03-homepage-seo-analysis.md](03-homepage-seo-analysis.md) | 섹션 3      | 홈페이지 키워드 출현·검색의도·구조 정밀 분석                    |
| [04-technical-seo.md](04-technical-seo.md)                 | 섹션 2, 9   | robots/sitemap/canonical/정규화/기술 SEO                        |
| [05-keyword-research.md](05-keyword-research.md)           | **D, E**    | 한국 키워드 리서치 · 핵심 키워드 비교표                         |
| [06-serp-analysis.md](06-serp-analysis.md)                 | **F**       | SERP 분석 · SERP Overlap                                        |
| [07-competitor-benchmark.md](07-competitor-benchmark.md)   | **G**       | 경쟁사 벤치마크                                                 |
| [08-content-trust-audit.md](08-content-trust-audit.md)     | 섹션 10     | 숫자·성과 Claim 전수 검증                                       |
| [09-search-console.md](09-search-console.md)               | 섹션 8      | Search Console — **데이터 필요**                                |
| [10-priority-issues.md](10-priority-issues.md)             | **H**       | SEO 문제점 우선순위 표                                          |
| [11-migration-plan.md](11-migration-plan.md)               | **I, J**    | 유지할 SEO 자산 · 필수 리다이렉트                               |
| [12-new-site-blueprint.md](12-new-site-blueprint.md)       | **K, L**    | 신규 랜딩페이지 목록 · 콘텐츠 클러스터 후보                     |
| [13-recommendations.md](13-recommendations.md)             | 권장 방향   | 데이터 기반 권장안                                              |

---

## 조사 방법과 데이터 출처

이 보고서의 모든 수치에는 출처를 표기했습니다. 출처 등급은 다음과 같습니다.

### ✅ 1차 실측 데이터 (신뢰도 높음)

| 출처 코드 | 방법                                                                                     | 조사일     |
| --------- | ---------------------------------------------------------------------------------------- | ---------- |
| `[소스]`  | 리포지토리 소스코드 직접 분석 (`app/`, `middleware.ts`, `app/sitemap.ts` 등)             | 2026-08-27 |
| `[실측]`  | `curl` HTTP 요청 — Googlebot User-Agent, 리다이렉트 미추적, 상태코드/헤더/HTML 원문 파싱 | 2026-08-27 |

**본 조사에서 사이트 크롤링은 추측 없이 전부 `[실측]`으로 수행했습니다.** 렌더링된 HTML을 직접 받아 title/canonical/robots/헤딩/링크/JSON-LD를 파싱했습니다.

### ⚠️ 2차 대체 데이터 (프록시 — 한국 Google 아님)

| 출처 코드     | 방법                                                               | 한계                                                                                                              |
| ------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `[DDG-KR]`    | DuckDuckGo HTML 엔드포인트, `kl=kr-kr`, `Accept-Language: ko-KR`   | **Bing 인덱스 기반.** 한국 Google 순위와 다를 수 있음                                                             |
| `[WebSearch]` | 내장 웹검색 도구                                                   | **US 기반 엔진.** 한국 Google SERP 아님                                                                           |
| `[자동완성]`  | `suggestqueries.google.com`, `hl=ko&gl=kr`                         | Google의 **실제 한국어 자동완성** 데이터. 단 검색량 수치는 제공 안 됨                                             |
| `[내부-Ads]`  | 프로젝트 내 `overview.md` (Google Ads 셋팅 보고서)의 검색량·CPC 표 | 원 출처가 `VebAPI`로 표기됨. Google Keyword Planner 원본 아님. 문서 자체에 데이터 품질 경고 있음 (05번 문서 참조) |

### ❌ 확인 불가 — 접근 권한/도구 없음

아래 항목은 **임의로 생성하지 않고 `확인 불가` 또는 `데이터 필요`로 표기**했습니다.

| 항목                                                                            | 사유                                                                                              | 확보 방법                            |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------ |
| Google Search Console 데이터 (Clicks/Impressions/CTR/Position, Query별, Page별) | GSC 접근 권한 미제공                                                                              | 소유자 GSC 계정 연동                 |
| **한국 Google 실제 순위 및 Ranking URL**                                        | Google 검색 결과 페이지가 JS 필수로 전환되어 서버 요청으로 파싱 불가 (`enablejs` 리다이렉트 확인) | GSC 또는 Ahrefs/Semrush 순위추적     |
| `site:backlinkshop.co.kr` 실제 색인 URL 목록                                    | 위와 동일. `site:` 연산자를 지원하는 도구 없음                                                    | GSC 색인 범위 보고서                 |
| Google Keyword Planner 정확 검색량                                              | Google Ads 계정 접근 권한 미제공                                                                  | Google Ads 키워드 플래너             |
| Ahrefs / Semrush 지표 (DR, KD, Organic Traffic, Ranking Keyword 수)             | 유료 도구 미보유                                                                                  | Ahrefs/Semrush 구독                  |
| Core Web Vitals · Lighthouse 점수 (LCP/INP/CLS 실측 점수)                       | PageSpeed Insights API **일일 쿼터 초과** (`Quota exceeded ... Queries per day`)                  | PSI 웹 UI 수동 실행 또는 API 키 발급 |
| 경쟁사 Organic Traffic / DA / DR                                                | 유료 도구 필요                                                                                    | 위와 동일                            |

> **Core Web Vitals 보완**: Lighthouse 점수는 못 받았지만, TTFB·HTML 크기·DOM 요소 수·스크립트 수·렌더 블로킹 리소스는 `[실측]`으로 직접 측정했습니다. [04-technical-seo.md](04-technical-seo.md) 참조.

---

## 한 문단 요약

backlinkshop.co.kr은 **현재 검색엔진이 색인할 수 있는 실질 페이지가 홈페이지 1개뿐**입니다. 사이트맵에 등록된 6개 URL 중 5개(`/products*`)는 미들웨어가 비로그인 사용자를 `/login`으로 307 리다이렉트하므로 Googlebot이 콘텐츠를 볼 수 없고, 실제로 존재하는 4개의 정적 페이지(`/services`, `/pricing`, `/faq`, `/cases`)는 사이트맵에도 없고 홈페이지에서 링크되지도 않으며, 루트 레이아웃의 하드코딩된 canonical 때문에 **전부 홈페이지로 canonical이 지정**되어 있습니다. `robots.txt`는 404입니다. 반면 홈페이지 자체는 `백링크 구매`·`고품질 백링크`·`PBN 백링크`에서 이미 상위 노출되고 있어(`[DDG-KR]` 기준 1위), **콘텐츠 경쟁력이 아니라 사이트 구조가 병목**입니다.

자세한 내용은 [10-priority-issues.md](10-priority-issues.md)를 보세요.
