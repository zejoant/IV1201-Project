// vitest.config.mjs
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: fileURLToPath(new URL('./tests/setupTest.js', import.meta.url)),
    deps: {
      inline: ['@exodus/bytes'], // force ESM dependency to be bundled by Vite
    },
  },
});