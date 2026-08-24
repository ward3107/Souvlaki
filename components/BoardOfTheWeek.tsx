import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Share2, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { tx, isRtlLang } from '../utils/i18n';
import { getLocalized, formatPrice, type Lang } from '../utils/menuData';
import { fetchActiveSpecial, type WeeklySpecial } from '../utils/weeklySpecial';

const SITE_URL = 'https://greeksouflaki.com';

export default function BoardOfTheWeek({ lang }: { lang: Language }) {
  const [special, setSpecial] = useState<WeeklySpecial | null>(null);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();
  const l = lang as Lang;
  const isRtl = isRtlLang(lang);

  useEffect(() => {
    let active = true;
    fetchActiveSpecial().then((s) => {
      if (active) {
        setSpecial(s);
        setLoaded(true);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  // Nothing published (or no Supabase) → the section simply doesn't exist.
  if (!loaded || !special) return null;

  const title = getLocalized(special.title, l);
  const description = special.description ? getLocalized(special.description, l) : '';
  const badge = special.badge ? getLocalized(special.badge, l) : '';

  const share = async () => {
    const priceText = special.price ? ` — ${formatPrice(special.price)}` : '';
    const shareData = {
      title: tx(
        lang,
        'המנה של השבוע',
        'This week’s special',
        'طبق الأسبوع',
        'Блюдо недели',
        'Το πιάτο της εβδομάδας'
      ),
      text: `${title}${priceText} · ${tx(lang, 'סובלאקי יווני', 'Greek Souvlaki', 'سوفلاكي يوناني', 'Греческий сувлаки', 'Ελληνικό Σουβλάκι')}`,
      url: SITE_URL,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
    } catch {
      // user cancelled or share failed — fall through to WhatsApp
    }
    const msg = encodeURIComponent(`${shareData.title}: ${shareData.text}\n${SITE_URL}`);
    window.open(`https://wa.me/?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      ref={ref}
      dir={isRtl ? 'rtl' : 'ltr'}
      aria-label={tx(
        lang,
        'המנה של השבוע',
        'Board of the week',
        'طبق الأسبوع',
        'Блюдо недели',
        'Το πιάτο της εβδομάδας'
      )}
      className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-20 md:py-28"
    >
      {/* Warm ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 50% at 30% 45%, rgba(255,150,90,0.16), transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-6 md:grid-cols-2 md:gap-12">
        {/* The photo, shown as-is in a clean frame */}
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: reduce ? 0.4 : 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-md"
        >
          {special.image_url ? (
            <div className="relative overflow-hidden rounded-3xl shadow-[0_30px_70px_-20px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
              <img
                src={special.image_url}
                alt={title}
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
              {/* subtle inner sheen */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{ boxShadow: 'inset 0 0 60px rgba(0,0,0,0.25)' }}
                aria-hidden="true"
              />
              {badge && (
                <span className="absolute start-4 top-4 rounded-full bg-emerald-500/95 px-3 py-1 text-xs font-bold text-white shadow-lg">
                  {badge}
                </span>
              )}
            </div>
          ) : (
            <div className="flex aspect-[4/3] w-full items-center justify-center rounded-3xl bg-white/5 text-white/30 ring-1 ring-white/10">
              <Sparkles className="h-10 w-10" aria-hidden="true" />
            </div>
          )}
        </motion.div>

        {/* The copy */}
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: reduce ? 0.4 : 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center md:text-start"
        >
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-terracotta-400/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-brand-terracotta-200">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {tx(
              lang,
              'המנה של השבוע',
              'Board of the week',
              'طبق الأسبوع',
              'Блюдо недели',
              'Το πιάτο της εβδομάδας'
            )}
          </p>

          <h2 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
            {title}
          </h2>

          {description && (
            <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-gray-300 md:mx-0 md:text-lg">
              {description}
            </p>
          )}

          <div className="mt-7 flex flex-wrap items-center justify-center gap-4 md:justify-start">
            {special.price != null && (
              <span className="font-display text-3xl font-bold text-brand-terracotta-300">
                {formatPrice(special.price)}
              </span>
            )}
            <button
              type="button"
              onClick={share}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20 active:scale-95"
            >
              <Share2 className="h-4 w-4" aria-hidden="true" />
              {tx(lang, 'שיתוף', 'Share', 'مشاركة', 'Поделиться', 'Κοινοποίηση')}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
