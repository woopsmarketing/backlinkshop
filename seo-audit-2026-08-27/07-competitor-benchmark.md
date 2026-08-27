# G. 경쟁사 Benchmark

**조사일: 2026-08-27** · 출처: `[실측]` 경쟁사 sitemap.xml·robots.txt·홈페이지 직접 요청, `[DDG-KR]` SERP 노출 빈도

---

## ⚠️ 확인 불가 항목

프롬프트가 요구한 다음 지표는 **유료 도구(Ahrefs/Semrush) 없이는 확보 불가**하여 **확인 불가**로 표기합니다. 임의 추정치를 넣지 않았습니다.

- 예상 Organic Traffic
- Ranking Keyword 수
- Domain Authority / DR
- 내부링크 구조 상세 (전체 크롤링 필요)

**대신 실측 가능한 것을 측정했습니다**: 사이트맵 URL 수, 콘텐츠 페이지 수, IA 구조, 정책 페이지 유무, 무료 도구 유무, robots/sitemap 유무, SERP 노출 빈도.

---

## G-1. 경쟁사 선정

`[DDG-KR]` 10개 핵심 키워드 SERP에서 **실제로 반복 노출된 도메인**을 빈도순으로 선정했습니다(추정이 아닌 실측 노출 기준).

|   # | 도메인                 | 브랜드                | SERP 노출 횟수 | 유형              |
| --: | ---------------------- | --------------------- | :------------: | ----------------- |
|   1 | **rankrocket.kr**      | 랭크로켓              |    **6회**     | 콘텐츠 주도형     |
|   2 | **linkauthority.kr**   | 링크어소리티          |    **6회**     | 풀스택 SEO 실행사 |
|   3 | **backlinkpro.kr**     | 백링크프로            |    **6회**     | 백링크 전문       |
|   4 | **backlinkhigh.shop**  | 백링크하이            |    **5회**     | 백링크 커머스     |
|   5 | indeedseo.com          | IndeedSEO             |      4회       | 글로벌 SEO        |
|   6 | marketingexit.com      | Marketing EXIT        |      2회       | SEO 에이전시      |
|   7 | greenbacklink.co.kr    | 그린백링크            |      2회       | 백링크 전문       |
|   8 | idearabbit.co.kr       | 아이디어래빗/오픈타임 |      3회       | SEO 컨설팅        |
|   9 | marketory.co.kr        | 마케토리              |      2회       | SEO 마케팅        |
|  10 | subbot.kr              | 섭봇                  |      1회       | 백링크 프로그램   |
|  11 | serporum.com           | 서포럼                |      1회       | SEO 업체          |
|  12 | nodelix.kr             | 노드릭스              |      1회       | SEO·AEO·GEO 대행  |
|  13 | wari.kr                | 와리                  |      1회       | 구글 상위노출     |
|   — | **backlinkshop.co.kr** | **백링크샵**          |    **4회**     | **백링크 커머스** |

> backlinkshop은 노출 빈도 4회로 **중상위권**입니다. 다만 그 4회가 **전부 홈페이지 1개 URL**입니다. 상위 경쟁사는 여러 URL로 분산 노출됩니다.

---

## G-2. 핵심 경쟁사 상세 벤치마크

### 🥇 linkauthority.kr — 링크어소리티 (구조 벤치마크 1순위)

| 항목                     | 값                                                                                     | 출처       |
| ------------------------ | -------------------------------------------------------------------------------------- | ---------- |
| 홈 Title                 | 구글 상위노출 · 백링크 전문 SEO 실행사 \| 링크어소리티                                 | `[실측]`   |
| 홈 H1                    | 검색을 지배하는 SEO 전략.                                                              | `[실측]`   |
| 홈페이지 Primary Keyword | **구글 상위노출 + 백링크 (업체 포지션)**                                               | `[실측]`   |
| **사이트맵 URL 수**      | **89개**                                                                               | `[실측]`   |
| robots.txt / sitemap.xml | ✅ / ✅                                                                                | `[실측]`   |
| **Blog 보유**            | ✅                                                                                     | `[실측]`   |
| **Blog 콘텐츠 수**       | **약 64편** (+ 페이지네이션 6페이지)                                                   | `[실측]`   |
| 서비스 랜딩 페이지       | **9개** (전부 공개·색인 가능)                                                          | `[실측]`   |
| 가격 페이지              | ✅ `/pricing` (200)                                                                    | `[실측]`   |
| Case Study               | ✅ `/case-studies` (200)                                                               | `[실측]`   |
| **정책 페이지**          | ✅ `/terms`, `/privacy`                                                                | `[실측]`   |
| **AI/GEO 최적화**        | ✅ **`/llms.txt`, `/llms-full.txt`**                                                   | `[실측]`   |
| CTA 구조                 | `/consult`(상담), `/contact`(문의) 별도 페이지                                         | `[실측]`   |
| SERP 노출                | 백링크 구매 4위, 백링크 판매 3위, 백링크 가격 3·4위, 백링크 업체 7위, PBN 백링크 6·9위 | `[DDG-KR]` |

**IA 구조** `[실측]`

```
linkauthority.kr
├── /                          홈 (Primary: 구글 상위노출·백링크 전문 실행사)
├── /services                  서비스 허브
│   ├── /services/pbn-backlinks      ← PBN 백링크 전용
│   ├── /services/tier-links         ← 티어 링크 전용
│   ├── /services/onpage-seo         ← 온페이지 SEO 전용
│   ├── /services/local-seo          ← 로컬 SEO 전용
│   ├── /services/naver-content-seo  ← 네이버 SEO 전용
│   ├── /services/programmatic-seo
│   ├── /services/web-design
│   └── /services/web-development
├── /pbn                       PBN 단독 랜딩 (services/pbn-backlinks와 별도)
├── /pricing                   가격
├── /case-studies              사례
├── /blog  (+ /page/2 … /page/6)   블로그 허브
│   ├── /blog/what-is-backlink-seo           ← "백링크" 개념
│   ├── /blog/how-to-buy-backlinks-guide     ← "백링크 구매"
│   ├── /blog/pbn-backlink-pricing-guide     ← "PBN 백링크 가격"
│   ├── /blog/pbn-guide-for-beginners        ← "PBN이란"
│   ├── /blog/seo-agency-cost-guide          ← "SEO 비용"
│   ├── /blog/backlink-building-strategies
│   ├── /blog/tier-link-building-strategy
│   ├── /blog/google-ranking-factors-2026
│   ├── /blog/onpage-seo-checklist
│   ├── /blog/naver-seo-vs-google-seo
│   ├── /blog/domain-authority-guide
│   ├── /blog/technical-seo-guide
│   ├── /blog/local-seo-guide
│   ├── /blog/seo-for-ecommerce
│   ├── /blog/seo-content-writing-guide
│   ├── /blog/wordpress-backlink-guide
│   ├── /blog/programmatic-seo-guide
│   ├── /blog/google-search-console-seo-guide
│   ├── /blog/plastic-surgery-seo          ← 업종별
│   └── … (총 64편)
├── /consult   /contact        CTA
├── /terms  /privacy           정책 ✅
└── /llms.txt  /llms-full.txt  AI 크롤러용 ✅
```

**주요 Content Cluster**: ① 백링크(개념·구매·티어·전략) ② PBN(입문·가격) ③ 온페이지/기술 SEO ④ 네이버 vs 구글 ⑤ 업종별 SEO ⑥ 플랫폼별(워드프레스)

**배울 점 3가지**

1. **서비스 유형마다 전용 URL** — `PBN 백링크`, `티어 링크`, `온페이지 SEO`가 각각 독립 페이지. backlinkshop은 이 전부를 홈페이지 H3 카드로만 갖고 있고, 실제 상품 페이지는 로그인 차단.
2. **키워드 1개 = 페이지 1개** — 블로그 슬러그가 곧 타깃 키워드(`how-to-buy-backlinks-guide` = 백링크 구매). SERP에 같은 도메인이 여러 URL로 노출되는 이유.
3. **`llms.txt` 도입** — 생성형 AI 크롤러용 파일. backlinkshop은 `/lp/ai`에서 GEO를 상품으로 팔면서 정작 자사에는 robots.txt조차 없음.

---

### 🥈 rankrocket.kr — 랭크로켓 (콘텐츠 전략 벤치마크)

| 항목      | 값                                                                             |
| --------- | ------------------------------------------------------------------------------ |
| 접근성    | ⚠️ 서버가 봇 UA 연결 거부 (`Connection refused`) — 사이트맵 수집 불가 `[실측]` |
| SERP 노출 | **6회** — 최다                                                                 |
| 전략      | **블로그 콘텐츠 단독으로 상업 키워드 SERP 점령**                               |

**핵심 발견 — 글 1편이 4개 SERP를 점유** `[DDG-KR]`

`rankrocket.kr/blog/complete-backlink-guide-2026` (「백링크 완벽 가이드 2026 \| 종류·구축·구매 방법 총정리」)

| 키워드      |  순위   |
| ----------- | :-----: |
| 백링크      |  10위   |
| 백링크 구매 | **3위** |
| 백링크 판매 | **2위** |
| 백링크 가격 | **2위** |

`rankrocket.kr/blog/backlink-price-comparison-2026` (「백링크 가격 비교 2026 \| 1만원대~100만원대 총정리」)

| 키워드      |  순위   |
| ----------- | :-----: |
| 백링크 가격 | **1위** |
| 백링크 구매 |   9위   |

`rankrocket.kr/blog/…` (「백링크 업체 추천 5곳 비교 — 가격·품질·환불 정책 완벽 분석」)

| 키워드      |  순위   |
| ----------- | :-----: |
| 백링크 판매 | **1위** |
| 백링크 업체 | **2위** |

**주요 Content Cluster**: 완벽 가이드형 / 가격 비교형 / 업체 추천 비교형 — **전부 "2026" 연도 표기**

**배울 점**

경쟁사 비교 글(자기 업체 포함)로 `백링크 업체`·`백링크 판매` 상위를 잡는 전략이 한국 시장에서 작동하고 있습니다. 가격을 공개적으로 비교하는 콘텐츠가 상업 키워드에서 서비스 홈페이지를 이깁니다.

**backlinkshop 대비**: 블로그 0편. 이 SERP들에 진입할 수단이 없습니다.

---

### 🥉 backlinkhigh.shop — 백링크하이 (커머스 IA 벤치마크)

| 항목                     | 값                                                |
| ------------------------ | ------------------------------------------------- |
| 홈 Title                 | 백링크 \| 구글 상위노출 & SEO 최적화 - 백링크하이 |
| 홈 H1                    | 구글 상위 노출 백링크 서비스로 확실하게           |
| 홈페이지 Primary Keyword | **백링크** (헤드텀 직접 공략)                     |
| 사이트맵 URL 수          | **15개**                                          |
| robots.txt / sitemap     | ✅ / ✅                                           |
| Blog                     | ❌                                                |
| SERP 노출                | 백링크 6위, 백링크 구매 6위, 백링크 가격 8위      |

**IA 구조** `[실측]` — backlinkshop이 가장 직접적으로 참고할 구조

```
backlinkhigh.shop
├── /
├── /estimate                        견적
├── /survey                          설문
├── /shop/profile-backlink           ← 프로필 백링크 전용 상품 페이지
├── /shop/edu-gov-backlink           ← EDU/GOV 백링크 전용
├── /shop/press-backlink             ← 프레스 릴리스 전용
├── /shop/comment-backlink           ← 블로그 댓글 전용
├── /shop/pbn-backlink               ← PBN 전용
├── /shop/guest-post-backlink        ← 게스트 포스트 전용
├── /packages/basic-package          ← 패키지별 페이지
├── /packages/starter-package
├── /packages/plus-package
├── /packages/premium-package
└── /content/privacy-policy          ← 개인정보처리방침 ✅
```

**🔴 backlinkshop에 주는 직접적 시사점**

backlinkshop 홈페이지에는 **백링크 유형 12종이 H3 카드로 나열**되어 있습니다 `[실측]`.

```
WEB 2.0 백링크 / 프로필 백링크 / EDU 백링크 / GOV 백링크 / Wiki 백링크 /
포럼 백링크 / 게스트 포스트 백링크 / 소셜 북마크 백링크 / 블로그 댓글 백링크 /
디렉토리 백링크 / 프레스 릴리스 / PBN 백링크
```

**백링크하이는 똑같은 유형들을 각각 독립 URL로 만들었고, backlinkshop은 한 페이지 안의 카드로만 갖고 있습니다.** 콘텐츠 자산은 이미 있고 **분리만 하면 되는 상태**입니다.

---

### backlinkpro.kr — 백링크프로 (무료 도구 벤치마크)

| 항목                     | 값                                                                                       |
| ------------------------ | ---------------------------------------------------------------------------------------- |
| 홈 Title                 | 백링크프로 - 백링크 작업, 순위상승 확실한 SEO 서비스                                     |
| 홈 H1                    | 백링크 작업으로 순위상승, 매출 상승으로 이어집니다                                       |
| 홈페이지 Primary Keyword | **백링크 작업**                                                                          |
| 사이트맵 URL 수          | 10개                                                                                     |
| **무료 도구**            | ✅ **`/backlink-check.php`** (백링크 체크 도구)                                          |
| Blog                     | ✅ `/post/`                                                                              |
| SERP 노출                | **백링크 업체 1위**, 백링크 4위, 백링크 구매 5위, 고품질 백링크 4·10위, 백링크 가격 10위 |

**IA** `[실측]`

```
backlinkpro.kr
├── /                      홈 (Primary: 백링크 작업)
├── /service.php           서비스
├── /product.php           상품
├── /guide.php             가이드
├── /intro.php             회사소개
├── /faq.php               FAQ
├── /portfolio.php         포트폴리오(사례)
├── /backlink-check.php    ← 무료 백링크 체크 도구 ✅
└── /post/                 블로그
    └── /post/google-rank.php
```

**배울 점**: `백링크 업체` **1위**를 서비스 홈페이지로 잡고 있습니다. 무료 도구(`backlink-check`)를 자사 도메인에 두어 정보성 트래픽을 흡수합니다.

> 💡 backlinkshop은 무료 도메인 분석 도구를 **외부 도메인 `domainchecker.co.kr`로 링크**하고 있습니다 `[실측]`. 자사 트래픽과 링크 가치를 외부로 내보내는 구조입니다.

---

### subbot.kr — 섭봇 / greenbacklink.co.kr — 그린백링크 (간략)

| 항목            | subbot.kr                                                                                 | greenbacklink.co.kr                                               |
| --------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 홈 Title        | 백링크 작업 \| 백링크 업체 \| 백링크 프로그램 - 섭봇                                      | 그린백링크                                                        |
| 사이트맵 URL    | 10개                                                                                      | 사이트맵 인덱스 6개 (home/faq/portfolio/product/product_list/seo) |
| Blog            | ✅ `/column/` — 7편                                                                       | ❌                                                                |
| Content Cluster | 백링크 개념 / 검색엔진 평가 방식 / SEO 자동화 / 구글·네이버 순위 / 백링크 프로그램 선택법 | —                                                                 |
| SERP 노출       | 백링크 업체 3위                                                                           | 백링크 7위, 고품질 백링크 6위                                     |
| 특이사항        | Title에 키워드 3개 파이프 나열                                                            | 사이트맵을 유형별로 분리                                          |

---

## G-3. 통합 벤치마크 비교표

| 항목                           |       **backlinkshop**       | linkauthority | rankrocket  | backlinkhigh  |  backlinkpro  |  subbot   |
| ------------------------------ | :--------------------------: | :-----------: | :---------: | :-----------: | :-----------: | :-------: |
| **robots.txt**                 |          🔴 **404**          |      ✅       |  확인불가¹  |      ✅       |      ✅       |    ✅     |
| **sitemap.xml**                |    ⚠️ 6개(5개 리다이렉트)    |  ✅ **89개**  |  확인불가¹  |    ✅ 15개    |    ✅ 10개    |  ✅ 10개  |
| **실질 색인 가능 페이지**      |          🔴 **1개**          |   ✅ ~89개    |  확인불가¹  |   ✅ ~15개    |   ✅ ~10개    | ✅ ~10개  |
| **Blog 보유**                  |  🔴 **없음** (`/blog` 404)   |  ✅ **64편**  |  ✅ (다수)  |      ❌       |      ✅       |  ✅ 7편   |
| **서비스별 전용 페이지**       |   🔴 **0개** (로그인 차단)   |  ✅ **9개**   |      —      |  ✅ **6개**   |    ✅ 2개     |    ✅     |
| **가격 페이지 공개**           |    ⚠️ 존재하나 색인 불가     |      ✅       | ✅ (비교글) | ✅ 패키지 4개 |      ✅       |     —     |
| **사례/포트폴리오**            |    ⚠️ 존재하나 색인 불가     |      ✅       |      —      |       —       |      ✅       |     —     |
| **정책 페이지(약관/개인정보)** |         🔴 **없음**          |    ✅ 2개     |  확인불가¹  |    ✅ 1개     |       —       |     —     |
| **무료 도구 (자사 도메인)**    | 🔴 **외부 도메인으로 링크**  |       —       |      —      | ✅ 견적/설문  | ✅ 백링크체크 |     —     |
| **AI/GEO 최적화(llms.txt)**    |           🔴 없음            |  ✅ **2개**   |      —      |       —       |       —       |     —     |
| **구조화 데이터**              |       ✅ **4종 8블록**       |   확인불가    |  확인불가   |   확인불가    |   확인불가    | 확인불가  |
| **SERP 노출 횟수**             |             4회              |    **6회**    |   **6회**   |      5회      |    **6회**    |    1회    |
| **노출 URL 다양성**            |        🔴 **1개 URL**        |  ✅ 6개 URL   | ✅ 3개 URL  |    1개 URL    |    3개 URL    |  1개 URL  |
| **1위 확보 키워드**            | ✅ **3개** (구매·고품질·PBN) |      0개      |   ✅ 2개    |      0개      | ✅ 1개 (업체) |    0개    |
| TTFB                           |         ✅ **90ms**          |   확인불가    |      —      |   확인불가    |   확인불가    | 확인불가  |
| Organic Traffic                |        **확인 불가**         |   확인 불가   |  확인 불가  |   확인 불가   |   확인 불가   | 확인 불가 |
| DA / DR                        |        **확인 불가**         |   확인 불가   |  확인 불가  |   확인 불가   |   확인 불가   | 확인 불가 |
| Ranking Keyword 수             |        **확인 불가**         |   확인 불가   |  확인 불가  |   확인 불가   |   확인 불가   | 확인 불가 |

¹ rankrocket.kr은 봇 User-Agent 연결을 거부하여 직접 측정 불가 `[실측]`

---

## G-4. 🔴 backlinkshop이 경쟁사보다 부족한 SEO 자산

우선순위 순으로 정리했습니다.

|      # | 부족한 자산                | backlinkshop                      | 경쟁사 최고                                  | 격차                    |
| -----: | -------------------------- | --------------------------------- | -------------------------------------------- | ----------------------- |
|  **1** | **색인 가능 페이지 수**    | **1개**                           | linkauthority **89개**                       | **89배**                |
|  **2** | **블로그 콘텐츠**          | **0편**                           | linkauthority **64편** / rankrocket 다수     | **∞**                   |
|  **3** | **서비스별 전용 랜딩**     | **0개** (로그인 차단)             | linkauthority 9개 / backlinkhigh 6개         | 전무                    |
|  **4** | **robots.txt**             | **404**                           | 조사 대상 9곳 **전부 보유**                  | 유일한 부재             |
|  **5** | **정책 페이지**            | **0개**                           | linkauthority 2개                            | 전무 (법적 리스크 동반) |
|  **6** | **SERP 노출 URL 다양성**   | **1개 URL**                       | linkauthority 6개 URL                        | 6배                     |
|  **7** | **자사 무료 도구**         | 외부 도메인으로 유출              | backlinkpro `/backlink-check`                | 링크 가치 유출          |
|  **8** | **가격 정보 공개성**       | 크레딧만 표기, **원화 환산 없음** | backlinkhigh 패키지 4개 공개                 | 전환 장벽               |
|  **9** | **AI/GEO 대응(llms.txt)**  | 없음 (GEO를 상품으로 팔면서)      | linkauthority 2개                            | 자기모순                |
| **10** | **업종별/플랫폼별 콘텐츠** | 없음                              | linkauthority (성형외과·이커머스·워드프레스) | 롱테일 전무             |

### backlinkshop이 경쟁사보다 **앞서는** 자산 (리뉴얼 시 반드시 보존)

|   # | 자산                        | 근거                                                                        |
| --: | --------------------------- | --------------------------------------------------------------------------- |
|   1 | **1위 키워드 3개**          | `백링크 구매`·`고품질 백링크`·`PBN 백링크` `[DDG-KR]` — 조사 대상 중 최다   |
|   2 | **구조화 데이터 4종 8블록** | FAQPage·Organization·WebSite·Service. 경쟁사에서 이 수준은 미확인           |
|   3 | **TTFB 90ms · SSG**         | Vercel 엣지 + `force-static`. 기술 기반은 경쟁사 대비 우위                  |
|   4 | **브랜드 도메인 적합성**    | `backlinkshop.co.kr` = "백링크" + "샵" — 상업 의도 키워드에 구조적으로 유리 |
|   5 | **홈페이지 카피 자산**      | 6,101자 + LP 7종의 카피. **콘텐츠 원재료는 이미 충분**                      |
|   6 | **광고 검증된 훅**          | `구글상위노출` CTR 57% 등 `[내부-Ads]` — 자연검색 메타에 이식 가능          |

---

## G-5. 벤치마크 결론

**backlinkshop의 문제는 콘텐츠 품질이 아니라 콘텐츠 배치입니다.**

- 백링크 유형 12종 설명 → 이미 있음. 다만 **한 페이지 H3 카드**로. (백링크하이는 6개 독립 URL)
- 서비스 4종 설명 → 이미 있음. 다만 `/services` **1페이지에 857자**로. (링크어소리티는 9개 독립 페이지)
- 성공사례 5건 → 이미 있음. 다만 **색인 불가 페이지**에. (링크어소리티는 `/case-studies` 공개)
- FAQ 6개 → 이미 있음. 다만 **홈과 `/faq`에 중복**으로.
- 광고 LP 카피 7종 → 이미 있음. 다만 **전부 noindex**로.

**즉 경쟁사를 따라잡기 위해 새로 써야 할 콘텐츠보다, 이미 쓴 콘텐츠를 올바른 URL에 재배치하는 작업이 더 큽니다.** 구체적 설계는 [12-new-site-blueprint.md](12-new-site-blueprint.md).
