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
      // Inject preload for the main JS module
      html = html.replace(
        /(<script type="module" crossorigin src="([^"]+)"><\/script>)/,
        '<link rel="modulepreload" crossorigin href="$2" as="script" fetchpriority="high" />\n  $1'
      );
      // Inject preload for CSS (before the async CSS link)
      html = html.replace(
        /(<link rel="stylesheet" crossorigin href="([^"]+)" media="print" onload)/,
        '<link rel="preload" crossorigin href="$2" as="style" />\n    <link rel="stylesheet" crossorigin href="$2" media="print" onload'
      );
      return html;
    },
  };
}

// Plugin to make CSS load asynchronously (non-blocking)
function asyncCss(): Plugin {
  return {
    name: 'async-css',
    transformIndexHtml(html: string) {
      // Replace Vite's CSS link to load asynchronously
      return html.replace(
        /<link rel="stylesheet" crossorigin href="([^"]+)">/g,
        '<link rel="stylesheet" crossorigin href="$1" media="print" onload="this.media=\'all\'"><noscript><link rel="stylesheet" crossorigin href="$1"></noscript>'
      );
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
      asyncCss(),
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
          navigateFallback: '/index.html',
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
          runtimeCaching: [
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
          },
        },
      },
      // Improve chunk size warning threshold
      chunkSizeWarningLimit: 600,
    },
  };
});
