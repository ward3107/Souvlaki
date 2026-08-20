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
import Menu from './components/Menu';
import InstallBanner from './components/InstallBanner';
import FloatingActions from './components/FloatingActions';
import BackToTopButton from './components/BackToTopButton';
import Lightbox from './components/Lightbox';
import FirePlateJourney from './components/FirePlateJourney';
import GreekKeyThread from './components/GreekKeyThread';
import FreshIngredients from './components/FreshIngredients';
import FamilyHeritage from './components/FamilyHeritage';
import SignatureShowpiece from './components/SignatureShowpiece';

// Lazy chunks
const AccessibilityWidget = lazy(() => import('./components/AccessibilityWidget'));
const CookieBanner = lazy(() => import('./components/CookieBanner'));
const LegalDocument = lazy(() => import('./components/LegalDocument'));
const RatingWidget = lazy(() => import('./components/RatingWidget'));

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

  const isRtl = isRtlLang(lang);

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
      const baseUrl = 'https://souvlaki.pages.dev/';
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

  return (
    <div className={`min-h-screen ${isRtl ? 'font-heebo' : 'font-rubik'}`}>
      {/* Thin install strip sits above the sticky header in normal flow. */}
      <InstallBanner lang={lang} />
      <Header lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />

      <main id="main-content" role="main">
        <Hero lang={lang} />
        {/* Solid-bg layer covers the pinned Hero so translucent sections
            below render against the page bg, not the hero video. */}
        <div className="relative z-10 bg-slate-50 dark:bg-slate-900">
          {/* Story, top to bottom: welcome band -> menu -> watch it made ->
              made fresh -> meet the family -> our world -> proof -> visit. */}
          <MarqueeStrip lang={lang} />
          <Menu language={lang} />

          {/* Dramatic full-screen signature showpiece */}
          <SignatureShowpiece lang={lang} />

          {/* Cinematic "from fire to plate" scroll story */}
          <FirePlateJourney lang={lang} />

          <FreshIngredients lang={lang} />
          <About lang={lang} />
          <FamilyHeritage lang={lang} />

          <InstagramCTA lang={lang} />
          <InstagramGrid lang={lang} galleryImages={GALLERY_IMAGES} />

          <Reviews lang={lang} />
          <FAQ lang={lang} />
          <Contact lang={lang} />
        </div>
      </main>

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
