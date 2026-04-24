-- v1.0 - 주문 보고서 업로드/다운로드 기능 (2026-02-05)
-- 목적: 관리자 업로드 파일을 주문에 연결하고 고객이 다운로드하도록 확장

-- ============================================================
-- 1) 스토리지 버킷 생성 (private)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('order-reports', 'order-reports', false)
on conflict (id) do nothing;

-- ============================================================
-- 2) orders 테이블에 보고서 메타데이터 컬럼 추가
-- ============================================================
alter table orders
  add column if not exists report_path text null,
  add column if not exists report_filename text null,
  add column if not exists report_content_type text null,
  add column if not exists report_uploaded_at timestamptz null,
  add column if not exists report_uploaded_by uuid null references auth.users(id);

-- 보고서 업로드 시점 정렬용 인덱스
create index if not exists orders_report_uploaded_at_idx
  on orders(report_uploaded_at desc);

-- ============================================================
-- 완료
-- ============================================================
