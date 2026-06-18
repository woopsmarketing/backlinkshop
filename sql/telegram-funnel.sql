-- ─────────────────────────────────────────────────────────────
-- 텔레그램 전환 깔때기 측정 쿼리
-- Supabase SQL Editor에 그대로 붙여넣어 실행하세요.
--
-- 데이터 모델: telegram_sessions 1행 = CTA 클릭 1건
--   · source     : 어느 CTA에서 눌렀나 (result_mid / result_bottom / sticky /
--                   keyword_analysis / simulation / pending / failed / lp_section7 ...)
--   · ref        : 광고그룹 (audit / rank / backlink / agency / blog / instagram ...)
--   · chat_id    : NULL → 클릭만 / NOT NULL → 실제로 봇에 진입함 (= 전환)
--   · created_at : 클릭 시각
-- ─────────────────────────────────────────────────────────────


-- ① source별: 어느 CTA가 실제 봇 진입까지 끌고 오나
select
  source                                                  as cta_위치,
  count(*)                                                as 클릭수,
  count(chat_id)                                          as 봇진입수,
  round(100.0 * count(chat_id) / nullif(count(*), 0), 1)  as 전환율_pct
from telegram_sessions
group by source
order by 클릭수 desc;


-- ② 광고그룹(ref)별: 어느 광고가 봇까지 데려오나 (예산 재배분 판단)
select
  coalesce(ref, '(직접/없음)')                            as 광고그룹,
  count(*)                                                as 클릭수,
  count(chat_id)                                          as 봇진입수,
  round(100.0 * count(chat_id) / nullif(count(*), 0), 1)  as 전환율_pct
from telegram_sessions
group by ref
order by 클릭수 desc;


-- ③ 일자별 추이 (최근 14일)
select
  date_trunc('day', created_at)::date                     as 날짜,
  count(*)                                                as 클릭수,
  count(chat_id)                                          as 봇진입수,
  round(100.0 * count(chat_id) / nullif(count(*), 0), 1)  as 전환율_pct
from telegram_sessions
where created_at > now() - interval '14 days'
group by 1
order by 1 desc;


-- ④ 전체 요약 (한 줄)
select
  count(*)                                                as 총클릭,
  count(chat_id)                                          as 총봇진입,
  round(100.0 * count(chat_id) / nullif(count(*), 0), 1)  as 전체전환율_pct,
  min(created_at)::date                                   as 집계시작일
from telegram_sessions;


-- ⑤ source × ref 교차 (어느 광고의 어느 CTA 조합이 가장 잘 먹히나)
select
  coalesce(ref, '(직접)')                                 as 광고그룹,
  source                                                  as cta_위치,
  count(*)                                                as 클릭수,
  count(chat_id)                                          as 봇진입수
from telegram_sessions
group by ref, source
order by 클릭수 desc
limit 30;
