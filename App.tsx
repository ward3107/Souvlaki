import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Language, TranslationKey, MenuItem, Review } from './types';
import { TRANSLATIONS, MENU_ITEMS, FAQS, REVIEWS } from './constants';
import AccessibilityWidget from './components/AccessibilityWidget';
import CookieBanner from './components/CookieBanner';

// Icons
import { Menu, X, Globe, Moon, Sun, Phone, MapPin, Facebook, Instagram, ChevronDown, ChevronUp, ArrowUp, Star, MessageCircle, Navigation, Quote, Clock, Check } from 'lucide-react';

const MenuItemCard: React.FC<{ item: MenuItem; lang: Language; index: number; t: (key: TranslationKey) => string }> = ({ item, lang, index, t }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  const isRtl = lang === Language.HE || lang === Language.AR;
  const isEven = index % 2 === 0;

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
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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

const ReviewCard: React.FC<{ review: Review; lang: Language; index: number }> = ({ review, lang, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref}
      className={`bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 relative transition-all duration-700 ease-out transform
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
      `}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="absolute top-6 right-6 text-gray-100 dark:text-slate-700 -z-0">
        <Quote className="w-12 h-12 fill-current transform rotate-180" />
      </div>
      
      <div className="relative z-10">
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
          ))}
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6 italic leading-relaxed min-h-[4rem]">
          "{review.text[lang]}"
        </p>

        <div className="flex items-center gap-3 border-t border-gray-100 dark:border-slate-700 pt-4">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center font-bold text-blue-600 dark:text-blue-300">
            {review.author.charAt(0)}
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white text-sm">{review.author}</h4>
            <span className="text-xs text-gray-400">{review.date}</span>
          </div>
          <div className="ml-auto">
             <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-5 h-5 opacity-70" />
          </div>
        </div>
      </div>
    </div>
  );
};

const ParallaxDivider: React.FC<{ image: string }> = ({ image }) => (
  <div 
    className="h-64 md:h-96 w-full bg-fixed bg-center bg-cover relative"
    style={{ backgroundImage: `url(${image})` }}
  >
    <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>
  </div>
);

const ReviewForm: React.FC<{ t: (key: TranslationKey) => string, onSubmit: (review: any) => void }> = ({ t, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    rating: 0,
    timeRating: 0,
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.rating || !formData.name || !formData.comment) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      onSubmit(formData);
      setSubmitted(true);
      setIsSubmitting(false);
      setFormData({ name: '', rating: 0, timeRating: 0, comment: '' });
      setTimeout(() => setSubmitted(false), 3000);
    }, 1000);
  };

  const StarRating = ({ value, onChange, label, icon: Icon = Star }: { value: number, onChange: (v: number) => void, label: string, icon?: React.ElementType }) => (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="focus:outline-none transition-transform hover:scale-110 p-1"
          >
            <Icon
              className={`w-6 h-6 ${star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto mt-16 bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-slate-700">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('form_title')}</h3>
        <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full"></div>
      </div>

      {submitted ? (
        <div className="flex flex-col items-center justify-center py-10 animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 mb-4">
            <Check className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('form_success')}</h4>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StarRating 
              value={formData.rating} 
              onChange={(v) => setFormData({...formData, rating: v})} 
              label={t('form_rating')}
            />
            <StarRating 
              value={formData.timeRating} 
              onChange={(v) => setFormData({...formData, timeRating: v})} 
              label={t('form_time_rating')}
              icon={Clock}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('form_name')}
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('form_comment')}
            </label>
            <textarea
              required
              rows={4}
              value={formData.comment}
              onChange={(e) => setFormData({...formData, comment: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !formData.rating}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] 
              ${isSubmitting || !formData.rating 
                ? 'bg-gray-200 dark:bg-slate-700 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30'}`}
          >
            {isSubmitting ? '...' : t('form_submit')}
          </button>
        </form>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(Language.HE);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMenuInView, setIsMenuInView] = useState(false);
  const [reviewsList, setReviewsList] = useState<Review[]>(REVIEWS);
  const menuRef = useRef<HTMLElement>(null);

  // Translation helper
  const t = (key: TranslationKey): string => TRANSLATIONS[lang][key] || key;
  const isRtl = lang === Language.HE || lang === Language.AR;

  // Effects for Document Attributes
  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleReviewSubmit = (data: any) => {
    const newReview: Review = {
      id: Date.now().toString(),
      author: data.name,
      rating: data.rating,
      date: 'Just now',
      text: {
        he: data.comment,
        en: data.comment,
        ar: data.comment,
        ru: data.comment,
        el: data.comment,
      }
    };
    // Add new review to the top
    setReviewsList([newReview, ...reviewsList]);
  };

  // Gallery Images - Expanded to simulate Google My Business photos
  const galleryImages = [
    'https://picsum.photos/800/600?random=10', 
    'https://picsum.photos/800/600?random=11', 
    'https://picsum.photos/800/600?random=12', 
    'https://picsum.photos/800/600?random=13', 
    'https://picsum.photos/800/600?random=14', 
    'https://picsum.photos/800/600?random=15', 
    'https://picsum.photos/800/600?random=16', 
    'https://picsum.photos/800/600?random=17',
    'https://picsum.photos/800/600?random=18',
    'https://picsum.photos/800/600?random=19',
    'https://picsum.photos/800/600?random=20',
    'https://picsum.photos/800/600?random=21',
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
    { id: 'gallery', labelKey: 'nav_gallery' },
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
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              GS
            </div>
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
            <div className="relative group">
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300">
                <Globe className="w-5 h-5" />
              </button>
              <div className="absolute top-full end-0 mt-2 w-32 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-100 dark:border-slate-700 py-2 hidden group-hover:block">
                {Object.values(Language).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`block w-full text-start px-4 py-2 text-sm hover:bg-blue-50 dark:hover:bg-slate-700 ${lang === l ? 'text-blue-600 font-bold' : 'text-gray-700 dark:text-gray-300'}`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-yellow-500 dark:text-yellow-300"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {/* Mobile Menu Btn */}
            <button
              className="md:hidden p-2 text-gray-600 dark:text-gray-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
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

      {/* --- HERO --- */}
      <section id="home" className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Parallax Background */}
        <div 
          className="absolute inset-0 z-0 bg-fixed bg-center bg-cover"
          style={{ backgroundImage: 'url(https://picsum.photos/1920/1080?random=hero)' }}
        >
          <div className="absolute inset-0 bg-gray-900/60"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          
          {/* Google Rating in Hero */}
          <div className="inline-flex items-center gap-2 mb-8 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 shadow-xl animate-[fadeInDown_1s_ease-out] hover:bg-white/20 transition-all cursor-default">
             <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-5 h-5" />
             <div className="flex gap-0.5 text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
             </div>
             <span className="text-white font-bold text-sm ml-1.5">4.9/5</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
            {t('hero_title')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 mb-10 font-light max-w-2xl mx-auto drop-shadow-lg">
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
      <section id="menu" ref={menuRef} className="py-20 bg-white dark:bg-slate-900 relative overflow-hidden transition-colors duration-300">
        {/* Animated Souvlaki Plate */}
        <div 
          className={`absolute top-0 md:top-20 z-10 pointer-events-none transition-all duration-1000 ease-out
            ${isRtl ? 'left-0' : 'right-0'}
            ${isMenuInView 
              ? 'opacity-100 translate-x-0 rotate-0' 
              : isRtl 
                ? 'opacity-0 -translate-x-full -rotate-45' 
                : 'opacity-0 translate-x-full rotate-45'}
          `}
        >
          <img 
            src="https://pngimg.com/d/kebab_PNG53.png" 
            alt="Authentic Souvlaki Plate" 
            className="w-48 md:w-80 lg:w-96 drop-shadow-2xl opacity-90 hover:opacity-100 transition-opacity" 
          />
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('menu_title')}</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {MENU_ITEMS.map((item, index) => (
              <MenuItemCard 
                key={item.id} 
                item={item} 
                lang={lang} 
                index={index} 
                t={t} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* --- PARALLAX SEPARATOR --- */}
      <ParallaxDivider image="https://picsum.photos/1920/1080?random=parallax" />

      {/* --- GALLERY --- */}
      <section id="gallery" className="py-20 bg-gray-50 dark:bg-slate-800/50 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('gallery_title')}</h2>
            <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 mb-4">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-4 h-4 grayscale opacity-70" />
              <span className="text-sm">Photos from Google Business Profile</span>
            </div>
            <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            {galleryImages.map((img, idx) => (
              <div 
                key={idx} 
                className="relative aspect-square overflow-hidden rounded-xl cursor-pointer group shadow-lg"
                onClick={() => setLightboxImage(img)}
              >
                <img 
                  src={img} 
                  alt={`Gallery ${idx}`} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="bg-white/90 p-3 rounded-full text-gray-900 shadow-lg">
                    <ChevronDown className="w-6 h-6 rotate-45" /> {/* Zoom Icon Sim */}
                  </div>
                </div>
              </div>
            ))}
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
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Authentic</span>
                 </div>
                 <div className="bg-blue-50 dark:bg-slate-800 p-4 rounded-lg text-center flex-1">
                    <span className="block text-3xl font-bold text-blue-600 mb-1">Fresh</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Daily Ingredients</span>
                 </div>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                 <img src="https://picsum.photos/600/800?random=about" alt="Restaurant Interior" className="w-full h-auto" />
              </div>
              <div className="absolute top-10 -end-6 w-full h-full bg-blue-100 dark:bg-blue-900/20 rounded-2xl -z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* --- REVIEWS --- */}
      <section id="reviews" className="py-20 bg-gray-50 dark:bg-slate-800/50 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('reviews_title')}</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{t('reviews_subtitle')}</p>
            <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {reviewsList.map((review, index) => (
              <ReviewCard key={review.id} review={review} lang={lang} index={index} />
            ))}
          </div>

          {/* New Review Form */}
          <ReviewForm t={t} onSubmit={handleReviewSubmit} />
        </div>
      </section>

      {/* --- FAQ --- */}
      <section id="faq" className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('faq_title')}</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq) => (
              <details key={faq.id} className="group bg-gray-50 dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white pr-4 rtl:pr-0 rtl:pl-4">
                    {faq.question[lang]}
                  </h3>
                  <span className="transition group-open:rotate-180">
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </span>
                </summary>
                <div className="px-6 pb-6 text-gray-600 dark:text-gray-300">
                  <p>{faq.answer[lang]}</p>
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
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Get in Touch</h3>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">Visit Us</h4>
                                    <p className="text-gray-600 dark:text-gray-400">Kafr Yasif, Route 70, Israel</p>
                                    <a href="https://waze.com/ul?q=Greek+Souvlaki+Kafr+Yasif" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline mt-1 inline-flex items-center gap-1">
                                      <Navigation className="w-3 h-3" /> Navigate with Waze
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">Call Us</h4>
                                    <a href="tel:048122980" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 block">04-812-2980</a>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 shrink-0">
                                    <MessageCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">WhatsApp</h4>
                                    <div className="space-y-1">
                                        <a href="https://wa.me/972542001235" className="text-gray-600 dark:text-gray-400 hover:text-green-600 block text-sm">Jennje: 054-200-1235</a>
                                        <a href="https://wa.me/972528921454" className="text-gray-600 dark:text-gray-400 hover:text-green-600 block text-sm">Andreia: 052-892-1454</a>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Hours */}
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Opening Hours</h3>
                        <ul className="space-y-3 opacity-80">
                            <li className="flex justify-between border-b border-gray-200 dark:border-slate-700 pb-2">
                                <span className="font-medium text-gray-700 dark:text-gray-300">Wednesday - Saturday</span>
                                <span className="text-gray-600 dark:text-gray-400">13:00 - 01:00</span>
                            </li>
                            <li className="flex justify-between pt-2">
                                <span className="font-medium text-gray-700 dark:text-gray-300">Sunday - Tuesday</span>
                                <span className="text-red-500 font-medium">Closed</span>
                            </li>
                        </ul>
                         <div className="mt-6 text-center">
                            <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold tracking-wider uppercase text-xs rounded-full">
                                {t('open_status_open')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Map Column */}
                <div className="h-full min-h-[400px] rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-slate-700 relative group">
                    <iframe 
                        width="100%" 
                        height="100%" 
                        id="gmap_canvas" 
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
                            View on Maps
                        </a>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
            
            {/* Brand */}
            <div className="text-center md:text-start">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">GS</div>
                <h2 className="text-2xl font-bold text-white">Greek Souvlaki</h2>
              </div>
              <p className="opacity-70 text-sm">Authentic Greek flavors in the heart of Kafr Yasif.</p>
            </div>
              
            {/* Social Media Section */}
            <div className="flex gap-4">
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-600 transition-colors group">
                <Facebook className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-pink-600 transition-colors group">
                <Instagram className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </a>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-50">
            <p>{t('footer_copyright')}</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">{t('footer_terms')}</a>
              <a href="#" className="hover:text-white transition-colors">{t('footer_privacy')}</a>
              <a href="#" className="hover:text-white transition-colors">{t('footer_accessibility')}</a>
            </div>
          </div>
        </div>
      </footer>

      {/* --- WIDGETS --- */}
      <AccessibilityWidget language={lang} />
      <CookieBanner language={lang} />
      
      {/* Lightbox */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md"
          onClick={() => setLightboxImage(null)}
        >
          <button className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full">
            <X className="w-8 h-8" />
          </button>
          <img 
            src={lightboxImage} 
            alt="Full size" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()} // Prevent close on image click
          />
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
    </div>
  );
};

export default App;