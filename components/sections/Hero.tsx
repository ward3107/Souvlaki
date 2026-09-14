import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Star } from 'lucide-react';
import { Language } from '../../types';
import { t, tx } from '../../utils/i18n';
import { navigate } from '../../utils/router';

interface HeroProps {
  lang: Language;
}

export default function Hero({ lang }: HeroProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [allowVideo, setAllowVideo] = useState(false);

  // Skip the video on reduced-motion / data-saver — the poster carries the
  // hero on its own, saving several MB on metered connections.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    type WithSaveData = Navigator & { connection?: { saveData?: boolean } };
    const conn = (navigator as WithSaveData).connection;
    const update = () => setAllowVideo(!reduce.matches && !conn?.saveData);
    update();
    reduce.addEventListener('change', update);
    return () => reduce.removeEventListener('change', update);
  }, []);

  // Only decode frames while the hero is actually on screen — the hero is
  // sticky, so it stays pinned behind scrolled content and would otherwise
  // keep decoding off-view.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (!allowVideo) {
      el.pause();
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) el.play().catch(() => {});
          else el.pause();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [allowVideo]);

  return (
    <div className="gpu-stable sticky top-0 z-0 h-screen overflow-hidden">
      <div className="relative flex h-full w-full items-center justify-center">
        <section id="home" className="absolute inset-0 flex items-center justify-center">
          <video
            ref={videoRef}
            className="gpu-stable absolute inset-0 w-full h-full object-cover z-0"
            src="/gallery/hero-bg.mp4"
            poster="/gallery/hero-bg.webp"
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div
              className="absolute -inset-[10%] hero-fog pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at 30% 40%, rgba(255,255,255,0.22), transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(11,95,165,0.20), transparent 55%)',
                mixBlendMode: 'screen',
                filter: 'blur(40px)',
              }}
            />
            <div
              className="absolute -inset-[15%] hero-spotlight pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 50% 40% at 50% 30%, rgba(255,210,140,0.45), rgba(255,180,90,0.15) 40%, transparent 70%)',
                mixBlendMode: 'screen',
                filter: 'blur(30px)',
              }}
            />
            <div className="absolute inset-0 bg-gray-900/55" />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.55) 100%)',
              }}
            />
          </div>

          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-8 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 shadow-lift hover:bg-white/20 transition-all cursor-default">
              <img src="/favicon.png" alt="Logo" className="w-12 h-12 rounded-full" />
              <div className="flex gap-0.5 text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-7 h-7 fill-current" />
                ))}
              </div>
              <span className="text-white font-bold text-sm ml-1.5">4.9/5</span>
            </div>

            <h1
              className="font-display text-5xl md:text-7xl font-semibold text-white mb-6 leading-tight tracking-tight drop-shadow-2xl"
              style={{ minHeight: '4.5rem' }}
            >
              {t(lang, 'hero_title')}
            </h1>
            <p
              className="text-xl md:text-2xl text-gray-100 mb-6 font-light max-w-2xl mx-auto drop-shadow-lg"
              style={{ minHeight: '3rem' }}
            >
              {t(lang, 'hero_subtitle')}
            </p>

            <p className="text-lg md:text-xl text-white/95 mb-8 font-normal max-w-3xl mx-auto drop-shadow-md leading-relaxed">
              {tx(
                lang,
                'מסעדה יוונית אותנטית בכפר יאסיף, הגליל המערבי. מתכונים משפחתיים מדור לדור, שילוב ייחודי של טריות ואותנטיות באווירה משפחתית חמה.',
                'An authentic Greek restaurant in Kfar Yasif, Western Galilee. Family recipes passed down through generations, featuring a unique blend of freshness and authenticity in a warm family atmosphere.',
                'مطعم يوناني أصيل في كفر ياسيف، الجليل الغربي. وصفات عائلية تنتقل عبر الأجيال، مزيج فريد من الطزاجة والأصالة في أجواء عائلية دافئة.',
                'Аутентичный греческий ресторан в Кафр-Ясиф, Западная Галилея. Семейные рецепты, передаваемые из поколения в поколение, уникальное сочетание свежести и аутентичности в теплой семейной атмосфере.',
                'Αυθεντικό ελληνικό εστιατόριο στο Καφρ Γιασίφ, Δυτική Γαλιλαία. Οικογενικές συνταγές που περνούν από γενιά σε γενιά, μοναδικός συνδυασμός φρεσκάδας και αυθεντικότητας σε μια ζεστή οικογενειακή ατμόσφαιρα.'
              )}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                onClick={() => navigate('/menu')}
                className="px-8 py-4 bg-brand-terracotta-400 hover:bg-brand-terracotta-500 text-white rounded-full font-semibold text-lg shadow-lift hover:shadow-pop transition-all active:scale-[0.97] inline-block"
                aria-label={t(lang, 'hero_cta_menu')}
              >
                {t(lang, 'hero_cta_menu')}
              </button>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/40 z-10">
            <ChevronDown className="w-6 h-6" />
          </div>
        </section>
      </div>
    </div>
  );
}
