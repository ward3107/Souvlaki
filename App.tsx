import React, { useState, useEffect, useRef } from 'react';
import { Language, TranslationKey, MenuItem } from './types';
import { TRANSLATIONS, MENU_ITEMS, FAQS, SEO_METADATA } from './constants';
import AccessibilityWidget from './components/AccessibilityWidget';
import CookieBanner from './components/CookieBanner';
import LegalDocument from './components/LegalDocument';
import Menu from './components/Menu';
import OpeningHours from './components/OpeningHours';

// Icons
import { Menu as MenuIcon, X, Globe, Moon, Sun, Phone, MapPin, Facebook, Instagram, ChevronDown, ChevronUp, ArrowUp, Star, MessageCircle, Award, Camera, Heart, Navigation } from 'lucide-react';

const MenuItemCard: React.FC<{ item: MenuItem; lang: Language; index: number; t: (key: TranslationKey) => string }> = ({ item, lang, index, t }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isRtl = lang === Language.HE || lang === Language.AR;
  const isEven = index % 2 === 0;

  // Detect desktop (non-touch) device using media query for hover capability
  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover)');
    setIsDesktop(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Animation Entry Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  // 3D Tilt Logic
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation based on cursor position relative to center
    // Limit rotation to 15 degrees
    const rotateX = ((y - centerY) / centerY) * -15; 
    const rotateY = ((x - centerX) / centerX) * 15;
    
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotate({ x: 0, y: 0 });
  };

  const getInitialTransform = () => {
    if (!isRtl) {
       return isEven ? '-translate-x-32' : 'translate-x-32';
    }
    return isEven ? 'translate-x-32' : '-translate-x-32';
  };

  return (
    <div
      ref={ref}
      className={`relative w-full transition-all duration-1000 ease-out
        ${isVisible ? 'opacity-100 translate-x-0' : `opacity-0 ${getInitialTransform()}`}
      `}
      style={{
        perspective: '1000px',
        transitionDelay: isVisible ? `${index * 100}ms` : '0ms'
      }}
      onMouseMove={isDesktop ? handleMouseMove : undefined}
      onMouseEnter={isDesktop ? handleMouseEnter : undefined}
      onMouseLeave={isDesktop ? handleMouseLeave : undefined}
    >
      {/* 3D Card Container */}
      <div 
        className="relative w-full bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-slate-700"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(${isHovering ? 1.02 : 1}, ${isHovering ? 1.02 : 1}, 1)`,
          transition: isHovering ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
        }}
      >
        {/* Floating Image Layer */}
        <div 
          className="relative h-64 w-full rounded-2xl overflow-visible mb-10"
          style={{ transform: 'translateZ(50px)' }}
        >
          <img 
            src={item.image} 
            alt={item.name[lang]} 
            className="w-full h-full object-cover rounded-2xl shadow-lg transform transition-transform duration-500"
          />
          {/* Shine effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          
          {/* Price Badge - Floats above image */}
          <div 
            className="absolute -bottom-5 right-6 rtl:right-auto rtl:left-6 bg-blue-600 text-white font-bold text-lg px-5 py-2 rounded-full shadow-xl border-4 border-white dark:border-slate-800"
            style={{ transform: 'translateZ(30px)' }}
          >
            ₪{item.price}
          </div>
        </div>

        {/* Content Layer */}
        <div className="text-center" style={{ transform: 'translateZ(30px)' }}>
          <span className="inline-block px-3 py-1 mb-2 text-xs font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase bg-blue-50 dark:bg-blue-900/30 rounded-full">
            {t(item.category as TranslationKey)}
          </span>
          
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {item.name[lang]}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 px-2">
            {item.description[lang]}
          </p>

          <button className="w-full py-3 rounded-xl bg-gray-50 dark:bg-slate-700 hover:bg-blue-600 hover:text-white text-gray-900 dark:text-white font-bold transition-all duration-300 shadow-sm hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center gap-2">
            {t('hero_cta_order')}
          </button>
        </div>
      </div>
    </div>
  );
};

const ParallaxDivider: React.FC<{ image: string }> = ({ image }) => (
  <div
    className="h-64 md:h-96 w-full md:bg-fixed bg-center bg-cover relative"
    style={{ backgroundImage: `url(${image})` }}
  >
    <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>
  </div>
);

const App: React.FC = () => {
  // Initialize language from localStorage or browser preference
  const getInitialLanguage = (): Language => {
    const savedLang = localStorage.getItem('language');
    if (savedLang && Object.values(Language).includes(savedLang as Language)) {
      return savedLang as Language;
    }

    // Detect browser language
    const browserLang = navigator.language || navigator.languages?.[0] || 'en';
    if (browserLang.startsWith('he')) return Language.HE;
    if (browserLang.startsWith('ar')) return Language.AR;
    if (browserLang.startsWith('ru')) return Language.RU;
    if (browserLang.startsWith('el')) return Language.EL;
    return Language.EN; // Default to English
  };

  const [lang, setLang] = useState<Language>(getInitialLanguage());
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMenuInView, setIsMenuInView] = useState(false);
  const [legalDocument, setLegalDocument] = useState<string | null>(null);
  const menuRef = useRef<HTMLElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Translation helper
  const t = (key: TranslationKey): string => TRANSLATIONS[lang][key] || key;
  const isRtl = lang === Language.HE || lang === Language.AR;

  // Effects for Document Attributes
  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  // Detect when user returns from external sites (Facebook, etc.)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // User returned to the tab - could scroll to top or show a welcome back message
        console.log('User returned to the site');
      }
    };

    const handlePageShow = (event: PageTransitionEvent) => {
      // This fires when navigating back to the page (bfcache)
      if (event.persisted) {
        console.log('Page restored from back/forward cache');
        // Optionally scroll to top or show a message
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  // Update SEO metadata when language changes
  useEffect(() => {
    const seo = SEO_METADATA[lang];

    // Update document title
    document.title = seo.title;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', seo.description);
    }

    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', seo.keywords);

    // Update Open Graph title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', seo.ogTitle);
    }

    // Update Open Graph description
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', seo.ogDescription);
    }

    // Update Open Graph locale
    const ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale) {
      ogLocale.setAttribute('content', seo.ogLocale);
    }

    // Update Twitter title
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', seo.ogTitle);
    }

    // Update Twitter description
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', seo.ogDescription);
    }

    // Update canonical URL with language parameter
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      const baseUrl = 'https://ward3107.github.io/GREEK_SOVLAKI_WEBSITE/';
      canonical.setAttribute('href', lang === Language.EN ? baseUrl : `${baseUrl}?lang=${lang}`);
    }
  }, [lang]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Scroll Listener for Back to Top Button and Menu Animation
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsMenuInView(true);
        }
      },
      { threshold: 0.15 }
    );

    if (menuRef.current) {
      observer.observe(menuRef.current);
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (menuRef.current) {
        observer.unobserve(menuRef.current);
      }
    };
  }, []);

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };

    if (isLangDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLangDropdownOpen]);

  // Listen for custom events to open legal documents (e.g., from CookieBanner)
  useEffect(() => {
    const handleOpenLegalDocument = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      setLegalDocument(customEvent.detail);
    };

    window.addEventListener('openLegalDocument', handleOpenLegalDocument as EventListener);

    return () => {
      window.removeEventListener('openLegalDocument', handleOpenLegalDocument as EventListener);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Lightbox navigation functions
  const goToNextImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % galleryImages.length);
  };

  const goToPrevImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + galleryImages.length) % galleryImages.length);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  // Keyboard shortcuts for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;

      switch (e.key) {
        case 'ArrowLeft':
          if (isRtl) goToNextImage();
          else goToPrevImage();
          break;
        case 'ArrowRight':
          if (isRtl) goToPrevImage();
          else goToNextImage();
          break;
        case 'Escape':
          closeLightbox();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, isRtl]);

  // Minimum swipe distance for gesture detection
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      if (isRtl) goToPrevImage();
      else goToNextImage();
    }
    if (isRightSwipe) {
      if (isRtl) goToNextImage();
      else goToPrevImage();
    }
  };

  // Gallery Images - Real restaurant photos from local folder
  const galleryImages = [
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

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks: { id: string; labelKey: TranslationKey }[] = [
    { id: 'home', labelKey: 'nav_home' },
    { id: 'menu', labelKey: 'nav_menu' },
    { id: 'about', labelKey: 'nav_about' },
    { id: 'reviews', labelKey: 'nav_reviews' },
    { id: 'faq', labelKey: 'nav_faq' },
    { id: 'contact', labelKey: 'nav_contact' },
  ];

  return (
    <div className={`min-h-screen ${isRtl ? 'font-heebo' : 'font-rubik'}`}>
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-gray-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('home')}>
            <img
              src="/favicon.png"
              alt="Greek Souvlaki Logo"
              className="w-14 h-14 rounded-full object-cover"
            />
            <h1 className="text-xl font-bold text-blue-900 dark:text-blue-100 hidden sm:block">
              Greek Souvlaki
            </h1>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 rtl:space-x-reverse">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
              >
                {t(link.labelKey)}
              </button>
            ))}
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Lang Switcher */}
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300"
                aria-label="Select language"
                aria-expanded={isLangDropdownOpen}
              >
                <Globe className="w-5 h-5" aria-hidden="true" />
              </button>
              {isLangDropdownOpen && (
                <div className="absolute top-full end-0 mt-2 w-32 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-100 dark:border-slate-700 py-2 z-50">
                  {Object.values(Language).map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        setLang(l);
                        localStorage.setItem('language', l);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`block w-full text-start px-4 py-2 text-sm hover:bg-blue-50 dark:hover:bg-slate-700 ${lang === l ? 'text-blue-600 font-bold' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-yellow-500 dark:text-yellow-300"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" aria-hidden="true" /> : <Sun className="w-5 h-5" aria-hidden="true" />}
            </button>

            {/* Mobile Menu Btn */}
            <button
              className="md:hidden p-2 text-gray-600 dark:text-gray-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X aria-hidden="true" /> : <MenuIcon aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="block w-full text-start py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200 font-medium"
                >
                  {t(link.labelKey)}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* --- MAIN CONTENT --- */}
      <main id="main-content" role="main">
        {/* --- HERO --- */}
      <section id="home" className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Parallax Background - fixed only on desktop */}
        <div
          className="absolute inset-0 z-0 md:bg-fixed bg-center bg-cover"
          style={{ backgroundImage: 'url(/gallery/hero-bg.webp)' }}
        >
          <div className="absolute inset-0 bg-gray-900/60"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto" style={{ contain: 'layout style' }}>
          
          {/* Google Rating in Hero */}
          <div className="inline-flex items-center gap-2 mb-8 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 shadow-xl animate-[fadeInDown_1s_ease-out] hover:bg-white/20 transition-all cursor-default">
             <img src="/favicon.png" alt="Logo" className="w-12 h-12 rounded-full" />
             <div className="flex gap-0.5 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-8 h-8 fill-current"
                    style={{
                      animation: 'flip-horizontal 3s ease-in-out infinite',
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
             </div>

             {/* Add 3D flip animation */}
             <style>{`
               @keyframes flip-horizontal {
                 0%, 100% { transform: rotateY(0deg); }
                 50% { transform: rotateY(180deg); }
               }
             `}</style>
             <span className="text-white font-bold text-sm ml-1.5">4.9/5</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl" style={{ minHeight: '4.5rem' }}>
            {t('hero_title')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 mb-10 font-light max-w-2xl mx-auto drop-shadow-lg" style={{ minHeight: '3rem' }}>
            {t('hero_subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => scrollToSection('menu')} className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-full font-bold text-lg transition-all">
              {t('hero_cta_menu')}
            </button>
          </div>
        </div>
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-white/50">
          <ChevronDown className="w-8 h-8" />
        </div>
      </section>

      {/* --- MENU --- */}
      <Menu language={lang} />

      {/* --- PARALLAX SEPARATOR --- */}
      <ParallaxDivider image="/favicon.png" />

      {/* --- TAG US ON INSTAGRAM CTA --- */}
      <section className="py-16 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse animate-in fade-in slide-in-from-bottom duration-1000" style={{ animationDelay: '0s' }}></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse animate-in fade-in slide-in-from-bottom duration-1000" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse animate-in fade-in slide-in-from-bottom duration-1000" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6 shadow-xl">
              <Camera className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {lang === Language.HE ? 'תייג/י אותנו באינסטגרם!' :
               lang === Language.AR ? 'صورنا على إنستغرام!' :
               lang === Language.RU ? 'Отметьте нас в Instagram!' :
               lang === Language.EL ? 'Tag μας στο Instagram!' :
               'Tag Us on Instagram!'}
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {lang === Language.HE
                ? 'צילמ/ת תמונה של האוכל שלנו? תייג/י אותנו ב-@greek.souvlakii ונשתף אותך בעמוד שלנו!'
                : lang === Language.AR
                ? 'التقطت صورة لطعامنا؟ ضع علامة علينا في @greek.souvlakii وسنقوم بمشاركتك!'
                : lang === Language.RU
                ? 'Сфоткали нашу еду? Отметьте нас @greek.souvlakii и мы поделимся вами!'
                : lang === Language.EL
                ? 'Photographiste το φαγητό μας; Tag μας στο @greek.souvlakii και θα σας μοιραστούμε!'
                : 'Took a photo of our food? Tag us @greek.souvlakii and we\'ll share you on our page!'}
            </p>
            <a
              href="https://www.instagram.com/greek.souvlakii"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-purple-600 rounded-full font-bold text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
            >
              <Instagram className="w-6 h-6" />
              <span>@greek.souvlakii</span>
            </a>
          </div>
        </div>
      </section>

      {/* --- INSTAGRAM FEED --- */}
      <section className="py-16 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-2xl mb-4 shadow-xl">
              <Instagram className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {lang === Language.HE ? 'עקבו אחרינו באינסטגרם' :
               lang === Language.AR ? 'تابعنا على إنستغرام' :
               lang === Language.RU ? 'Подпишитесь на нас в Instagram' :
               lang === Language.EL ? 'Ακολουθήστε μας στο Instagram' :
               'Follow Us on Instagram'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto mb-6">
              {lang === Language.HE
                ? 'צפו/י בתמונות הכי עדכניות של המנות המיוחדות שלנו, האווירה והעוד.'
                : lang === Language.AR
                ? 'شاهد أحدث الصور لأطباقنا المميزة والأجواء والمزيد.'
                : lang === Language.RU
                ? 'Смотрите последние фото наших фирменных блюд, атмосферы и многого другого.'
                : lang === Language.EL
                ? 'Δείτε τις τελευταίες φωτογραφίες από τα σπεσιαλιτέ μας, την ατμόσφαιρα και πολλά άλλα.'
                : 'Check out the latest photos of our signature dishes, atmosphere, and more.'}
            </p>
            <a
              href="https://www.instagram.com/greek.souvlakii"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <Instagram className="w-5 h-5" />
              <span>@greek.souvlakii</span>
              <Heart className="w-4 h-4 fill-white" />
            </a>
          </div>

          {/* Instagram Grid - Using gallery images as Instagram feed preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 max-w-5xl mx-auto">
            {galleryImages.slice(0, 8).map((img, idx) => (
              <a
                key={idx}
                href="https://www.instagram.com/greek.souvlakii"
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-square rounded-xl overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <img
                  src={img}
                  alt={`Instagram ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Instagram-style overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
                    <Heart className="w-5 h-5 fill-white" />
                    <Instagram className="w-5 h-5" />
                  </div>
                </div>
                {/* Instagram icon badge */}
                <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/70 rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <Instagram className="w-4 h-4 text-pink-600" />
                </div>
              </a>
            ))}
          </div>

          <div className="text-center mt-8">
            <a
              href="https://www.instagram.com/greek.souvlakii"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400 rounded-full font-bold hover:bg-purple-600 hover:text-white dark:hover:bg-purple-400 dark:hover:text-slate-900 transition-all duration-300"
            >
              {lang === Language.HE ? 'עוד תמונות באינסטגרם →' :
               lang === Language.AR ? 'المزيد من الصور على إنستغرام →' :
               lang === Language.RU ? 'Больше фото в Instagram →' :
               lang === Language.EL ? 'Περισσότερες φωτογραφίες στο Instagram →' :
               'More Photos on Instagram →'}
            </a>
          </div>
        </div>
      </section>

      {/* --- FACEBOOK REVIEWS --- */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-xl">
                <Facebook className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {lang === Language.HE ? 'דירוגי פייסבוק' :
                 lang === Language.AR ? 'تقييمات فيسبوك' :
                 lang === Language.RU ? 'Отзывы Facebook' :
                 lang === Language.EL ? 'Κριτικές Facebook' :
                 'Facebook Reviews'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto mb-6">
                {lang === Language.HE
                  ? 'ראו/י מה הלקוחות שלנו אומרים עלינו בפייסבוק'
                  : lang === Language.AR
                  ? 'شاهد ما يقوله عملاؤنا عنا على فيسبوك'
                  : lang === Language.RU
                  ? 'Посмотрите, что наши клиенты говорят о нас на Facebook'
                  : lang === Language.EL
                  ? 'Δείτε τι λένε οι πελάτες μας για εμάς στο Facebook'
                  : 'See what our customers are saying about us on Facebook'}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href="https://www.facebook.com/greeksouvlaki/reviews"
                  target="_self"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300"
                >
                  <Facebook className="w-5 h-5" />
                  <span>{lang === Language.HE ? 'כל הדירוגים' :
                           lang === Language.AR ? 'جميع التقييمات' :
                           lang === Language.RU ? 'Все отзывы' :
                           lang === Language.EL ? 'Όλες οι κριτικές' :
                           'See All Reviews'}</span>
                </a>
                <a
                  href="https://www.facebook.com/greeksouvlaki/reviews"
                  target="_self"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 rounded-full font-bold hover:bg-blue-600 hover:text-white dark:hover:bg-blue-400 dark:hover:text-slate-900 transition-all duration-300"
                >
                  <Star className="w-5 h-5" />
                  <span>{lang === Language.HE ? 'כתוב ביקורת' :
                           lang === Language.AR ? 'اكتب تقييماً' :
                           lang === Language.RU ? 'Написать отзыв' :
                           lang === Language.EL ? 'Γράψτε κριτική' :
                           'Write a Review'}</span>
                </a>
              </div>
              {/* Back button hint */}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                {lang === Language.HE
                  ? 'לחץ חזרה לחזור לאתר'
                  : lang === Language.AR
                  ? 'اضغط للخلف للعودة إلى الموقع'
                  : lang === Language.RU
                  ? 'Нажмите "Назад" чтобы вернуться на сайт'
                  : lang === Language.EL
                  ? 'Πατήστε "Πίσω" για να επιστρέψετε στον ιστότοπο'
                  : 'Press back to return to the site'}
              </p>
            </div>

            {/* Facebook Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Call to Action Card */}
              <div className="md:col-span-3 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 shadow-lg border border-blue-200 dark:border-blue-800 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                    <Facebook className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {lang === Language.HE ? 'השאירו ביקורת אמיתית' :
                     lang === Language.AR ? 'اترك تقييماً حقيقياً' :
                     lang === Language.RU ? 'Оставьте настоящий отзыв' :
                     lang === Language.EL ? 'Αφήστε μια πραγματική κριτική' :
                     'Leave a Real Review'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 max-w-md">
                    {lang === Language.HE
                      ? 'הזמנו אתכם לשתף את החוויה שלכם עם המסעדה בפייסבוק. הביקורות שלכם עוזרות לנו להשתפר!'
                      : lang === Language.AR
                      ? 'ن ندعوكم لمشاركة تجربتكم مع المطعم على فيسبوك. تقييماتكم تساعدنا على التحسن!'
                      : lang === Language.RU
                      ? 'Приглашаем вас поделиться своим опытом работы с нашим рестораном на Facebook. Ваши отзывы помогают нам стать лучше!'
                      : lang === Language.EL
                      ? 'Σας προσκαλούμε να μοιραστείτε την εμπειρία σας με το εστιατόριό μας στο Facebook. Οι κριτικές σας μας βοηθούν να βελτιωθούμε!'
                      : 'We invite you to share your experience with our restaurant on Facebook. Your reviews help us improve!'}
                  </p>
                  <a
                    href="https://www.facebook.com/greeksouvlaki/reviews"
                    target="_self"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                  >
                    <Star className="w-5 h-5" />
                    <span>{lang === Language.HE ? 'כתוב ביקורת בפייסבוק' :
                             lang === Language.AR ? 'اكتب تقييماً على فيسبوك' :
                             lang === Language.RU ? 'Написать отзыв на Facebook' :
                             lang === Language.EL ? 'Γράψτε κριτική στο Facebook' :
                             'Write a Review on Facebook'}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- ABOUT --- */}
      <section id="about" className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto">
            <div className="flex-1 space-y-6">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 relative inline-block">
                {t('about_title')}
                <span className="absolute -bottom-2 start-0 w-1/2 h-1 bg-blue-600 rounded-full"></span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('about_content_1')}
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('about_content_2')}
              </p>
              <div className="pt-4 flex gap-4">
                 <div className="bg-blue-50 dark:bg-slate-800 p-4 rounded-lg text-center flex-1">
                    <span className="block text-3xl font-bold text-blue-600 mb-1">100%</span>
                    <span className="text-xs text-gray-700 dark:text-gray-300 uppercase tracking-wide font-semibold">Authentic</span>
                 </div>
                 <div className="bg-blue-50 dark:bg-slate-800 p-4 rounded-lg text-center flex-1">
                    <span className="block text-3xl font-bold text-blue-600 mb-1">Fresh</span>
                    <span className="text-xs text-gray-700 dark:text-gray-300 uppercase tracking-wide font-semibold">Daily Ingredients</span>
                 </div>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                 <img src="/about/restaurant-interior.webp" alt="Restaurant Interior" className="w-full h-auto object-cover" />
              </div>
              <div className="absolute top-10 -end-6 w-full h-full bg-blue-100 dark:bg-blue-900/20 rounded-2xl -z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* --- REVIEWS --- */}
      <section id="reviews" className="py-20 bg-gray-50 dark:bg-slate-800/50 transition-colors duration-300">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {lang === Language.HE ? 'דירוגים וביקורות' :
               lang === Language.AR ? 'التقييمات والمراجعات' :
               lang === Language.RU ? 'Отзывы и рейтинги' :
               lang === Language.EL ? 'Κριτικές και βαθμολογίες' :
               'Reviews & Ratings'}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {lang === Language.HE
                ? 'ראו מה הלקוחות שלנו אומרים עלינו'
                : lang === Language.AR
                ? 'شاهد ما يقوله عملاؤنا عنا'
                : lang === Language.RU
                ? 'Посмотрите, что говорят наши клиенты'
                : lang === Language.EL
                ? 'Δείτε τι λένε οι πελάτες μας για εμάς'
                : 'See what our customers are saying about us'}
            </p>
            <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full mt-4"></div>
          </div>

          {/* Google Business Profile Card - Prominent */}
          <div className="mb-8 max-w-4xl mx-auto">
            <a
              href="https://search.google.com/local/writereview?placeid=ChIJY3h7h8F9NhURRQKF3LxiNIg"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-2xl font-bold text-white">
                        {lang === Language.HE ? 'Google' :
                         lang === Language.AR ? 'جوجل' :
                         lang === Language.RU ? 'Google' :
                         lang === Language.EL ? 'Google' :
                         'Google'}
                      </h3>
                      <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1">
                        <span className="text-white font-bold text-lg">4.9</span>
                        <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                      </div>
                    </div>
                    <p className="text-blue-50 text-sm">
                      {lang === Language.HE
                        ? 'השאר ביקורת ב-Google ועזור לנו להתפתח!'
                        : lang === Language.AR
                        ? 'اكتب تقييماً على Google وساعدنا على النمو!'
                        : lang === Language.RU
                        ? 'Оставьте отзыв на Google и помогите нам расти!'
                        : lang === Language.EL
                        ? 'Γράψτε κριτική στο Google και βοηθήστε μας να αναπτυχθούμε!'
                        : 'Leave a review on Google and help us grow!'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5 text-yellow-300">
                    <Star className="w-6 h-6 fill-current" />
                    <Star className="w-6 h-6 fill-current" />
                    <Star className="w-6 h-6 fill-current" />
                    <Star className="w-6 h-6 fill-current" />
                    <Star className="w-6 h-6 fill-current" />
                  </div>
                  <span className="text-white font-bold ml-2">
                    {lang === Language.HE ? 'כתוב ביקורת' :
                     lang === Language.AR ? 'اكتب تقييماً' :
                     lang === Language.RU ? 'Написать отзыв' :
                     lang === Language.EL ? 'Γράψτε κριτική' :
                     'Write a Review'}
                  </span>
                </div>
              </div>
            </a>
          </div>

          {/* TripAdvisor Review Card */}
          <div className="mt-16">
            <a
              href="https://www.tripadvisor.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                    <Award className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {lang === Language.HE ? 'דרג/י אותנו ב-TripAdvisor' :
                       lang === Language.AR ? 'قيمنا على TripAdvisor' :
                       lang === Language.RU ? 'Оцените нас на TripAdvisor' :
                       lang === Language.EL ? 'Βαθμολογήστε μας στο TripAdvisor' :
                       'Rate Us on TripAdvisor'}
                    </h3>
                    <p className="text-green-50 text-sm">
                      {lang === Language.HE
                        ? 'השאר את חוות הדעת שלך ועזור לאחרים לגלות אותנו!'
                        : lang === Language.AR
                        ? 'شارك تجربتك وساعد الآخرين في اكتشافنا!'
                        : lang === Language.RU
                        ? 'Поделитесь своим опытом и помогите другим найти нас!'
                        : lang === Language.EL
                        ? 'Μοιραστείτε την εμπειρία σας και βοηθήστε άλλους να μας βρουν!'
                        : 'Share your experience and help others discover us!'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/20 rounded-full px-6 py-3">
                  <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                  <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                  <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                  <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                  <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                  <span className="text-white font-bold ml-2">
                    {lang === Language.HE ? 'כתוב ביקורת' :
                     lang === Language.AR ? 'اكتب مراجعة' :
                     lang === Language.RU ? 'Написать отзыв' :
                     lang === Language.EL ? 'Γράψτε κριτική' :
                     'Write a Review'}
                  </span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* --- FAQ --- */}
      <section id="faq" className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-800/50 transition-colors duration-300">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Highlighted header */}
          <div className="text-center mb-12 relative">
            {/* Animated background decoration */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-xl shadow-blue-600/30">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
                {t('faq_title')}
              </h2>
              <div className="flex items-center justify-center gap-2">
                <div className="w-12 h-1 bg-gradient-to-r from-transparent to-blue-600 rounded-full"></div>
                <div className="w-8 h-1 bg-blue-600 rounded-full animate-pulse"></div>
                <div className="w-12 h-1 bg-gradient-to-l from-transparent to-blue-600 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <details
                key={faq.id}
                className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700"
              >
                {/* Gradient accent on left */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-500 to-purple-500 rounded-l-2xl"></div>

                <summary className="flex justify-between items-center p-6 cursor-pointer list-none hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Question number badge */}
                    <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-bold rounded-full flex items-center justify-center shadow-md">
                      {index + 1}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white pr-4 rtl:pr-0 rtl:pl-4">
                      {faq.question[lang]}
                    </h3>
                  </div>
                  <span className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center transition group-open:rotate-180 group-open:bg-blue-200 dark:group-open:bg-blue-800">
                    <ChevronDown className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </span>
                </summary>
                <div className="px-6 pb-6 text-gray-700 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-slate-700 bg-gradient-to-b from-transparent to-blue-50/50 dark:to-blue-900/10">
                  <p className="pt-4">{faq.answer[lang]}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* --- CONTACT & MAP --- */}
      <section id="contact" className="py-20 bg-gray-50 dark:bg-slate-800/50 transition-colors duration-300">
        <div className="container mx-auto px-4">
            {/* Title */}
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('contact_title')}</h2>
                <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                {/* Info Column */}
                <div className="space-y-8">
                    {/* Contact Details */}
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">📞 צור קשר</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">לחץ על הכפתורים ליצירת קשר מהירה</p>

                        <div className="grid grid-cols-1 gap-3">
                            {/* Call Button */}
                            <a
                              href="tel:048122980"
                              className="group flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/20"
                            >
                              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                                <Phone className="w-6 h-6" />
                              </div>
                              <div className="flex-1">
                                <div className="font-bold text-gray-900 dark:text-white text-lg">04-812-2980</div>
                                <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">לחץ להתקשר →</div>
                              </div>
                            </a>

                            {/* WhatsApp Jennje */}
                            <a
                              href="https://wa.me/972542001235"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border-2 border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/20"
                            >
                              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                </svg>
                              </div>
                              <div className="flex-1">
                                <div className="font-bold text-gray-900 dark:text-white text-lg">Jennje</div>
                                <div className="text-green-600 dark:text-green-400 text-sm font-medium">054-200-1235 • לחצו כאן 💬</div>
                              </div>
                            </a>

                            {/* WhatsApp Andreia */}
                            <a
                              href="https://wa.me/972528921454"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border-2 border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/20"
                            >
                              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                </svg>
                              </div>
                              <div className="flex-1">
                                <div className="font-bold text-gray-900 dark:text-white text-lg">Andreia</div>
                                <div className="text-green-600 dark:text-green-400 text-sm font-medium">052-892-1454 • לחצו כאן 💬</div>
                              </div>
                            </a>

                            {/* Waze Navigation */}
                            <a
                              href="https://waze.com/ul?ll=32.9556,35.1636&navigate=yes"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20"
                            >
                              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                                <Navigation className="w-6 h-6" />
                              </div>
                              <div className="flex-1">
                                <div className="font-bold text-gray-900 dark:text-white text-lg">ניווט Waze</div>
                                <div className="text-purple-600 dark:text-purple-400 text-sm font-medium">כפר יאסיף, כביש 70 🧭</div>
                              </div>
                            </a>
                        </div>
                    </div>

                    {/* Hours */}
                    <div className="relative group">
                        {/* Animated gradient border */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500 animate-pulse"></div>

                        <OpeningHours language={lang} />
                    </div>
                </div>

                {/* Map Column */}
                <div className="h-full min-h-[400px] rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-slate-700 relative group">
                    <iframe
                        width="100%"
                        height="100%"
                        src="https://maps.google.com/maps?q=Greek%20Souvlaki%20Kafr%20Yasif&t=&z=15&ie=UTF8&iwloc=&output=embed"
                        frameBorder="0"
                        scrolling="no"
                        marginHeight={0}
                        marginWidth={0}
                        className="w-full h-full absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out"
                        title="Google Maps Location"
                    ></iframe>
                    <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-center shadow-lg transform translate-y-2 group-hover:translate-y-0 duration-300">
                        <div>
                            <p className="font-bold text-gray-900 dark:text-white">Greek Souvlaki</p>
                            <div className="flex text-yellow-500 text-xs">★★★★★ (4.9)</div>
                        </div>
                        <a
                            href="https://www.google.com/maps/search/?api=1&query=Greek+Souvlaki+Kafr+Yasif"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {lang === Language.HE ? 'צפה במפה' :
                             lang === Language.AR ? 'عرض الخريطة' :
                             lang === Language.RU ? 'Смотреть карту' :
                             lang === Language.EL ? 'Δείτε τον χάρτη' :
                             'View on Map'}
                        </a>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- COMING SOON --- */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              <span className="text-white font-semibold text-sm uppercase tracking-wide">
                {lang === Language.HE ? 'בקרוב' :
                 lang === Language.AR ? 'قريباً' :
                 lang === Language.RU ? 'Скоро' :
                 lang === Language.EL ? 'Σύντομα' :
                 'Coming Soon'}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {lang === Language.HE
                ? 'חדשות ודברים מגיעים'
                : lang === Language.AR
                ? 'شيء جديد قادم'
                : lang === Language.RU
                ? 'Новое и интересное'
                : lang === Language.EL
                ? 'Καινούρια και συναρπαστικά'
                : 'New & Exciting Things Coming'}
            </h2>

            {/* Description */}
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {lang === Language.HE
                ? 'אנחנו עובדים כל הזמן על חוויות חדשות כדי לשפר את השירות שלכם. הישארו מעודכדים!'
                : lang === Language.AR
                ? 'نعمل باستمرار على تجارب جديدة لتحسين تجربتك. ابق على اطلاع!'
                : lang === Language.RU
                ? 'Мы постоянно работаем над новыми возможностями для улучшения вашего опыта. Оставайтесь на связи!'
                : lang === Language.EL
                ? 'Εργαζόμαστε συνεχώς σε νέες εμπειρίες για να βελτιώσουμε την εμπειρία σας. Μείτε ενήμεροι!'
                : 'We\'re constantly working on new experiences to make your visit even better. Stay tuned!'}
            </p>

            {/* Features Grid */}
            <div className="flex justify-center mb-8">
              {/* Virtual Tour */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 max-w-sm">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 text-center">
                  {lang === Language.HE ? 'סיור וירטואלי' :
                   lang === Language.AR ? 'جولة افتراضية' :
                   lang === Language.RU ? 'Виртуальный тур' :
                   lang === Language.EL ? 'Εικονικός περίπλους' :
                   'Virtual Tour'}
                </h3>
                <p className="text-white/80 text-sm text-center">
                  {lang === Language.HE ? '360° תמונות של המסעדה' :
                   lang === Language.AR ? 'صور 360° للمطعم' :
                   lang === Language.RU ? '360° фото ресторана' :
                   lang === Language.EL ? '360° φωτο του εστιατορίου' :
                   '360° restaurant photos'}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
            
            {/* Brand */}
            <div className="text-center md:text-start">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <img
                src="/favicon.png"
                alt="Greek Souvlaki Logo"
                className="w-14 h-14 rounded-full object-cover"
              />
                <h2 className="text-2xl font-bold text-white">Greek Souvlaki</h2>
              </div>
              <p className="opacity-70 text-sm">Authentic Greek flavors in the heart of Kafr Yasif.</p>
            </div>
              
            {/* Social Media Section */}
            <div className="flex gap-4">
                <a href="https://www.facebook.com/greeksouvlaki" target="_self" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-600 transition-colors group" aria-label="Visit our Facebook page">
                <Facebook className="w-6 h-6 group-hover:scale-110 transition-transform" aria-hidden="true" />
                </a>
                <a href="https://www.instagram.com/greek.souvlakii" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-pink-600 transition-colors group" aria-label="Visit our Instagram page">
                <Instagram className="w-6 h-6 group-hover:scale-110 transition-transform" aria-hidden="true" />
                </a>
                <a href="https://www.tripadvisor.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-600 transition-colors group" aria-label="Find us on TripAdvisor">
                <Award className="w-6 h-6 group-hover:scale-110 transition-transform" aria-hidden="true" />
                </a>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-70 hover:opacity-100 transition-opacity">
            <p>{t('footer_copyright')}</p>
            <div className="flex gap-4 flex-wrap justify-center md:justify-end items-center">
              <button
                onClick={() => {
                  console.log('Terms clicked - opening modal');
                  setLegalDocument('/legal/terms-of-use.md');
                  setTimeout(() => console.log('legalDocument state set'), 100);
                }}
                className="text-gray-400 dark:text-gray-500 hover:text-blue-400 dark:hover:text-blue-400 hover:underline transition-all cursor-pointer font-medium px-2 py-1 rounded hover:bg-gray-800/50"
              >
                {t('footer_terms')}
              </button>
              <span className="text-gray-600">•</span>
              <button
                onClick={() => {
                  console.log('Privacy clicked - opening modal');
                  setLegalDocument('/legal/privacy-policy.md');
                }}
                className="text-gray-400 dark:text-gray-500 hover:text-blue-400 dark:hover:text-blue-400 hover:underline transition-all cursor-pointer font-medium px-2 py-1 rounded hover:bg-gray-800/50"
              >
                {t('footer_privacy')}
              </button>
              <span className="text-gray-600">•</span>
              <button
                onClick={() => {
                  console.log('Accessibility clicked - opening modal');
                  setLegalDocument('/legal/accessibility-statement.md');
                }}
                className="text-gray-400 dark:text-gray-500 hover:text-blue-400 dark:hover:text-blue-400 hover:underline transition-all cursor-pointer font-medium px-2 py-1 rounded hover:bg-gray-800/50"
              >
                {t('footer_accessibility')}
              </button>
            </div>

            {/* Website Builder Badge */}
            <div className="flex justify-center md:justify-end items-center md:ml-24">
              <a
                href="https://wwebsie-4.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors group"
                title="Built with wwwebsie"
              >
                <span className="text-sm">Built with</span>
                <img
                  src="/ws-logo-100w.avif"
                  alt="wwwebsie logo"
                  className="h-10 w-auto opacity-70 group-hover:opacity-100 transition-opacity"
                />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* --- WIDGETS --- */}
      <AccessibilityWidget language={lang} />
      <CookieBanner language={lang} />
      
      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          role="dialog"
          aria-modal="true"
          aria-label={`${t('גלריית תמונות', 'Image Gallery', 'معرض الصور')} - ${lightboxIndex + 1} / ${galleryImages.length}`}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full z-10 transition-colors"
            aria-label={t('סגור גלריה', 'Close gallery', 'إغلاق المعرض')}
          >
            <X className="w-8 h-8" aria-hidden="true" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 text-white bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
            {lightboxIndex + 1} / {galleryImages.length}
          </div>

          {/* Previous Button */}
          <button
            onClick={goToPrevImage}
            className="absolute left-4 rtl:left-auto rtl:right-4 text-white p-3 hover:bg-white/20 rounded-full transition-all hover:scale-110"
            aria-label={t('תמונה קודמת', 'Previous image', 'الصورة السابقة')}
          >
            <ChevronDown className={`w-10 h-10 ${isRtl ? 'rotate-90' : '-rotate-90'}`} aria-hidden="true" />
          </button>

          {/* Navigation Areas - Click on left/right sides */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1/3 rtl:left-auto rtl:right-0 z-0 cursor-pointer"
            onClick={goToPrevImage}
            role="button"
            tabIndex={0}
            aria-label={t('תמונה קודמת', 'Previous image', 'الصورة السابقة')}
            onKeyDown={(e) => e.key === 'Enter' && goToPrevImage()}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-1/3 rtl:right-auto rtl:left-0 z-0 cursor-pointer"
            onClick={goToNextImage}
            role="button"
            tabIndex={0}
            aria-label={t('תמונה הבאה', 'Next image', 'الصورة التالية')}
            onKeyDown={(e) => e.key === 'Enter' && goToNextImage()}
          />

          {/* Main Image */}
          <img
            src={galleryImages[lightboxIndex]}
            alt={`Gallery ${lightboxIndex + 1}`}
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl z-1 transition-opacity duration-300"
          />

          {/* Next Button */}
          <button
            onClick={goToNextImage}
            className="absolute right-4 rtl:right-auto rtl:left-4 text-white p-3 hover:bg-white/20 rounded-full transition-all hover:scale-110"
            aria-label={t('תמונה הבאה', 'Next image', 'الصورة التالية')}
          >
            <ChevronDown className={`w-10 h-10 ${isRtl ? '-rotate-90' : 'rotate-90'}`} aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 rtl:right-auto rtl:left-6 z-40 w-12 h-12 bg-white text-black rounded-full shadow-lg flex items-center justify-center transition-all transform hover:-translate-y-1 mix-blend-difference hover:scale-110"
          aria-label="Back to Top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/972542001235"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-40 w-14 h-14 bg-white text-black rounded-full flex items-center justify-center shadow-xl mix-blend-difference hover:scale-110 transition-all duration-300"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>

      {/* Legal Document Modal */}
      {legalDocument && (
        <LegalDocument
          language={lang}
          documentPath={legalDocument}
          onClose={() => setLegalDocument(null)}
        />
      )}
    </div>
  );
};

export default App;