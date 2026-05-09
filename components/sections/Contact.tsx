import { Navigation, Phone } from 'lucide-react';
import { Language } from '../../types';
import { t, tx } from '../../utils/i18n';
import OpeningHours from '../OpeningHours';

interface Props {
  lang: Language;
}

const WhatsAppGlyph = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`${className} fill-current`} aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

export default function Contact({ lang }: Props) {
  return (
    <section
      id="contact"
      className="py-20 bg-gray-50 dark:bg-slate-800/50 transition-colors duration-300"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-gray-900 dark:text-white mb-4 tracking-tight">
            {t(lang, 'contact_title')}
          </h2>
          <div className="w-16 h-1 bg-brand-terracotta-400 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-soft border border-gray-100 dark:border-slate-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                📞{' '}
                {tx(lang, 'צור קשר', 'Contact Us', 'اتصل بنا', 'Свяжитесь с нами', 'Επικοινωνήστε')}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                {tx(
                  lang,
                  'לחץ על הכפתורים ליצירת קשר מהירה',
                  'Click the buttons for quick contact',
                  'اضغط على الأزرار للتواصل السريع',
                  'Нажмите на кнопки для быстрой связи',
                  'Πατήστε τα κουμπιά για γρήγορη επικοινωνία'
                )}
              </p>

              <div className="grid grid-cols-1 gap-3">
                <a
                  href="tel:048122980"
                  className="group flex items-center gap-3 p-4 bg-gradient-to-r from-brand-blue-50 to-brand-blue-100 dark:from-brand-blue-900/20 dark:to-brand-blue-800/20 rounded-xl border-2 border-brand-blue-200 dark:border-brand-blue-800 hover:border-brand-blue-400 transition-all duration-300 hover:scale-[1.02] hover:shadow-lift"
                >
                  <div className="w-12 h-12 bg-brand-blue-500 rounded-xl flex items-center justify-center text-white shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 dark:text-white text-lg">
                      04-812-2980
                    </div>
                    <div className="text-brand-blue-500 dark:text-brand-blue-300 text-sm font-medium">
                      {tx(
                        lang,
                        'לחץ להתקשר →',
                        'Tap to call →',
                        'اضغط للاتصال →',
                        'Нажмите, чтобы позвонить →',
                        'Πατήστε για κλήση →'
                      )}
                    </div>
                  </div>
                </a>

                <a
                  href="https://wa.me/972542001235"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border-2 border-green-200 dark:border-green-800 hover:border-green-400 transition-all duration-300 hover:scale-[1.02] hover:shadow-lift"
                >
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                    <WhatsAppGlyph />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 dark:text-white text-lg">Jennje</div>
                    <div className="text-green-600 dark:text-green-400 text-sm font-medium">
                      {tx(
                        lang,
                        '054-200-1235 • לחצו כאן 💬',
                        '054-200-1235 • Tap here 💬',
                        '054-200-1235 • اضغط هنا 💬',
                        '054-200-1235 • Нажмите здесь 💬',
                        '054-200-1235 • Πατήστε εδώ 💬'
                      )}
                    </div>
                  </div>
                </a>

                <a
                  href="https://wa.me/972528921454"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border-2 border-green-200 dark:border-green-800 hover:border-green-400 transition-all duration-300 hover:scale-[1.02] hover:shadow-lift"
                >
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                    <WhatsAppGlyph />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 dark:text-white text-lg">Andreia</div>
                    <div className="text-green-600 dark:text-green-400 text-sm font-medium">
                      {tx(
                        lang,
                        '052-892-1454 • לחצו כאן 💬',
                        '052-892-1454 • Tap here 💬',
                        '052-892-1454 • اضغط هنا 💬',
                        '052-892-1454 • Нажмите здесь 💬',
                        '052-892-1454 • Πατήστε εδώ 💬'
                      )}
                    </div>
                  </div>
                </a>

                <a
                  href="https://waze.com/ul?ll=32.9556,35.1636&navigate=yes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 p-4 bg-gradient-to-r from-brand-terracotta-50 to-brand-terracotta-100 dark:from-brand-terracotta-400/15 dark:to-brand-terracotta-400/20 rounded-xl border-2 border-brand-terracotta-200 dark:border-brand-terracotta-400/40 hover:border-brand-terracotta-400 transition-all duration-300 hover:scale-[1.02] hover:shadow-lift"
                >
                  <div className="w-12 h-12 bg-brand-terracotta-400 rounded-xl flex items-center justify-center text-white shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                    <Navigation className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 dark:text-white text-lg">
                      {tx(
                        lang,
                        'ניווט Waze',
                        'Waze Navigation',
                        'تنقل Waze',
                        'Навигация Waze',
                        'Πλοήγηση Waze'
                      )}
                    </div>
                    <div className="text-brand-terracotta-500 dark:text-brand-terracotta-200 text-sm font-medium">
                      {tx(
                        lang,
                        'כפר יאסיף, כביש 70 🧭',
                        'Kfar Yasif, Route 70 🧭',
                        'كفر ياسيف، طريق 70 🧭',
                        'Кфар-Ясиф, Шоссе 70 🧭',
                        'Καφρ Γιασίφ, Οδός 70 🧭'
                      )}
                    </div>
                  </div>
                </a>
              </div>
            </div>

            <OpeningHours language={lang} />
          </div>

          <div className="h-full min-h-[400px] rounded-2xl overflow-hidden shadow-lift border border-gray-100 dark:border-slate-700 relative group">
            <iframe
              width="100%"
              height="100%"
              src="https://maps.google.com/maps?q=Greek%20Souvlaki%20Kafr%20Yasif&t=&z=15&ie=UTF8&iwloc=&output=embed"
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              className="w-full h-full absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out"
              title="Google Maps Location"
            />
            <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-center shadow-lift transform translate-y-2 group-hover:translate-y-0 duration-300">
              <div>
                <p className="font-bold text-gray-900 dark:text-white">Greek Souvlaki</p>
                <div className="flex text-yellow-500 text-xs">★★★★★ (4.9)</div>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Greek+Souvlaki+Kafr+Yasif"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-brand-blue-500 text-white text-sm font-bold rounded-lg hover:bg-brand-blue-600 transition-colors"
              >
                {tx(
                  lang,
                  'צפה במפה',
                  'View on Map',
                  'عرض الخريطة',
                  'Смотреть карту',
                  'Δείτε τον χάρτη'
                )}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
