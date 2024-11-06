// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig, Options } from 'tsup';

// eslint-disable-next-line import/no-default-export
export default defineConfig((options: Options) => ({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  banner: {
    js: "'use client'",
  },
  dts: true,
  minify: true,
  clean: true,
  external: ['react'],
  injectStyle: true,
  ...options,
  onSuccess: 'cp -r src/styles dist/', // Copy CSS files to dist after build
}));
