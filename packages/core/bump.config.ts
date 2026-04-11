import { defineConfig } from 'bumpp';

export default defineConfig({
  commit: 'release: core@v%s',
  tag: 'core@v%s',
  push: false,
});
