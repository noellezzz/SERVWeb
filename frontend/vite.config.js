import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
  ],
  server: {
    port: 3000,
    proxy: {
      '/api/v1': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
