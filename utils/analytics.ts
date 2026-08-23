// Lightweight analytics event helper.
//
// GA4 is loaded (with anonymize_ip) only after the visitor accepts analytics
// cookies — see components/CookieBanner.tsx. This helper is therefore a safe
// no-op until consent is given: it fires an event only when `window.gtag`
// actually exists, so calling track() from anywhere in the UI never throws and
// never sends anything without consent.

type GtagFn = (...args: unknown[]) => void;

interface GtagWindow extends Window {
  gtag?: GtagFn;
}

/**
 * Report a conversion / interaction event to GA4 when analytics is active.
 * @param name   GA4 event name, e.g. 'order_whatsapp', 'click_call'.
 * @param params Optional event parameters (value, currency, item counts…).
 */
export function track(name: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  const gtag = (window as GtagWindow).gtag;
  if (typeof gtag !== 'function') return; // no consent / analytics not loaded
  try {
    gtag('event', name, params ?? {});
  } catch {
    // never let analytics break a user action
  }
}
