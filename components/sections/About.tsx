import { Language } from '../../types';
import { t, tx } from '../../utils/i18n';
import Reveal from '../Reveal';

interface Props {
  lang: Language;
}

export default function About({ lang }: Props) {
  return (
    <section id="about" className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <Reveal>
          <div className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto">
            <div className="flex-1 space-y-6">
              <h2 className="font-display text-4xl md:text-5xl font-semibold text-gray-900 dark:text-white mb-4 tracking-tight relative inline-block">
                {t(lang, 'about_title')}
                <span className="absolute -bottom-2 start-0 w-1/2 h-1 bg-brand-terracotta-400 rounded-full"></span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                {t(lang, 'about_content_1')}
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                {t(lang, 'about_content_2')}
              </p>
              <div className="pt-4 flex gap-4">
                <div className="bg-brand-blue-50 dark:bg-slate-800 p-4 rounded-lg text-center flex-1">
                  <span className="block text-3xl font-bold text-brand-blue-500 mb-1">100%</span>
                  <span className="text-xs text-gray-700 dark:text-gray-300 uppercase tracking-wide font-semibold">
                    {tx(lang, 'אותנטי', 'Authentic', 'أصلي', 'Аутентичный', 'Αυθεντικό')}
                  </span>
                </div>
                <div className="bg-brand-blue-50 dark:bg-slate-800 p-4 rounded-lg text-center flex-1">
                  <span className="block text-3xl font-bold text-brand-blue-500 mb-1">
                    {tx(lang, 'טרי', 'Fresh', 'طازج', 'Свежий', 'Φρέσκο')}
                  </span>
                  <span className="text-xs text-gray-700 dark:text-gray-300 uppercase tracking-wide font-semibold">
                    {tx(
                      lang,
                      'מרכיבים יומיים',
                      'Daily Ingredients',
                      'مكونات يومية',
                      'Ежедневные ингредиенты',
                      'Καθημερινά υλικά'
                    )}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-lift transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <img
                  src="/about/restaurant-interior.webp"
                  alt="Restaurant Interior"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute top-10 -end-6 w-full h-full bg-brand-blue-50 dark:bg-brand-blue-900/20 rounded-2xl -z-0"></div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
