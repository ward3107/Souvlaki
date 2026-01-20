import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    // Show update prompt to user
    if (
      confirm(
        'גרסה חדשה זמינה! לרענן עכשיו?\n\nNew version available! Refresh now?\n\nНовая версия доступна! Обновить?\n\nНueva versión disponible! ¿Actualizar?'
      )
    ) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('✅ PWA ready to work offline');
  },
  onRegistered(registration) {
    console.log('✅ Service Worker registered:', registration);

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
