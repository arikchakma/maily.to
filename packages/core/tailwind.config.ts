// tailwind config is required for editor support
import type { Config } from 'tailwindcss';
import sharedConfig from 'tailwind-config/tailwind.config';

const config: Pick<Config, 'prefix' | 'presets' | 'corePlugins'> = {
  prefix: 'mly-',
  corePlugins: {
    // Disable preflight to avoid Tailwind overriding the styles of the editor.
    preflight: false,
  },
  presets: [sharedConfig],
};

export default config;
