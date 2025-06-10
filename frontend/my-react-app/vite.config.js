import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(({ mode }) => {
  // Load env vars based on mode
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    
    // Konfigurasi build untuk production
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
    
    // Server config hanya untuk development
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
    
    // Base path untuk Netlify
    base: '/'
  };
});