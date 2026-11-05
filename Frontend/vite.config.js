import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(({ command, mode }) => ({
  plugins: [react()], base: '/',
  server: { host: 'localhost', port: 5173, strictPort: true, proxy: { '/api': 'http://127.0.0.1:3000' } },
  define: { __LOCAL_CATALOG__: JSON.stringify(command === 'serve' || mode === 'prototype') },
}));
