import { defineConfig } from 'bumpp';

export default defineConfig({
  commit: 'release: render@v%s',
  tag: 'render@v%s',
  push: false,
});
