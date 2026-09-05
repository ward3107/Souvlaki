import { useRef, type ComponentType, type MouseEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Citrus, Leaf, Cherry, Grape } from 'lucide-react';
import { Language } from '../types';
import { tx } from '../utils/i18n';
import { navigate } from '../utils/router';

type Localized = { he: string; en: string; ar: string; ru: string; el: string };
type Item = {
  Icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  name: Localized;
  desc: Localized;
};

// Monoline lucide marks in the brand palette — coherent with the rest of the
// site's minimal, editorial styling (terracotta eyebrow, Fraunces headings)
// rather than the standalone cartoon produce illustrations they replace.
const ITEMS: Item[] = [
  {
    Icon: Grape,
    name: { he: 'זיתים', en: 'Olives', ar: 'زيتون', ru: 'Оливки', el: 'Ελιές' },
    desc: {
      he: 'קלמטה כבושים',
      en: 'Brine-cured Kalamata',
      ar: 'كالاماتا مُملّح',
      ru: 'Каламата в рассоле',
      el: 'Καλαμάτας σε άλμη',
    },
  },
  {
    Icon: Citrus,
    name: { he: 'לימון', en: 'Lemon', ar: 'ليمون', ru: 'Лимон', el: 'Λεμόνι' },
    desc: {
      he: 'חמצמץ ורענן',
      en: 'Bright & zesty',
      ar: 'منعش وحامض',
      ru: 'Яркий и сочный',
      el: 'Δροσερό & αρωματικό',
    },
  },
  {
    Icon: Leaf,
    name: {
      he: 'עשבי תיבול',
      en: 'Fresh herbs',
      ar: 'أعشاب طازجة',
      ru: 'Свежая зелень',
      el: 'Φρέσκα βότανα',
    },
    desc: {
      he: 'קטופים מהגינה',
      en: 'Garden-picked',
      ar: 'مقطوفة من الحديقة',
      ru: 'Прямо с грядки',
      el: 'Φρεσκοκομμένα',
    },
  },
  {
    Icon: Cherry,
    name: { he: 'עגבניות', en: 'Tomatoes', ar: 'طماطم', ru: 'Помидоры', el: 'Ντομάτες' },
    desc: {
      he: 'בשלים על הגפן',
      en: 'Vine-ripened',
      ar: 'ناضجة على الكرمة',
      ru: 'Спелые на ветке',
      el: 'Ωριμασμένες στο κλήμα',
    },
  },
];

export default function FreshIngredients({ lang }: { lang: Language }) {
  const reduce = useReducedMotion();

  // Hidden owner shortcut: tapping the four ingredient cards left-to-right
  // (each tap on a card further right than the last, within 5s) opens /admin.
  // Position-based so it works the same in LTR and RTL layouts. There is no
  // visible admin link anywhere on the site.
  const tapsRef = useRef<{ left: number; t: number }[]>([]);
  const handleSecretTap = (e: MouseEvent<HTMLDivElement>) => {
    const left = e.currentTarget.getBoundingClientRect().left;
    const now = Date.now();
    const recent = tapsRef.current.filter((x) => now - x.t < 5000);
    const last = recent[recent.length - 1];
    const next = !last || left > last.left + 5 ? [...recent, { left, t: now }] : [{ left, t: now }];
    tapsRef.current = next;
    if (next.length === 4) {
      tapsRef.current = [];
      navigate('/admin');
    }
  };

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
    <section className="relative overflow-hidden bg-brand-cream-100 dark:bg-slate-900 py-20 md:py-28">
      <div className="container mx-auto px-6 text-center">
        <motion.p
          {...reveal(0)}
          className="text-brand-terracotta-400 dark:text-brand-terracotta-200 uppercase tracking-[0.3em] text-xs md:text-sm font-medium"
        >
          {tx(
            lang,
            'מהשוק לצלחת',
            'Market to plate',
            'من السوق إلى الطبق',
            'С рынка на тарелку',
            'Από την αγορά στο πιάτο'
          )}
        </motion.p>
        <motion.h2
          {...reveal(0.12)}
          className="mt-4 font-display text-4xl md:text-5xl font-semibold tracking-tight text-brand-blue-700 dark:text-white"
        >
          {tx(
            lang,
            'טרי, בכל יום.',
            'Fresh, every day.',
            'طازج، كل يوم.',
            'Свежее, каждый день.',
            'Φρέσκο, κάθε μέρα.'
          )}
        </motion.h2>
        <motion.p
          {...reveal(0.2)}
          className="mt-4 text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed"
        >
          {tx(
            lang,
            'רק המרכיבים הטובים ביותר, נבחרים ביד.',
            'Only the best ingredients, hand-picked.',
            'أفضل المكونات فقط، مختارة يدويًا.',
            'Только лучшие ингредиенты, отобранные вручную.',
            'Μόνο τα καλύτερα υλικά, διαλεγμένα στο χέρι.'
          )}
        </motion.p>
        <motion.div
          {...reveal(0.28)}
          className="mt-8 mx-auto w-16 h-[2px] bg-brand-terracotta-300"
          aria-hidden="true"
        />

        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
          {ITEMS.map((it, i) => (
            <motion.div
              key={it.name.en}
              {...reveal(0.3 + i * 0.08)}
              onClick={handleSecretTap}
              className="group flex flex-col items-center rounded-2xl border border-brand-blue-500/10 bg-white/80 px-5 py-8 shadow-soft backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 dark:border-white/10 dark:bg-slate-800/60"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-cream-200 text-brand-terracotta-400 ring-1 ring-brand-terracotta-300/40 transition-colors duration-300 group-hover:bg-brand-terracotta-400 group-hover:text-white dark:bg-slate-700 dark:text-brand-terracotta-200">
                <it.Icon className="h-7 w-7" strokeWidth={1.6} />
              </span>
              <span className="mt-5 font-display text-xl md:text-2xl font-semibold tracking-tight text-brand-blue-800 dark:text-white">
                {tx(lang, it.name.he, it.name.en, it.name.ar, it.name.ru, it.name.el)}
              </span>
              <span className="mt-1 text-sm md:text-base text-gray-500 dark:text-gray-400">
                {tx(lang, it.desc.he, it.desc.en, it.desc.ar, it.desc.ru, it.desc.el)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
