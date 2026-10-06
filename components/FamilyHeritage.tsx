import { motion } from 'framer-motion';
import { Language } from '../types';
import { tx } from '../utils/i18n';
import AmbientVideo from './AmbientVideo';
import { useLiteEffects } from '../src/renderingPolicy';

export default function FamilyHeritage({ lang }: { lang: Language }) {
  const reduce = useLiteEffects();

  const reveal = (delay: number) => ({
    initial: reduce ? (false as const) : { opacity: 0, y: 24 },
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
      <AmbientVideo
        className="absolute inset-0"
        src="/video/family-recipes.mp4"
        poster="/video/family-recipes-poster.jpg"
      />
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
