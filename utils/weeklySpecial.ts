import { supabase, isSupabaseConfigured } from './supabase';
import type { LocalizedString } from './menuData';

// "Board of the Week" data layer. Only one row is ever active; that row is what
// the homepage 3D plate shows. Everything degrades to a no-op / null when
// Supabase isn't configured, so the section simply hides.

export interface WeeklySpecial {
  id: string;
  title: LocalizedString;
  description: LocalizedString | null;
  price: number | null;
  image_url: string | null;
  badge: LocalizedString | null;
  active: boolean;
  created_at: string;
}

export interface SpecialDraft {
  id?: string;
  title: LocalizedString;
  description: LocalizedString | null;
  price: number | null;
  image_url: string | null;
  badge: LocalizedString | null;
  active: boolean;
}

/** The one special customers see. null when none is published / no Supabase. */
export async function fetchActiveSpecial(): Promise<WeeklySpecial | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase
    .from('weekly_special')
    .select('*')
    .eq('active', true)
    .maybeSingle();
  if (error || !data) return null;
  return data as WeeklySpecial;
}

/** Owner-only: full history, newest first. */
export async function fetchAllSpecials(): Promise<WeeklySpecial[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data, error } = await supabase
    .from('weekly_special')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return [];
  return (data ?? []) as WeeklySpecial[];
}

/**
 * Create or update a special. When the draft is active, every other row is
 * deactivated first so the DB's single-active constraint never trips.
 */
export async function saveSpecial(draft: SpecialDraft): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured');

  if (draft.active) {
    // Clear the current board before publishing the new one.
    const { error: clearErr } = await supabase
      .from('weekly_special')
      .update({ active: false, updated_at: new Date().toISOString() })
      .eq('active', true);
    if (clearErr) throw clearErr;
  }

  const row = {
    title: draft.title,
    description: draft.description,
    price: draft.price,
    image_url: draft.image_url,
    badge: draft.badge,
    active: draft.active,
    updated_at: new Date().toISOString(),
  };

  if (draft.id) {
    const { error } = await supabase.from('weekly_special').update(row).eq('id', draft.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('weekly_special').insert(row);
    if (error) throw error;
  }
}

/** Take the board down without deleting the row (keeps it in history). */
export async function unpublishSpecial(id: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from('weekly_special')
    .update({ active: false, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteSpecial(id: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('weekly_special').delete().eq('id', id);
  if (error) throw error;
}
