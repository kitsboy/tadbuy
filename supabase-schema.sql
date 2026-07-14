-- Tadbuy Supabase Schema
-- Project: cegzfjbsadwchonpxwmv
-- Run in: https://supabase.com/dashboard/project/cegzfjbsadwchonpxwmv/sql/new

-- ─── Campaigns ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  budget_sats BIGINT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'live', 'paused', 'completed')),
  user_id TEXT,
  invoice_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ,
  payment_confirmed_at TIMESTAMPTZ,
  data JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_invoice_id ON campaigns(invoice_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_at ON campaigns(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);

-- ─── Marketplace Bids ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id TEXT NOT NULL,
  slot_name TEXT NOT NULL,
  bid_sats INTEGER NOT NULL,
  budget_sats INTEGER,
  user_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bids_user_id ON bids(user_id);
CREATE INDEX IF NOT EXISTS idx_bids_created_at ON bids(created_at DESC);

-- ─── Publisher Settings ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS publisher_settings (
  user_id TEXT PRIMARY KEY,
  lightning_address TEXT NOT NULL,
  bitcoin_address TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Fedimint Sessions ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fedimint_sessions (
  session_id TEXT PRIMARY KEY,
  federation_id TEXT NOT NULL,
  federation_name TEXT NOT NULL,
  balance_msats BIGINT NOT NULL DEFAULT 0,
  invite TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Settlements ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS settlements (
  id SERIAL PRIMARY KEY,
  amount NUMERIC NOT NULL,
  address TEXT NOT NULL,
  txid TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_type TEXT NOT NULL CHECK (payment_type IN ('on-chain', 'lightning')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_settlements_created_at ON settlements(created_at DESC);

-- ─── Row Level Security ─────────────────────────────────────────────────────
-- Server uses service_role key (bypasses RLS). Policies guard anon/authenticated.

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE publisher_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE fedimint_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;

-- Service role has full access (default). Anon read-only on live campaigns.
CREATE POLICY "anon_read_live_campaigns" ON campaigns
  FOR SELECT TO anon
  USING (status = 'live');

CREATE POLICY "users_read_own_campaigns" ON campaigns
  FOR SELECT TO authenticated
  USING (user_id = auth.uid()::text);

CREATE POLICY "users_manage_own_campaigns" ON campaigns
  FOR ALL TO authenticated
  USING (user_id = auth.uid()::text)
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "users_read_own_bids" ON bids
  FOR SELECT TO authenticated
  USING (user_id = auth.uid()::text);

CREATE POLICY "users_insert_own_bids" ON bids
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "users_manage_own_publisher_settings" ON publisher_settings
  FOR ALL TO authenticated
  USING (user_id = auth.uid()::text)
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "users_manage_own_fedimint_sessions" ON fedimint_sessions
  FOR ALL TO authenticated
  USING (session_id = auth.uid()::text)
  WITH CHECK (session_id = auth.uid()::text);

-- Settlements must not be world-readable. Add user_id when migrating to multi-tenant.
-- Until user_id exists on settlements, deny client reads (server uses service_role).
DROP POLICY IF EXISTS "users_read_own_settlements" ON settlements;
CREATE POLICY "deny_client_settlements" ON settlements
  FOR ALL TO authenticated, anon
  USING (false)
  WITH CHECK (false);

-- ─── Impression logs (privacy) ───────────────────────────────────────────────
-- See supabase-impression-logs.sql for impression_logs table +
-- purge_impression_logs(30) RPC. Run that file in the Supabase SQL editor.
-- Raw IP is never stored; 30-day retention on raw events.
