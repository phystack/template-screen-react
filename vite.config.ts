import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Support CRA's PUBLIC_URL environment variable for backwards compatibility
// Use relative paths (./) by default for maximum flexibility in deployment
const base = process.env.PUBLIC_URL || process.env.VITE_ROOT_PATH || "./";

// When launched via `phy simulator run`, PHYSTACK_SIMULATOR_URL is set
const simulatorUrl = process.env.PHYSTACK_SIMULATOR_URL;
const twinId = process.env.TWIN_ID;

export default defineConfig({
  base,
  plugins: [react()],
  define: {
    // Polyfill Node.js globals for isomorphic packages like @phystack/hub-client
    // PHYSTACK_SIMULATOR_URL tells hub-client to connect to the local simulator
    "process.env": {
      PHYSTACK_SIMULATOR_URL: simulatorUrl,
    },
    "process.version": JSON.stringify(""),
    "process.platform": JSON.stringify("browser"),
  },
  server: {
    port: 3000,
    // In simulator mode, auto-open browser with instanceId in URL hash — same as production screen-boot
    open: simulatorUrl && twinId ? `/#instanceId=${twinId}` : false,
  },
  resolve: {
    alias: {
      events: "events",
    },
  },
  build: {
    outDir: "build",
    target: "es2015", // Target ES2015 for Tizen 4 compatibility (Chrome 56-63 equivalent)
    sourcemap: false,
    rollupOptions: {
      output: {
        entryFileNames: "static/js/[name].[hash].js",
        chunkFileNames: "static/js/[name].[hash].js",
        assetFileNames: "static/[ext]/[name].[hash].[ext]",
      },
    },
  },
  optimizeDeps: {
    include: ["events"],
  },
  json: {
    stringify: false, // Allow importing JSON as objects
  },
});
