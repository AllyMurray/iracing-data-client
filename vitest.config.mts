import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Samples reach 44 MB. Parse them as data instead of transforming their
  // contents into JavaScript exports in Vite's module runner.
  json: { stringify: true, namedExports: false },
  test: {
    exclude: ['**/node_modules/**', '**/dist/**', '**/*.integration.test.ts'],
  },
});
