import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // during development proxy /expense to the local PHP server (adjust target if needed)
    proxy: {
      '/expense': {
        target: 'http://localhost',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/expense/, '/expense'),
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
