/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      events: "events",
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["src/utils/test-setup.ts"],
    coverage: {
      provider: "v8",
      exclude: ["node_modules/", "build/", "scripts/", "*.config.*"],
    },
  },
});
