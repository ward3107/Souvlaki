import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Language } from '../types';
import { tx } from '../utils/i18n';

// The showpiece background. Swap this path for your best, highest-res plate shot.
const SHOWPIECE_IMAGE = '/gallery/IMG-20251205-WA0050-400.webp';

export default function SignatureShowpiece({ lang }: { lang: Language }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  // Slow cinematic push-in + drift as the section passes through.
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.25, 1.05]);
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-6%', '6%']);

  const reveal = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-100px' },
    transition: {
      duration: reduce ? 0.4 : 1.0,
      delay: reduce ? 0 : delay,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  });

  return (
    <section
      ref={ref}
      aria-label={tx(
        lang,
        'החתימה שלנו',
        'Our signature',
        'توقيعنا',
        'Наша визитка',
        'Η υπογραφή μας'
      )}
      className="relative h-screen min-h-[560px] overflow-hidden bg-black flex items-center justify-center"
    >
      {/* Parallax background */}
      <motion.div
        className="absolute inset-0"
        style={{ scale, y, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        aria-hidden="true"
      >
        <img src={SHOWPIECE_IMAGE} alt="" className="w-full h-full object-cover" loading="lazy" />
      </motion.div>

      {/* Cinematic grade: darken, vignette, warm ember glow */}
      <div className="absolute inset-0 bg-black/55" aria-hidden="true" />
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.88) 100%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 55% at 50% 62%, rgba(216,90,48,0.28), transparent 70%)',
          mixBlendMode: 'screen',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.p
          {...reveal(0)}
          className="text-brand-terracotta-200 uppercase tracking-[0.4em] text-xs md:text-sm font-medium mb-6"
        >
          {tx(
            lang,
            'החתימה שלנו',
            'Our signature',
            'توقيعنا',
            'Наша визитная карточка',
            'Η υπογραφή μας'
          )}
        </motion.p>
        <motion.h2
          {...reveal(0.15)}
          className="font-display text-5xl sm:text-6xl md:text-8xl font-bold text-white tracking-tight leading-[0.95] drop-shadow-2xl whitespace-pre-line"
        >
          {tx(
            lang,
            'סובלאקי,\nכמו שצריך.',
            'Souvlaki,\ndone right.',
            'سوفلاكي،\nكما يجب.',
            'Сувлаки,\nкак надо.',
            'Σουβλάκι,\nόπως πρέπει.'
          )}
        </motion.h2>
        <motion.p
          {...reveal(0.3)}
          className="mt-8 text-lg md:text-2xl text-gray-200 font-light max-w-2xl mx-auto leading-relaxed"
        >
          {tx(
            lang,
            'שיפודים על האש, פיתה חמה, טרי מהגריל שלנו.',
            'Char-grilled skewers, warm pita, fresh from our fire.',
            'أسياخ مشوية على النار، خبز دافئ، طازج من نارنا.',
            'Шампуры на огне, тёплая пита, прямо с нашего гриля.',
            'Σουβλάκια στη σχάρα, ζεστή πίτα, φρέσκα από τη φωτιά μας.'
          )}
        </motion.p>
        <motion.div
          {...reveal(0.45)}
          className="mt-10 mx-auto w-20 h-[2px] bg-brand-terracotta-300"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
