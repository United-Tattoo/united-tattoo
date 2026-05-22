import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    restoreMocks: true,
  },
  resolve: {
    alias: {
      'astro:content': new URL('./tests/mocks/astro-content.ts', import.meta.url).pathname,
    },
  },
});
