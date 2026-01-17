import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { Cookie, X, Check, ChevronDown, ChevronUp, Shield, Settings, BarChart3 } from 'lucide-react';

interface CookieBannerProps {
  language: Language;
}

interface CookiePreferences {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
}

const CookieBanner: React.FC<CookieBannerProps> = ({ language }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always enabled
    functional: false,
    analytics: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // Delay slightly to prevent jarring load
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie_consent', JSON.stringify(prefs));
    // You can also dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: prefs }));
    setIsVisible(false);
  };

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      functional: true,
      analytics: true,
    };
    savePreferences(allAccepted);
  };

  const handleRejectNonEssential = () => {
    const onlyEssential: CookiePreferences = {
      essential: true,
      functional: false,
      analytics: false,
    };
    savePreferences(onlyEssential);
  };

  const handleCustomizeSave = () => {
    savePreferences(preferences);
  };

  const t = (he: string, en: string, ar: string): string => {
    if (language === Language.HE) return he;
    if (language === Language.AR) return ar;
    return en;
  };

  const isRtl = language === Language.HE || language === Language.AR;

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-[60] p-4 animate-in slide-in-from-bottom duration-500 ${isRtl ? 'rtl' : 'ltr'}`}>
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
        {/* Gradient top border */}
        <div className="h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>

        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 p-3 rounded-xl">
              <Cookie className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t('פרטיות ועוגיות', 'Privacy & Cookies', 'الخصوصية وملفات تعريف الارتباط')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {t(
                  'אנו משתמשים בעוגיות כדי לשפר את חווית השימוש שלך. אנא בחר אילו עוגיות ברצונך לאפשר.',
                  'We use cookies to enhance your experience. Please choose which cookies you\'d like to allow.',
                  'نستخدم ملفات تعريف الارتباط لتحسين تجربتك. يرجى اختيار ملفات تعريف الارتباط التي تريد السماح بها.'
                )}
              </p>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Customize Section */}
          {isCustomizeOpen && (
            <div className="mb-6 p-5 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-200 dark:border-slate-700 animate-in slide-in-from-top-2 duration-300">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                {t('בחר קטגוריות עוגיות', 'Choose Cookie Categories', 'اختر فئات ملفات تعريف الارتباط')}
              </h4>

              {/* Essential Cookies */}
              <div className="mb-4 pb-4 border-b border-gray-200 dark:border-slate-700 last:border-0 last:mb-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">
                        {t('עוגיות הכרחיות', 'Essential Cookies', 'ملفات تعريف الارتباط الضرورية')}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t('Google Maps - נדרש לתצוגת המפה', 'Required for map functionality', 'مطلوب لعمل الخريطة')}
                      </p>
                    </div>
                  </div>
                  <div className="w-12 h-7 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mr-13">
                  {t(
                    'עוגיות אלו נחוצות לתפקוד האתר ולא ניתן לבטל אותן.',
                    'These cookies are necessary for the site to function and cannot be disabled.',
                    'ملفات تعريف الارتباط هذه ضرورية لعمل الموقع ولا يمكن تعطيلها.'
                  )}
                </p>
              </div>

              {/* Functional Cookies */}
              <div className="mb-4 pb-4 border-b border-gray-200 dark:border-slate-700 last:border-0 last:mb-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Settings className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">
                        {t('עוגיות פונקציונליות', 'Functional Cookies', 'ملفات تعريف الارتباط الوظيفية')}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t('שמירת שפה והעדפות', 'Remember language & preferences', 'تذكر اللغة والتفضيلات')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPreferences({ ...preferences, functional: !preferences.functional })}
                    className={`relative w-12 h-7 rounded-full transition-colors ${
                      preferences.functional ? 'bg-purple-500' : 'bg-gray-300 dark:bg-slate-600'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                        preferences.functional ? (isRtl ? 'right-1' : 'left-1') : (isRtl ? 'left-1' : 'right-1')
                      }`}
                    />
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mr-13">
                  {t(
                    'עוגיות אלו זוכרות את השפה וההעדפות שלך.',
                    'These cookies remember your language and preferences.',
                    'تذكر ملفات تعريف الارتباط هذه لغتك وتفضيلاتك.'
                  )}
                </p>
              </div>

              {/* Analytics Cookies */}
              <div className="mb-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">
                        {t('עוגיות ניתוח', 'Analytics Cookies', 'ملفات تعريف الارتباط التحليلية')}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t('Google Analytics - כרגע מנוטרל', 'Google Analytics - Currently disabled', 'Google Analytics - معطلة حاليًا')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPreferences({ ...preferences, analytics: !preferences.analytics })}
                    className={`relative w-12 h-7 rounded-full transition-colors ${
                      preferences.analytics ? 'bg-pink-500' : 'bg-gray-300 dark:bg-slate-600'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                        preferences.analytics ? (isRtl ? 'right-1' : 'left-1') : (isRtl ? 'left-1' : 'right-1')
                      }`}
                    />
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mr-13">
                  {t(
                    'עוגיות אלו עוזרות לנו להבין כיצד המשתמשים משתמשים באתר.',
                    'These cookies help us understand how users use our site.',
                    'تساعدنا ملفات تعريف الارتباط هذه على فهم كيفية استخدام المستخدمين لموقعنا.'
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAcceptAll}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20 text-sm flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              {t('אשר הכל', 'Accept All', 'قبول الكل')}
            </button>
            <button
              onClick={handleRejectNonEssential}
              className="flex-1 px-6 py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 rounded-xl font-semibold transition-colors text-sm"
            >
              {t('דחה לא הכרחיות', 'Reject Non-Essential', 'رفض غير الضرورية')}
            </button>
            <button
              onClick={() => setIsCustomizeOpen(!isCustomizeOpen)}
              className="flex-1 px-6 py-3 border-2 border-gray-200 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 text-gray-700 dark:text-gray-200 rounded-xl font-semibold transition-all text-sm flex items-center justify-center gap-2"
            >
              <Settings className="w-4 h-4" />
              {t('התאם אישית', 'Customize', 'تخصيص')}
              {isCustomizeOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {isCustomizeOpen && (
              <button
                onClick={handleCustomizeSave}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-green-600/20 text-sm flex items-center justify-center gap-2 animate-in fade-in duration-300"
              >
                <Check className="w-4 h-4" />
                {t('שמור העדפות', 'Save Preferences', 'حفظ التفضيلات')}
              </button>
            )}
          </div>

          {/* Footer Link */}
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                const event = new CustomEvent('openLegalDocument', { detail: '/legal/cookie-policy.md' });
                window.dispatchEvent(event);
              }}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-purple-600 dark:hover:text-purple-400 hover:underline transition-colors"
            >
              {t('מדיניות עוגיות מלאה', 'Full Cookie Policy', 'سياسة ملفات تعريف الارتباط الكاملة')}
            </button>
          </div>
        </div>

        {/* Gradient bottom border */}
        <div className="h-1 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600"></div>
      </div>
    </div>
  );
};

export default CookieBanner;
