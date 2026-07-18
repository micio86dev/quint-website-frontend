import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: { include: ['tests/unit/**/*.test.ts'], coverage: { provider: 'v8', reporter: ['text', 'json-summary'], thresholds: { lines: 90, functions: 90, branches: 90, statements: 90 }, include: ['src/content/**/*.ts', 'src/lib/**/*.ts'] } }
});
