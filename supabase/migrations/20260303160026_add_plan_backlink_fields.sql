-- ============================================================
-- 마이그레이션: 플랜 백링크 주문 필드 추가
-- 작성일: 2026-03-03
-- 설명: 플랜 백링크 주문을 위한 서브키워드 옵션 및 비율 필드 추가
-- ============================================================

-- 1. orders 테이블에 서브키워드 관련 컬럼 추가
ALTER TABLE orders
ADD COLUMN use_sub_keywords boolean DEFAULT false,
ADD COLUMN main_keyword_ratio integer DEFAULT 70,
ADD COLUMN sub_keyword_ratio integer DEFAULT 30;

-- 컬럼에 대한 코멘트 추가
COMMENT ON COLUMN orders.use_sub_keywords IS '서브키워드 사용 여부 (플랜 백링크에서 사용)';
COMMENT ON COLUMN orders.main_keyword_ratio IS '메인키워드 비율 (%) - 기본값 70%';
COMMENT ON COLUMN orders.sub_keyword_ratio IS '서브키워드 비율 (%) - 기본값 30%';

-- ============================================================
-- 완료
-- ============================================================
