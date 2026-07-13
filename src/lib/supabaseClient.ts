/**
 * Browser Supabase client — scaffold for Firebase → Supabase Auth migration.
 * Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY on Cloudflare Pages when ready.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

export function getSupabaseBrowser(): SupabaseClient | null {
  if (client) return client;
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (!url || !key) return null;
  client = createClient(url, key);
  return client;
}

export function isSupabaseAuthEnabled(): boolean {
  return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
}