import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Share2, Sparkles, Hand } from 'lucide-react';
import { Language } from '../types';
import { tx, isRtlLang } from '../utils/i18n';
import { getLocalized, formatPrice, type Lang } from '../utils/menuData';
import { fetchActiveSpecial, type WeeklySpecial } from '../utils/weeklySpecial';

// Loaded only when the board is actually shown and scrolled near — keeps the
// three.js bundle off the homepage's critical path entirely.
const PlateScene = lazy(() => import('./PlateScene'));

const SITE_URL = 'https://greeksouflaki.com';

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

/** Static, CSS-only plate — the fallback when WebGL is off or motion is reduced. */
function FlatPlate({ imageUrl, alt }: { imageUrl: string | null; alt: string }) {
  return (
    <div className="relative mx-auto aspect-square w-[78%] max-w-[420px]">
      <div className="absolute inset-0 rounded-full bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] ring-1 ring-black/5" />
      <div className="absolute inset-[7%] rounded-full ring-2 ring-brand-terracotta-400/70" />
      <div className="absolute inset-[11%] overflow-hidden rounded-full bg-brand-cream-100">
        {imageUrl ? (
          <img src={imageUrl} alt={alt} className="h-full w-full object-cover" loading="lazy" />
        ) : null}
      </div>
    </div>
  );
}

export default function BoardOfTheWeek({ lang }: { lang: Language }) {
  const [special, setSpecial] = useState<WeeklySpecial | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
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

  // Mount the WebGL canvas only once the section approaches the viewport.
  useEffect(() => {
    const el = ref.current;
    if (!el || !special) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [special]);

  // Nothing published (or no Supabase) → the section simply doesn't exist.
  if (!loaded || !special) return null;

  const title = getLocalized(special.title, l);
  const description = special.description ? getLocalized(special.description, l) : '';
  const badge = special.badge ? getLocalized(special.badge, l) : '';
  const use3D = !reduce && hasWebGL();

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
      {/* Warm ambient glow behind the plate */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 50% at 30% 45%, rgba(255,150,90,0.18), transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-6 px-6 md:grid-cols-2 md:gap-10">
        {/* The plate */}
        <div className="relative h-[360px] w-full md:h-[520px]">
          {use3D ? (
            <Suspense fallback={<FlatPlate imageUrl={special.image_url} alt={title} />}>
              {inView ? (
                <PlateScene imageUrl={special.image_url} />
              ) : (
                <FlatPlate imageUrl={special.image_url} alt={title} />
              )}
            </Suspense>
          ) : (
            <div className="flex h-full items-center justify-center">
              <FlatPlate imageUrl={special.image_url} alt={title} />
            </div>
          )}
          {use3D && inView && (
            <p className="pointer-events-none absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1.5 text-xs text-white/40">
              <Hand className="h-3.5 w-3.5" aria-hidden="true" />
              {tx(
                lang,
                'גררו לסיבוב',
                'Drag to spin',
                'اسحب للتدوير',
                'Тяните, чтобы вращать',
                'Σύρετε για περιστροφή'
              )}
            </p>
          )}
        </div>

        {/* The copy */}
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: reduce ? 0.4 : 0.8, ease: [0.16, 1, 0.3, 1] }}
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

          {badge && (
            <span className="mb-3 inline-block rounded-md bg-emerald-500/90 px-2.5 py-1 text-xs font-bold text-white">
              {badge}
            </span>
          )}

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
