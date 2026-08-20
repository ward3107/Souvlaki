import { motion, useReducedMotion } from 'framer-motion';
import { Language } from '../types';
import { tx } from '../utils/i18n';

const OLIVE = (
  <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
    <ellipse cx="16" cy="18" rx="10" ry="11" fill="#4A6B2D" />
    <ellipse cx="13" cy="14" rx="3" ry="4" fill="#7B9D5E" opacity="0.5" />
    <path d="M16 4c2 1 3 3 3 5s-1 3-3 3-3-1-3-3 1-4 3-5z" fill="#3F5A1F" />
  </svg>
);

const LEMON = (
  <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
    <ellipse cx="16" cy="16" rx="13" ry="11" fill="#F5C946" />
    <ellipse cx="13" cy="13" rx="4" ry="3" fill="#FBE498" opacity="0.6" />
    <path
      d="M3 16h26M16 5v22M9 8l14 16M23 8L9 24"
      stroke="#D4A21D"
      strokeWidth="0.6"
      opacity="0.4"
    />
  </svg>
);

const PARSLEY = (
  <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
    <circle cx="10" cy="12" r="4" fill="#3F8C3A" />
    <circle cx="16" cy="9" r="4.5" fill="#4DA847" />
    <circle cx="22" cy="13" r="4" fill="#3F8C3A" />
    <circle cx="14" cy="16" r="4" fill="#5BB853" />
    <circle cx="20" cy="19" r="3.5" fill="#4DA847" />
    <path d="M16 13v15" stroke="#4A6B2D" strokeWidth="1.2" />
  </svg>
);

const TOMATO = (
  <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
    <circle cx="16" cy="18" r="11" fill="#D9434A" />
    <ellipse cx="13" cy="14" rx="3" ry="4" fill="#E8767A" opacity="0.5" />
    <path d="M11 7l5 4 5-4-3 5h-4l-3-5z" fill="#4A8033" />
  </svg>
);

type Item = {
  art: React.ReactNode;
  glow: string;
  he: string;
  en: string;
  ar: string;
  ru: string;
  el: string;
};

const ITEMS: Item[] = [
  {
    art: OLIVE,
    glow: '#4A6B2D',
    he: 'זיתים',
    en: 'Olives',
    ar: 'زيتون',
    ru: 'Оливки',
    el: 'Ελιές',
  },
  { art: LEMON, glow: '#F5C946', he: 'לימון', en: 'Lemon', ar: 'ليمون', ru: 'Лимон', el: 'Λεμόνι' },
  {
    art: PARSLEY,
    glow: '#4DA847',
    he: 'עשבי תיבול',
    en: 'Fresh herbs',
    ar: 'أعشاب طازجة',
    ru: 'Свежая зелень',
    el: 'Φρέσκα βότανα',
  },
  {
    art: TOMATO,
    glow: '#D9434A',
    he: 'עגבניות',
    en: 'Tomatoes',
    ar: 'طماطم',
    ru: 'Помидоры',
    el: 'Ντομάτες',
  },
];

export default function FreshIngredients({ lang }: { lang: Language }) {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-brand-cream-100 dark:bg-slate-900 py-20 md:py-28">
      <div className="container mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-brand-blue-700 dark:text-white"
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
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-3 text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto"
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

        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {ITEMS.map((it, i) => (
            <motion.div
              key={i}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 44, scale: 0.82 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.65, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center"
            >
              <div className="relative w-28 h-28 md:w-36 md:h-36 flex items-center justify-center">
                <div
                  className="absolute inset-2 rounded-full blur-2xl opacity-40"
                  style={{ backgroundColor: it.glow }}
                  aria-hidden="true"
                />
                <div className="relative w-16 h-16 md:w-24 md:h-24 drop-shadow-sm">{it.art}</div>
              </div>
              <span className="mt-3 font-display text-lg md:text-xl font-semibold text-brand-blue-700 dark:text-gray-100">
                {tx(lang, it.he, it.en, it.ar, it.ru, it.el)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
