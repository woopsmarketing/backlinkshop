# 배포 이후 할 일 체크리스트

> 작성일: 2026-04-15
> 커밋: `adadd70` — Google Ads 전환 파이프라인 정비 + LP 개선
> 전제: Vercel 자동 배포 완료 (보통 push 후 2~4분)

---

## STEP 0. 배포 완료 확인 (가장 먼저)

1. Vercel 대시보드 → 프로젝트 → Deployments 탭
2. 최상단 배포가 **Ready (초록)** 상태인지 확인
3. 배포 완료 후 아래 URL 4개가 전부 정상 열리는지 시크릿 브라우저로 확인:
   ```
   https://www.backlinkshop.co.kr/lp/seo
   https://www.backlinkshop.co.kr/lp/seo?ref=backlink
   https://www.backlinkshop.co.kr/lp/seo?ref=rank
   https://www.backlinkshop.co.kr/lp/seo?ref=audit
   https://www.backlinkshop.co.kr/lp/seo?ref=agency
   ```
4. 각 URL마다 **Hero 헤드라인 문구가 4종 다르게** 나오면 정상
   - backlink: "고품질 백링크로 구글 1페이지 진입"
   - rank: "구글 1페이지, 지금 무료로 시작하세요"
   - audit: "내 사이트 SEO, 10분 만에 무료 진단"
   - agency: "SEO 대행 전, 진단부터 받아보세요"

---

## STEP 1. GA4 실시간 보고서로 이벤트 작동 확인 (10분)

### 1-1. 내가 직접 테스트 플로우 1회 수행

시크릿 브라우저 새 창에서:

1. GA4 접속 (`vnfm0580@gmail.com`) → 속성 `SEOworld` 선택 → 왼쪽 메뉴 **보고서 → 실시간 (Realtime)**
2. 다른 탭에서 `https://www.backlinkshop.co.kr/lp/seo?ref=rank` 접속
3. GA4 실시간 보고서에 **`page_view`** 이벤트 즉시 표시되어야 함 (30초 내)
4. LP 페이지에서 사이트 URL(예: `https://example.com`) 입력 → **"무료 SEO 진단 시작하기"** 버튼 클릭
5. GA4 실시간 보고서에 **`lp_form_submit`** 이벤트 표시되어야 함 ⭐
6. 이어서 로그인 페이지 나오면 **구글 로그인** 진행 (반드시 아직 가입 안 한 구글 계정으로!)
7. 로그인 완료 후 상품 페이지로 자동 이동되면 URL에 `?welcome=1` 포함되어 있어야 함
8. GA4 실시간 보고서에 **`sign_up`** 이벤트 표시되어야 함 ⭐

### 1-2. 3개 이벤트 전부 확인되면 파이프라인 성공

- ✅ `page_view` 정상
- ✅ `lp_form_submit` 정상
- ✅ `sign_up` 정상

### 1-3. 만약 하나라도 안 보이면

- 브라우저 F12 → Console 탭 → 빨간 에러 있는지 확인 → 스크린샷
- 브라우저 F12 → Network 탭 → `google-analytics.com/g/collect` 또는 `analytics.google.com/g/collect` 요청 200 OK 인지 확인
- 광고차단기/uBlock 등 꺼져있는지 확인 (GA4 차단하는 확장 많음)
- 문제 해결 못 하면 스크린샷 저장 후 Claude 에게 알리기

---

## STEP 2. GA4 에서 이벤트를 "주요 이벤트"로 승격 (5분)

### 2-1. GA4 → 관리 → 데이터 표시 → 이벤트

현재 위치: **"주요 이벤트"** 탭에 `close_convert_lead`, `purchase`, `qualify_lead` 3개가 있음

### 2-2. "최근 활동" 탭 클릭

이벤트 목록이 모두 나옴. 다음 3개 이벤트 옆의 **별 ⭐ 아이콘을 클릭해서 ON** 으로 바꾸세요:

- [ ] `sign_up` ← 별 ON (가장 중요, 현재 OFF 상태)
- [ ] `lp_form_submit` ← 별 ON (배포 후 1~2시간 뒤 목록에 나타남)
- [ ] `free_order_complete` ← 별 ON (선택, 보조 관찰용)

### 2-3. 기존에 이미 별표 된 것들

- `purchase` ← 이미 별 ON 유지
- `close_convert_lead`, `qualify_lead` ← 사용 안 하는 이벤트면 별 OFF (선택)

### 2-4. 주의사항

- **이벤트가 목록에 없으면** 아직 배포 후 데이터가 한 번도 안 들어온 것. Step 1 테스트를 다시 한 번 수행한 뒤 1~2시간 기다리기
- 별을 ON 한 순간부터 **앞으로 발화되는 이벤트**가 주요 이벤트로 집계됨 (과거 데이터는 소급 적용 안 됨)

---

## STEP 3. Google Ads 에서 GA4 이벤트 가져오기 (10분)

### 3-1. `qkrrmaehd8390@gmail.com` 계정으로 Google Ads 접속

### 3-2. 왼쪽 사이드바 → 목표 → 전환 → 요약

### 3-3. `+ 새 전환 액션` 버튼 클릭

### 3-4. "가져오기" 선택

### 3-5. "Google Analytics 4 속성" 선택

### 3-6. `SEOworld` 속성 선택

### 3-7. 가져올 이벤트 목록에서 다음 체크

- [ ] `lp_form_submit`
- [ ] `sign_up` (이미 가져와진 상태면 체크박스 비활성화돼 있을 것 — 넘어가기)
- [ ] `free_order_complete` (선택)

### 3-8. "계속" → "가져오기" 클릭

### 3-9. 생성된 전환 액션 각각의 설정 조정

**전환 → 요약 → `잠재고객` 또는 `기타` 그룹 아래 나타난 `lp_form_submit` 클릭**

- 카테고리: **잠재고객 (Lead)**
- 값: `각 전환에 동일한 값 사용` → **1000** KRW
- 횟수: **1회 (One)**
- 우선순위: **보조 전환 (Secondary)** ← 절대 주 전환으로 올리지 말 것
- 저장

**`sign_up` 은 이미 설정돼 있으므로 건드리지 마세요.** (현재 `9.50` 전환 누적, 주 전환, 운영중 상태 유지)

---

## STEP 4. 광고그룹 재편 확인 (전략서 참조)

`GOOGLE_ADS_STRATEGY.md` 의 **2장, 3장** 내용대로 광고그룹 A, B, C, D 생성 중인 작업 완료.

각 광고그룹의 최종 URL 에 `?ref=` 파라미터 붙이는 것 잊지 마세요:

| 광고그룹         | 최종 URL                                             |
| ---------------- | ---------------------------------------------------- |
| A. 백링크 구매   | `https://www.backlinkshop.co.kr/lp/seo?ref=backlink` |
| B. 구글 상위노출 | `https://www.backlinkshop.co.kr/lp/seo?ref=rank`     |
| C. SEO 진단      | `https://www.backlinkshop.co.kr/lp/seo?ref=audit`    |
| D. SEO 대행      | `https://www.backlinkshop.co.kr/lp/seo?ref=agency`   |

### 4-1. 입찰 전략을 "클릭수 최대화 (최대 CPC 5,000원)" 로 변경

기존 "전환수 최대화" 로는 지금 노출이 깨어나지 않음. 1~2주차는 데이터 모으기에 집중.

### 4-2. 일일 예산 20,000원 확인

### 4-3. 제외 키워드 일괄 추가

`GOOGLE_ADS_STRATEGY.md` 2장 각 광고그룹의 "제외 키워드" 섹션 참고. 공통으로:
`무료`, `뜻`, `방법`, `하는법`, `블로그`, `티스토리`, `강의`, `자격증`, `학원`

---

## STEP 5. 24시간 후 검증 (다음 날 아침)

### 5-1. GA4 에서 `lp_form_submit`, `sign_up` 이벤트 수가 어제 대비 늘어났는지 확인

- GA4 → 보고서 → 참여도 → 이벤트
- 지난 24시간 필터
- `lp_form_submit`, `sign_up` 수 확인

### 5-2. Google Ads 전환 열에 숫자가 찍히기 시작했는지 확인

- Google Ads → 캠페인 → 전환 열 또는 `모든 전환` 열
- "지난 1일" 기간으로 필터
- 0 이 아니면 파이프라인 성공

### 5-3. 캠페인 진단 경고가 사라졌는지 확인

- Google Ads → 대시보드 → 캠페인 진단
- "더 적은 검색어를 타겟팅함" 경고가 사라지거나 `상태: 운영 가능` 으로 변경되어야 함

---

## STEP 6. 주간 점검 (매주 월요일 30분)

`GOOGLE_ADS_STRATEGY.md` 6장 운영 루틴 참조:

- [ ] 그룹별 CTR, CPC, 전환율 점검
- [ ] CTR 1% 미만 광고 문구 일시중지 후 새 버전 작성
- [ ] 검색어 보고서에서 의도 불일치 검색어 → 제외 키워드 추가
- [ ] 예산 소진률 85~100% 인지 확인

---

## 문제 발생 시 체크포인트

| 증상                                                        | 먼저 확인할 것                                                       |
| ----------------------------------------------------------- | -------------------------------------------------------------------- |
| GA4 실시간에 `lp_form_submit` 안 보임                       | Vercel 배포 완료? / 광고차단기 OFF? / F12 Network 에서 gtag 요청?    |
| `sign_up` 이벤트가 발화하지만 Google Ads 전환 수 증가 안 함 | GA4 주요 이벤트로 표시됐는지? / Google Ads 에서 가져오기 완료했는지? |
| 광고그룹이 여전히 "거의 게재되지 않음"                      | 품질점수 낮음 → 키워드와 광고 카피의 의미 매칭 다시 점검             |
| 클릭만 오고 가입 0                                          | 로그인 페이지의 구글 OAuth 흐름 수동 테스트 / Supabase 로그 확인     |
| `?welcome=1` 이 URL에 안 붙음                               | auth/callback 로그 확인 / `ensureUserInitialized` 에러               |

---

## 핵심 요약

**오늘 이후 내가 해야 할 일 (순서 고정)**:

1. Vercel 배포 Ready 확인
2. 시크릿 브라우저로 LP → 폼 → 구글 로그인 테스트 (새 계정)
3. GA4 실시간 보고서에서 3개 이벤트(`page_view`, `lp_form_submit`, `sign_up`) 확인
4. GA4 "이벤트" 에서 `sign_up`, `lp_form_submit` 별표 ON
5. Google Ads 에서 `lp_form_submit` 가져오기 → 보조 전환으로 설정
6. 광고그룹 재편 마무리 (전략서 2장)
7. 입찰 전략 "클릭수 최대화" 로 변경
8. 24시간 후 결과 확인

**건드리지 말 것**:

- 기존 `sign_up` 전환 (9.5 누적 데이터)
- 기존 `구매` 전환 2개
- Vercel 환경변수 `NEXT_PUBLIC_GOOGLE_ADS_ID` 추가 → **불필요**

---

_문의/막힘: Claude Code 에 해당 단계 번호 + 스크린샷 공유하면 이어서 도와드립니다._
