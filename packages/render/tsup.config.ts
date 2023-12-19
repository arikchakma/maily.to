import { defineConfig } from 'tsup';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  banner: {
    js: '// @ts-nocheck\n',
  },
  dts: true,
  clean: true,
  minify: true,
  external: ['react'],
});
