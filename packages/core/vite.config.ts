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
      clean: false,
      deps: { neverBundle: ['react'] },
      entry: {
        index: 'src/index.ts',
        'extensions/index': 'src/extensions.ts',
        'blocks/index': 'src/blocks.ts',
      },
      plugins: [
        react(),
        babel({ presets: [reactCompilerPreset()] }),
      ] as unknown as Plugin[],
      exports: {
        customExports(exports) {
          exports['./style.css'] = './dist/index.css';
          return exports;
        },
      },
    },
  ],
});
