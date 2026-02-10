-- ============================================================
-- 마이그레이션: 크레딧 트랜잭션 함수
-- 작성일: 2026-02-05
-- 설명: 크레딧 증감을 원자적으로 처리하는 함수
-- ============================================================

-- ============================================================
-- apply_credit_delta: 크레딧 증감 처리 함수
-- ============================================================
-- 입력:
--   - p_user_id: 대상 유저 ID
--   - p_amount: 증감량 (+충전, -차감)
--   - p_reason: 사유 ('signup_bonus', 'coupon', 'manual_topup', 'product_purchase')
--   - p_ref_type: 참조 타입 ('order', 'coupon', 'topup_request' 등)
--   - p_ref_id: 참조 레코드 ID
--
-- 동작:
--   1. credit_ledger에 기록 추가
--   2. credit_balances 잔액 업데이트
--   3. 잔액이 음수가 되면 rollback (차감 실패)
--
-- 반환:
--   - 성공 시: 새로운 잔액
--   - 실패 시: exception 발생

create or replace function apply_credit_delta(
  p_user_id uuid,
  p_amount bigint,
  p_reason text,
  p_ref_type text default null,
  p_ref_id text default null
)
returns bigint
language plpgsql
security definer -- 함수는 정의자(서버) 권한으로 실행 (RLS 우회)
as $$
declare
  v_new_balance bigint;
begin
  -- 1. 원장에 기록 추가
  insert into credit_ledger (user_id, amount, reason, ref_type, ref_id)
  values (p_user_id, p_amount, p_reason, p_ref_type, p_ref_id);

  -- 2. 잔액 테이블 업데이트 (없으면 생성)
  insert into credit_balances (user_id, balance, updated_at)
  values (p_user_id, p_amount, now())
  on conflict (user_id)
  do update set
    balance = credit_balances.balance + p_amount,
    updated_at = now()
  returning balance into v_new_balance;

  -- 3. 잔액 음수 방지
  if v_new_balance < 0 then
    raise exception '크레딧 잔액 부족: 현재 잔액 %, 요청 차감 %', v_new_balance - p_amount, -p_amount;
  end if;

  -- 4. 새 잔액 반환
  return v_new_balance;
end;
$$;

-- ============================================================
-- 함수 사용 예시 (테스트용 - 실제 운영에서는 삭제 가능)
-- ============================================================

-- 예시 1: 회원가입 보너스 지급 (300 크레딧)
-- select apply_credit_delta(
--   'user-uuid-here'::uuid,
--   300,
--   'signup_bonus',
--   null,
--   null
-- );

-- 예시 2: 쿠폰 사용 (1000 크레딧)
-- select apply_credit_delta(
--   'user-uuid-here'::uuid,
--   1000,
--   'coupon',
--   'coupon',
--   'WELCOME2026'
-- );

-- 예시 3: 상품 구매 (500 크레딧 차감)
-- select apply_credit_delta(
--   'user-uuid-here'::uuid,
--   -500,
--   'product_purchase',
--   'order',
--   'order-uuid-here'
-- );

-- 예시 4: 수동 충전 승인 (5000 크레딧)
-- select apply_credit_delta(
--   'user-uuid-here'::uuid,
--   5000,
--   'manual_topup',
--   'topup_request',
--   'topup-uuid-here'
-- );

-- ============================================================
-- 완료
-- ============================================================
