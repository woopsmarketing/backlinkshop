-- AI 상담 챗봇 레이트리밋용 사용량 테이블.
-- 익명성 보장을 위해 원본 IP가 아닌 해시(ip_hash)만 저장한다.
-- service role(서버)에서만 접근하므로 RLS 활성화 + 정책 없음(= 일반 접근 차단).

create table if not exists ai_chat_usage (
  ip_hash      text primary key,
  count        int not null default 0,
  window_start timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table ai_chat_usage enable row level security;
