-- ============================================================
-- 마이그레이션: 기존 테이블 삭제
-- 작성일: 2026-02-05
-- 설명: 스키마 재설계를 위해 모든 기존 테이블을 CASCADE로 삭제
-- ============================================================

-- 1. 기존 테이블 삭제 (존재하는 경우)
-- CASCADE 옵션으로 연관된 외래키, 인덱스, 정책도 함께 삭제

drop table if exists coupon_redemptions cascade;
drop table if exists coupons cascade;
drop table if exists topup_requests cascade;
drop table if exists orders cascade;
drop table if exists products cascade;
drop table if exists credit_ledger cascade;
drop table if exists credit_balances cascade;
drop table if exists profiles cascade;

-- 2. 기존 함수 삭제 (존재하는 경우)
drop function if exists apply_credit_delta cascade;

-- ============================================================
-- 완료
-- ============================================================
