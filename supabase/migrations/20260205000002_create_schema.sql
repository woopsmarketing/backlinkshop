-- ============================================================
-- 마이그레이션: 백링크샵 스키마 생성
-- 작성일: 2026-02-05
-- 설명: PRD 섹션 4 기반 전체 테이블 + 인덱스 + RLS 정책 생성
-- ============================================================

-- ============================================================
-- 1. profiles (권한 관리)
-- ============================================================
-- Supabase Auth의 auth.users와 1:1 매핑
-- 유저 권한(role) 관리용 테이블

create table profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user', -- 'user' | 'admin'
  created_at timestamptz not null default now()
);

-- RLS 활성화
alter table profiles enable row level security;

-- RLS 정책: 유저는 자기 프로필만 조회 가능
create policy "Users can view their own profile"
  on profiles for select
  using (user_id = auth.uid());

-- RLS 정책: 서비스는 모든 프로필 접근 가능 (admin 권한 체크용)
-- 참고: 서버에서 service_role로 조회하므로 RLS 우회됨


-- ============================================================
-- 2. credit_balances (크레딧 잔액 캐시)
-- ============================================================
-- 빠른 조회용 잔액 캐시 테이블
-- 진실은 credit_ledger에 있음

create table credit_balances (
  user_id uuid primary key references auth.users(id) on delete cascade,
  balance bigint not null default 0, -- 크레딧 잔액 (음수 불가)
  updated_at timestamptz not null default now()
);

-- RLS 활성화
alter table credit_balances enable row level security;

-- RLS 정책: 유저는 자기 잔액만 조회 가능
create policy "Users can view their own balance"
  on credit_balances for select
  using (user_id = auth.uid());


-- ============================================================
-- 3. credit_ledger (크레딧 원장 - 진실의 원천)
-- ============================================================
-- 모든 크레딧 증감 기록
-- amount: 양수(충전) / 음수(차감)

create table credit_ledger (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  amount bigint not null, -- 크레딧 증감량 (+/-)
  reason text not null, -- 'signup_bonus' | 'coupon' | 'manual_topup' | 'product_purchase'
  ref_type text null, -- 'order' | 'coupon' | 'topup_request'
  ref_id text null, -- 연결되는 레코드의 pk
  created_at timestamptz not null default now()
);

-- 인덱스: 유저별 시간순 조회 최적화
create index on credit_ledger(user_id, created_at desc);

-- RLS 활성화
alter table credit_ledger enable row level security;

-- RLS 정책: 유저는 자기 원장만 조회 가능
create policy "Users can view their own ledger"
  on credit_ledger for select
  using (user_id = auth.uid());


-- ============================================================
-- 4. products (상품)
-- ============================================================

create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  price bigint not null, -- 크레딧 가격
  category text not null, -- 'backlink' | 'seo' | 'content'
  status text not null default 'active', -- 'active' | 'inactive'
  metadata jsonb default '{}'::jsonb, -- 추가 정보 (DA, DR 등)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 인덱스: 카테고리 + 상태별 조회 최적화
create index on products(category, status);

-- 인덱스: 상태별 조회 최적화
create index on products(status);

-- RLS 활성화
alter table products enable row level security;

-- RLS 정책: 모든 유저가 활성 상품 조회 가능
create policy "Anyone can view active products"
  on products for select
  using (status = 'active');

-- RLS 정책: Admin은 모든 상품 조회 가능 (서버에서 service_role로 처리)


-- ============================================================
-- 5. orders (주문)
-- ============================================================

create table orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references products(id) on delete restrict,
  quantity int not null default 1,
  total_price bigint not null, -- 구매 당시 가격 × 수량
  status text not null default 'pending', -- 'pending' | 'processing' | 'completed' | 'failed'
  note text null, -- 사용자 요청사항
  created_at timestamptz not null default now(),
  completed_at timestamptz null
);

-- 인덱스: 유저별 최신 주문 조회 최적화
create index on orders(user_id, created_at desc);

-- 인덱스: 상태별 최신 주문 조회 최적화 (admin용)
create index on orders(status, created_at desc);

-- 인덱스: 상품별 주문 조회
create index on orders(product_id);

-- RLS 활성화
alter table orders enable row level security;

-- RLS 정책: 유저는 자기 주문만 조회 가능
create policy "Users can view their own orders"
  on orders for select
  using (user_id = auth.uid());


-- ============================================================
-- 6. coupons (쿠폰/무료체험)
-- ============================================================

create table coupons (
  code text primary key,
  amount bigint not null, -- 지급 크레딧
  max_uses int not null default 1, -- 최대 사용 횟수
  used_count int not null default 0, -- 현재 사용 횟수
  expires_at timestamptz null, -- 만료일 (null이면 무제한)
  created_by uuid null references auth.users(id), -- 생성자
  created_at timestamptz not null default now()
);

-- RLS 활성화
alter table coupons enable row level security;

-- RLS 정책: 쿠폰은 서버에서만 검증 (클라이언트 직접 조회 차단)
-- 참고: 정책 없음 = 기본 차단 (service_role만 접근 가능)


-- ============================================================
-- 7. coupon_redemptions (쿠폰 사용 내역)
-- ============================================================

create table coupon_redemptions (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  code text not null references coupons(code) on delete restrict,
  redeemed_at timestamptz not null default now(),
  unique(user_id, code) -- 유저당 쿠폰 1회만 사용 가능
);

-- 인덱스: 유저별 사용 내역 조회
create index on coupon_redemptions(user_id, redeemed_at desc);

-- 인덱스: 쿠폰별 사용 내역 조회
create index on coupon_redemptions(code, redeemed_at desc);

-- RLS 활성화
alter table coupon_redemptions enable row level security;

-- RLS 정책: 유저는 자기 사용 내역만 조회 가능
create policy "Users can view their own redemptions"
  on coupon_redemptions for select
  using (user_id = auth.uid());


-- ============================================================
-- 8. topup_requests (수동 충전 요청)
-- ============================================================

create table topup_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  package_id text not null, -- 'starter_300' | 'pro_1000' 등
  amount bigint not null, -- 요청 크레딧
  status text not null default 'requested', -- 'requested' | 'approved' | 'rejected'
  note text null, -- 유저 메모
  processed_by uuid null references auth.users(id), -- 승인/거절한 admin
  processed_at timestamptz null, -- 처리 시각
  created_at timestamptz not null default now()
);

-- 인덱스: 상태별 최신 요청 조회 최적화 (admin용)
create index on topup_requests(status, created_at desc);

-- 인덱스: 유저별 요청 내역 조회
create index on topup_requests(user_id, created_at desc);

-- RLS 활성화
alter table topup_requests enable row level security;

-- RLS 정책: 유저는 자기 충전 요청만 조회 가능
create policy "Users can view their own topup requests"
  on topup_requests for select
  using (user_id = auth.uid());

-- RLS 정책: 유저는 자기 충전 요청만 생성 가능
create policy "Users can create their own topup requests"
  on topup_requests for insert
  with check (user_id = auth.uid());


-- ============================================================
-- 완료
-- ============================================================
