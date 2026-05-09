import { useEffect, useState } from 'react';
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

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 z-40 animate-slide-up">
      <div className="bg-brand-blue-500 rounded-2xl shadow-pop p-4 text-white">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-soft overflow-hidden">
            <img src="/pwa-icon.png" alt="Greek Souvlaki" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-1">{labels.title}</h3>
            <p className="text-sm opacity-90 mb-3">{labels.message}</p>
            <div className="flex gap-2">
              <button
                onClick={isIOS ? handleDismiss : handleInstall}
                className="flex-1 bg-white text-brand-blue-500 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-opacity-90 transition-opacity"
              >
                {isIOS ? labels.ios : labels.install}
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 rounded-lg font-semibold text-sm hover:bg-white/10 transition-colors"
              >
                {labels.dismiss}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallBanner;
