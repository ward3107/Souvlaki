// Minimal client-side routing for a small SPA — no dependency needed.
// Cloudflare Pages' _redirects (/* -> /index.html 200) makes deep links work.

export function navigate(to: string) {
  if (window.location.pathname !== to) {
    window.history.pushState({}, '', to);
  }
  window.dispatchEvent(new Event('locationchange'));
  window.scrollTo(0, 0);
}
