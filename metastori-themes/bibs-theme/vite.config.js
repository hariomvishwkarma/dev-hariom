import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'assets',
    emptyOutDir: false, // don't nuke other Shopify assets
    rollupOptions: {
      input: {
        parcel_scripts: path.resolve(__dirname, 'src/scripts/main.js'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: 'parcel_style.[ext]',
      },
    },
    cssCodeSplit: false, // single CSS bundle
  },
  css: {
    preprocessorOptions: {
      scss: {
        // add any global SCSS vars/mixins here if needed
      },
    },
  },
});