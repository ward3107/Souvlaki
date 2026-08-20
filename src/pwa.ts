import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    // Show update prompt to user
    if (
      confirm(
        'גרסה חדשה זמינה! לרענן עכשיו?\n\nNew version available! Refresh now?\n\nإصدار جديد متاح! تحديث الآن؟\n\nНовая версия доступна! Обновить?\n\nΝέα έκδοση διαθέσιμη! Ανανέωση τώρα;'
      )
    ) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    if (import.meta.env.DEV) console.log('✅ PWA ready to work offline');
  },
  onRegistered(registration) {
    if (import.meta.env.DEV) console.log('✅ Service Worker registered:', registration);

    // Check for updates every hour
    if (registration) {
      setInterval(
        () => {
          registration.update();
        },
        60 * 60 * 1000
      );
    }
  },
  onRegisterError(error) {
    console.error('❌ Service Worker registration error:', error);
  },
});

export { updateSW };
