import { motion, useReducedMotion } from 'framer-motion';
import { Language } from '../types';
import { tx } from '../utils/i18n';

// Detailed, gradient-shaded produce illustrations — volume, glossy highlights
// and real detail (a cut lemon half, a glossy tomato, layered olives) so they
// read as real ingredients rather than flat icons. Each gradient id is unique
// so the four can render together without clashing.
const OLIVE = (
  <svg viewBox="0 0 64 64" className="w-full h-full">
    <defs>
      <radialGradient id="olvGreen" cx="36%" cy="28%" r="78%">
        <stop offset="0%" stopColor="#B8CE72" />
        <stop offset="55%" stopColor="#6E8B3D" />
        <stop offset="100%" stopColor="#425F27" />
      </radialGradient>
      <radialGradient id="olvDark" cx="36%" cy="28%" r="78%">
        <stop offset="0%" stopColor="#7A6478" />
        <stop offset="55%" stopColor="#412F46" />
        <stop offset="100%" stopColor="#221624" />
      </radialGradient>
    </defs>
    <path d="M28 13c9-4 19-1 23 7-7 3-18 1-23-7z" fill="#5C7B34" />
    <path d="M30 14c8-1 15 2 20 6" stroke="#3F5A1F" strokeWidth="1.1" fill="none" />
    <ellipse cx="41" cy="39" rx="12" ry="15.5" fill="url(#olvDark)" />
    <ellipse cx="36.5" cy="31" rx="3.2" ry="4.8" fill="#ffffff" opacity="0.28" />
    <ellipse cx="23" cy="43" rx="12.6" ry="16" fill="url(#olvGreen)" />
    <ellipse cx="18.5" cy="34.5" rx="3.6" ry="5.4" fill="#ffffff" opacity="0.4" />
  </svg>
);

const LEMON = (
  <svg viewBox="0 0 64 64" className="w-full h-full">
    <defs>
      <radialGradient id="lemBody" cx="34%" cy="28%" r="82%">
        <stop offset="0%" stopColor="#FFF2AC" />
        <stop offset="45%" stopColor="#F6D03C" />
        <stop offset="100%" stopColor="#D19A1E" />
      </radialGradient>
      <radialGradient id="lemCut" cx="50%" cy="50%" r="58%">
        <stop offset="0%" stopColor="#FFFBE0" />
        <stop offset="100%" stopColor="#F1DB74" />
      </radialGradient>
    </defs>
    <path d="M40 9c10-2 18 4 17 12-9 1-16-4-17-12z" fill="#5FA24A" />
    <path d="M42 11c6 0 11 3 14 7" stroke="#3F7A32" strokeWidth="1" fill="none" />
    <g transform="rotate(-20 40 40)">
      <ellipse cx="40" cy="40" rx="15" ry="13" fill="url(#lemBody)" />
      <ellipse cx="55" cy="40" rx="2.6" ry="2" fill="#E3BE45" />
      <ellipse cx="33" cy="33" rx="4.2" ry="2.8" fill="#ffffff" opacity="0.45" />
    </g>
    <g transform="translate(22 44) rotate(-8)">
      <ellipse cx="0" cy="0" rx="13" ry="12.2" fill="url(#lemBody)" />
      <ellipse cx="0" cy="0" rx="10.6" ry="9.8" fill="#FFFBE6" />
      <ellipse cx="0" cy="0" rx="9" ry="8.2" fill="url(#lemCut)" />
      <g stroke="#E7C858" strokeWidth="0.9" opacity="0.85">
        <line x1="0" y1="0" x2="0" y2="-8" />
        <line x1="0" y1="0" x2="6" y2="-5" />
        <line x1="0" y1="0" x2="8" y2="1" />
        <line x1="0" y1="0" x2="5" y2="6" />
        <line x1="0" y1="0" x2="-5" y2="6" />
        <line x1="0" y1="0" x2="-8" y2="1" />
        <line x1="0" y1="0" x2="-6" y2="-5" />
      </g>
    </g>
  </svg>
);

const PARSLEY = (
  <svg viewBox="0 0 64 64" className="w-full h-full">
    <defs>
      <linearGradient id="herbLeaf" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#79C954" />
        <stop offset="100%" stopColor="#357A2C" />
      </linearGradient>
    </defs>
    <path
      d="M32 60c-2-14-2-26 0-38"
      stroke="#3F6B2E"
      strokeWidth="2.6"
      fill="none"
      strokeLinecap="round"
    />
    <path d="M32 42c-6-2-10-6-12-11" stroke="#3F6B2E" strokeWidth="1.6" fill="none" />
    <path d="M32 36c6-2 10-6 12-11" stroke="#3F6B2E" strokeWidth="1.6" fill="none" />
    <g fill="url(#herbLeaf)">
      <circle cx="32" cy="15" r="8.5" />
      <circle cx="21.5" cy="22" r="7.2" />
      <circle cx="42.5" cy="22" r="7.2" />
      <circle cx="16.5" cy="31" r="6" />
      <circle cx="47.5" cy="31" r="6" />
      <circle cx="26" cy="11" r="6.2" />
      <circle cx="38" cy="11" r="6.2" />
    </g>
    <g stroke="#D2EFB4" strokeWidth="0.8" opacity="0.55" fill="none">
      <path d="M32 9v11" />
      <path d="M21.5 18v8" />
      <path d="M42.5 18v8" />
    </g>
  </svg>
);

const TOMATO = (
  <svg viewBox="0 0 64 64" className="w-full h-full">
    <defs>
      <radialGradient id="tomBody" cx="37%" cy="28%" r="80%">
        <stop offset="0%" stopColor="#FF7E66" />
        <stop offset="45%" stopColor="#E5372F" />
        <stop offset="100%" stopColor="#A31C1C" />
      </radialGradient>
    </defs>
    <path
      d="M32 22c15 0 22 9 22 19 0 11-10 17-22 17s-22-6-22-17c0-10 7-19 22-19z"
      fill="url(#tomBody)"
    />
    <g fill="#54923A">
      <path d="M32 24l-10-6c4 6 7 7 10 7z" />
      <path d="M32 24l10-6c-4 6-7 7-10 7z" />
      <path d="M32 25l-8 3c4 0 7-1 8-2z" />
      <path d="M32 25l8 3c-4 0-7-1-8-2z" />
      <path d="M32 14c1 6 1 8 0 11-1-3-1-5 0-11z" />
    </g>
    <circle cx="32" cy="19" r="2" fill="#3F6B2E" />
    <ellipse
      cx="23"
      cy="35"
      rx="7"
      ry="4.5"
      fill="#ffffff"
      opacity="0.32"
      transform="rotate(-28 23 35)"
    />
  </svg>
);

type Localized = { he: string; en: string; ar: string; ru: string; el: string };
type Item = {
  art: React.ReactNode;
  glow: string;
  name: Localized;
  desc: Localized;
};

const ITEMS: Item[] = [
  {
    art: OLIVE,
    glow: '#4A6B2D',
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
    art: LEMON,
    glow: '#E0A423',
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
    art: PARSLEY,
    glow: '#3F8C3A',
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
    art: TOMATO,
    glow: '#D9434A',
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

        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
          {ITEMS.map((it, i) => (
            <motion.div
              key={i}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 44, scale: 0.85 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex flex-col items-center rounded-3xl border border-black/5 bg-white/75 px-5 py-8 shadow-[0_14px_36px_-16px_rgba(15,23,42,0.28)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1.5 dark:border-white/10 dark:bg-slate-800/60"
            >
              <div
                className="relative flex h-24 w-24 items-center justify-center rounded-full md:h-28 md:w-28"
                style={{ backgroundColor: `${it.glow}1F` }}
              >
                <div
                  className="absolute inset-0 rounded-full opacity-45 blur-xl transition-opacity duration-300 group-hover:opacity-80"
                  style={{ backgroundColor: it.glow }}
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ boxShadow: `inset 0 0 0 2px ${it.glow}59` }}
                  aria-hidden="true"
                />
                <div className="relative h-14 w-14 drop-shadow-sm md:h-16 md:w-16 transition-transform duration-300 group-hover:scale-110">
                  {it.art}
                </div>
              </div>
              <span className="mt-5 font-display text-xl md:text-2xl font-bold tracking-tight text-brand-blue-800 dark:text-white">
                {tx(lang, it.name.he, it.name.en, it.name.ar, it.name.ru, it.name.el)}
              </span>
              <span className="mt-1 text-sm md:text-base font-medium text-gray-500 dark:text-gray-400">
                {tx(lang, it.desc.he, it.desc.en, it.desc.ar, it.desc.ru, it.desc.el)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
