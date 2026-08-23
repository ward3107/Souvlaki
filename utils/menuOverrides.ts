// Owner-managed menu overrides (sold-out + price).
//
// The base menu lives in code (utils/menuData.ts). This lets the owner mark an
// item "sold out" or tweak its price from /admin without a redeploy.
//
// Two backends, chosen automatically:
//   • Supabase (when configured) — shared across ALL visitors and devices.
//   • localStorage (fallback)    — device-local, works with no backend.
// The async helpers (getOverrides / applyItemOverride / resetAllOverrides) pick
// the right one; the localStorage functions remain for the fallback path and
// cross-tab sync.

import { supabase, isSupabaseConfigured } from './supabase';

export interface ItemOverride {
  soldOut?: boolean;
  price?: number; // replaces the base price when set
}

export type MenuOverrides = Record<string, ItemOverride>;

const STORAGE_KEY = 'menu-overrides-v1';
export const MENU_OVERRIDES_EVENT = 'menuOverridesChanged';

interface OverrideRow {
  item_id: string;
  sold_out: boolean;
  price: number | null;
}

export function loadOverrides(): MenuOverrides {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? (parsed as MenuOverrides) : {};
  } catch {
    return {};
  }
}

export function saveOverrides(overrides: MenuOverrides): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
    window.dispatchEvent(new CustomEvent(MENU_OVERRIDES_EVENT));
  } catch {
    // ignore quota / private-mode failures
  }
}

export function setItemOverride(itemId: string, patch: ItemOverride): MenuOverrides {
  const all = loadOverrides();
  const merged: ItemOverride = { ...all[itemId], ...patch };
  // Drop empty overrides so the store stays tidy.
  if (!merged.soldOut && merged.price == null) {
    delete all[itemId];
  } else {
    all[itemId] = merged;
  }
  saveOverrides(all);
  return all;
}

export function clearOverrides(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(MENU_OVERRIDES_EVENT));
  } catch {
    // ignore
  }
}

// ── Backend-aware helpers ────────────────────────────────────────────────────

function rowsToOverrides(rows: OverrideRow[]): MenuOverrides {
  const out: MenuOverrides = {};
  for (const r of rows) {
    const o: ItemOverride = {};
    if (r.sold_out) o.soldOut = true;
    if (r.price != null) o.price = r.price;
    if (o.soldOut || o.price != null) out[r.item_id] = o;
  }
  return out;
}

/** Read current overrides from Supabase when configured, else localStorage. */
export async function getOverrides(): Promise<MenuOverrides> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('menu_overrides')
      .select('item_id, sold_out, price');
    if (error) {
      // Network/permission hiccup — degrade to whatever is cached locally.
      return loadOverrides();
    }
    return rowsToOverrides((data ?? []) as OverrideRow[]);
  }
  return loadOverrides();
}

/**
 * Apply a single item's override. With Supabase this upserts (or deletes when
 * cleared) and requires the owner to be signed in; otherwise it writes
 * localStorage. Returns the full, refreshed override map.
 */
export async function applyItemOverride(
  itemId: string,
  patch: ItemOverride
): Promise<MenuOverrides> {
  if (isSupabaseConfigured && supabase) {
    // Merge against the current remote value for this item.
    const current = (await getOverrides())[itemId] ?? {};
    const merged: ItemOverride = { ...current, ...patch };
    if (!merged.soldOut && merged.price == null) {
      await supabase.from('menu_overrides').delete().eq('item_id', itemId);
    } else {
      await supabase.from('menu_overrides').upsert(
        {
          item_id: itemId,
          sold_out: !!merged.soldOut,
          price: merged.price ?? null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'item_id' }
      );
    }
    return getOverrides();
  }
  return setItemOverride(itemId, patch);
}

/** Clear every override (owner-only under Supabase). */
export async function resetAllOverrides(): Promise<MenuOverrides> {
  if (isSupabaseConfigured && supabase) {
    // Delete all rows (neq on a never-empty PK matches everything).
    await supabase.from('menu_overrides').delete().neq('item_id', '');
    return {};
  }
  clearOverrides();
  return {};
}
