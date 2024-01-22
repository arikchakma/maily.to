import { defineConfig } from 'tsup';

// eslint-disable-next-line import/no-default-export
export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    minify: true,
    external: ['react'],
  },
  {
    entry: {
      index: 'src/jsx-email.tsx'
    },
    format: ['cjs', 'esm'],
    outDir: 'dist/jsx-email',
    dts: true,
    clean: true,
    minify: true,
    external: ['react'],
  },
]);
