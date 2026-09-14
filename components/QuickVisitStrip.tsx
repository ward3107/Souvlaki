import { Clock3, Navigation, Phone, UtensilsCrossed } from 'lucide-react';
import { Language } from '../types';
import { tx, isRtlLang } from '../utils/i18n';
import { track } from '../utils/analytics';
import { navigate } from '../utils/router';
import { BUSINESS_INFO } from '../utils/businessInfo';

export default function QuickVisitStrip({ lang }: { lang: Language }) {
  const isRtl = isRtlLang(lang);
  const actionClass =
    'flex min-h-20 flex-col items-center justify-center gap-1.5 rounded-2xl border border-brand-blue-900/10 bg-white px-3 py-4 text-center text-brand-blue-900 shadow-sm transition-colors hover:border-brand-terracotta-300 hover:bg-brand-cream-50 dark:border-white/10 dark:bg-slate-800 dark:text-white';

  return (
    <section
      aria-label={tx(
        lang,
        'מידע מהיר',
        'Quick information',
        'معلومات سريعة',
        'Быстрая информация',
        'Γρήγορες πληροφορίες'
      )}
      className="relative z-10 bg-brand-cream-100 px-4 pb-14 dark:bg-slate-900 md:pb-20"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-4">
        <a
          href="/menu"
          onClick={(event) => {
            event.preventDefault();
            navigate('/menu');
          }}
          className={actionClass}
        >
          <UtensilsCrossed className="h-5 w-5 text-brand-terracotta-500" aria-hidden="true" />
          <strong className="text-sm">
            {tx(lang, 'לתפריט', 'Menu', 'القائمة', 'Меню', 'Μενού')}
          </strong>
        </a>
        <a
          href={BUSINESS_INFO.phone.href}
          onClick={() => track('click_call', { location: 'quick_strip' })}
          className={actionClass}
        >
          <Phone className="h-5 w-5 text-brand-terracotta-500" aria-hidden="true" />
          <strong className="text-sm">{BUSINESS_INFO.phone.display}</strong>
        </a>
        <a
          href={BUSINESS_INFO.location.wazeUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('click_directions', { provider: 'waze', location: 'quick_strip' })}
          className={actionClass}
        >
          <Navigation className="h-5 w-5 text-brand-terracotta-500" aria-hidden="true" />
          <strong className="text-sm">
            {tx(lang, 'ניווט', 'Directions', 'الاتجاهات', 'Маршрут', 'Οδηγίες')}
          </strong>
        </a>
        <div className={actionClass}>
          <Clock3 className="h-5 w-5 text-brand-terracotta-500" aria-hidden="true" />
          <strong className="text-sm">
            {tx(lang, 'ד׳–ש׳', 'Wed–Sat', 'الأربعاء–السبت', 'Ср–Сб', 'Τετ–Σαβ')}{' '}
            {BUSINESS_INFO.hours.display}
          </strong>
        </div>
      </div>
    </section>
  );
}
