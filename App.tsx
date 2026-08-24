import { lazy, Suspense, useEffect, useState } from 'react';
import { Language } from './types';
import { SEO_METADATA } from './constants';
import { isRtlLang } from './utils/i18n';

// Sections
import Header from './components/sections/Header';
import Hero from './components/sections/Hero';
import MarqueeStrip from './components/sections/MarqueeStrip';
import InstagramCTA from './components/sections/InstagramCTA';
import InstagramGrid from './components/sections/InstagramGrid';
import About from './components/sections/About';
import Reviews from './components/sections/Reviews';
import FAQ from './components/sections/FAQ';
import Contact from './components/sections/Contact';
import Footer from './components/sections/Footer';

// Eagerly loaded
import FloatingActions from './components/FloatingActions';
import BackToTopButton from './components/BackToTopButton';
import Lightbox from './components/Lightbox';
import FirePlateJourney from './components/FirePlateJourney';
import GreekKeyThread from './components/GreekKeyThread';
import FreshIngredients from './components/FreshIngredients';
import FamilyHeritage from './components/FamilyHeritage';
import SignatureShowpiece from './components/SignatureShowpiece';
import MenuCTA from './components/MenuCTA';
import InstallPrompt from './components/InstallPrompt';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy chunks
// The full menu lives on its own /menu route, so keep it out of the homepage
// bundle — it loads only when a visitor actually opens the menu.
const Menu = lazy(() => import('./components/Menu'));
// "Board of the week" — the owner's weekly special (photo + details). Lazy, and
// it renders nothing until a special is published.
const BoardOfTheWeek = lazy(() => import('./components/BoardOfTheWeek'));
const AccessibilityWidget = lazy(() => import('./components/AccessibilityWidget'));
const CookieBanner = lazy(() => import('./components/CookieBanner'));
const LegalDocument = lazy(() => import('./components/LegalDocument'));
const RatingWidget = lazy(() => import('./components/RatingWidget'));
// Owner-only kitchen timer — its own unlinked /kitchen route, kept out of the
// customer bundle since it lazy-loads only when that path is visited.
const Kitchen = lazy(() => import('./components/Kitchen'));
// Printable itemized kitchen ticket — opened from the link inside a WhatsApp
// order. Standalone route, lazy so it never ships in the customer bundle.
const Ticket = lazy(() => import('./components/Ticket'));
// Printable table QR-code stickers — owner opens /qr, prints a sheet, cuts and
// sticks them on the tables so guests scan straight to the menu. Standalone,
// lazy, and unlinked from the customer site.
const QrStickers = lazy(() => import('./components/QrStickers'));
// Owner-only menu console (/admin) — toggle sold-out + edit prices. Lazy so it
// never ships in the customer bundle.
const Admin = lazy(() => import('./components/Admin'));

const GALLERY_IMAGES = [
  '/gallery/IMG-20251205-WA0032-400.webp',
  '/gallery/IMG-20251205-WA0033-400.webp',
  '/gallery/IMG-20251205-WA0034-400.webp',
  '/gallery/IMG-20251205-WA0035-400.webp',
  '/gallery/IMG-20251205-WA0036-400.webp',
  '/gallery/IMG-20251205-WA0037-400.webp',
  '/gallery/IMG-20251205-WA0038-400.webp',
  '/gallery/IMG-20251205-WA0039-400.webp',
  '/gallery/IMG-20251205-WA0040-400.webp',
  '/gallery/IMG-20251205-WA0041-400.webp',
  '/gallery/IMG-20251205-WA0042-400.webp',
  '/gallery/IMG-20251205-WA0048-400.webp',
  '/gallery/IMG-20251205-WA0050-400.webp',
  '/gallery/IMG-20251205-WA0051-400.webp',
  '/gallery/IMG-20251205-WA0052-400.webp',
  '/gallery/IMG-20251205-WA0053-400.webp',
  '/gallery/IMG-20251205-WA0054-400.webp',
  '/gallery/IMG-20251205-WA0055-400.webp',
  '/gallery/IMG-20251205-WA0056-400.webp',
  '/gallery/IMG-20251205-WA0057-400.webp',
  '/gallery/IMG-20251205-WA0058-400.webp',
  '/gallery/IMG-20251205-WA0059-400.webp',
  '/gallery/IMG-20251205-WA0061-400.webp',
  '/gallery/IMG-20251205-WA0062-400.webp',
  '/gallery/IMG-20251205-WA0063-400.webp',
  '/gallery/IMG-20251205-WA0064-400.webp',
  '/gallery/IMG-20251205-WA0066-400.webp',
  '/gallery/IMG-20251205-WA0070-400.webp',
  '/gallery/IMG-20251205-WA0072-400.webp',
  '/gallery/IMG-20251205-WA0073-400.webp',
  '/gallery/IMG-20251205-WA0075-400.webp',
  '/gallery/IMG-20251205-WA0076-400.webp',
  '/gallery/IMG-20251205-WA0077-400.webp',
  '/gallery/IMG-20251205-WA0079-400.webp',
  '/gallery/IMG-20251205-WA0083-400.webp',
];

function getInitialLanguage(): Language {
  // An explicit ?lang= wins (matches our hreflang alternates and lets links
  // deep-link a specific language).
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get('lang');
  if (fromQuery && Object.values(Language).includes(fromQuery as Language)) {
    return fromQuery as Language;
  }
  const saved = localStorage.getItem('language');
  if (saved && Object.values(Language).includes(saved as Language)) {
    return saved as Language;
  }
  const browser = navigator.language || navigator.languages?.[0] || 'en';
  if (browser.startsWith('he')) return Language.HE;
  if (browser.startsWith('ar')) return Language.AR;
  if (browser.startsWith('ru')) return Language.RU;
  if (browser.startsWith('el')) return Language.EL;
  return Language.EN;
}

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(getInitialLanguage);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [legalDocument, setLegalDocument] = useState<string | null>(null);
  const [path, setPath] = useState(() => window.location.pathname);

  const isRtl = isRtlLang(lang);
  const isMenuPage = path === '/menu';
  const isKitchenPage = path === '/kitchen';
  const isTicketPage = path === '/ticket';
  const isQrPage = path === '/qr';
  const isAdminPage = path === '/admin';

  // Minimal routing: the menu lives on its own /menu page so browsing it stays
  // focused instead of scrolling on into the homepage story.
  useEffect(() => {
    const update = () => setPath(window.location.pathname);
    window.addEventListener('locationchange', update);
    window.addEventListener('popstate', update);
    return () => {
      window.removeEventListener('locationchange', update);
      window.removeEventListener('popstate', update);
    };
  }, []);

  // Document direction & language
  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  // BFCache restoration → jump to top instantly (smooth on bfcache restore
  // is jarring because you didn't ask for it).
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) window.scrollTo(0, 0);
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  // SEO metadata sync
  useEffect(() => {
    const seo = SEO_METADATA[lang];
    document.title = seo.title;

    const setMeta = (selector: string, content: string) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute('content', content);
    };

    setMeta('meta[name="description"]', seo.description);

    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', seo.keywords);

    setMeta('meta[property="og:title"]', seo.ogTitle);
    setMeta('meta[property="og:description"]', seo.ogDescription);
    setMeta('meta[property="og:locale"]', seo.ogLocale);
    setMeta('meta[name="twitter:title"]', seo.ogTitle);
    setMeta('meta[name="twitter:description"]', seo.ogDescription);

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      const baseUrl = 'https://greeksouflaki.com/';
      canonical.setAttribute('href', lang === Language.EN ? baseUrl : `${baseUrl}?lang=${lang}`);
    }
  }, [lang]);

  // Theme class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Cross-component event: open legal modal (e.g. fired from CookieBanner)
  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      setLegalDocument(customEvent.detail);
    };
    window.addEventListener('openLegalDocument', handler as EventListener);
    return () => window.removeEventListener('openLegalDocument', handler as EventListener);
  }, []);

  // The kitchen tool and the printable ticket are standalone owner screens — no
  // marketing header, footer, or floating widgets around them.
  if (isKitchenPage) {
    return (
      <div className={isRtl ? 'font-heebo' : 'font-rubik'}>
        <Suspense fallback={null}>
          <Kitchen lang={lang} />
        </Suspense>
      </div>
    );
  }

  if (isTicketPage) {
    return (
      <div className={isRtl ? 'font-heebo' : 'font-rubik'}>
        <Suspense fallback={null}>
          <Ticket lang={lang} />
        </Suspense>
      </div>
    );
  }

  if (isQrPage) {
    return (
      <div className={isRtl ? 'font-heebo' : 'font-rubik'}>
        <Suspense fallback={null}>
          <QrStickers lang={lang} />
        </Suspense>
      </div>
    );
  }

  if (isAdminPage) {
    return (
      <div className={isRtl ? 'font-heebo' : 'font-rubik'}>
        <ErrorBoundary region="admin">
          <Suspense fallback={null}>
            <Admin lang={lang} />
          </Suspense>
        </ErrorBoundary>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isRtl ? 'font-heebo' : 'font-rubik'}`}>
      <Header lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />

      {isMenuPage ? (
        <main id="main-content" role="main" className="bg-brand-cream-100 dark:bg-slate-900">
          <ErrorBoundary region="menu">
            <Suspense fallback={null}>
              <Menu language={lang} />
            </Suspense>
          </ErrorBoundary>
        </main>
      ) : (
        <main id="main-content" role="main">
          <Hero lang={lang} />
          {/* Solid-bg layer covers the pinned Hero so translucent sections
              below render against the page bg, not the hero video. */}
          <div className="relative z-10 bg-slate-50 dark:bg-slate-900">
            {/* Story, top to bottom: welcome band -> menu prompt -> watch it made
                -> made fresh -> meet the family -> our world -> proof -> visit. */}
            <MarqueeStrip lang={lang} />

            {/* Owner's weekly special on an interactive 3D plate. Renders
                nothing until a special is published, so no layout shift. */}
            <Suspense fallback={null}>
              <BoardOfTheWeek lang={lang} />
            </Suspense>

            {/* Dramatic full-screen signature showpiece */}
            <SignatureShowpiece lang={lang} />

            {/* Cinematic "from fire to plate" scroll story */}
            <FirePlateJourney lang={lang} />

            <FreshIngredients lang={lang} />
            <MenuCTA lang={lang} />
            <About lang={lang} />
            <FamilyHeritage lang={lang} />

            <InstagramCTA lang={lang} />
            <InstagramGrid lang={lang} galleryImages={GALLERY_IMAGES} />

            <Reviews lang={lang} />
            <FAQ lang={lang} />
            <Contact lang={lang} />
          </div>
        </main>
      )}

      <Footer lang={lang} onOpenLegal={setLegalDocument} />

      {/* Floating widgets / overlays */}
      <Suspense fallback={null}>
        <AccessibilityWidget language={lang} />
        <CookieBanner language={lang} />
        <RatingWidget language={lang} isRtl={isRtl} />
      </Suspense>
      <GreekKeyThread />
      <FloatingActions lang={lang} />
      <BackToTopButton />
      <InstallPrompt lang={lang} />

      <Lightbox
        lang={lang}
        index={lightboxIndex}
        images={GALLERY_IMAGES}
        onClose={() => setLightboxIndex(null)}
        onChange={setLightboxIndex}
      />

      {legalDocument && (
        <Suspense fallback={null}>
          <LegalDocument
            language={lang}
            documentPath={legalDocument}
            onClose={() => setLegalDocument(null)}
          />
        </Suspense>
      )}
    </div>
  );
};

export default App;
