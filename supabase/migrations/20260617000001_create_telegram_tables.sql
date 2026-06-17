-- 텔레그램 봇 연동: 세션(임시 매핑) + 사용자(누적 정보)

-- ─────────────────────────────────────────────
-- 1) telegram_sessions
--    LP/분석결과 페이지에서 "텔레그램 1:1 상담" 클릭 시 발급되는 임시 세션.
--    deeplink(t.me/<bot>?start=<id>)의 start 파라미터로 사용된다.
-- ─────────────────────────────────────────────
CREATE TABLE telegram_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lp_request_id UUID REFERENCES lp_requests(id) ON DELETE SET NULL,
  source TEXT NOT NULL,                    -- 'result_mid' / 'result_bottom' / 'pending' / 'sticky' / 'failed' / 'lp_section7' 등
  ref TEXT,                                -- 'audit' / 'rank' / 'backlink' / 'agency' / 'blog' / 'instagram' 등
  chat_id BIGINT,                          -- 봇 진입 후 채워짐
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  started_at TIMESTAMPTZ,                  -- 사용자가 봇 /start 누른 시각
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '24 hours')
);

CREATE INDEX idx_telegram_sessions_chat_id ON telegram_sessions(chat_id);
CREATE INDEX idx_telegram_sessions_lp_request ON telegram_sessions(lp_request_id);
CREATE INDEX idx_telegram_sessions_created_at ON telegram_sessions(created_at DESC);

ALTER TABLE telegram_sessions ENABLE ROW LEVEL SECURITY;
-- API route(admin client) 에서만 접근. 일반 사용자 RLS 없음.


-- ─────────────────────────────────────────────
-- 2) telegram_users
--    chat_id 기준 영구 누적 정보. 같은 사용자가 여러 도메인 분석해도 1명으로 추적.
-- ─────────────────────────────────────────────
CREATE TABLE telegram_users (
  chat_id BIGINT PRIMARY KEY,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  language_code TEXT,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  total_sessions INT NOT NULL DEFAULT 0,
  analyzed_domains TEXT[] NOT NULL DEFAULT '{}'::text[],
  source_channels TEXT[] NOT NULL DEFAULT '{}'::text[]
);

CREATE INDEX idx_telegram_users_username ON telegram_users(username);
CREATE INDEX idx_telegram_users_last_seen ON telegram_users(last_seen_at DESC);

ALTER TABLE telegram_users ENABLE ROW LEVEL SECURITY;
