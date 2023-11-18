// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'tsup';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  banner: {
    js: "'use client'",
  },
  dts: true,
  clean: true,
  minify: true,
  external: ['react'],
  injectStyle: true,
});
