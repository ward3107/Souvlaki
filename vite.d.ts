/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

// Type the app's own environment variables (all client-exposed VITE_* keys).
interface ImportMetaEnv {
  readonly VITE_GA_MEASUREMENT_ID?: string;
  readonly VITE_GOOGLE_MAPS_API_KEY?: string;
  readonly VITE_GOOGLE_PLACES_API_KEY?: string;
  readonly VITE_FACEBOOK_PIXEL_ID?: string;
  readonly VITE_FEEDBACK_EMAIL?: string;
  readonly VITE_APP_ENV?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_NEWSLETTER_ENDPOINT?: string;
  readonly VITE_INSTAGRAM_FEED_URL?: string;
  readonly VITE_ADMIN_PIN?: string;
  readonly VITE_STAFF_PIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'virtual:pwa-register' {
  export interface RegisterSWOptions {
    immediate?: boolean;
    onNeedRefresh?: () => void;
    onOfflineReady?: () => void;
    onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void;
    onRegisterError?: (error: unknown) => void;
  }

  export function registerSW(options: RegisterSWOptions): (reloadPage?: boolean) => void;
}
