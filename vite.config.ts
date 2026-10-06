import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';
import type { Plugin } from 'vite';

// Vitest config lives in vitest.config.ts (the file Vitest loads by default).

// Plugin to inject preload hints for main JS and CSS bundles
function injectPreloads(): Plugin {
  return {
    name: 'inject-preloads',
    transformIndexHtml(html: string) {
      // Inject modulepreload for the main JS bundle.
      html = html.replace(
        /(<script type="module" crossorigin src="([^"]+)"><\/script>)/,
        '<link rel="modulepreload" crossorigin href="$2" as="script" fetchpriority="high" />\n  $1'
      );
      return html;
    },
  };
}

export default defineConfig(({ mode }) => {
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    preview: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [
      react(),
      injectPreloads(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icons/*.png'],
        strategies: 'generateSW',
        manifest: {
          name: 'Greek Souvlaki Kfar Yasif | סובלאקי יווני כפר יאסיף',
          short_name: 'Greek Souvlaki',
          description:
            'Authentic Greek souvlaki in Kfar Yasif. Fresh pita, gyros, skewers & more. | סובלאקי יווני אותנטי בכפר יאסיף',
          theme_color: '#0f172a',
          background_color: '#0f172a',
          display: 'standalone',
          orientation: 'portrait',
          lang: 'en',
          scope: '/',
          start_url: './',
          icons: [
            {
              src: '/icons/icon-192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any maskable',
            },
            {
              src: '/icons/icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
        },
        workbox: {
          skipWaiting: true,
          clientsClaim: true,
          cleanupOutdatedCaches: true,
          // Precache only the app shell. Photos (png/jpg/webp) are NOT precached
          // here — they're fetched on demand and cached by the runtimeCaching
          // images rule below, so first install doesn't pull ~60 MB of gallery.
          globPatterns: ['**/*.{js,css,html,ico,svg,json,woff2}'],
          // Owner tools and optional overlays are cached when visited, never
          // downloaded in the background during a customer's first visit.
          globIgnores: [
            '**/assets/Admin-*.js',
            '**/assets/Kitchen-*.js',
            '**/assets/Ticket-*.js',
            '**/assets/QrStickers-*.js',
            '**/assets/LegalDocument-*.js',
            '**/assets/Lightbox-*.js',
            '**/assets/lenis-*.js',
            '**/assets/supabase-*.js',
            '**/assets/browser-*.js',
          ],
          navigateFallback: '/index.html',
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
          runtimeCaching: [
            {
              urlPattern: ({ request, url }) =>
                request.destination === 'script' && url.origin === self.location.origin,
              handler: 'CacheFirst',
              options: {
                cacheName: 'optional-scripts-cache',
                expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 },
                cacheableResponse: { statuses: [200] },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'images-cache',
                expiration: {
                  maxEntries: 200,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: false,
          type: 'module',
        },
      }),
      // Bundle analyzer (only in analyze mode)
      mode === 'analyze' &&
        visualizer({
          open: true,
          filename: 'dist/stats.html',
          gzipSize: true,
          brotliSize: true,
        }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      // Avoid modern syntax becoming a parse-time failure on older phones.
      // This transforms syntax; it does not promise support for every old API.
      target: ['es2018', 'chrome80', 'firefox78', 'safari14'],
      // Enable code splitting for better caching
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (/\/node_modules\/(react|react-dom|scheduler)\//.test(id)) {
              return 'react-vendor';
            }
            if (id.includes('/node_modules/lucide-react')) return 'icons';
            return undefined;
          },
        },
      },
      // Improve chunk size warning threshold
      chunkSizeWarningLimit: 600,
    },
  };
});
