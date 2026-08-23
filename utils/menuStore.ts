import { supabase, isSupabaseConfigured } from './supabase';
import {
  MENU_CATEGORIES,
  type MenuCategory,
  type MenuItem,
  type LocalizedString,
  type BadgeKey,
} from './menuData';
import type { MenuOverrides } from './menuOverrides';

// Owner-added dishes, stored in Supabase and merged into the built-in menu.
// The built-in menu (in code) is always the base; these rows are additive.

export interface MenuItemRecord {
  id: string;
  category: string;
  name: LocalizedString;
  description: LocalizedString | null;
  price: number;
  image_url: string | null;
  badges: BadgeKey[];
  available: boolean;
  sort_order: number;
}

/** All owner-added dishes (public read). Empty when Supabase isn't configured. */
export async function fetchMenuItems(): Promise<MenuItemRecord[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .order('category', { ascending: true })
    .order('sort_order', { ascending: true });
  if (error) return [];
  return (data ?? []) as MenuItemRecord[];
}

export async function createMenuItem(
  rec: Omit<MenuItemRecord, 'id'>
): Promise<MenuItemRecord | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from('menu_items').insert(rec).select().single();
  if (error) throw error;
  return data as MenuItemRecord;
}

export async function updateMenuItem(
  id: string,
  patch: Partial<Omit<MenuItemRecord, 'id'>>
): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from('menu_items')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteMenuItem(id: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('menu_items').delete().eq('id', id);
  if (error) throw error;
}

/** Upload a dish photo to the public bucket and return its URL. */
export async function uploadMenuImage(file: File): Promise<string> {
  if (!supabase) throw new Error('Supabase not configured');
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  // Time-based unique path; Math.random is unavailable in some sandboxes, so
  // derive entropy from the file instead.
  const key = `${Date.now()}-${file.size}-${file.name.replace(/[^a-z0-9.]+/gi, '-')}`.slice(0, 80);
  const path = `dishes/${key}.${ext}`.replace(/\.\.+/g, '.');
  const { error } = await supabase.storage
    .from('menu-images')
    .upload(path, file, { upsert: true, cacheControl: '3600' });
  if (error) throw error;
  const { data } = supabase.storage.from('menu-images').getPublicUrl(path);
  return data.publicUrl;
}

/** Map a DB record to the customer-facing MenuItem shape. */
export function recordToMenuItem(rec: MenuItemRecord): MenuItem {
  return {
    id: rec.id,
    name: rec.name,
    description: rec.description ?? undefined,
    price: rec.price,
    image: rec.image_url ?? undefined,
    badges: rec.badges,
  };
}

/**
 * Build the categories shown to customers: the built-in menu, with each
 * category's owner-added dishes appended. (Availability/price overrides for the
 * built-in dishes are applied separately by the Menu component.)
 */
export function buildMergedCategories(dbItems: MenuItemRecord[]): MenuCategory[] {
  return MENU_CATEGORIES.map((cat) => {
    const extra = dbItems.filter((r) => r.category === cat.id).map(recordToMenuItem);
    return extra.length ? { ...cat, items: [...cat.items, ...extra] } : cat;
  });
}

/** Synthesize sold-out overrides for unavailable owner-added dishes so the
 *  existing Menu rendering (which reads the overrides map) hides their Add
 *  button. Their price lives on the item itself, so no price override needed. */
export function dbAvailabilityOverrides(dbItems: MenuItemRecord[]): MenuOverrides {
  const out: MenuOverrides = {};
  for (const r of dbItems) {
    if (!r.available) out[r.id] = { soldOut: true };
  }
  return out;
}
