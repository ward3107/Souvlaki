import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Language } from '../types';
import Reveal from './Reveal';
import IngredientFloaters from './IngredientFloaters';
import { track } from '../utils/analytics';
import {
  MENU_CATEGORIES,
  BADGE_LABELS,
  FILTERABLE_BADGES,
  getLocalized,
  type Lang,
  type BadgeKey,
  type MenuItem,
  type MenuCategory,
} from '../utils/menuData';
import { getOverrides, MENU_OVERRIDES_EVENT, type MenuOverrides } from '../utils/menuOverrides';
import { recordOrder } from '../utils/orders';
import { fetchMenuItems, buildMergedCategories, dbAvailabilityOverrides } from '../utils/menuStore';
import {
  SECTION_TITLES,
  SCROLL_HINT,
  SEARCH_PLACEHOLDER,
  NO_RESULTS,
  RESULTS_LABEL,
  CLEAR_FILTERS_LABEL,
} from './menu/labels';
import {
  CART_STORAGE_KEY,
  lineKey,
  loadCart,
  resolveLine,
  buildCartUrl,
  type CartLine,
  type ResolvedLine,
} from './menu/cart';
import { buildMenuSchema } from './menu/schema';
import MenuCard from './menu/MenuCard';
import CartBar from './menu/CartBar';
import CartSheet from './menu/CartSheet';
import AddOnsList from './menu/AddOnsList';

interface MenuProps {
  language: Language;
  id?: string;
}

export default function Menu({ language, id = 'menu' }: MenuProps) {
  const [activeId, setActiveId] = useState<string>(MENU_CATEGORIES[0].id);
  const [cart, setCart] = useState<CartLine[]>(() => loadCart());
  const [cartOpen, setCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [query, setQuery] = useState('');
  const [activeBadges, setActiveBadges] = useState<BadgeKey[]>([]);
  const [overrides, setOverrides] = useState<MenuOverrides>({});
  const [categories, setCategories] = useState<MenuCategory[]>(MENU_CATEGORIES);
  const lang = language as Lang;
  const isRtl = lang === 'he' || lang === 'ar';
  const titles = SECTION_TITLES[lang] ?? SECTION_TITLES.en;
  const active = categories.find((c) => c.id === activeId) ?? categories[0];

  // Keep the menu in sync with the /admin editor: built-in dish
  // availability/prices (overrides) AND owner-added dishes (from Supabase),
  // merged together. With Supabase that means all visitors see changes; the
  // localStorage fallback syncs across tabs. Refresh on mount, on tab focus,
  // and on the local change events.
  useEffect(() => {
    let cancelled = false;
    const refresh = () => {
      Promise.all([getOverrides(), fetchMenuItems()]).then(([codeOverrides, dbItems]) => {
        if (cancelled) return;
        setCategories(buildMergedCategories(dbItems));
        setOverrides({ ...codeOverrides, ...dbAvailabilityOverrides(dbItems) });
      });
    };
    refresh();
    window.addEventListener(MENU_OVERRIDES_EVENT, refresh);
    window.addEventListener('storage', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      cancelled = true;
      window.removeEventListener(MENU_OVERRIDES_EVENT, refresh);
      window.removeEventListener('storage', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);

  // Persist the cart so a refresh (or accidental navigation) never loses an
  // order in progress.
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore quota / private-mode failures
    }
  }, [cart]);

  // Inject Menu/MenuItem JSON-LD for SEO while the menu page is mounted.
  useEffect(() => {
    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = 'menu-schema';
    el.textContent = JSON.stringify(buildMenuSchema(categories, overrides));
    document.head.appendChild(el);
    return () => {
      el.remove();
    };
  }, [overrides, categories]);

  const resolvedLines = useMemo(
    () =>
      cart
        .map((l) => resolveLine(l, lang, overrides, categories))
        .filter((l): l is ResolvedLine => l !== null),
    [cart, lang, overrides, categories]
  );
  const itemCount = resolvedLines.reduce((sum, l) => sum + l.qty, 0);
  const cartTotal = resolvedLines.reduce((sum, l) => sum + l.lineTotal, 0);

  const isFiltering = query.trim().length > 0 || activeBadges.length > 0;

  // Flat, cross-category result set when the visitor is searching or filtering.
  const filteredItems = useMemo(() => {
    if (!isFiltering) return [];
    const q = query.trim().toLowerCase();
    const results: MenuItem[] = [];
    for (const cat of categories) {
      for (const item of cat.items) {
        if (activeBadges.length > 0 && !activeBadges.every((b) => item.badges?.includes(b))) {
          continue;
        }
        if (q) {
          const haystack = `${getLocalized(item.name, lang)} ${getLocalized(
            item.description,
            lang
          )} ${getLocalized(item.name, 'en')}`.toLowerCase();
          if (!haystack.includes(q)) continue;
        }
        results.push(item);
      }
    }
    return results;
  }, [isFiltering, query, activeBadges, lang, categories]);

  const toggleBadge = (b: BadgeKey) =>
    setActiveBadges((prev) => (prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]));

  const clearFilters = () => {
    setQuery('');
    setActiveBadges([]);
  };

  const handleAdd = (itemId: string, variantId?: string) => {
    track('menu_add_to_cart', { item_id: itemId, variant: variantId ?? '' });
    setCart((prev) => {
      const idx = prev.findIndex((l) => l.itemId === itemId && l.variantId === variantId);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [...prev, { itemId, variantId, qty: 1 }];
    });
  };

  const adjustQty = (key: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((l) => (lineKey(l.itemId, l.variantId) === key ? { ...l, qty: l.qty + delta } : l))
        .filter((l) => l.qty > 0)
    );
  };

  const removeLine = (key: string) => {
    setCart((prev) => prev.filter((l) => lineKey(l.itemId, l.variantId) !== key));
  };

  const clearCart = () => {
    setCart([]);
    setCartOpen(false);
  };

  const sendOrder = () => {
    if (resolvedLines.length === 0) return;
    if (!customerName.trim()) return;
    const name = customerName.trim();
    track('order_whatsapp', {
      value: cartTotal,
      currency: 'ILS',
      items: itemCount,
    });
    // Persist to order history (no-op unless Supabase is configured); never let
    // it block or delay the WhatsApp handoff.
    void recordOrder({
      customerName: name,
      total: cartTotal,
      items: resolvedLines.map((l) => ({
        q: l.qty,
        n: l.name,
        v: l.variantLabel,
        p: l.lineTotal,
      })),
      lang,
    });
    const url = buildCartUrl(lang, resolvedLines, name);
    window.open(url, '_blank', 'noopener,noreferrer');
    // The order handed off to WhatsApp — reset so returning to the tab doesn't
    // show a stale cart the customer might re-send as a duplicate.
    setCart([]);
    setCustomerName('');
    setCartOpen(false);
  };

  useEffect(() => {
    if (!cartOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCartOpen(false);
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [cartOpen]);

  // Signal to other floating widgets (share, rating) to step aside so the
  // checkout CTA owns the bottom of the screen while the cart has items.
  useEffect(() => {
    if (itemCount === 0) return;
    document.body.classList.add('cart-active');
    return () => document.body.classList.remove('cart-active');
  }, [itemCount]);

  const renderCard = (item: MenuItem, key: string, delay: number) => {
    const ov = overrides[item.id] ?? {};
    return (
      <Reveal key={key} delay={delay} y={20}>
        <MenuCard
          item={item}
          lang={lang}
          onAdd={handleAdd}
          soldOut={!!ov.soldOut}
          priceOverride={ov.price}
        />
      </Reveal>
    );
  };

  return (
    <section
      id={id}
      className="relative py-20 px-4 bg-brand-cream-100 dark:bg-slate-900 overflow-hidden"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <IngredientFloaters />
      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <Reveal>
          <div className="text-center mb-8">
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-gray-900 dark:text-white mb-3 tracking-tight">
              {titles.title}
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
              {titles.subtitle}
            </p>
          </div>
        </Reveal>

        {/* Search + dietary filters */}
        <div className="mb-4 max-w-2xl mx-auto">
          <div className="relative">
            <Search
              className="absolute top-1/2 -translate-y-1/2 start-4 w-4 h-4 text-gray-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={SEARCH_PLACEHOLDER[lang]}
              aria-label={SEARCH_PLACEHOLDER[lang]}
              className="w-full ps-11 pe-4 py-2.5 rounded-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-terracotta-300"
            />
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            {FILTERABLE_BADGES.map((b) => {
              const on = activeBadges.includes(b);
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => toggleBadge(b)}
                  aria-pressed={on}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    on
                      ? 'bg-brand-blue-500 text-white'
                      : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:bg-brand-blue-50 dark:hover:bg-slate-700'
                  }`}
                >
                  {BADGE_LABELS[b][lang]}
                </button>
              );
            })}
            {isFiltering && (
              <button
                type="button"
                onClick={clearFilters}
                className="px-3 py-1.5 rounded-full text-xs font-medium text-brand-terracotta-500 hover:underline"
              >
                {CLEAR_FILTERS_LABEL[lang]} ✕
              </button>
            )}
          </div>
        </div>

        {isFiltering ? (
          /* Flat, cross-category results */
          <div className="mt-4 pb-24">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-5">
              {filteredItems.length} {RESULTS_LABEL[lang]}
            </p>
            {filteredItems.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-16">
                {NO_RESULTS[lang]}
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                {filteredItems.map((item, idx) =>
                  renderCard(item, `search-${item.id}`, idx * 0.03)
                )}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Category tabs (sticky) */}
            <div className="mb-2 sticky top-20 z-20 -mx-4 px-4 py-3 bg-brand-cream-100/90 dark:bg-slate-900/90 backdrop-blur-sm">
              <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-hide">
                {categories.map((cat) => {
                  const Icon = cat.Icon;
                  const activeTab = activeId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveId(cat.id)}
                      aria-pressed={activeTab}
                      className={`
                        flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all active:scale-95
                        ${
                          activeTab
                            ? 'bg-brand-blue-500 text-white shadow-soft'
                            : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-brand-blue-50 dark:hover:bg-slate-700'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" aria-hidden="true" />
                      <span>{getLocalized(cat.name, lang)}</span>
                    </button>
                  );
                })}
              </div>
              <div className="md:hidden text-center text-[11px] text-gray-400 dark:text-gray-500 mt-1.5">
                {SCROLL_HINT[lang]}
              </div>
            </div>

            {/* Items grid — 3D flip cards */}
            <div className="mt-6 pb-24">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                {active.items.map((item, idx) =>
                  renderCard(item, `${active.id}-${item.id}`, idx * 0.05)
                )}
              </div>
              {active.addons && active.addons.length > 0 && (
                <div className="mt-6 bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-gray-200/60 dark:border-slate-700/60 px-6 md:px-8 py-2">
                  <AddOnsList addons={active.addons} lang={lang} />
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {itemCount > 0 && !cartOpen && (
        <CartBar
          count={itemCount}
          total={cartTotal}
          lang={lang}
          isRtl={isRtl}
          onOpen={() => setCartOpen(true)}
        />
      )}

      {cartOpen && (
        <CartSheet
          lines={resolvedLines}
          total={cartTotal}
          lang={lang}
          isRtl={isRtl}
          onClose={() => setCartOpen(false)}
          onInc={(k) => adjustQty(k, 1)}
          onDec={(k) => adjustQty(k, -1)}
          onRemove={removeLine}
          onClear={clearCart}
          onSend={sendOrder}
          customerName={customerName}
          onNameChange={setCustomerName}
        />
      )}
    </section>
  );
}
