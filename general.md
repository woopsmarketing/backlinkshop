# BACKLINKSHOP.CO.KR

# UI / CONTENT / CONVERSION 2차 리뉴얼 MASTER PROMPT

현재 backlinkshop.co.kr은 1차 전면 리뉴얼과 Production Technical SEO 정비가 완료된 상태다.

GitHub `origin/main`에 push하면 Vercel Production으로 자동 배포된다.

이번 작업은 기존 사이트 구조를 다시 만드는 작업이 아니다.

기존에 완성된 아래 시스템을 최대한 보존하면서:

- SEO IA
- canonical
- sitemap
- robots
- noindex
- redirects
- seo-graph
- 내부링크 시스템
- JSON-LD architecture
- Telegram tracking
- GA4
- Google Ads tracking
- CSS architecture
- reusable components

사용자 눈검수에서 발견된 UI / Copy / Trust / Conversion 문제를 개선하는 **2차 리뉴얼**이다.

이번 작업의 핵심 목표는 다음과 같다.

1. 홈페이지를 더 강력한 `백링크` 브랜드 대표 페이지로 만든다.
2. 기존 `백링크 구매 / 백링크 판매` SEO 성과는 보존한다.
3. 사이트 전체의 밋밋한 UI를 고급스럽게 개선한다.
4. 8년 이상의 실제 SEO 경험을 브랜드 신뢰 자산으로 사용한다.
5. 실제 운영자가 제공한 SEO 성공사례를 시각화한다.
6. `/google-ranking`을 사이트의 두 번째 핵심 SEO Pillar로 대폭 확장한다.
7. Blog와 장문 콘텐츠에 이미지와 Diagram을 추가한다.
8. CTA 카피를 페이지와 문맥에 맞게 다양화한다.
9. 모든 최종 상담은 당분간 Telegram `goat82`로 연결한다.
10. Form / Web Chat / AI Chatbot은 이번 작업에서 만들지 않는다.

================================================== 0. 절대 보존사항
==========

기존 Production Technical SEO를 망가뜨리지 않는다.

특히 다음을 보존한다.

- self canonical
- sitemap 구성
- robots
- noindex
- 301 redirect
- seo-graph
- RelatedContent
- Breadcrumb
- JSON-LD
- GA4
- Google Ads conversion
- GSC verification
- telegram_click 이벤트 이름
- 기존 /lp/\*
- /shop/\* 비공개 회원 시스템
- 기존 URL 구조

새로운 UI 변경을 이유로 canonical이나 routing architecture를 재설계하지 않는다.

현재 `/blog/what-is-backlink`는 이미:

301 → `/backlink`

로 통합된 상태다.

다시 생성하지 않는다.

/backlink가 `백링크` 정보성 Pillar의 정본이다.

==================================================

1. # Homepage SEO 역할 재정의

기존 홈페이지는 `백링크 구매`에 지나치게 집중되어 보인다.

하지만 기존 검색성과가 있는:

- 백링크 구매
- 백링크 판매

신호는 절대 제거하지 않는다.

최종 역할:

`/`

= BacklinkShop의 Commercial Backlink Authority Homepage

자연스럽게 다룰 핵심 표현:

백링크
백링크 구매
백링크 판매
백링크 업체
고품질 백링크
PBN 백링크
구글 상위노출

단 특정 키워드 등장 횟수를 맞추지 않는다.

keyword density 개념을 사용하지 않는다.

추천 Homepage Title:

백링크 전문 업체 | 백링크 구매·판매·PBN SEO | 백링크샵

Homepage H1:

구글 상위노출을 위한 백링크,
이제는 개수보다 전략입니다.

H1에서:

구글 상위노출
백링크

가 자연스럽게 강조되어야 한다.

본문에서는 기존:

백링크 구매
백링크 판매

검색 의도를 자연스럽게 보존한다.

/backlink와 정보성 intent cannibalization이 발생하지 않도록:

홈 = Commercial / Service / Trust / Conversion

/backlink = Informational / Educational

역할을 유지한다.

================================================== 2. Homepage Hero 완전 재설계
=======================

현재 Hero의:

SEO BACKLINK STRATEGY

영문 Eyebrow를 제거한다.

모든 Section Eyebrow / Label은 한글을 기본으로 사용한다.

기존 2-column Hero에서:

오른쪽 SEO 판단 항목 Panel

을 제거한다.

Homepage Hero만:

CENTER ALIGNED
ONE COLUMN

구조로 변경한다.

다른 Landing Hero는 기존 Left Align을 유지할 수 있다.

Hero 구조:

[작은 한글 Eyebrow]

백링크 전문 SEO

[H1]

구글 상위노출을 위한 백링크,
이제는 개수보다 전략입니다.

Supporting Copy 방향:

백링크 구매를 고민하고 있거나
믿을 수 있는 백링크 업체를 찾고 있다면,
링크 개수부터 결정할 필요는 없습니다.

사이트 상태와 목표 키워드,
기존 콘텐츠와 링크 구조를 먼저 보고
필요한 SEO 전략을 판단합니다.

CTA는 Hero에서 하나만 사용한다.

Secondary CTA 삭제.

추천 CTA:

상위노출이 막혀있나요? 현재 사이트를 진단해보세요

또는 화면 길이에 따라:

현재 사이트 상태를 정밀하게 진단해드립니다

두 카피 중 디자인상 자연스러운 쪽을 사용한다.

CTA 클릭:

Telegram username `goat82`

로 연결.

Telegram URL은 기존 중앙 config 방식 유지.

문자열을 페이지마다 직접 hardcode하지 않는다.

================================================== 3. Hero Background Visual
=========================

현재 우측 Panel을 제거하므로 Hero 배경에 시각적 완성도를 추가한다.

목표:

고급스럽지만 과하지 않은
"검색 성장 / 상승 / 데이터" 느낌.

추천:

- 아주 옅은 Grid
- Cobalt Blue 계열
- 상승하는 그래프 Line
- 작은 Data Point
- 매우 약한 Glow
- 화면 진입 시 Line Draw Animation

그래프는 주식 투자 서비스처럼 보이면 안 된다.

SEO Visibility가 장기간 상승하는 추상적인 곡선 형태.

Background opacity는 낮게.

텍스트 가독성을 방해하면 안 된다.

가능하면:

CSS + SVG

로 구현한다.

무거운 Animation Library 추가 금지.

prefers-reduced-motion 지원.

Mobile에서는 animation과 detail을 줄인다.

================================================== 4. 전체 Section Label 한글화
=======================

현재 영어 Section Label을 한글로 변경한다.

예:

01 / SITUATION
→ 01 / 현재 상황

02 / DIAGNOSIS
→ 02 / 문제 진단

03 / START HERE
→ 03 / 전략 선택

04 / SERVICES
→ 04 / 서비스

05
→ 05 / 경험과 변화

06 / CASES
→ 06 / 성공 사례

07 / PRICING
→ 07 / 예산과 전략

08 / SEO KNOWLEDGE
→ 08 / SEO 인사이트

FAQ
→ 필요하면 09 / 자주 묻는 질문

불필요한 영문 Eyebrow 남발을 없앤다.

SEO, PBN 등 실제 업계 용어는 그대로 사용할 수 있다.

================================================== 5. Site-wide Design V2
======================

현재 장점:

- Pure White
- Blue Accent
- 넓은 여백
- 깔끔함

은 유지한다.

문제:

- 너무 밋밋함
- Card border가 약함
- 시각적 정보 계층이 약함
- Long-form content가 텍스트 중심
- 카드들이 비슷하게 보임

이를 개선한다.

Design V2:

Pure White

- Near Black
- Cobalt Blue
- Stronger Hairline Border
- Subtle Shadow
- Icon
- Editorial Illustration
- Diagram
- Highlighted Insight Block

Card 기본:

border를 기존보다 명확하게.

예:

border: 1px solid #D8DDE6 정도의 대비.

shadow는 고급스럽고 매우 약하게.

과한 rounded UI 금지.

12~14px radius 내외.

Hover:

- border contrast 증가
- translateY 약 -2px
- subtle shadow

================================================== 6. Icon System
==============

사용자가 시각적 포인트로 Emoji 느낌을 원한다.

하지만 OS마다 렌더링이 다른 시스템 Emoji를 대량 사용하지 않는다.

대신:

- Lucide
- 자체 SVG
- Emoji-like illustrated SVG Icon

중 한 종류로 통일한다.

아이콘 배경:

brand-soft

형태의 작은 Surface 사용 가능.

각 Card 내용과 의미가 맞는 Icon을 사용한다.

================================================== 7. Homepage Section 01 / 현재 상황
==============================

현재 단순 질문 4개 나열 구조를 개선한다.

Desktop:

4-column Card

Tablet:
2 x 2

Mobile:
1-column

각 카드:

Icon
Question
1~2문장 설명

예:

백링크를 했는데도
검색 노출이 그대로인가요?

링크를 늘렸는데 순위가 움직이지 않는다면
원인이 다른 곳에 있을 수 있습니다.

질문 예:

1.

백링크 작업을 했는데도
검색 노출이 그대로인가요?

2.

알고리즘 업데이트마다
순위가 크게 흔들리나요?

3.

경쟁이 심한 키워드에서
더 이상 올라가지 않나요?

4.

어떤 SEO 작업부터 해야 할지
기준이 없으신가요?

Section 아래 기존 문구를 강한 Insight Block으로 변경한다.

기존 작은 안내문처럼 보이면 안 된다.

추천:

링크가 부족해서가 아니라,
링크를 받을 준비가 안 된 페이지일 수 있습니다.

검색 노출이 막히는 이유가
콘텐츠인지, 사이트 구조인지,
외부 권위인지 먼저 구분해야 합니다.

관련 internal link:

/google-ranking

================================================== 8. Homepage Section 02 / 문제 진단
==============================

기존:

CONTENT
콘텐츠

처럼 영문 Label을 중복해서 쓰지 않는다.

Icon + Korean Title 방식.

4 Card:

콘텐츠
사이트 구조
외부 권위
경쟁 환경

콘텐츠:

검색한 사람이 찾던 답을
페이지가 충분히 제공하는가.

사이트 구조:

검색엔진과 사용자가
중요 페이지에 쉽게 도달할 수 있는가.

외부 권위:

사이트 주제와 관련성 있는
외부 신호가 필요한 수준인지.

경쟁 환경:

현재 상위 페이지와
어떤 차이가 존재하는지.

기존:

"그래서 저희는 무조건 더 많은 링크를 권하지 않습니다..."

형태의 박스가 밋밋하므로
Premium Insight Block으로 재디자인한다.

추천 Heading:

백링크가 정답이 아닌 상황도 있습니다.

본문:

백링크샵은 링크를 판매하기 전에
현재 사이트에서 가장 큰 병목이 무엇인지 먼저 판단합니다.

콘텐츠와 페이지 구조가 준비되지 않았다면
링크보다 다른 작업이 먼저일 수 있습니다.

CTA:

링크를 구축해도 노출이 안되나요? 원인을 확인해보세요

→ /google-ranking

================================================== 9. Homepage Section 03 / 전략 선택
==============================

제목 변경:

현재 상황에 맞는 전략은 따로 있습니다.

기존 가로형 짧은 Button list 제거.

좀 더 풍부한 Strategy Card로 변경한다.

Card마다:

Icon
사용자 상황
추천 전략
간단한 이유
관련 internal link

예:

사이트 권위를 높이고 싶다면

백링크 전략

관련성과 품질을 기준으로
필요한 외부 신호를 구성합니다.

백링크 전략 보기 →

경쟁 키워드를 공략하고 싶다면

PBN 전략

경쟁 환경과 현재 도메인 상태를
먼저 판단한 뒤 접근합니다.

PBN 자세히 보기 →

무엇부터 해야 할지 모르겠다면

맞춤형 플랜

하나의 상품이 아니라
현재 필요한 작업의 우선순위를 구성합니다.

백링크를 했는데도 안 오른다면

온페이지 SEO

페이지 구조와 내부링크,
기술적인 병목부터 확인합니다.

콘텐츠가 약하다면

콘텐츠 SEO

검색 의도와 콘텐츠 구조부터 다시 설계합니다.

================================================== 10. Homepage Section 04 / 서비스
=============================

기존 4종에서 사용자 제공 서비스까지 포함해 7개로 확장한다.

1. PBN 백링크
2. 플랜 백링크
3. 온페이지 SEO
4. 콘텐츠 SEO
5. PBN 커스텀 구축
6. 만료·경매 도메인 리서치
7. SEO 호스팅

주의:

신규 서비스 3개를 위해 thin SEO page를 생성하지 않는다.

기존 Landing이 없는 경우
Card + 상담 CTA 형태로만 제공한다.

PBN Custom은 기존:

/services/pbn-backlink

와 문맥적으로 연결 가능하다.

서비스 Card에서 현재 가격 표시는 제거한다.

홈 서비스 섹션에서는 가격 때문에 탐색이 중단되지 않게 한다.

온페이지 SEO 설명은 다음 범위를 충분히 반영한다.

- 사이트 속도
- Core Web Vitals
- 페이지 구조
- 사이트 구조 / IA
- 내부링크 설계
- Crawl Path
- Indexability
- Canonical
- Redirect
- Sitemap
- Robots
- Heading
- Metadata
- Structured Data
- Content Structure
- Technical duplication / footprint risk
- Mobile usability

여기서 footprint는
검색엔진 탐지 회피나 은폐가 아니라
기술적 중복 / 사이트 품질 위험 요소 점검이라는 의미로 사용한다.

================================================== 11. 신규 Section 05 / 경험과 변화
==========================

Homepage에 BacklinkShop의 핵심 Trust Section을 추가한다.

운영자 제공 사실:

- 8년 이상의 Google SEO 실무 경험
- 다양한 백링크 전략 경험
- PBN
- 해외 백링크
- SNS backlink
- 만료/경매 도메인
- 플랫폼 기반 사이트 구축
- 온페이지 SEO
- 콘텐츠 SEO
- 내부링크
- Technical SEO
- 국내 다수 SEO 대행사가 실제 프로젝트에서 BacklinkShop 서비스를 이용

이 정보를 적극적으로 활용한다.

Heading 추천:

8년 넘게,
검색 결과가 변하는 과정을 직접 경험했습니다.

Supporting:

SEO에서 통하던 방법은 계속 변해왔습니다.

그래서 BacklinkShop은
한 가지 방식만 정답이라고 말하지 않습니다.

Timeline 구조:

과거
↓
도메인
↓
네트워크
↓
콘텐츠와 기술
↓
현재

Timeline 내용 방향:

[과거]

대량 링크와 강한 앵커텍스트만으로도
검색 결과가 크게 움직이던 시기.

[도메인]

만료·경매 도메인과
기존 도메인의 히스토리와 권위를 활용하는
다양한 접근을 경험한 시기.

[플랫폼]

URIWEB
IMWEB
ISWEB

등 사이트 제작 플랫폼 및 하위도메인을 활용한
여러 SEO 구조를 직접 경험.

플랫폼 이름은 설명 목적의 외부 링크로 사용할 수 있다.

운영자가 특별히 요청했으므로
외부 링크에는 `nofollow noopener noreferrer` 적용.

[네트워크]

해외 백링크
PBN
고품질 PBN
SNS 기반 링크

등 다양한 외부 신호를 운영하고 테스트.

[기술 SEO]

콘텐츠
검색 의도
사이트 구조
내부링크
크롤링
인덱싱
페이지 품질

중요성이 점점 커짐.

[NOW]

현재는 하나의 기법이 아니라
사이트 상태와 검색 의도,
경쟁환경을 함께 보고 판단.

중요 Conclusion:

방법은 계속 바뀌었습니다.
그래서 하나의 방법만 고집하지 않습니다.

또는:

무엇을 해야 하는지만큼,
무엇을 하지 말아야 하는지도 경험을 통해 판단합니다.

과거 기법을 현재도 보장되는
검색순위 우회 기법처럼 홍보하지 않는다.

검색엔진 탐지 회피 방법을 상세하게 안내하지 않는다.

================================================== 12. 강한 Brand Trust
==================

운영자가 확인한 실제 사실:

국내 다수 SEO 대행사가
BacklinkShop의 서비스를 실제 프로젝트에 사용한다.

이 사실을 적극적으로 활용한다.

추천 Trust Copy:

SEO를 판매하는 회사들도
BacklinkShop의 서비스를 이용합니다.

Supporting:

국내 SEO 대행사와 마케팅 파트너가
실제 고객 프로젝트에서 BacklinkShop의
백링크 및 SEO 인프라를 활용하고 있습니다.

또는:

일반 사업자뿐 아니라
SEO를 업으로 하는 대행사도 선택하는 서비스.

강한 브랜드 카피는 허용한다.

"국내 최고 수준의 SEO 실행력"

같은 표현도 사용할 수 있다.

단 객관적인 조사 없이:

대한민국 공식 1위
국내 점유율 1위

같은 통계형 표현은 만들지 않는다.

================================================== 13. /about 신규 생성
================

신규 URL:

/about

목적:

SEO 키워드 양산이 아니라
Brand Trust / Experience Page.

Indexable:
YES

Self canonical.

Sitemap 포함.

Breadcrumb 포함.

새로운 Organization Schema 중복 생성 금지.

필요하면 BreadcrumbList만 사용.

추천 Title:

백링크샵 소개 | 8년+ 구글 SEO 실행 경험

구조:

Hero

백링크샵이 하는 일

8년 이상의 SEO 경험

검색 환경 변화 Timeline

직접 다뤄온 SEO 영역

PBN
Backlink
Domain
Platform
Content
On-page
Technical SEO
Internal Linking

국내 SEO 대행사 B2B 협업

SEO를 판단하는 기준

서비스 운영 원칙

현재의 SEO 접근 방식

CTA

Home 경험 Section:

전체 이야기 보기 → /about

Footer에도 About 링크 추가.

Header까지 반드시 추가할 필요는 없다.

================================================== 14. 성공사례 시스템
============

운영자가 직접 제공한 실제 사례 데이터를 사용한다.

정확한 중간 날짜나 중간 순위는 임의 생성하지 않는다.

운영자가 사실로 확인한 공통 흐름:

초기
→ 4~8페이지권
→ 1~2페이지권
→ 최종 결과

를 사용한다.

CASE 1

업종:
강남 피부과

키워드:
지역 + 진료 키워드

연도:
2024

시작:
신규 사이트 / 사이트 없음

최종:
1위

기간:
약 8개월

Timeline:

신규 사이트 구축
→ 검색 결과 4~8페이지권 진입
→ 1~2페이지권 진입
→ 최종 1위

CASE 2

업종:
부산 마사지

키워드:
부산 + 마사지

연도:
2026

시작:
10페이지 밖

최종:
1페이지

기간:
약 6개월

Timeline:

10페이지 밖
→ 4~8페이지권
→ 1~2페이지권
→ 최종 1페이지

CASE 3

업종:
스포츠중계

키워드:
핵심 키워드

연도:
2026

시작:
10페이지 밖

최종:
1페이지

기간:
약 6개월

Timeline:

10페이지 밖
→ 4~8페이지권
→ 1~2페이지권
→ 최종 1페이지

CASE 4

업종:
백링크

키워드:
핵심 키워드

연도:
2021

시작:
신규 사이트 / 사이트 없음

최종:
1페이지

기간:
약 3개월

Timeline:

신규 사이트
→ 4~8페이지권
→ 1~2페이지권
→ 최종 1페이지

CASE 5

업종:
밤알바

키워드:
핵심 키워드

연도:
2025

시작:
10페이지 밖

최종:
1~2위

기간:
약 5개월

Timeline:

10페이지 밖
→ 4~8페이지권
→ 1~2페이지권
→ 최종 1~2위

================================================== 15. Case UI
===========

현재 단순 Card보다
SEO Rank Journey를 보여주는 디자인으로 만든다.

Card 구성:

Industry
Keyword Type
Year
Starting Point
Final Result
Period
Timeline / Progress
Work Type

중간 순위를 정확한 숫자로 표시하지 않는다.

대신 Range 형태:

신규 / 10페이지 밖
↓
4~8페이지권
↓
1~2페이지권
↓
1위 / 1페이지 / 1~2위

사용.

그래프를 만든다면 정확한 Historical data를 위조하지 않는다.

Y-axis exact ranking chart 금지.

대신:

Stage Timeline
Progress Path
Range Band

형태 사용.

표시:

"운영자 제공 프로젝트 기록 기준"

정도의 작은 Footnote 가능.

Homepage에는 대표 사례 3개 정도를 Featured로 보여주고:

/cases

에서는 5개 전체를 보여준다.

Featured 추천:

강남 피부과
백링크
부산 마사지

필요하면 디자인 Balance에 따라 변경 가능.

================================================== 16. Homepage Section 06 / 성공 사례
===============================

Heading:

검색 결과는 말보다 기록으로 보여드립니다.

또는:

직접 경험한 검색 성장 사례.

Case Card 3개.

각 카드:

업종
목표
시작
최종
기간
간단 Timeline

전체 사례 보기 → /cases

가짜 Search Console Screenshot을 생성하지 않는다.

실제 Screenshot asset이 없으면
UI 형태의 Timeline만 사용한다.

================================================== 17. Homepage Section 07 / 예산과 전략
================================

기존 Pricing Preview를 제거한다.

홈에서 개별 서비스 가격을 직접 보여주지 않는다.

Heading:

정해진 가격표보다
현재 사이트에 필요한 작업이 먼저입니다.

핵심 Copy:

구글 상위노출은
정해진 금액을 지불하고
정해진 기간을 기다리면 자동으로 달성되는 상품이 아닙니다.

현재 사이트 상태,
목표 키워드,
경쟁 환경,
필요한 작업 범위에 따라
전략과 예산이 달라집니다.

추가:

월 예산과 목표를 알려주시면
현재 상황에서 우선순위가 높은 작업부터 구성합니다.

다사이트 Highlight 추가.

Heading:

여러 사이트를 운영하시나요?

Copy:

여러 사이트를 함께 진행하면
분석, 인프라, 운영과 리포팅의 일부를 병렬화할 수 있습니다.

사이트 수가 많아질수록
각 사이트를 개별적으로 진행하는 것보다
효율적인 비용 구조를 설계할 수 있습니다.

정확한 할인율이나 가짜 예시 금액은 만들지 않는다.

CTA:

여러 사이트를 함께 운영하고 있다면 맞춤 구성을 확인해보세요

================================================== 18. /pricing Page
=================

기존 `/pricing` SEO intent는 유지한다.

Primary:
백링크 가격

Home에서 가격을 숨긴다고
/pricing까지 없애거나 noindex 하지 않는다.

가격 Page에서는:

- 백링크 가격이 달라지는 이유
- 서비스에 따라 가격 구조가 다른 이유
- 예산 결정 방식
- 비용 대비 우선순위
- 다사이트 운영
- 상담형 구성

을 충분히 설명한다.

현재 실제 config/pricing.ts 값이 있다면
기존 Business Source of Truth와 일치하는지 유지한다.

운영자의 이번 요청은
"홈 서비스 카드와 Home Pricing Preview에서
가격으로 먼저 이탈시키지 않는다"

는 방향으로 이해한다.

================================================== 19. Homepage Section 08 / SEO 인사이트
==================================

현재 Blog Card 디자인을 전면 개선한다.

현재 문제:

Category
Title
Description

텍스트만 나열되어
Blog Card가 문서 Link처럼 보인다.

신규 Article Card:

Thumbnail
Category
Title
Short Summary
Updated / Reading Time optional
Arrow

Desktop에서 Visual Thumbnail이 반드시 보이게 한다.

Blog 대표이미지 사용.

================================================== 20. Blog Image Architecture
===========================

모든 Blog Article metadata에:

thumbnail
heroImage
imageAlt

필드를 추가한다.

한 이미지로 thumbnail/hero를 공유할 수 있지만
필드 구조는 확장 가능하게 만든다.

외부 Hotlink 의존은 최소화한다.

이번 작업에서는 먼저
브랜드 일관성이 있는 자체 SEO Illustration / SVG Diagram을 생성하는 것을 추천한다.

예:

백링크 가격
→ Price Factors Diagram

업체 선택
→ Agency Evaluation Checklist Visual

PBN
→ PBN Concept Architecture Diagram

고품질 백링크
→ Backlink Quality Signal Diagram

링크빌딩
→ Link Building Strategy Flow

SVG를:

/public/images/blog/

등에 관리.

Next/Image 또는 적절한 이미지 렌더링 사용.

Alt text 작성.

================================================== 21. Blog Article Visual
=======================

장문 Article에 텍스트만 계속 이어지지 않도록 한다.

각 글에 의미 있는 Visual 2~4개 사용 가능.

다만 장식용 Stock Photo를 문단마다 넣지 않는다.

Visual 목적:

설명
비교
구조
Process
Timeline

중심.

예:

링크주스 흐름
사이트 내부링크 구조
PBN 개념도
가격 결정 요소
SEO 의사결정 Flow

================================================== 22. CTA System V2
=================

모든 CTA 아래에 존재하는:

Telegram으로 연결됩니다

문구를 전부 삭제한다.

"Telegram" 영문 안내도 제거한다.

CTA는 페이지/섹션 문맥에 따라 달라진다.

전부 같은 문구를 반복하지 않는다.

CTA examples:

Home Hero:

상위노출이 막혀있나요? 현재 사이트를 진단해보세요

Home Problem:

링크를 구축해도 노출이 안되나요? 원인을 확인해보세요

Home Strategy:

내 사이트에 필요한 SEO 전략 확인하기

Home Service:

고품질의 백링크 전략을 시작해보세요

PBN:

경쟁 키워드에 더 강한 백링크가 필요하신가요?

On-page:

백링크 전에 사이트 구조부터 점검해보세요

Content SEO:

콘텐츠는 많은데 노출이 안되나요?

Google Ranking:

목표 키워드가 왜 안 오르는지 확인해보세요

Agency:

지금 받고 있는 SEO 작업이 적절한지 확인해보세요

Budget:

예산에 맞는 최적의 SEO 구성을 받아보세요

Final:

사이트 주소와 목표 키워드를 보내주세요

CTA Button은 너무 긴 경우:

Short Heading

- Button Label

구조로 나눌 수 있다.

예:

링크를 구축해도 노출이 안되나요?

[ 원인 진단 요청하기 ]

모든 Telegram CTA는:

username = goat82

중앙 config를 사용.

기존 Analytics:

telegram_click

이벤트 이름 유지.

source
position
page
label

tracking 유지.

================================================== 23. Form / Chatbot
==================

이번 작업에서 만들지 않는다.

현재 최종 Conversion:

Telegram only.

Form:
Later

Web Chat:
Later

AI SEO Consultant:
Later

어떠한 Placeholder Chatbot 버튼도 만들지 않는다.

================================================== 24. /google-ranking 대폭 확장
=========================

이 페이지는 사이트에서 가장 중요한 SEO Page 중 하나다.

Target Cluster:

구글 상위노출
구글 상단노출
구글 1페이지

자연스럽게 모두 포함.

keyword stuffing 금지.

추천 Title:

구글 상위노출 · 구글 상단노출 SEO 전략 | 백링크샵

추천 H1:

구글 상위노출은
한 가지 SEO 작업으로 만들어지지 않습니다.

현재 Page보다 콘텐츠 깊이를 크게 높인다.

단 글자 수를 채우기 위한 반복 콘텐츠 금지.

다음 구조를 권장:

1.

Hero

2.

현재 이런 문제를 겪고 있나요?

순위가 계속 흔들림
콘텐츠를 추가해도 변화 없음
백링크를 추가해도 변화 없음
경쟁사이트만 상승

3.

구글 상위노출이 어려운 이유

4.

검색 결과가 결정되는 큰 구조

콘텐츠
검색 의도
페이지 품질
사이트 구조
내부링크
외부 권위
도메인 역사
경쟁환경
Technical SEO

5.

8년간 경험한 Google SEO의 변화

6.

과거 링크 중심 SEO

7.

만료·경매 도메인 전략의 변화

8.

플랫폼 / 하위도메인 활용 방식의 변화

URIWEB
IMWEB
ISWEB

경험 언급.

9.

PBN과 외부 신호

10.

콘텐츠와 Search Intent

11.

On-page SEO

12.

사이트 Architecture

13.

Internal Linking

14.

Crawling / Indexing

15.

Technical SEO

16.

백링크를 해도 순위가 안 오르는 이유

17.

순위가 갑자기 떨어지는 이유

18.

신규 사이트와 기존 사이트의 차이

19.

경쟁 키워드와 Long-tail 전략

20.

BacklinkShop이 실제로 진단하는 순서

21.

관련 서비스

PBN
Plan
On-page
Content

22.

실제 Case Study

23.

FAQ

24.

관련 SEO Guide

25.

Final CTA

================================================== 25. Google Ranking Experience Copy
==================================

중요한 Brand narrative:

과거에는 대량의 스팸성 링크만 구축해도
검색 결과가 크게 움직이는 경우가 있었습니다.

검색 환경이 발전하면서
단순 링크 개수만으로 설명하기 어려워졌습니다.

만료·경매 도메인,
플랫폼 기반 사이트,
해외 PBN,
고품질 PBN,
SNS backlink 등
다양한 방법이 사용되어 왔습니다.

BacklinkShop은 이런 변화들을
8년 이상 직접 현장에서 경험해왔습니다.

현재는:

콘텐츠
사이트 구조
내부링크
Technical SEO
도메인 상태
외부 권위
검색 의도
경쟁 환경

을 함께 봅니다.

이 섹션의 목적은
"검색 알고리즘을 속이는 비법"

을 홍보하는 것이 아니라:

"다양한 시대와 방법을 직접 경험했기 때문에
현재 상황을 더 넓게 판단할 수 있다"

는 전문성을 전달하는 것이다.

================================================== 26. 다른 Landing Hero
===================

Homepage만 Center Hero.

나머지:

/backlink
/backlink-agency
/pricing
/services/\*
/google-ranking
/about

은 Left Align 유지 가능.

오른쪽 영역이 비어 보인다면:

의미 있는 Diagram
Process
Small Timeline
Service Illustration

등을 넣을 수 있다.

하지만 단순히 빈 공간을 채우기 위한
가짜 Dashboard Panel은 만들지 않는다.

가독성이 좋아진다고 판단될 때만 사용.

================================================== 27. /backlink 유지
================

/backlink는 현재:

백링크란
뜻
효과
종류
품질
Dofollow
PBN
구매
가격
판단기준

정보 Pillar로 유지한다.

Home H1에서 백링크를 강하게 사용한다고 해서
/backlink를 삭제하거나 redirect하지 않는다.

Intent:

Home = Commercial
/backlink = Educational

로 구분한다.

================================================== 28. Internal Linking 보강
=======================

새 `/about` 추가 후:

Home Experience
→ /about

/google-ranking Experience
→ /about

Footer
→ /about

Case:

관련 서비스
→ Money page

Google Ranking:

/services/onpage-seo
/services/content-seo
/services/pbn-backlink
/backlink
/cases
/about
관련 Blog

자연스럽게 연결.

기존 seo-graph architecture를 확장한다.

페이지에 무작위로 hardcode하지 않는다.

================================================== 29. Image SEO
=============

새 이미지마다:

descriptive filename
width/height
alt
optimized format

사용.

Hero / Blog 대표 이미지는
OG image와 혼동하지 않는다.

Article hero image가 적합하면
Article structured data image에도 반영 가능.

Structured data 내용은
실제 페이지와 일치해야 한다.

================================================== 30. Cases Structured Data
=========================

사례 숫자/순위를 AggregateRating이나 Review로 변환하지 않는다.

Case Study 자체는 일반 콘텐츠로 표현.

실제 보이는 데이터만 사용.

운영자가 제공하지 않은:

중간 정확 순위
특정 날짜
CTR
Traffic
ROI
Conversion

생성 금지.

================================================== 31. Current Google SEO Risk Language
====================================

PBN / paid backlink / expired domain 이야기를
Google-safe / 패널티 없음 / 100% 안전

이라고 표현하지 않는다.

과거 경험을 자랑하는 것과
현재 Google 정책을 무시하는 것은 별개다.

PBN 페이지에서 기존의 균형 잡힌 리스크 설명을 유지한다.

"위험이 0인 링크 작업은 없다"

는 방향 유지 가능.

================================================== 32. Blog Copy
=============

기존 글 5편의 SEO 구조를 다시 쓰지 않는다.

이번 작업의 주 목적은:

Visual
Thumbnail
Diagram
Readability
Internal CTA

개선.

불필요한 대규모 AI Rewrite 금지.

================================================== 33. Responsive
==============

특히 새 UI는:

390px
Tablet
Desktop

검사.

Homepage 4-card:

Desktop 4
Tablet 2
Mobile 1

Hero Center copy가 Mobile에서
과도하게 5~6줄로 깨지지 않도록 한다.

Graph visual이 텍스트와 겹치지 않아야 한다.

Timeline은 Mobile에서 Vertical Timeline으로 전환.

================================================== 34. Accessibility
=================

SVG Icon:
aria-hidden 적절히 사용.

의미 있는 이미지:
alt.

Card 자체가 Link이면
nested interactive element 만들지 않는다.

Focus state.

Keyboard.

Reduced motion.

================================================== 35. Performance
===============

새로운 Visual 때문에 현재 속도를 크게 떨어뜨리지 않는다.

금지:

heavy animation library
background video
large autoplay asset
수 MB stock images
외부 script 기반 visual

가능하면:

CSS
SVG
optimized local image

사용.

================================================== 36. Metadata / Schema Regression 방지
===================================

UI 변경 후:

canonical
title
description
H1
robots
sitemap
JSON-LD

전수 재검사.

새 /about만 Metadata 추가.

Home Metadata 변경 시 기존:

백링크 구매
백링크 판매
고품질 백링크
PBN

Commercial relevancy가 사라지지 않는지 확인.

================================================== 37. FAQ Schema
==============

기존 FAQ Page 구조를 함부로 깨지 않는다.

다만 FAQ rich result 자체를 목표 KPI로 삼지 않는다.

화면 FAQ와 schema text가 다르면 안 된다.

================================================== 38. QA
======

작업 완료 후 반드시 실행:

tsc
vitest
next build
seo-qa
Production SEO audit script가 있다면 실행

검사:

canonical errors = 0
broken link = 0
schema parse error = 0
sitemap redirect URL = 0
noindex leak = 0
console error = 0
mobile overflow = 0

/blog/what-is-backlink
→ /backlink

301 유지.

/signup
→ /

301 유지.

================================================== 39. Visual QA
=============

최소 Screenshot / Browser inspect:

Desktop:

/
/services/pbn-backlink
/pricing
/backlink
/google-ranking
/about
/blog
/blog/high-quality-backlink-criteria
/cases

Mobile:

/
/services/pbn-backlink
/pricing
/backlink
/google-ranking
Blog Article

특히 확인:

Hero
Card Border
Typography
Section spacing
CTA
Image
Timeline
Blog card
Mobile wrapping

================================================== 40. Git
=======

작업 전:

git status
git branch
git remote -v
git fetch origin

실행.

origin/main에 다른 Commit이 추가되어 있으면
force push하지 않는다.

기존 변경을 덮어쓰지 않는다.

안전하게 통합.

모든 Test 성공 후 Commit.

추천 Commit:

feat: enhance backlinkshop UI content and trust experience

origin/main push.

GitHub push 후 Vercel Production 자동 배포.

================================================== 41. Production Verify
=====================

배포 후 실제 Production 확인.

특히:

/
/about
/google-ranking
/cases
/blog

200.

새 /about:

canonical 정상
sitemap 포함
indexable.

기존 Redirect 보존.

GA4 보존.

Telegram CTA:

goat82

정상 연결.

telegram_click 정상.

================================================== 42. 최종 보고
=========

작업 후 다음만 명확하게 보고.

1. Homepage 변경
2. Hero 변경
3. Section Label 한글화
4. Design V2 변경
5. 서비스 7종
6. Experience Section
7. /about
8. Case Study 5개
9. Budget Section
10. Blog Image System
11. CTA 변경
12. /google-ranking 확장
13. Internal Linking
14. Metadata/Schema 영향
15. Test 결과
16. Commit SHA
17. Push 결과
18. Production 결과
19. 사람이 눈검수해야 할 URL

================================================== 43. 마지막 원칙
==========

이번 작업의 목표는:

"더 화려한 AI 사이트"

가 아니다.

목표는:

깔끔했던 BacklinkShop을
더 신뢰할 수 있고,
더 풍부하고,
더 전문적으로 보이며,
계속 읽고 싶고,
상담하고 싶은 SEO 브랜드로 만드는 것이다.

Pure White 기반 디자인은 유지한다.

Blue Accent 유지.

과도한 장식 금지.

그러나 이전처럼
텍스트 + 얇은 카드만 반복되는
밋밋한 화면도 금지한다.

Content
Visual
Icon
Diagram
Timeline
Trust
Case
CTA

를 균형 있게 사용한다.

지금부터 기존 repository와 Production 상태를 먼저 확인한 뒤,
위 명세에 따라 2차 리뉴얼을 구현하라.

사업정보나 확인되지 않은 데이터를 묻기 위해 작업을 중단하지 말고,
제공된 사실만 사용해서 가능한 부분을 완성하라.
