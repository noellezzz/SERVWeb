import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths'
import basicSsl from '@vitejs/plugin-basic-ssl'
import Terminal from "vite-plugin-terminal";


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),

    ...(import.meta.env?.VITE_APP_ENV === 'development' && [
      basicSsl(),
      Terminal({
        console: 'terminal',
        output: ['terminal', 'console']
      }),
    ] || []),

  ],
  assetsInclude: ['**/*.old'],
  esbuild: {
    exclude: ['**/*.old'],
  },
  server: {
    port: 3000,
    https: true,
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
