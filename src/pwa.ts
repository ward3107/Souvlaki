import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    // Activate the new build immediately so returning visitors never remain
    // trapped on stale menu/admin bundles.
    updateSW(true);
  },
  onOfflineReady() {
    if (import.meta.env.DEV) console.log('✅ PWA ready to work offline');
  },
  onRegistered(registration) {
    if (import.meta.env.DEV) console.log('✅ Service Worker registered:', registration);
    registration?.update();
    if (registration) {
      setInterval(() => registration.update(), 60 * 60 * 1000);
    }
  },
  onRegisterError(error) {
    console.error('❌ Service Worker registration error:', error);
  },
});

export { updateSW };
