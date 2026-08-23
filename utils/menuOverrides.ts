// Owner-managed, device-local menu overrides.
//
// The base menu lives in code (utils/menuData.ts). This lets the owner mark an
// item "sold out" or tweak its price from the /admin page without a redeploy —
// stored in localStorage. It is intentionally per-device (no backend): perfect
// for the counter tablet during a shift. Cross-tab updates propagate via the
// 'storage' event, and same-tab updates via a custom event.

export interface ItemOverride {
  soldOut?: boolean;
  price?: number; // replaces the base price when set
}

export type MenuOverrides = Record<string, ItemOverride>;

const STORAGE_KEY = 'menu-overrides-v1';
export const MENU_OVERRIDES_EVENT = 'menuOverridesChanged';

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
