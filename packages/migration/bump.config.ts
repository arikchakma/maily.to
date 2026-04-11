import { defineConfig } from 'bumpp';

export default defineConfig({
  commit: 'release: migration@v%s',
  tag: 'migration@v%s',
  push: false,
});
