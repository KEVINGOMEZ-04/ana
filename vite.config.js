import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        capitulo01: resolve(__dirname, 'capitulo01.html'),
        capitulo02: resolve(__dirname, 'capitulo02.html'),
        capitulo03: resolve(__dirname, 'capitulo03.html'),
        capitulo04: resolve(__dirname, 'capitulo04.html'),
        epilogo: resolve(__dirname, 'epilogo.html'),
        landing: resolve(__dirname, 'landing.html')
      }
    },
    cssCodeSplit: false,
    minify: 'esbuild'
  },
  server: {
    port: 5173,
    host: true,
    open: true
  }
});
