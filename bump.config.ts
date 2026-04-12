import { defineConfig } from 'bumpp';

import pkg from './packages/core/package.json' with { type: 'json' };

export default defineConfig({
  currentVersion: pkg.version,
  files: [
    'packages/shared/package.json',
    'packages/ui/package.json',
    'packages/migration/package.json',
    'packages/render/package.json',
    'packages/core/package.json',
  ],
  commit: 'release: v%s',
  tag: 'v%s',
  push: true,
  all: true,
});
