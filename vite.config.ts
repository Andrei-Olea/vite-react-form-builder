import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
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

    // Proxy API requests to backend during development
    // Note: If backend is not running, proxy errors will appear in console but app will still work
    // The form submits to Google Sheets (primary) and backend (optional for emails/logging)
    // Target URL is configured in .env via VITE_DEV_PROXY_TARGET
    proxy: {
      '/api': {
        target: env.VITE_DEV_PROXY_TARGET,
        changeOrigin: true,
        secure: false, // Allow self-signed certificates (DDEV, local dev)
        rewrite: (path) => path, // Keep the path as-is
      },
    },
  },
  };
});
