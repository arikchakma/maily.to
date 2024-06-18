/* eslint-disable import/no-default-export */
import type { Options } from 'tsup';
import { defineConfig } from 'tsup';

const packageOptions: Options = {
  clean: true,
  minify: true,
  dts: true,
  format: ['cjs', 'esm'],
  external: ['react'],
};

export default defineConfig([
  {
    ...packageOptions,
    entry: ['src/index.ts'],
    outDir: 'dist',
  },
  {
    ...packageOptions,
    entry: ['src/jsx/index.ts'],
    outDir: 'dist/jsx',
  },
]);
