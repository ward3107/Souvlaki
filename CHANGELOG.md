# 📝 Changelog - Greek Souvlaki Website

All notable changes to the Greek Souvlaki Kfar Yasif website will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased] - Audit fixes (v1.1 hardening)

### 🔒 Security & Deployment

- Added `public/_headers` + `public/_redirects` so the **Cloudflare Pages** host
  (the actual production host) ships the full CSP/HSTS/security header set and an
  SPA fallback — previously these lived only in `vercel.json` and were never applied.
- Hardened CSP: removed `script-src 'unsafe-inline'`/`'unsafe-eval'`; allow-listed
  Google Analytics origins; set `X-XSS-Protection: 0` (per current guidance).
- Removed the broken `vercel.json` redirect that collapsed every path to the
  Cloudflare root.

### 🐛 Fixes

- Google Analytics now reads the real `VITE_GA_MEASUREMENT_ID` (was a hardcoded
  `G-XXXXXXXXXX` placeholder) and initialises without an inline script.
- Cookie consent banner now covers all 5 languages (was HE/AR/EN only).
- Accessibility widget can no longer be permanently dismissed — a discreet
  restore control remains (IS 5568).
- Hero video respects `prefers-reduced-motion` / data-saver and pauses off-screen.
- Removed dead code (`MenuRow`, `VariantChip`, `AddPill`, `ORDER_LABEL`, unused
  helpers) and duplicate/conflicting meta tags + orphaned manifests.

### ⚡ Performance

- `useTilt3D` now writes transforms imperatively via rAF instead of `setState`
  per mousemove — no more re-render thrashing on the Instagram/Menu card grids.
- Cached bounding rects in the mouse-driven parallax/magnetic effects.
- Greek-key background now animates a GPU-composited transform and pauses off-screen.
- PWA precache trimmed from ~60 MB (115 entries) to ~2.3 MB (21 entries); photos
  are runtime-cached on demand.

### 🧰 Tooling

- Enabled TypeScript `strict` (+ `noUnused*`) and added the missing
  `@types/react` / `@types/react-dom`.
- ESLint now runs the `react` + `jsx-a11y` recommended rule sets (previously
  registered but inert) with real browser globals.
- Fixed the Lighthouse CI job to actually start a preview server before auditing.
- Test setup mocks `IntersectionObserver`; Vitest no longer collects Playwright specs.

---

## [1.0.0] - 2026-01-17

### 🎉 Initial Release - Production Launch

#### Added

- ✅ Multi-language support (Hebrew, Arabic, Russian, Greek, English)
- ✅ RTL layout support for Hebrew and Arabic
- ✅ Fully responsive design (desktop, tablet, mobile)
- ✅ Dark mode support (system preference based)
- ✅ Interactive menu with 3D tilt effects (desktop & mobile)
- ✅ Touch event handlers for mobile 3D effects
- ✅ Parallax scrolling background (all devices)
- ✅ Smooth scroll animations with intersection observers
- ✅ Opening hours display with automatic status
- ✅ FAQ section with expandable answers
- ✅ About section with restaurant story
- ✅ Contact section with WhatsApp integration
- ✅ Google Maps navigation integration
- ✅ Facebook reviews integration
- ✅ Social media links (Facebook, Instagram)
- ✅ Accessibility widget (font size, contrast, spacing)
- ✅ Cookie consent banner (GDPR compliant)
- ✅ Legal document viewer (Privacy Policy, Terms, Accessibility)

#### Performance

- ✅ Code splitting with manual chunks (React vendor: 60KB, Icons: 4KB, App: 71KB gzipped)
- ✅ Resource preloading (DNS prefetch, preconnect, modulepreload)
- ✅ Image optimization (76 WebP images, responsive sizes, AVIF fallbacks)
- ✅ Critical CSS inlining to prevent FOUC
- ✅ Font loading optimization (display: optional)
- ✅ CSS containment for layout stability

#### SEO

- ✅ Multi-language meta tags and Open Graph
- ✅ Twitter Card integration
- ✅ JSON-LD structured data (Restaurant Schema)
- ✅ Multi-language sitemaps (5 files: he, ar, ru, el, en)
- ✅ Sitemap index file
- ✅ Robots.txt configuration
- ✅ Canonical URLs and hreflang tags
- ✅ Semantic HTML structure

#### Accessibility

- ✅ WCAG 2.1 AA compliance
- ✅ Skip to main content link
- ✅ ARIA labels and roles
- ✅ Keyboard navigation support
- ✅ Focus indicators
- ✅ Screen reader friendly markup
- ✅ Touch-friendly tap targets (48x48px minimum)

#### Deployment

- ✅ Vercel hosting configuration
- ✅ Automated deployment pipeline
- ✅ Production build optimization
- ✅ GitHub repository setup

---

## [Unreleased]

### Planned for Version 1.1

- [ ] Mobile parallax performance testing
- [ ] iOS Safari compatibility improvements
- [ ] Android Chrome compatibility testing
- [ ] Image lazy loading
- [ ] Service Worker for PWA
- [ ] Mobile menu animation improvements

---

## Version History Format

### Types of Changes

- **Added** - New features
- **Changed** - Changes to existing functionality
- **Deprecated** - Soon-to-be removed features
- **Removed** - Removed features
- **Fixed** - Bug fixes
- **Security** - Security vulnerability fixes

### Release Categories

- **Major** (X.0.0) - Breaking changes, major features
- **Minor** (0.X.0) - New features, backward compatible
- **Patch** (0.0.X) - Bug fixes, small improvements

---

## Upcoming Releases

### Version 1.1 - Bug Fixes & Optimizations

**Target**: February 2026
**Focus**: Performance, compatibility, minor fixes

### Version 1.2 - Content & SEO

**Target**: March 2026
**Focus**: Content expansion, SEO improvements

### Version 2.0 - Online Ordering

**Target**: Q2 2026
**Focus**: E-commerce capabilities

---

## Links

- **Live Site**: https://greek-souvlaki-website.vercel.app
- **GitHub**: https://github.com/ward3107/Souvlaki
- **Handoff Document**: [HANDOFF.md](HANDOFF.md)
- **Roadmap**: [ROADMAP.md](ROADMAP.md)

---

<div align="center">

**🍢 Greek Souvlaki Kfar Yasif**

**Version 1.0.0** | **Released**: January 17, 2026

</div>
