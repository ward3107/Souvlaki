import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Language } from '../types';
import { tx } from '../utils/i18n';

export default function FamilyHeritage({ lang }: { lang: Language }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [allowVideo, setAllowVideo] = useState(false);
  const reduce = useReducedMotion();

  // Gate the video on reduced-motion / data-saver — the poster carries it.
  useEffect(() => {
    const r = window.matchMedia('(prefers-reduced-motion: reduce)');
    type WithSaveData = Navigator & { connection?: { saveData?: boolean } };
    const conn = (navigator as WithSaveData).connection;
    const update = () => setAllowVideo(!r.matches && !conn?.saveData);
    update();
    r.addEventListener('change', update);
    return () => r.removeEventListener('change', update);
  }, []);

  // Only decode while on screen.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (!allowVideo) {
      el.pause();
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) el.play().catch(() => {});
          else el.pause();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [allowVideo]);

  const reveal = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: {
      duration: reduce ? 0.3 : 0.7,
      delay: reduce ? 0 : delay,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  });

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {allowVideo ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src="/video/family-recipes.mp4"
          poster="/video/family-recipes-poster.jpg"
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/video/family-recipes-poster.jpg)' }}
          aria-hidden="true"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/75" />

      <div className="relative z-10 text-center px-6 max-w-3xl">
        <motion.p
          {...reveal(0)}
          className="text-brand-terracotta-200 uppercase tracking-[0.3em] text-xs md:text-sm font-medium"
        >
          {tx(lang, 'הסיפור שלנו', 'Our story', 'قصتنا', 'Наша история', 'Η ιστορία μας')}
        </motion.p>
        <motion.h2
          {...reveal(0.12)}
          className="mt-4 font-display text-4xl md:text-6xl font-semibold text-white tracking-tight leading-tight drop-shadow-lg"
        >
          {tx(
            lang,
            'מהמשפחה שלנו, אליכם.',
            'From our family, to yours.',
            'من عائلتنا، إليكم.',
            'От нашей семьи — вам.',
            'Από την οικογένειά μας, σε εσάς.'
          )}
        </motion.h2>
        <motion.p
          {...reveal(0.24)}
          className="mt-6 text-lg md:text-xl text-gray-100 leading-relaxed"
        >
          {tx(
            lang,
            'מתכונים שעוברים מדור לדור. אותה אש, אותה אהבה, אותה קבלת פנים חמה, מאז ומתמיד.',
            'Recipes passed down, generation to generation. The same fire, the same love, the same warm welcome, always.',
            'وصفات تنتقل من جيل إلى جيل. نفس النار، نفس الحب، نفس الترحيب الدافئ، دائمًا.',
            'Рецепты, передаваемые из поколения в поколение. Тот же огонь, та же любовь, тот же тёплый приём — всегда.',
            'Συνταγές που περνούν από γενιά σε γενιά. Η ίδια φωτιά, η ίδια αγάπη, το ίδιο ζεστό καλωσόρισμα, πάντα.'
          )}
        </motion.p>
        <motion.div
          {...reveal(0.36)}
          className="mt-8 mx-auto w-16 h-[2px] bg-brand-terracotta-300"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
