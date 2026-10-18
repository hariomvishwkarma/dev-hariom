import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    tailwindcss()
  ],
  build: {
    outDir: './assets',
    emptyOutDir: false,
    minify: false,
    rollupOptions: {
      input: [
        './src/scripts/main.js',
        './src/styles/main.css',
      ],
      output: {
        dir: './assets',
        entryFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    }
  },
})