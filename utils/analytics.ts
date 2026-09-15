// Lightweight analytics event helper.
//
// GA4 is loaded (with anonymize_ip) only after the visitor accepts analytics
// cookies — see components/CookieBanner.tsx. This helper is therefore a safe
// no-op until consent is given: it fires an event only when `window.gtag`
// actually exists, so calling track() from anywhere in the UI never throws and
// never sends anything without consent.

type GtagFn = (...args: unknown[]) => void;

export type AnalyticsEventName =
  | 'add_to_cart'
  | 'begin_checkout'
  | 'click_call'
  | 'click_directions'
  | 'click_whatsapp'
  | 'generate_lead'
  | 'language_change'
  | 'open_whatsapp'
  | 'order_whatsapp'
  | 'page_view'
  | 'pwa_install_click'
  | 'pwa_installed'
  | 'select_item'
  | 'view_cart'
  | 'view_item'
  | 'view_item_list';

export interface AnalyticsItem {
  item_id: string;
  item_name: string;
  item_category?: string;
  item_variant?: string;
  price?: number;
  quantity?: number;
}

interface GtagWindow extends Window {
  gtag?: GtagFn;
}

/**
 * Report a conversion / interaction event to GA4 when analytics is active.
 * @param name   GA4 event name, e.g. 'order_whatsapp', 'click_call'.
 * @param params Optional event parameters (value, currency, item counts…).
 */
export function track(name: AnalyticsEventName, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  const gtag = (window as GtagWindow).gtag;
  if (typeof gtag !== 'function') return; // no consent / analytics not loaded
  try {
    gtag('event', name, params ?? {});
  } catch {
    // never let analytics break a user action
  }
}
