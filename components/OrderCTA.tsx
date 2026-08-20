import { Language } from '../types';
import { tx } from '../utils/i18n';
import { scrollToSection } from '../utils/scroll';

const WhatsAppIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`${className} fill-current`} aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

export default function OrderCTA({ lang }: { lang: Language }) {
  return (
    <section className="relative overflow-hidden bg-brand-blue-600 dark:bg-brand-blue-800 py-16 md:py-24">
      {/* Warm ember glow for appetite */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 60% at 50% 50%, rgba(216,90,48,0.35), transparent 70%)',
        }}
        aria-hidden="true"
      />
      <div className="container mx-auto px-6 text-center relative z-10">
        <h2 className="font-display text-3xl md:text-5xl font-semibold text-white tracking-tight leading-tight">
          {tx(
            lang,
            'רעבים? הזמינו עכשיו.',
            'Hungry? Order now.',
            'جائع؟ اطلب الآن.',
            'Проголодались? Закажите сейчас.',
            'Πεινάσατε; Παραγγείλτε τώρα.'
          )}
        </h2>
        <p className="mt-3 text-white/85 text-base md:text-lg max-w-xl mx-auto">
          {tx(
            lang,
            'הזמנה מהירה בוואטסאפ, ישר מהאש אליכם.',
            'A quick WhatsApp order, straight from our fire to you.',
            'طلب سريع عبر واتساب، من نارنا إليك مباشرة.',
            'Быстрый заказ в WhatsApp, прямо с нашего огня к вам.',
            'Μια γρήγορη παραγγελία στο WhatsApp, κατευθείαν από τη φωτιά μας σε εσάς.'
          )}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="https://wa.me/972542001235"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold text-lg shadow-lift hover:shadow-pop active:scale-[0.97] transition-all"
          >
            <WhatsAppIcon className="w-6 h-6" />
            {tx(
              lang,
              'הזמינו בוואטסאפ',
              'Order on WhatsApp',
              'اطلب عبر واتساب',
              'Заказать в WhatsApp',
              'Παραγγείλτε στο WhatsApp'
            )}
          </a>
          <button
            onClick={() => scrollToSection('menu')}
            className="px-8 py-4 rounded-full border-2 border-white/60 text-white font-semibold text-lg hover:bg-white/10 active:scale-[0.97] transition-all"
          >
            {tx(
              lang,
              'צפייה בתפריט',
              'View the menu',
              'عرض القائمة',
              'Посмотреть меню',
              'Δείτε το μενού'
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
