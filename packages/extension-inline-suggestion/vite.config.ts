import { defineConfig } from 'vite-plus';

export default defineConfig({
  pack: {
    clean: true,
    dts: { cjsReexport: true },
    entry: ['src/index.ts'],
    exports: true,
    format: ['cjs', 'esm'],
    sourcemap: true,
  },
});
