-- ============================================================
-- 마이그레이션: 주문 필드 추가 및 프로필 이메일 추가
-- 작성일: 2026-03-03
-- 설명: PBN 백링크 주문을 위한 사이트 URL, 키워드 필드 추가
--       프로필에 이메일 저장 컬럼 추가
-- ============================================================

-- 1. orders 테이블에 사이트 URL, 키워드 컬럼 추가
ALTER TABLE orders
ADD COLUMN site_url text,
ADD COLUMN keywords text;

-- 사이트 URL과 키워드 컬럼에 대한 코멘트 추가
COMMENT ON COLUMN orders.site_url IS 'PBN 백링크 대상 사이트 URL (PBN 상품에서 필수)';
COMMENT ON COLUMN orders.keywords IS 'PBN 백링크 타겟 키워드 (PBN 상품에서 필수)';

-- 2. profiles 테이블에 이메일 컬럼 추가
ALTER TABLE profiles
ADD COLUMN email text;

-- 이메일 컬럼에 대한 코멘트 추가
COMMENT ON COLUMN profiles.email IS '사용자 이메일 주소 (auth.users.email 복사본)';

-- 3. 기존 사용자의 이메일을 auth.users에서 복사
UPDATE profiles
SET email = auth.users.email
FROM auth.users
WHERE profiles.user_id = auth.users.id
  AND profiles.email IS NULL;

-- ============================================================
-- 완료
-- ============================================================
