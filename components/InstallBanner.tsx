import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Language } from '../types';

const InstallBanner: React.FC<{ lang: Language }> = ({ lang }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('pwa-install-dismissed')) return;
    if (localStorage.getItem('pwa-installed')) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        localStorage.setItem('pwa-installed', 'true');
      }
      setDeferredPrompt(null);
    }
    setShowBanner(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-install-dismissed', 'true');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  const installText: Record<
    Language,
    {
      title: string;
      message: string;
      install: string;
      dismiss: string;
      ios: string;
      android: string;
    }
  > = {
    [Language.HE]: {
      title: 'התקן את האפליקציה שלנו',
      message: 'קבל גישה מהירה ישירות ממסך הבית שלך!',
      install: 'התקן',
      dismiss: 'לא עכשיו',
      ios: 'הוסף למסך הבית',
      android: 'התקנת אפליקציה',
    },
    [Language.EN]: {
      title: 'Install Our App',
      message: 'Get quick access right from your home screen!',
      install: 'Install',
      dismiss: 'Not now',
      ios: 'Add to Home Screen',
      android: 'Install app',
    },
    [Language.AR]: {
      title: 'ثبت تطبيقنا',
      message: 'احصل على وصول سريع من الشاشة الرئيسية!',
      install: 'تثبيت',
      dismiss: 'ليس الآن',
      ios: 'إضافة إلى الشاشة الرئيسية',
      android: 'تثبيت التطبيق',
    },
    [Language.RU]: {
      title: 'Установите наше приложение',
      message: 'Быстрый доступ с главного экрана!',
      install: 'Установить',
      dismiss: 'Не сейчас',
      ios: 'На главный экран',
      android: 'Установить приложение',
    },
    [Language.EL]: {
      title: 'Εγκαταστήστε την εφαρμογή μας',
      message: 'Γρήγορη πρόσβαση από την αρχική οθόνη!',
      install: 'Εγκατάσταση',
      dismiss: 'Όχι τώρα',
      ios: 'Στην αρχική οθόνη',
      android: 'Εγκατάσταση εφαρμογής',
    },
  };

  const labels = installText[lang] || installText[Language.EN];
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  // Thin, dismissible strip pinned at the very top of the page — it sits ABOVE
  // the sticky header in normal document flow, so both stay visible and the
  // page content is simply pushed down while the strip is shown.
  return (
    <div className="w-full bg-slate-900 text-white">
      <div className="container mx-auto flex items-center gap-2 sm:gap-3 px-3 sm:px-4 h-9 sm:h-11">
        <img
          src="/pwa-icon.png"
          alt=""
          aria-hidden="true"
          className="w-5 h-5 sm:w-6 sm:h-6 rounded-md object-cover flex-shrink-0"
        />
        <p className="flex-1 min-w-0 text-xs sm:text-sm text-center truncate">{labels.message}</p>
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <button
            onClick={isIOS ? handleDismiss : handleInstall}
            className="bg-white text-slate-900 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full font-semibold text-xs sm:text-sm hover:bg-opacity-90 transition-opacity"
          >
            {isIOS ? labels.ios : labels.install}
          </button>
          <button
            onClick={handleDismiss}
            className="w-7 h-7 flex items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label={labels.dismiss}
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallBanner;
