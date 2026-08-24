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
        registerType: 'prompt',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icons/*.png'],
        strategies: 'generateSW',
        manifest: {
          name: 'Greek Souvlaki Kfar Yasif | סובלקי יווני כפר יאסיף',
          short_name: 'Greek Souvlaki',
          description:
            'Authentic Greek souvlaki in Kfar Yasif. Fresh pita, gyros, skewers & more. | סובלקי יווני אותנטי בכפר יאסיף',
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
          // Precache only the app shell. Photos (png/jpg/webp) are NOT precached
          // here — they're fetched on demand and cached by the runtimeCaching
          // images rule below, so first install doesn't pull ~60 MB of gallery.
          globPatterns: ['**/*.{js,css,html,ico,svg,json,woff2}'],
          // The three.js stack (~1.1 MB) powers only the optional 3D "Board of
          // the week". Keep it out of the install-time precache so visitors who
          // never see the board don't pay for it; the runtimeCaching rule below
          // caches it on first use for offline.
          globIgnores: ['**/three-vendor-*.js'],
          navigateFallback: '/index.html',
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
          runtimeCaching: [
            {
              // The 3D plate's three.js chunk — cached the first time the board
              // actually loads it, then served from cache (incl. offline).
              urlPattern: /three-vendor-.*\.js$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'three-vendor-cache',
                expiration: {
                  maxEntries: 3,
                  maxAgeSeconds: 60 * 60 * 24 * 90, // 90 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
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
      // Enable code splitting for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunk for React and related libraries
            'react-vendor': ['react', 'react-dom', 'react-dom/client'],
            // Lucide icons chunk
            icons: ['lucide-react'],
            // WebGL stack for the Board of the Week 3D plate. Its own chunk so
            // it downloads only when that section's lazy component is loaded,
            // never on the homepage's critical path.
            'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          },
        },
      },
      // Improve chunk size warning threshold
      chunkSizeWarningLimit: 600,
    },
  };
});
