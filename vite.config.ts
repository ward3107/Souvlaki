import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';

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
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), asyncCss(), injectPreloads()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        // Enable code splitting for better caching
        rollupOptions: {
          output: {
            manualChunks: {
              // Vendor chunk for React and related libraries
              'react-vendor': ['react', 'react-dom', 'react-dom/client'],
              // Lucide icons chunk
              'icons': ['lucide-react'],
            },
          },
        },
        // Improve chunk size warning threshold
        chunkSizeWarningLimit: 600,
      },
    };
});
