import React, { useState, useEffect } from 'react';
import { Language } from '../types';

interface CookieBannerProps {
  language: Language;
}

const loadAnalytics = () => {
  // Load Google Analytics
  if (!document.getElementById('ga-script')) {
    const gaScript = document.createElement('script');
    gaScript.id = 'ga-script';
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
    document.head.appendChild(gaScript);

    const gaInit = document.createElement('script');
    gaInit.id = 'ga-init';
    gaInit.textContent = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-XXXXXXXXXX', { anonymize_ip: true });
      `;
    document.head.appendChild(gaInit);
  }

  // Load Vercel Analytics
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

  const isRtl = language === Language.HE || language === Language.AR;

  const t = (he: string, en: string, ar: string): string => {
    if (language === Language.HE) return he;
    if (language === Language.AR) return ar;
    return en;
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[9999] p-4 ${isRtl ? 'rtl' : 'ltr'}`}
      role="dialog"
      aria-label={t('הודעת עוגיות', 'Cookie notice', 'إشعار ملفات تعريف الارتباط')}
    >
      <div
        className="max-w-2xl mx-auto rounded-2xl shadow-2xl overflow-hidden border border-[#F5A623]/30"
        style={{ backgroundColor: '#1a1a2e' }}
      >
        {/* Orange accent top */}
        <div className="h-1" style={{ backgroundColor: '#F5A623' }} />

        <div className="p-5 md:p-6">
          {/* Text */}
          <div className="mb-4">
            <h3
              className="text-lg font-bold mb-2"
              style={{ color: '#F5A623', fontFamily: 'Heebo, sans-serif' }}
            >
              {t('פרטיות ועוגיות 🍪', 'Privacy & Cookies 🍪', 'الخصوصية وملفات تعريف الارتباط 🍪')}
            </h3>
            <p
              className="text-sm leading-relaxed text-gray-300"
              style={{ fontFamily: 'Heebo, sans-serif' }}
            >
              {t(
                'אנו משתמשים בעוגיות הכרחיות לתפקוד האתר ובעוגיות ניתוח (Google Analytics, Vercel Analytics) לשיפור השירות. בהתאם לתיקון 13 לחוק הגנת הפרטיות, באפשרותך לבחור אילו עוגיות לאשר.',
                'We use essential cookies for site functionality and analytics cookies (Google Analytics, Vercel Analytics) to improve our service. Per Israeli Amendment 13, you can choose which cookies to allow.',
                'نستخدم ملفات تعريف الارتباط الأساسية لعمل الموقع وملفات تعريف الارتباط التحليلية (Google Analytics, Vercel Analytics) لتحسين الخدمة. وفقاً للتعديل 13، يمكنك اختيار ملفات تعريف الارتباط التي تسمح بها.'
              )}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAcceptAll}
              className="flex-1 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:brightness-110 active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg"
              style={{
                backgroundColor: '#F5A623',
                fontFamily: 'Heebo, sans-serif',
              }}
            >
              {t('אישור הכל ✓', 'Accept All ✓', 'قبول الكل ✓')}
            </button>
            <button
              onClick={handleEssentialOnly}
              className="flex-1 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:bg-white/10 active:scale-[0.98] flex items-center justify-center gap-2"
              style={{
                border: '2px solid #F5A623',
                color: '#F5A623',
                backgroundColor: 'transparent',
                fontFamily: 'Heebo, sans-serif',
              }}
            >
              {t('הכרחיות בלבד', 'Essential Only', 'الضرورية فقط')}
            </button>
          </div>

          {/* Privacy policy link */}
          <div className="mt-3 text-center">
            <button
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent('openLegalDocument', {
                    detail: '/legal/privacy-policy.md',
                  })
                );
              }}
              className="text-xs hover:underline transition-colors"
              style={{ color: '#F5A623', fontFamily: 'Heebo, sans-serif' }}
            >
              {t('מדיניות פרטיות', 'Privacy Policy', 'سياسة الخصوصية')}
            </button>
          </div>
        </div>

        {/* Orange accent bottom */}
        <div className="h-1" style={{ backgroundColor: '#F5A623' }} />
      </div>
    </div>
  );
};

export default CookieBanner;
