-- SEO 분석 결과 저장용 컬럼 추가
-- 온페이지 SEO 점검 주문 시 분석 결과를 저장하고, 크론잡이 지연 발송

ALTER TABLE orders ADD COLUMN IF NOT EXISTS seo_report_data jsonb DEFAULT NULL;

COMMENT ON COLUMN orders.seo_report_data IS '온페이지 SEO 자동 분석 결과 (parsedData + analysisHtml + score). 크론잡이 5분 후 이메일 발송 시 사용';
