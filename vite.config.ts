import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      devOptions: {
        enabled: true
      },
      includeAssets: ['favicon.ico', 'icon-512.png', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: false, // We are using a static public/manifest.webmanifest
      workbox: {
        globPatterns: [],
        // Ensures that any URL requested offline returns index.html
        // Ensures that any URL requested offline returns index.html
        navigateFallback: '/index.html',
        navigateFallbackAllowlist: [/^(?!\/__).*/],
        // Immediate activation is critical for PWA UX
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          }
        ]
      }
    })
  ],
  server: {
    host: true,
    port: 5173,
    allowedHosts: [
      'middlemost-gerry-intramolecular.ngrok-free.dev',
      '.ngrok-free.app',
      '.ngrok-free.dev',
      '.trycloudflare.com',
      '.serveo.net',
      '.serveousercontent.com'
    ]
  }
});