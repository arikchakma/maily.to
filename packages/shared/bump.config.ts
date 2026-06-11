import { defineConfig } from 'bumpp';

export default defineConfig({
  commit: 'release: shared@v%s',
  tag: 'shared@v%s',
  push: false,
});
