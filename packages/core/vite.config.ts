import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite-plus';

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
        react({
          babel: {
            plugins: [['babel-plugin-react-compiler']],
          },
        }),
      ],
      exports: {
        customExports(exports) {
          exports['./style.css'] = './dist/index.css';
          return exports;
        },
      },
    },
  ],
});
