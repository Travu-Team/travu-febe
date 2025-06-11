import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'Travu - Travel Planning App',
          short_name: 'Travu',
          description: 'Your ultimate travel planning companion',
          theme_color: '#ffffff',
          background_color: '#ffffff',
          display: 'standalone',
          orientation: 'portrait',
          scope: '/',
          start_url: '/',
          icons: [
            {
              src: '/image/pwa/logo192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/image/pwa/logo72x72.png',
              sizes: '72x72',
              type: 'image/png'
            },
            {
              src: '/image/pwa/logo620x620.png',
              sizes: '620x620',
              type: 'image/png'
            },
            {
              src: '/image/pwa/logo620x620.png',
              sizes: '620x620',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp}'],
          maximumFileSizeToCacheInBytes: 20 * 1024 * 1024, // 20 MB
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365
                }
              }
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365
                }
              }
            },
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'images-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 30
                }
              }
            },
            {
              urlPattern: /\/api\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24
                },
                networkTimeoutSeconds: 10
              }
            }
          ]
        }
      })
    ],

    build: {
      outDir: 'dist',
      sourcemap: false,
      minify: 'terser',
      chunkSizeWarningLimit: 1600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor-react';
              }
              if (id.includes('@material-tailwind')) {
                return 'vendor-material';
              }
              if (id.includes('antd')) {
                return 'vendor-antd';
              }
              return 'vendor-other';
            }
          }
        }
      }
    },

    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
          rewrite: path => path.replace(/^\/api/, '')
        }
      }
    },

    base: '/'
  };
});