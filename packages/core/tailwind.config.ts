import type { Config } from 'tailwindcss';
import sharedConfig from 'tailwind-config/tailwind.config';

const config: Pick<
  Config,
  'prefix' | 'presets' | 'corePlugins' | 'theme' | 'plugins'
> = {
  corePlugins: {
    // Disable preflight to avoid Tailwind overriding the styles of the editor.
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        'soft-gray': '#f4f5f6',
        'midnight-gray': '#333333',
      },
    },
  },
  presets: [sharedConfig],
};

export default config;
