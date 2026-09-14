-- Tadbuy durable vendor marketplace extensions
-- Apply after supabase-schema.sql in the configured Supabase project.

CREATE TABLE IF NOT EXISTS vendor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  npub TEXT NOT NULL DEFAULT '',
  pubkey_hex TEXT,
  nip05 TEXT NOT NULL DEFAULT '',
  nip05_status TEXT NOT NULL DEFAULT 'unverified'
    CHECK (nip05_status IN ('unverified', 'pending', 'verified', 'failed')),
  nip05_checked_at TIMESTAMPTZ,
  nip05_evidence JSONB NOT NULL DEFAULT '{}'::jsonb,
  lightning_address TEXT NOT NULL DEFAULT '',
  audience TEXT NOT NULL DEFAULT '',
  geography TEXT NOT NULL DEFAULT '',
  channels TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vendor_profiles_status ON vendor_profiles(status);
CREATE INDEX IF NOT EXISTS idx_vendor_profiles_nip05 ON vendor_profiles(nip05);

CREATE TABLE IF NOT EXISTS vendor_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id TEXT NOT NULL,
  vendor_profile_id UUID NOT NULL REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  channel TEXT NOT NULL,
  format TEXT NOT NULL,
  placement TEXT NOT NULL,
  audience TEXT NOT NULL DEFAULT '',
  geography TEXT[] NOT NULL DEFAULT '{}',
  min_bid_sats BIGINT NOT NULL DEFAULT 0 CHECK (min_bid_sats >= 0),
  current_bid_sats BIGINT NOT NULL DEFAULT 0 CHECK (current_bid_sats >= 0),
  proof_requirements TEXT[] NOT NULL DEFAULT '{}',
  disclosure_required BOOLEAN NOT NULL DEFAULT TRUE,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'paused')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT vendor_inventory_owner_profile_match UNIQUE (id, owner_id)
);

CREATE INDEX IF NOT EXISTS idx_vendor_inventory_owner ON vendor_inventory(owner_id);
CREATE INDEX IF NOT EXISTS idx_vendor_inventory_status ON vendor_inventory(status);
CREATE INDEX IF NOT EXISTS idx_vendor_inventory_channel ON vendor_inventory(channel);

CREATE TABLE IF NOT EXISTS placement_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advertiser_id TEXT NOT NULL,
  vendor_id TEXT NOT NULL,
  inventory_id UUID NOT NULL REFERENCES vendor_inventory(id) ON DELETE RESTRICT,
  slot_name TEXT NOT NULL,
  publisher TEXT NOT NULL,
  channel TEXT NOT NULL,
  format TEXT NOT NULL,
  audience TEXT NOT NULL DEFAULT '',
  budget_sats BIGINT NOT NULL CHECK (budget_sats >= 0),
  advertiser_label TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  disclosure_required BOOLEAN NOT NULL DEFAULT TRUE,
  proof_requirements TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'offered'
    CHECK (status IN ('offered', 'accepted', 'declined', 'published', 'proof_submitted', 'verified')),
  proof JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  accepted_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_placement_requests_advertiser ON placement_requests(advertiser_id);
CREATE INDEX IF NOT EXISTS idx_placement_requests_vendor ON placement_requests(vendor_id);
CREATE INDEX IF NOT EXISTS idx_placement_requests_inventory ON placement_requests(inventory_id);
CREATE INDEX IF NOT EXISTS idx_placement_requests_status ON placement_requests(status);

ALTER TABLE vendor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE placement_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_manage_own_vendor_profiles" ON vendor_profiles
  FOR ALL TO authenticated
  USING (owner_id = auth.uid()::text)
  WITH CHECK (owner_id = auth.uid()::text);

CREATE POLICY "public_read_published_vendor_profiles" ON vendor_profiles
  FOR SELECT TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "users_manage_own_vendor_inventory" ON vendor_inventory
  FOR ALL TO authenticated
  USING (owner_id = auth.uid()::text)
  WITH CHECK (owner_id = auth.uid()::text);

CREATE POLICY "public_read_published_vendor_inventory" ON vendor_inventory
  FOR SELECT TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "users_read_placement_requests" ON placement_requests
  FOR SELECT TO authenticated
  USING (advertiser_id = auth.uid()::text OR vendor_id = auth.uid()::text);

CREATE POLICY "users_create_placement_requests" ON placement_requests
  FOR INSERT TO authenticated
  WITH CHECK (advertiser_id = auth.uid()::text);

CREATE POLICY "users_update_placement_requests" ON placement_requests
  FOR UPDATE TO authenticated
  USING (vendor_id = auth.uid()::text OR advertiser_id = auth.uid()::text)
  WITH CHECK (vendor_id = auth.uid()::text OR advertiser_id = auth.uid()::text);

-- The API currently uses service_role for server-side ownership checks.
-- Do not expose SUPABASE_SERVICE_ROLE_KEY to the browser.
