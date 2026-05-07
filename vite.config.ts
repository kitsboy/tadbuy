import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],

    // NOTE: GEMINI_API_KEY is intentionally NOT exposed here.
    // The server-side proxy at POST /api/ai/optimize keeps it safe.
    // Never add server-only secrets to the `define` block — they end up in the JS bundle.
    define: {},

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    build: {
      // Raise the warning threshold so build output is clean
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks: {
            // React core — loaded immediately
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],

            // Firebase — large, only needed once auth loads
            'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],

            // Charts — only loaded on dashboard/metrics pages
            'vendor-charts': ['recharts', 'd3'],

            // i18n — loaded after first render
            'vendor-i18n': ['i18next', 'react-i18next'],

            // Animation + UI utilities
            'vendor-ui': ['motion', 'lucide-react', 'clsx', 'tailwind-merge'],

            // PDF generation — only used on export action
            'vendor-pdf': ['jspdf', 'jspdf-autotable'],

            // QR codes — only used on wallet/payment pages
            'vendor-qr': ['qrcode.react'],
          },
        },
      },
    },

    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
