import React, { useState, useEffect } from 'react';
import { TRANSLATIONS } from '../constants';
import { Language, TranslationKey } from '../types';
import { Cookie } from 'lucide-react';

interface CookieBannerProps {
  language: Language;
}

const CookieBanner: React.FC<CookieBannerProps> = ({ language }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // Delay slightly to prevent jarring load
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAction = (action: 'accepted' | 'declined') => {
    localStorage.setItem('cookie_consent', action);
    setIsVisible(false);
  };

  const t = (key: TranslationKey): string => TRANSLATIONS[language][key] || key;

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] p-4 animate-in slide-in-from-bottom duration-500">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
        <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full text-blue-600 dark:text-blue-400">
          <Cookie className="w-8 h-8" />
        </div>
        
        <div className="flex-1 text-center md:text-start">
          <p className="text-gray-700 dark:text-gray-200 text-sm md:text-base leading-relaxed">
            {t('cookie_text')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto min-w-[200px]">
          <button
            onClick={() => handleAction('accepted')}
            className="flex-1 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm text-sm"
          >
            {t('cookie_accept')}
          </button>
          <button
            onClick={() => handleAction('declined')}
            className="flex-1 px-6 py-2.5 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors text-sm"
          >
            {t('cookie_decline')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
