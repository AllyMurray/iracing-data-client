import { defineConfig } from 'vite-plus';

// Live API tests stay opt-in and receive credentials through dotenvx.
export default defineConfig({
  test: { include: ['**/*.integration.test.ts'] },
});
