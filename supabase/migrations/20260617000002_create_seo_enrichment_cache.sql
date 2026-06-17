-- VebAPI SEO 정밀 분석 데이터 캐시
-- analyze/v2, keywordresearch, singlekeyword, topsearchkeywords, ai-visibility-checker/v2
-- cache_key 패턴: "analyze:<domain>", "keyword:<keyword>:<country>", "topkw:<domain>", "aivis:<domain>"

CREATE TABLE seo_enrichment_cache (
  cache_key TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_seo_enrichment_fetched ON seo_enrichment_cache(fetched_at);

ALTER TABLE seo_enrichment_cache ENABLE ROW LEVEL SECURITY;
-- API route(admin client) 에서만 접근. 일반 사용자 RLS 없음.
