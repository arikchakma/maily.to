import type { Config } from 'tailwindcss';

const config: Config = {
  content: [],
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
  plugins: [require('tailwindcss-animate')],
};

export default config;
