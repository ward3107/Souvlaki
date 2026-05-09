import { lazy, Suspense } from 'react';
import { Language } from '../../types';
import { tx, isRtlLang } from '../../utils/i18n';

const GoogleReviews = lazy(() => import('../GoogleReviews'));

interface Props {
  lang: Language;
}

export default function Reviews({ lang }: Props) {
  const isRtl = isRtlLang(lang);

  return (
    <section
      id="reviews"
      className="py-20 bg-gray-50 dark:bg-slate-800/50 transition-colors duration-300"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-gray-900 dark:text-white mb-4 tracking-tight">
            {tx(
              lang,
              'דירוגים וביקורות',
              'Reviews & Ratings',
              'التقييمات والمراجعات',
              'Отзывы и рейтинги',
              'Κριτικές και βαθμολογίες'
            )}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {tx(
              lang,
              'ראו מה הלקוחות שלנו אומרים עלינו',
              'See what our customers are saying about us',
              'شاهد ما يقوله عملاؤنا عنا',
              'Посмотрите, что говорят наши клиенты',
              'Δείτε τι λένε οι πελάτες μας για εμάς'
            )}
          </p>
          <div className="w-16 h-1 bg-brand-terracotta-400 mx-auto rounded-full mt-4"></div>
        </div>

        <div className="max-w-6xl mx-auto">
          <Suspense
            fallback={
              <div className="py-12 text-center text-gray-400 dark:text-gray-500">…</div>
            }
          >
            <GoogleReviews language={lang} isRtl={isRtl} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
