import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite-plus';

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
        react({
          babel: {
            plugins: [['babel-plugin-react-compiler']],
          },
        }),
      ],
    },
  ],
});
