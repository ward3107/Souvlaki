import { useEffect, useState } from 'react';
import { Download, WifiOff, X } from 'lucide-react';
import { Language } from '../types';
import { tx, isRtlLang } from '../utils/i18n';
import { track } from '../utils/analytics';

// The browser's install event isn't in the TS DOM lib yet.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'a2hs-dismissed-v1';

// Two small, unobtrusive helpers bundled together:
//  1. "Install app" — an Add-to-Home-Screen prompt that appears only when the
//     browser says the PWA is installable and the visitor hasn't dismissed it.
//  2. Offline indicator — a slim banner while the device is offline, reassuring
//     visitors the (already cached) menu still works.
export default function InstallPrompt({ lang }: { lang: Language }) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [offline, setOffline] = useState(
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  );
  const isRtl = isRtlLang(lang);

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY)) return;
    const onPrompt = (e: Event) => {
      e.preventDefault(); // stop Chrome's default mini-infobar
      setDeferred(e as BeforeInstallPromptEvent);
      setShowInstall(true);
    };
    const onInstalled = () => {
      setShowInstall(false);
      track('pwa_installed');
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  useEffect(() => {
    const goOnline = () => setOffline(false);
    const goOffline = () => setOffline(true);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  const install = async () => {
    if (!deferred) return;
    track('pwa_install_click');
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setShowInstall(false);
  };

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, '1');
    setShowInstall(false);
  };

  return (
    <>
      {offline && (
        <div
          className="fixed inset-x-0 top-0 z-[9998] flex items-center justify-center gap-2 bg-slate-800 px-4 py-1.5 text-center text-xs font-medium text-white"
          role="status"
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          <WifiOff className="h-3.5 w-3.5" aria-hidden="true" />
          {tx(
            lang,
            'אין חיבור — התפריט עדיין זמין',
            "You're offline — the menu still works",
            'أنت غير متصل — القائمة لا تزال متاحة',
            'Нет сети — меню всё ещё доступно',
            'Είστε εκτός σύνδεσης — το μενού λειτουργεί'
          )}
        </div>
      )}

      {showInstall && (
        <div
          className="fixed bottom-4 left-1/2 z-[70] w-[min(92vw,26rem)] -translate-x-1/2 [body.cart-active_&]:hidden"
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          <div className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white p-3 shadow-lift dark:border-white/10 dark:bg-slate-800">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-terracotta-400/15 text-brand-terracotta-500">
              <Download className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                {tx(
                  lang,
                  'התקינו את האפליקציה',
                  'Install our app',
                  'ثبّت تطبيقنا',
                  'Установите приложение',
                  'Εγκαταστήστε την εφαρμογή'
                )}
              </p>
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                {tx(
                  lang,
                  'גישה מהירה לתפריט, גם ללא אינטרנט',
                  'Fast menu access, even offline',
                  'وصول سريع للقائمة، حتى دون إنترنت',
                  'Быстрый доступ к меню, даже офлайн',
                  'Γρήγορη πρόσβαση στο μενού, ακόμη και εκτός σύνδεσης'
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={install}
              className="shrink-0 rounded-full bg-brand-terracotta-400 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-terracotta-500 active:scale-95"
            >
              {tx(lang, 'התקנה', 'Install', 'تثبيت', 'Установить', 'Εγκατάσταση')}
            </button>
            <button
              type="button"
              onClick={dismiss}
              aria-label={tx(lang, 'סגור', 'Dismiss', 'إغلاق', 'Закрыть', 'Κλείσιμο')}
              className="shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
