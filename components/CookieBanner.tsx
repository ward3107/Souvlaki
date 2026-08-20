import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { tx, isRtlLang } from '../utils/i18n';

interface CookieBannerProps {
  language: Language;
}

// Real GA4 measurement id, supplied via env (VITE_GA_MEASUREMENT_ID). When
// unset, analytics is simply skipped instead of loading a broken placeholder.
const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

type GtagWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

const loadAnalytics = () => {
  // Google Analytics — only when a real measurement id is configured.
  if (GA_ID && !document.getElementById('ga-script')) {
    const gaScript = document.createElement('script');
    gaScript.id = 'ga-script';
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(gaScript);

    // Initialise gtag in-bundle (no inline <script> element) so the CSP can
    // forbid 'unsafe-inline'/'unsafe-eval' script execution.
    const w = window as GtagWindow;
    w.dataLayer = w.dataLayer || [];
    // gtag must push the live `arguments` object, exactly per Google's snippet.
    const gtag: (...args: unknown[]) => void = function () {
      // eslint-disable-next-line prefer-rest-params
      w.dataLayer!.push(arguments);
    };
    w.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }

  // Vercel Analytics (no-op off Vercel; harmless).
  if (!document.getElementById('vercel-analytics')) {
    const vaScript = document.createElement('script');
    vaScript.id = 'vercel-analytics';
    vaScript.defer = true;
    vaScript.src = '/_vercel/insights/script.js';
    document.head.appendChild(vaScript);
  }
};

const CookieBanner: React.FC<CookieBannerProps> = ({ language }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 800);
      return () => clearTimeout(timer);
    } else {
      if (consent === 'all') {
        loadAnalytics();
      }
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookieConsent', 'all');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: 'all' }));
    loadAnalytics();
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    localStorage.setItem('cookieConsent', 'essential');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: 'essential' }));
    setIsVisible(false);
  };

  const isRtl = isRtlLang(language);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[9999] p-3 sm:p-4 ${isRtl ? 'rtl' : 'ltr'}`}
      role="dialog"
      aria-label={tx(
        language,
        'הודעת עוגיות',
        'Cookie notice',
        'إشعار ملفات تعريف الارتباط',
        'Уведомление о файлах cookie',
        'Ειδοποίηση cookie'
      )}
    >
      <div
        className="max-w-2xl mx-auto rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden border border-[#F5A623]/30"
        style={{ backgroundColor: '#1a1a2e' }}
      >
        {/* Orange accent top */}
        <div className="h-0.5 sm:h-1" style={{ backgroundColor: '#F5A623' }} />

        <div className="p-3 sm:p-5 md:p-6">
          {/* Text */}
          <div className="mb-3 sm:mb-4">
            <h3
              className="text-base sm:text-lg font-bold mb-1 sm:mb-2"
              style={{ color: '#F5A623', fontFamily: 'Heebo, sans-serif' }}
            >
              {tx(
                language,
                'פרטיות ועוגיות 🍪',
                'Privacy & Cookies 🍪',
                'الخصوصية وملفات تعريف الارتباط 🍪',
                'Конфиденциальность и cookie 🍪',
                'Απόρρητο & Cookies 🍪'
              )}
            </h3>
            <p
              className="text-xs sm:text-sm leading-relaxed text-gray-300"
              style={{ fontFamily: 'Heebo, sans-serif' }}
            >
              {tx(
                language,
                'אנו משתמשים בעוגיות הכרחיות לתפקוד האתר ובעוגיות ניתוח (Google Analytics, Vercel Analytics) לשיפור השירות. בהתאם לתיקון 13 לחוק הגנת הפרטיות, באפשרותך לבחור אילו עוגיות לאשר.',
                'We use essential cookies for site functionality and analytics cookies (Google Analytics, Vercel Analytics) to improve our service. Per Israeli Amendment 13, you can choose which cookies to allow.',
                'نستخدم ملفات تعريف الارتباط الأساسية لعمل الموقع وملفات تعريف الارتباط التحليلية (Google Analytics, Vercel Analytics) لتحسين الخدمة. وفقاً للتعديل 13، يمكنك اختيار ملفات تعريف الارتباط التي تسمح بها.',
                'Мы используем необходимые файлы cookie для работы сайта и аналитические файлы cookie (Google Analytics, Vercel Analytics) для улучшения сервиса. Согласно поправке 13, вы можете выбрать, какие cookie разрешить.',
                'Χρησιμοποιούμε απαραίτητα cookies για τη λειτουργία του ιστότοπου και αναλυτικά cookies (Google Analytics, Vercel Analytics) για τη βελτίωση της υπηρεσίας. Σύμφωνα με την Τροποποίηση 13, μπορείτε να επιλέξετε ποια cookies θα επιτρέψετε.'
              )}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={handleAcceptAll}
              className="flex-1 px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm text-white transition-all hover:brightness-110 active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg"
              style={{
                backgroundColor: '#F5A623',
                fontFamily: 'Heebo, sans-serif',
              }}
            >
              {tx(
                language,
                'אישור הכל ✓',
                'Accept All ✓',
                'قبول الكل ✓',
                'Принять все ✓',
                'Αποδοχή όλων ✓'
              )}
            </button>
            <button
              onClick={handleEssentialOnly}
              className="flex-1 px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all hover:bg-white/10 active:scale-[0.98] flex items-center justify-center gap-2"
              style={{
                border: '2px solid #F5A623',
                color: '#F5A623',
                backgroundColor: 'transparent',
                fontFamily: 'Heebo, sans-serif',
              }}
            >
              {tx(
                language,
                'הכרחיות בלבד',
                'Essential Only',
                'الضرورية فقط',
                'Только необходимые',
                'Μόνο απαραίτητα'
              )}
            </button>
          </div>

          {/* Privacy policy link */}
          <div className="mt-2 sm:mt-3 text-center">
            <button
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent('openLegalDocument', {
                    detail: '/legal/privacy-policy.md',
                  })
                );
              }}
              className="text-[11px] sm:text-xs hover:underline transition-colors"
              style={{ color: '#F5A623', fontFamily: 'Heebo, sans-serif' }}
            >
              {tx(
                language,
                'מדיניות פרטיות',
                'Privacy Policy',
                'سياسة الخصوصية',
                'Политика конфиденциальности',
                'Πολιτική Απορρήτου'
              )}
            </button>
          </div>
        </div>

        {/* Orange accent bottom */}
        <div className="h-0.5 sm:h-1" style={{ backgroundColor: '#F5A623' }} />
      </div>
    </div>
  );
};

export default CookieBanner;
