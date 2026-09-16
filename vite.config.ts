import { jsxLocPlugin } from '@builder.io/vite-plugin-jsx-loc';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  // The GitHub Pages project URL is served beneath the repository name.
  // Change this to '/' when a custom domain such as my-artcode.com is connected.
  base: '/artcode-redesign/',
  plugins: [react(), tailwindcss(), jsxLocPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'client', 'src'),
      '@shared': path.resolve(import.meta.dirname, 'shared'),
    },
  },
  root: path.resolve(import.meta.dirname, 'client'),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
  },
});
