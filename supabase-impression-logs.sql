-- Tadbuy: impression_logs table + 30-day retention
-- Project: cegzfjbsadwchonpxwmv
-- Run in Supabase SQL editor AFTER supabase-schema.sql
-- Privacy: NEVER store raw IP. Only ip_anonymized (IPv4 /24, IPv6 /48).
--          Fingerprints stored as fp_hash (SHA-256 prefix), never raw fp/UA.

CREATE TABLE IF NOT EXISTS impression_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL
    CHECK (event_type IN ('view', 'retargeting', 'conversion', 'heatmap', 'serve', 'fraud_audit')),
  ad_id TEXT,
  campaign_id TEXT,
  publisher_id TEXT,
  advertiser_id TEXT,
  -- Privacy-preserving identifiers only
  fp_hash TEXT,
  ip_anonymized TEXT,
  page_path TEXT,
  scroll_depth SMALLINT CHECK (scroll_depth IS NULL OR (scroll_depth >= 0 AND scroll_depth <= 100)),
  value_sats BIGINT,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_impression_logs_created_at
  ON impression_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_impression_logs_event_type
  ON impression_logs (event_type);
CREATE INDEX IF NOT EXISTS idx_impression_logs_campaign
  ON impression_logs (campaign_id)
  WHERE campaign_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_impression_logs_fp_hash
  ON impression_logs (fp_hash)
  WHERE fp_hash IS NOT NULL;

ALTER TABLE impression_logs ENABLE ROW LEVEL SECURITY;

-- Clients must never read/write raw impression logs (server uses service_role)
DROP POLICY IF EXISTS "deny_client_impression_logs" ON impression_logs;
CREATE POLICY "deny_client_impression_logs" ON impression_logs
  FOR ALL TO authenticated, anon
  USING (false)
  WITH CHECK (false);

-- ─── 30-day auto-purge function ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION purge_impression_logs(retention_days INTEGER DEFAULT 30)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  IF retention_days IS NULL OR retention_days < 1 THEN
    retention_days := 30;
  END IF;

  WITH doomed AS (
    SELECT id
    FROM impression_logs
    WHERE created_at < now() - make_interval(days => retention_days)
    LIMIT 10000
  ),
  removed AS (
    DELETE FROM impression_logs il
    USING doomed d
    WHERE il.id = d.id
    RETURNING il.id
  )
  SELECT COUNT(*)::INTEGER INTO deleted_count FROM removed;

  RETURN deleted_count;
END;
$$;

REVOKE ALL ON FUNCTION purge_impression_logs(INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION purge_impression_logs(INTEGER) TO service_role;

-- Optional: schedule daily purge if pg_cron is available
-- SELECT cron.schedule(
--   'tadbuy-purge-impression-logs',
--   '15 3 * * *',
--   $$SELECT purge_impression_logs(30);$$
-- );

COMMENT ON TABLE impression_logs IS
  'Raw ad tracking events. IP truncated, fp hashed, purged after 30 days.';
COMMENT ON COLUMN impression_logs.ip_anonymized IS
  'IPv4 last octet zeroed (/24); IPv6 truncated to /48. Never store full IP.';
COMMENT ON COLUMN impression_logs.fp_hash IS
  'SHA-256(salt:fp) hex prefix — not reversible to raw fingerprint/UA.';
