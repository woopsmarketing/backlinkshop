-- v1.0 - RLS 정책 추가 (2026-02-05)
-- 목적: 주문/쿠폰 사용에 필요한 INSERT/SELECT 정책 보강

-- ============================================================
-- 1. profiles: 회원가입 시 프로필 생성 허용
-- ============================================================
do $$
begin
  create policy "Users can create their own profile on signup"
    on profiles for insert
    with check (user_id = auth.uid());
exception
  when duplicate_object then null;
end $$;

-- ============================================================
-- 2. orders: 유저 주문 생성 허용
-- ============================================================
do $$
begin
  create policy "Users can create their own orders"
    on orders for insert
    with check (user_id = auth.uid());
exception
  when duplicate_object then null;
end $$;

-- ============================================================
-- 3. coupon_redemptions: 쿠폰 사용 기록 생성 허용
-- ============================================================
do $$
begin
  create policy "Users can create their own redemptions"
    on coupon_redemptions for insert
    with check (user_id = auth.uid());
exception
  when duplicate_object then null;
end $$;

-- ============================================================
-- 4. coupons: 쿠폰 검증용 조회 허용 (읽기 전용)
-- ============================================================
do $$
begin
  create policy "Anyone can read coupons for validation"
    on coupons for select
    using (true);
exception
  when duplicate_object then null;
end $$;

