import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Supabase client, created only when both env vars are present. When unset, the
// app falls back to its no-backend behaviour (menu overrides live in
// localStorage on the owner's device; orders are not persisted) so the site
// keeps working before Supabase is configured.
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;
