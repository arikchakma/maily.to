import babel from '@rolldown/plugin-babel';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite-plus';
import type { Plugin } from 'vite-plus';

export default defineConfig({
  pack: [
    {
      dts: {
        tsgo: true,
      },
      format: ['esm', 'cjs'],
      deps: { neverBundle: ['react'] },
      exports: true,
      entry: {
        index: 'src/index.ts',
      },
      plugins: [
        react(),
        babel({ presets: [reactCompilerPreset()] }),
      ] as unknown as Plugin[],
    },
  ],
});
