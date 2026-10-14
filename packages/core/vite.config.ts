import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite-plus';
import { defineConfig } from 'vite-plus';
import { playwright } from 'vite-plus/test/browser-playwright';

const ALLOWED_TEST_BROWSERS = ['chromium', 'firefox', 'webkit'] as const;

type AllowedTestBrowser = (typeof ALLOWED_TEST_BROWSERS)[number];

function getTestBrowsers(): AllowedTestBrowser[] {
  const requested = process.env.TEST_BROWSER;

  if (requested === 'all') {
    return [...ALLOWED_TEST_BROWSERS];
  }

  const found = ALLOWED_TEST_BROWSERS.find((browser) => {
    return browser === requested;
  });

  return [found ?? 'chromium'];
}

export default defineConfig({
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    include: [
      '@base-ui/react/merge-props',
      '@base-ui/react/popover',
      '@base-ui/react/select',
      '@base-ui/react/tooltip',
      '@base-ui/react/use-render',
      '@react-email/components',
      '@react-email/render',
      '@tiptap/core',
      '@tiptap/extension-document',
      '@tiptap/extension-paragraph',
      '@tiptap/extension-table',
      '@tiptap/extension-text',
      '@tiptap/pm/keymap',
      '@tiptap/pm/state',
      '@tiptap/pm/view',
      '@tiptap/react',
      'react/jsx-runtime',
      'react-dom/server',
      'vite-plus/test/browser/context',
    ],
  },
  pack: [
    {
      clean: false,
      dts: { cjsReexport: true, emitDtsOnly: true },
      entry: {
        index: 'src/index.ts',
        'extensions/index': 'src/extensions.ts',
        'blocks/index': 'src/blocks/index.ts',
      },
      format: ['esm', 'cjs'],
    },
    {
      dts: false,
      format: ['esm', 'cjs'],
      clean: false,
      deps: { neverBundle: ['react'] },
      entry: {
        index: 'src/index.ts',
        'extensions/index': 'src/extensions.ts',
        'blocks/index': 'src/blocks/index.ts',
      },
      plugins: react({ compiler: true }) as unknown as Plugin[],
      exports: {
        customExports(exports) {
          exports['./style.css'] = './src/styles/index.css';

          return exports;
        },
      },
    },
  ],
  test: {
    browser: {
      enabled: true,
      headless: true,
      instances: getTestBrowsers().map((browser) => {
        return { browser };
      }),
      provider: playwright(),
    },
    fileParallelism: process.env.TEST_BROWSER === undefined,
    include: ['tests/**/*.browser.test.{ts,tsx}'],
  },
});
