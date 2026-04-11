import { defineConfig } from 'vite-plus';

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
  fmt: {
    endOfLine: 'lf',
    singleQuote: true,
    tabWidth: 2,
    trailingComma: 'es5',
    overrides: [
      {
        files: ['packages/core/**/*.{ts,tsx}'],
        options: {
          experimentalTailwindcss: {
            stylesheet: './packages/core/src/styles/index.css',
            attributes: ['class', 'className'],
            functions: ['cn', 'clsx', 'cva'],
          },
        },
      },
    ],
    printWidth: 80,
    experimentalSortPackageJson: {
      sortScripts: true,
    },
    sortImports: {},
    experimentalTailwindcss: {
      attributes: ['class', 'className'],
      functions: ['cn', 'clsx', 'cva'],
    },
    ignorePatterns: ['coverage/', 'coverage-merged/', 'dist/', 'node_modules/'],
  },
  lint: {
    plugins: ['typescript', 'import'],
    rules: {
      'typescript/consistent-type-imports': 'error',
      'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
      curly: ['error', 'all'],
    },
    options: {
      typeCheck: true,
      typeAware: true,
    },
  },
});
