# PRD: 백링크샵 커머스 플랫폼 MVP

**버전**: 2.0  
**작성일**: 2026-02-05  
**목표**: 7일 내 MVP 완성 + 크레딧 기반 커머스 + 수동충전 운영

---

## 1. 시스템 목표와 원칙

### 목표
- 유저가 크레딧을 충전하고 상품을 구매하는 "단순 커머스" 완성
- 결제 없이도 운영자가 수동충전으로 유료 운영 가능
- 7일 MVP에 맞게 최소 기능으로 설계

### 핵심 원칙 (변경 금지)
1. **크레딧은 "돈"이라서 원장(ledger)으로만 증감 기록**
2. **잔액(balance)은 빠른 조회용 캐시. 진실은 ledger**
3. **클라이언트에서 크레딧/승인 업데이트 금지 (서버에서만)**
4. **Admin 기능은 role 기반 접근 제어 + 서버 검증 필수**

---

## 2. 기술 구성 (Vercel MVP)

| 레이어 | 기술 |
|--------|------|
| **Frontend** | Next.js App Router |
| **UI** | Tailwind CSS + shadcn/ui |
| **Auth/DB** | Supabase (Auth + Postgres) |
| **Server** | Next.js Route Handler / Server Actions |
| **Job** | DB 상태머신 + 서버 지연 처리 (초기) |
| **로그** | campaign_runs 테이블에 JSON 저장 |

---

## 3. 폴더 구조

```
/app
  /(auth)/login              # 로그인 페이지
  /dashboard                 # 대시보드 (잔액, 주문 요약)
  /credits                   # 크레딧 관리 (쿠폰, 충전 요청)
  /products                  # 상품 목록
  /products/[id]             # 상품 상세
  /orders                    # 내 주문 내역
  /admin/topups              # 관리자: 충전 승인
  /admin/coupons             # 관리자: 쿠폰 관리
  /admin/products            # 관리자: 상품 관리
  /admin/orders              # 관리자: 주문 관리
  /api/webhooks              # 나중 결제용 자리

/server
  /supabase                  # client/server helpers
  /queries                   # 읽기 전용 함수
  /mutations                 # 쓰기 + 트랜잭션 + 권한 체크
  /actions                   # server actions wrapper
  /auth                      # role, session 검증
  /jobs                      # campaign 실행 로직

/lib
  constants.ts               # 상수 (크레딧 가격, 패키지 등)
  validators.ts              # zod 스키마
  utils.ts                   # 유틸 함수
```

---

## 4. 데이터베이스 설계

### 4.1 profiles (권한 관리)
- Supabase Auth의 `auth.users`와 1:1 매핑
- `role`: `'user'` | `'admin'`

```sql
create table profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user',
  created_at timestamptz not null default now()
);
```

### 4.2 credit_balances (잔액 캐시)
- 빠른 조회용 캐시
- 진실은 `credit_ledger`

```sql
create table credit_balances (
  user_id uuid primary key references auth.users(id) on delete cascade,
  balance bigint not null default 0,
  updated_at timestamptz not null default now()
);
```

### 4.3 credit_ledger (크레딧 원장 - 진실)
- 모든 크레딧 증감은 여기에만 기록
- `amount`: 양수(충전) / 음수(차감)
- `reason`: 충전/차감 사유

```sql
create table credit_ledger (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  amount bigint not null,
  reason text not null,   -- 'signup_bonus' | 'coupon' | 'manual_topup' | 'campaign_run'
  ref_type text null,     -- 'campaign_run' | 'coupon' | 'topup_request'
  ref_id text null,       -- 연결되는 pk
  created_at timestamptz not null default now()
);

create index on credit_ledger(user_id, created_at desc);
```

### 4.4 products (상품)
```sql
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  price bigint not null, -- 크레딧 가격
  category text not null, -- 'backlink' | 'seo' | 'content' 등
  status text not null default 'active', -- active | inactive
  metadata jsonb default '{}'::jsonb, -- 추가 정보 (DA, DR 등)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index on products(category, status);
```

### 4.5 orders (주문)
```sql
create table orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references products(id) on delete restrict,
  quantity int not null default 1,
  total_price bigint not null, -- 구매 당시 가격 × 수량
  status text not null default 'pending', -- pending | processing | completed | failed
  note text null, -- 사용자 요청사항
  created_at timestamptz not null default now(),
  completed_at timestamptz null
);

create index on orders(user_id, created_at desc);
create index on orders(status, created_at desc);
```

### 4.6 coupons (쿠폰/무료체험)
```sql
create table coupons (
  code text primary key,
  amount bigint not null,
  max_uses int not null default 1,
  used_count int not null default 0,
  expires_at timestamptz null,
  created_by uuid null references auth.users(id),
  created_at timestamptz not null default now()
);

create table coupon_redemptions (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  code text not null references coupons(code) on delete restrict,
  redeemed_at timestamptz not null default now(),
  unique(user_id, code)
);
```

### 4.7 topup_requests (수동 충전 요청)
```sql
create table topup_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  package_id text not null, -- 'starter_300' | 'pro_1000'
  amount bigint not null,
  status text not null default 'requested', -- requested | approved | rejected
  note text null,
  processed_by uuid null references auth.users(id),
  processed_at timestamptz null,
  created_at timestamptz not null default now()
);

create index on topup_requests(status, created_at desc);
```

---

## 5. RLS (Row Level Security) 정책

### 원칙
- **유저는 자기 데이터만 접근** (`orders`, `credit_ledger`, `topup_requests`, `coupon_redemptions`, `credit_balances`)
- **products는 모든 유저가 읽기 가능** (status='active'만)
- **coupons는 서버에서만 검증** (직접 조회 차단)
- **admin 페이지는 서버에서 `profiles.role='admin'` 검사 후 접근**

### 구현 팁
- RLS를 "매우 타이트"하게 설정
- 서버는 **유저 세션 기반**으로 처리 (Service Role 지양)
- admin 전용 로직은 별도 분리

---

## 6. 핵심 비즈니스 로직

### 6.1 크레딧 가감 함수 (서버 전용)
**입력**: `user_id`, `amount` (+/-), `reason`, `ref_type`, `ref_id`

**동작**:
1. `credit_ledger`에 insert
2. `credit_balances` update (`balance = balance + amount`)
3. `balance < 0`이면 rollback (차감 실패)

**추천**: Postgres 함수로 구현

### 6.2 상품 구매 흐름
1. `product` 조회 (가격, 재고 확인)
2. `total_price` 계산 (가격 × 수량)
3. `apply_credit_delta(user_id, -total_price, 'product_purchase', 'order', order_id)`
4. `orders` 생성 (`status=pending`)
5. admin이 수동 처리 → `status=processing` → 완료 시 `status=completed`

### 6.3 쿠폰 사용 흐름
**화면**: `/credits` 에서 코드 입력

**서버 검증**:
1. 쿠폰 존재 & 만료 안 됨
2. `used_count < max_uses`
3. `coupon_redemptions`에 중복 체크 (`user_id`, `code`)
4. `used_count + 1`
5. 크레딧 지급 (`reason='coupon'`, `ref=code`)

### 6.4 수동 충전 흐름
**유저**:
- "충전 요청" 생성 (`package_id`, `amount`, `note`)

**Admin 승인**:
1. `topup_requests.status='requested'` 확인
2. 승인 시:
   - 크레딧 지급 (`reason='manual_topup'`, `ref=topup_request_id`)
   - `topup_requests.status='approved'`, `processed_by`, `processed_at` 기록

---

## 7. API / Server Actions 설계

### 7.1 유저 액션
- `GET /server/queries/getBalance`
- `POST /server/mutations/redeemCoupon(code)`
- `GET /server/queries/getProducts(category?)`
- `POST /server/mutations/createOrder(product_id, quantity, note)`
- `GET /server/queries/getMyOrders()`
- `POST /server/mutations/createTopupRequest(package_id)`

### 7.2 Admin 액션
- `GET /server/queries/adminListTopupRequests(status)`
- `POST /server/mutations/adminApproveTopup(request_id)`
- `POST /server/mutations/adminRejectTopup(request_id)`
- `POST /server/mutations/adminCreateCoupon(amount, max_uses, expires_at)`
- `POST /server/mutations/adminCreateProduct(name, price, category, description)`
- `POST /server/mutations/adminUpdateProduct(id, data)`
- `GET /server/queries/adminListOrders(status)`
- `POST /server/mutations/adminUpdateOrderStatus(order_id, status)`

**구현 방식**: Next.js **Server Actions** (MVP에 가장 빠름)

---

## 8. 화면 설계 (Next.js App Router)

### 로그인
- Supabase Auth 이메일 로그인 (매직링크 or 패스워드)
- 첫 로그인 시:
  - `profiles` row 생성 (`role=user`)
  - `credit_balances` row 생성
  - (선택) `signup_bonus +300` 자동 지급

### `/dashboard`
- 현재 잔액 (크게 표시)
- 최근 주문 요약 (개수)
- CTA: "상품 보기", "크레딧 충전"

### `/credits`
- 현재 잔액
- 쿠폰 입력 폼
- 충전 패키지 카드 + "충전 요청" 버튼
- 최근 원장 내역 테이블 (`credit_ledger`)

### `/products`
- 상품 카드 그리드
- 카테고리 필터
- 각 카드: 이름, 가격(크레딧), 설명, "구매하기" 버튼

### `/products/[id]`
- 상품 상세 정보
- 수량 선택
- 총 가격 표시
- 요청사항 입력
- "구매하기" 버튼

### `/orders`
- 내 주문 내역 테이블
- 상태 필터 (pending, processing, completed)
- 각 row: 상품명, 수량, 가격, 상태, 날짜

### `/admin/topups`
- `requested` 리스트
- Approve/Reject 버튼
- 필터 (`status`)

### `/admin/coupons`
- 쿠폰 생성 폼
- 쿠폰 리스트

### `/admin/products`
- 상품 생성 폼
- 상품 리스트 (수정/활성화/비활성화)

### `/admin/orders`
- 모든 주문 리스트
- 상태 변경 (pending → processing → completed)
- 필터 (상태, 날짜)

---

## 9. 주문 처리 흐름

### MVP 버전 (수동 처리)
1. 유저가 주문 생성 → `status=pending`
2. Admin이 주문 확인 → `status=processing` 변경
3. Admin이 작업 완료 → `status=completed` 변경

### 2주차부터 (자동화 옵션)
- 특정 상품은 즉시 처리 (status=completed)
- 이메일 알림 연동
- Worker로 자동 처리

---

## 10. 배포/도메인 이전 전략

### Vercel MVP 운영
- 도메인은 처음부터 "최종 도메인"에 연결 (권장)
- 나중에 VPS로 옮길 때: DNS A/AAAA만 VPS로 변경하면 끝

### 도메인 변경이 필요한 경우
- 구 도메인(Vercel) → 301 리디렉션 → 신 도메인(VPS)
- 중요 페이지(`/dashboard` 등)는 301보다 "안내 페이지"가 안전 (세션 꼬임 방지)

---

## 11. Subagent 설계 (필요한 것들)

"바이브코딩"으로 빠르게 진행하기 위한 역할 분리

### 필수 Subagents (7개)

1. **decision-terminator**
   - 역할: 기능 제안 시 YES/NO 결정
   - 규칙: "7일 내 매출/체험에 직접 기여 없으면 NO"

2. **nextjs-app-architect**
   - 역할: App Router 구조, 서버/클라 경계, 폴더 설계 고정

3. **supabase-schema-engineer**
   - 역할: DB/함수/인덱스/RLS 작성 + 마이그레이션 정리

4. **credit-ledger-guardian**
   - 역할: 크레딧 트랜잭션/원장 무결성 검증 (잔액 음수 방지, 중복 지급 방지)

5. **commerce-ops-designer**
   - 역할: 상품/주문 관리 플로우 + Admin UI 설계

6. **ui-kit-builder**
   - 역할: shadcn/ui 기반 커머스 페이지 UI 완성 (통일감)

7. **e2e-test-engineer**
   - 역할: Playwright로 "로그인→쿠폰충전→상품구매→주문완료" 플로우

---

## 12. Skills 설계

Cursor에서 반복 호출할 것들

### 꼭 있으면 생산성이 미친 듯이 올라가는 스킬 (8개)

1. **skill:generate-supabase-migration**
   - 입력: 테이블/정책 요구사항
   - 출력: `supabase/migrations/*.sql` 완성본

2. **skill:rls-policy-writer**
   - 입력: 테이블명 + 접근 규칙
   - 출력: RLS enable + policy 세트

3. **skill:credit-ledger-transaction**
   - 입력: delta(+/-), reason, ref
   - 출력: Postgres 함수 + 테스트 케이스 (간단 SQL)

4. **skill:nextjs-server-action-template**
   - 입력: action 이름 + 입력 스키마
   - 출력: zod validation + 권한 체크 + mutation 호출 템플릿

5. **skill:shadcn-page-scaffold**
   - 입력: 페이지명
   - 출력: 페이지 레이아웃/컴포넌트 스캐폴딩

6. **skill:admin-page-guard**
   - 입력: admin 페이지 경로
   - 출력: role 체크 가드 + 403 처리

7. **skill:run-job-simulator**
   - 입력: step 목록 + 시간 간격
   - 출력: `campaign_runs` log append + 완료 처리 로직

8. **skill:playwright-happy-path**
   - 입력: baseURL + flow
   - 출력: e2e 테스트 1개 (고정 시나리오)

---

## 13. 개발 진행 티켓 (순서대로)

멈출 일이 없도록 순서 고정

| # | 티켓 | 설명 |
|---|------|------|
| 1 | Next.js 초기 셋업 | App Router, Tailwind, shadcn |
| 2 | Supabase 프로젝트 연결 | auth 로그인 구현 |
| 3 | DB 마이그레이션 1차 | Profiles, Balances, Ledger, Products, Orders |
| 4 | RLS 1차 | 유저 자기 데이터만 + Products 읽기 |
| 5 | credits 화면 | 잔액/원장 표시 |
| 6 | 쿠폰 테이블 + redeem 로직 | 쿠폰 사용 기능 |
| 7 | 상품 목록/상세 | Products CRUD |
| 8 | 주문 생성 로직 | 차감 + order row + 상태 관리 |
| 9 | 내 주문 내역 | 주문 리스트 |
| 10 | topup_request 생성 | 유저 충전 요청 |
| 11 | admin 승인 페이지 | 충전/주문 승인 + role 가드 |
| 12 | admin 상품 관리 | 상품 생성/수정/비활성화 |
| 13 | 랜딩 페이지 | 가격표 + 무료 크레딧 안내 |
| 14 | E2E 1개 플로우 | 전체 시나리오 테스트 |

---

## 14. 성공 지표 (MVP 완료 기준)

- [ ] 회원가입 → 쿠폰 → 크레딧 지급 정상 작동
- [ ] 상품 조회 → 구매 → 크레딧 차감 → 주문 생성 정상
- [ ] 충전 요청 → admin 승인 → 크레딧 지급 정상
- [ ] 잔액 음수 방지 (트랜잭션 롤백)
- [ ] admin 페이지 접근 제어 정상
- [ ] admin 상품 생성 → 유저가 구매 가능
- [ ] admin 주문 상태 변경 정상
- [ ] E2E 테스트 통과

---

## 15. 제약사항 / 기술 부채 (나중에 해결)

### 1주차에서 제외되는 것들
- 실제 결제 연동 (PortOne/Stripe)
- 실제 Worker/Queue (Celery, BullMQ 등)
- 이메일 발송
- 고급 대시보드 (차트, 통계)
- 모바일 최적화
- 다국어 지원

### 2주차 이후 추가 예정
- 결제 연동 (자동 충전)
- Worker로 Job 실행
- 이메일 알림 (충전 승인, 캠페인 완료)
- 대시보드 차트

---

## 16. 참고 자료

- [Next.js App Router 공식 문서](https://nextjs.org/docs/app)
- [Supabase 공식 문서](https://supabase.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Playwright](https://playwright.dev/)

---

**작성자**: AI Assistant  
**최종 수정**: 2026-02-05
