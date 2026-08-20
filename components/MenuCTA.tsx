import { Language } from '../types';
import { tx } from '../utils/i18n';
import { navigate } from '../utils/router';

export default function MenuCTA({ lang }: { lang: Language }) {
  return (
    <section className="py-16 md:py-24 bg-brand-cream-100 dark:bg-slate-900 text-center px-6">
      <h2 className="font-display text-3xl md:text-5xl font-semibold text-brand-blue-700 dark:text-white tracking-tight">
        {tx(lang, 'התפריט שלנו', 'Our menu', 'قائمتنا', 'Наше меню', 'Το μενού μας')}
      </h2>
      <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-xl mx-auto text-base md:text-lg">
        {tx(
          lang,
          'כל המנות, הזמנה מהירה. בעמוד נקי וממוקד.',
          'Every dish, quick to order, on one clean, focused page.',
          'كل الأطباق، طلب سريع، في صفحة واحدة واضحة ومركزة.',
          'Все блюда, быстрый заказ, на одной чистой странице.',
          'Όλα τα πιάτα, γρήγορη παραγγελία, σε μία καθαρή σελίδα.'
        )}
      </p>
      <button
        onClick={() => navigate('/menu')}
        className="mt-8 inline-flex items-center justify-center gap-2 px-10 py-4 bg-brand-terracotta-400 hover:bg-brand-terracotta-500 text-white rounded-full font-semibold text-lg shadow-lift hover:shadow-pop active:scale-[0.97] transition-all"
      >
        {tx(
          lang,
          'לצפייה בתפריט המלא',
          'View the full menu',
          'عرض القائمة الكاملة',
          'Открыть меню',
          'Δείτε το πλήρες μενού'
        )}
      </button>
    </section>
  );
}
