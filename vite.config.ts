import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Support CRA's PUBLIC_URL environment variable for backwards compatibility
// Use relative paths (./) by default for maximum flexibility in deployment
const base = process.env.PUBLIC_URL || process.env.VITE_ROOT_PATH || './';

export default defineConfig({
  base,
  plugins: [react()],
  define: {
    // Polyfill Node.js globals for isomorphic packages like @phystack/hub-client
    'process.env': {},
    'process.version': JSON.stringify(''),
    'process.platform': JSON.stringify('browser'),
  },
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      events: 'events',
    },
  },
  build: {
    outDir: 'build',
    sourcemap: false,
    rollupOptions: {
      output: {
        entryFileNames: 'static/js/[name].[hash].js',
        chunkFileNames: 'static/js/[name].[hash].js',
        assetFileNames: 'static/[ext]/[name].[hash].[ext]',
      },
    },
  },
  optimizeDeps: {
    include: ['events'],
  },
  json: {
    stringify: false, // Allow importing JSON as objects
  },
});
