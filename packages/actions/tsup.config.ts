import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['iife'], // Browser-compatible IIFE format
  globalName: 'MT', // Expose as global `MT`
  minify: true, // Minify for production
  sourcemap: false, // Disable sourcemaps for production
  dts: false, // Skip TypeScript declarations
  clean: true, // Clean the output directory before building
  platform: 'browser', // Browser platform, similar to esbuild's behavior
  target: 'es2017', // Set the JavaScript target to ES2017
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'), // Set for React production mode
    'process.env.BROWSER': JSON.stringify('true'), // Browser environment flag
    'process.env.IS_BROWSER': JSON.stringify('true'), // Client-side code flag
    'process.env.IS_CLIENT': JSON.stringify('true'), // Another client-side flag
    process: JSON.stringify({}), // Basic polyfill for `process`
  },
  noExternal: ['react', 'react-dom', '@maily-to/core'], // Include core and dependencies in the bundle
});
