import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['iife'],
  globalName: 'MT',
  minify: true,
  sourcemap: false,
  dts: false,
  clean: true,
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    process: JSON.stringify({}),
  },
  noExternal: ['react', 'react-dom', '@maily-to/core'],
});
