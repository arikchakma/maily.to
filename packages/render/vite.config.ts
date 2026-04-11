import { defineConfig } from 'vite-plus';

export default defineConfig({
  pack: {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    sourcemap: true,
    dts: {
      tsgo: true,
    },
    exports: true,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
