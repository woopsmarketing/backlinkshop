# backlinkshop.co.kr 리뉴얼 후속 수정 + Production 배포

현재 리포지토리에는 general.md의 전면 리뉴얼 작업이 이미 완료되어 있다.

작업 결과 문서:

- RENEWAL-REPORT-2026-08-27.md

현재 변경사항은 아직 commit되지 않은 상태다.

중요:
현재 리뉴얼 구조를 다시 설계하거나 대규모로 뒤엎지 마라.
이미 완성된 IA, 디자인 시스템, 컴포넌트 시스템, 내부링크 시스템을 유지하면서 아래 후속 수정만 정확하게 수행한다.

최종적으로 모든 검증을 통과하면 현재 Git 브랜치에 commit하고 origin에 push한다.

이 프로젝트는 GitHub에 push되면 Vercel이 자동으로 Production 배포한다.

force push는 절대 하지 않는다.

==================================================

1. # /backlink 와 /blog/what-is-backlink 중복 제거

현재:

/backlink
Primary Keyword = 백링크
약 9,700자 Pillar Page

/blog/what-is-backlink
Primary Keyword = 백링크
별도 Featured Article

두 페이지의 검색 의도가 지나치게 겹친다.

SEO Cannibalization 및 콘텐츠 역할 중복을 피하기 위해 다음 구조로 변경한다.

최종:

/backlink
= "백링크" Primary Pillar Page

/blog/what-is-backlink
= 제거 후 301 → /backlink

작업:

1.  기존 /blog/what-is-backlink 콘텐츠를 분석한다.

2.  그 페이지에만 존재하면서 /backlink의 품질을 실제로 높이는 유용한 내용이 있다면 /backlink에 자연스럽게 통합한다.

단순 문장 중복은 합치지 않는다.

3.  /backlink는 정보성 Pillar Page 역할을 유지한다.

4.  /blog/what-is-backlink는 301 permanent redirect → /backlink.

5.  다음에서 /blog/what-is-backlink를 제거 또는 교체한다.

- sitemap
- blog index
- featured article
- article registry
- seo graph
- RelatedArticles
- RelatedContent
- breadcrumbs
- structured data
- 내부 링크
- 기타 configuration

6.  기존 내부링크가 /blog/what-is-backlink를 가리킨다면 목적에 맞게 /backlink로 변경한다.

7.  Redirect chain 없이 1 hop 301이어야 한다.

================================================== 2. /signup redirect 수정
==================================================

현재:

/signup → /login

하지만 새 공개 사이트는 회원가입/로그인 기반 전환 구조가 아니다.

Primary Conversion은 Telegram 상담이다.

따라서:

/signup → /

로 301 변경한다.

이 Redirect는 기존 외부 링크 또는 과거 Google Ads URL을 위한 fallback 역할이다.

새 사이트의 어느 UI에서도 /signup으로 링크하지 않는다.

Repository 전체에서:

"/signup"

참조를 검색한다.

새 공개 사이트 내부 링크나 CTA에 사용되고 있다면 제거한다.

단:

Google Ads 외부 계정 설정은 repository 밖이므로 임의로 변경할 수 없다.

작업 완료 보고서에:

"Google Ads에서 /signup final_url을 직접 / 또는 적절한 신규 랜딩 URL로 교체 필요"

TODO를 명확히 남긴다.

================================================== 3. 홈페이지 Keyword Count를 목표값으로 사용하지 말 것
==================================================

현재 보고서에는 홈 기준:

백링크 구매 10회
고품질 백링크 8회
PBN 백링크 20회

라고 기록되어 있다.

이 횟수를 SEO 목표 또는 QA 기준으로 사용하면 안 된다.

확인할 것:

scripts/seo-qa.mjs
기타 테스트
config
page source

에서 특정 키워드의 "최소 출현 횟수"를 강제하고 있는 로직이 있는지 검사한다.

있다면 제거한다.

단 다음 세 표현 자체는 중요한 기존 SEO 자산이므로 자연스럽게 유지한다.

- 백링크 구매
- 고품질 백링크
- PBN 백링크

원칙:

Title / Description / H1 / Intro / 서비스 설명 등 자연스러운 위치에서 사용.

특정 횟수를 맞추기 위해 반복하지 않는다.

특히 홈에서 "PBN 백링크"가 불필요하게 반복되는지 사람이 읽는 관점으로 검토한다.

반복이 어색하다면 자연스럽게 줄인다.

단:

기존 리뉴얼 전체 카피를 다시 작성하지 않는다.

최소 수정만 수행한다.

홈 Primary Intent는 계속:

백링크 구매

여야 한다.

================================================== 4. Blog 5편 콘텐츠 품질 검수
==================================================

/blog/what-is-backlink를 제거한 후 남는 핵심 아티클을 검토한다.

- backlink-price-guide
- how-to-choose-backlink-agency
- what-is-pbn-backlink
- high-quality-backlink-criteria
- link-building-guide

목표:

AI가 일반적인 정보를 요약한 것처럼 보이는 문장을 줄이고,
BacklinkShop 사이트 전체에서 정의한 판단 기준 및 작업 관점을 더 명확하게 만든다.

하지만 매우 중요:

실제 경험, 프로젝트 결과, 고객 사례, 통계, 내부 운영 방식을 임의로 만들어내지 않는다.

Repository에서 검증 가능한 사실만 사용할 수 있다.

콘텐츠마다 가능하면 다음 중 하나를 강화한다.

백링크 가격:
가격이 어떤 요소에 따라 달라지는지 구체적 판단 기준.

업체 선택:
실제 업체 비교 시 사용자가 확인해야 할 체크리스트.

PBN:
PBN 구조, 품질 판단 기준, 리스크를 균형 있게 설명.

고품질 백링크:
DA/DR 단일 숫자만으로 품질을 판단할 수 없는 이유.

링크빌딩:
링크 구축을 하나의 링크 구매 행위가 아니라 SEO 전략 흐름으로 설명.

근거가 없는 경우 억지로 독창성을 만들지 않는다.

필요하면 콘텐츠는 그대로 두고 TODO로 보고한다.

================================================== 5. Case / Business Info / Policy 값은 생성 금지
==================================================

다음은 운영자만 확정할 수 있으므로 절대 임의 생성하지 않는다.

BUSINESS_INFO
사업자등록번호
통신판매업 신고번호
대표자
주소
개인정보보호책임자

실제 Case Study 수치

환불정책의 실제 운영 조건

실제 DB 판매가격과 다른 가격

config에 TODO가 현재 존재한다면 그대로 유지한다.

누락되어 있다면 TODO 형태로 중앙 configuration에만 남긴다.

화면 여기저기에 TODO 텍스트를 노출하지 않는다.

================================================== 6. 기존 핵심 구조 보존
==================================================

다음은 이번 작업에서 변경하지 않는다.

홈 /
/backlink-agency
/pricing
/services
/services/pbn-backlink
/services/plan-backlink
/services/onpage-seo
/services/content-seo
/google-ranking
/cases
/faq
/blog
정책 페이지

seo-graph architecture

RelatedContent architecture

TelegramCTA architecture

telegram_click 기존 GA4 event name

styles/
master.css
tokens.css
reset.css
utilities.css
components.css
blog.css

현재 Pure White 중심 디자인 시스템.

현재 Component architecture.

기존 /lp/\* 광고 랜딩.

기존 /shop/\* 로그인 뒤 상품 시스템.

GA4
Google Ads tracking
GSC verification.

================================================== 7. SEO 구조 재검증
==================================================

수정 후 전체 Public URL을 다시 검사한다.

모든 indexable URL:

200

self canonical

unique title

unique description

unique H1

sitemap 포함

깨진 internal link 없음

/blog/what-is-backlink:

301 → /backlink

sitemap 제외

/signup:

301 → /

sitemap 제외

다음은 계속 noindex:

/login
/shop/_
/dashboard
/credits
/orders
/admin/_
/email-preview
/analyze/_
/lp/_

존재하지 않는 URL은 정상 404.

================================================== 8. Internal Linking 재검증
==================================================

/backlink를 "백링크" Pillar의 명확한 정본으로 만든다.

백링크 관련 Blog에서 적절한 경우:

→ /backlink

링크 유지.

Money Pages:

/
/backlink-agency
/pricing
/services/pbn-backlink
/google-ranking

에 대한 기존 link equity 구조를 훼손하지 않는다.

seo-graph.ts에서 삭제된 article 때문에 깨지는 reference가 없어야 한다.

================================================== 9. Build / QA
==================================================

코드 수정 완료 후 반드시 다음을 실행한다.

npm 또는 현재 repository의 package manager 확인 후 적절히 실행.

필수:

npx tsc --noEmit

vitest 전체

next build

node scripts/seo-qa.mjs

그리고 기존에 수행했던 방식대로 가능하면:

- redirect status 검사
- sitemap URL 200 검사
- internal link 검사

모든 오류를 해결한다.

기존 코드의 unrelated warning을 이번 작업 때문에 억지로 수정하지 않는다.

================================================== 10. Git Diff 최종 검토
==================================================

Commit 전:

git status

git diff

를 확인한다.

다음이 없는지 확인:

secret
API key
.env
credential
불필요한 debug code
console.log
temporary test file
artifact
large generated files

현재 리뉴얼 변경사항과 이번 수정사항이 의도한 내용인지 확인한다.

================================================== 11. Commit
==================================================

모든 검증 성공 시 현재 변경사항을 하나의 리뉴얼 commit으로 만든다.

추천 commit message:

feat: launch SEO-focused backlinkshop renewal

또는 repository convention이 존재한다면 그 convention을 따른다.

commit 후 commit SHA를 기록한다.

================================================== 12. GitHub Push / Vercel Production 배포
==================================================

현재 branch와 remote를 먼저 확인한다.

git branch
git remote -v

정상적인 production branch이고 origin이 확인되는 경우 push한다.

force push 금지.

history rewrite 금지.

정상적인 push만 수행한다.

GitHub push가 성공하면 Vercel 자동 배포가 연결되어 있으므로 별도 수동 Vercel deploy는 하지 않는다.

가능하다면 push 후 public production URL을 HTTP 요청으로 확인한다.

최소 확인:

/
/backlink
/backlink-agency
/pricing
/services/pbn-backlink
/google-ranking
/blog
/faq
/cases

그리고:

/blog/what-is-backlink → 301 /backlink

/signup → 301 /

실제 production deployment가 아직 반영되지 않아 확인할 수 없는 경우 실패로 간주하지 말고:

"GitHub push 성공 / Vercel 자동 배포 대기 또는 확인 필요"

상태를 정확하게 보고한다.

================================================== 13. 최종 보고
==================================================

작업 완료 후 짧고 명확하게 다음을 출력한다.

1. 수정한 내용
2. /backlink 통합 결과
3. /signup 변경 결과
4. Homepage keyword repetition 변경 여부
5. Blog 콘텐츠에서 수정한 내용
6. Build/Test/SEO QA 결과
7. Commit SHA
8. Push 결과
9. Production URL 확인 결과
10. 아직 운영자가 처리해야 하는 TODO

특히 운영자 TODO에서 반드시 다시 알려줄 것:

- BUSINESS_INFO 입력
- 실제 가격 DB 대조
- 실제 환불정책 확인
- 실제 검증 가능한 Case 입력
- Google Ads의 /signup final_url 변경
- 신규 sitemap GSC 제출

================================================== 14. 금지
==================================================

이번 작업에서 새로운 서비스 페이지를 추가하지 않는다.

무료 SEO Tool을 만들지 않는다.

백링크 유형별 thin page를 만들지 않는다.

새 디자인 테마를 만들지 않는다.

회원 시스템을 다시 공개 Navigation에 넣지 않는다.

근거 없는 숫자를 만들지 않는다.

가짜 후기 / 사례를 만들지 않는다.

SEO를 이유로 키워드를 기계적으로 반복하지 않는다.

기존 Telegram event name을 변경하지 않는다.

기존 광고 LP를 삭제하지 않는다.

force push하지 않는다.

이 작업의 목적은:

"완료된 리뉴얼을 다시 만드는 것"

이 아니라

"Production 배포 전에 남은 구조적 문제를 정리하고 안정적으로 배포하는 것"

이다.

이제 repository를 분석하고 작업을 시작하라.
