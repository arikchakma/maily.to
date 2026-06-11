import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import type { Plugin } from 'vite-plus';
import { defineConfig } from 'vite-plus';

/**
 * Strips the deprecated `esbuild` config from plugin hook results.
 * Vite 8 handles JSX via its built-in oxc transform, so the
 * esbuild.jsx config react-router sets is redundant. Can be removed
 * once react-router ships native Vite 8 support.
 */
function stripEsbuildConfig(plugins: Plugin[]): Plugin[] {
  return plugins.map((plugin) => {
    const original = plugin.config;
    if (typeof original !== 'function') {
      return plugin;
    }

    plugin.config = async function (...args) {
      const result = await (original as Function).apply(this, args);
      if (result && typeof result === 'object' && 'esbuild' in result) {
        const { esbuild: _, ...rest } = result;
        return rest;
      }
      return result;
    };

    return plugin;
  });
}

export default defineConfig(() => ({
  plugins: [tailwindcss(), ...stripEsbuildConfig(reactRouter())],
  resolve: {
    tsconfigPaths: true,
  },
  ssr: {
    noExternal: [/^@maily-to\//, /^@radix-ui\//, /^@tiptap\//],
  },
}));
