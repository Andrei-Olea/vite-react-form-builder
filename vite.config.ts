import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],

  // Configure base path for Apache deployment
  base: './',

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,

    // Optimize for production
    minify: 'esbuild',
    sourcemap: false,

    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
        assetFileNames: 'assets/[name].[hash][extname]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
      },
    },

    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
  },

  server: {
    port: 3000,
    strictPort: false, // Allow Vite to try next available port if 3000 is busy
    open: true,
    host: true, // Listen on all addresses (allows network access)

    // Proxy API requests to parent DDEV backend during development
    // Note: If DDEV is not running, proxy errors will appear in console but app will still work
    // The form submits to Google Sheets (primary) and backend (optional for emails/logging)
    proxy: {
      '/api': {
        target: 'https://codecol.ddev.site/vinculacion-ahorro-bono-navideno-2025',
        changeOrigin: true,
        secure: false, // DDEV uses self-signed certificates
      },
    },
  },
});
