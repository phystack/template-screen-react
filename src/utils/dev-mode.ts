/**
 * Load dev settings with priority system:
 * 1. Try index.json (downloaded from installation) - persistent
 * 2. Fall back to .generated.json (from schema defaults) - ephemeral
 *
 * Settings are auto-initialized by `yarn dev` (via predev script).
 */
import type { Settings } from "../schema";

export const getDevSettings = async (): Promise<Settings> => {
  // Priority 1: Try downloaded settings (persistent)
  // Use dynamic import with string template to avoid Vite static analysis
  const tryImport = async (path: string) => {
    try {
      const module = await import(/* @vite-ignore */ path);
      return (
        module.default?.app?.gridApp?.settings ||
        module?.app?.gridApp?.settings ||
        null
      );
    } catch {
      return null;
    }
  };

  // Try index.json first
  const downloaded = await tryImport("../settings/index.json");
  if (downloaded) {
    console.log("📥 Using downloaded settings from index.json");
    return downloaded;
  }

  // Fall back to .generated.json
  const generated = await tryImport("../settings/.generated.json");
  if (generated) {
    console.log("🔨 Using schema defaults from .generated.json");
    return generated;
  }

  console.warn("⚠️  No settings found. Run `yarn dev` to initialize settings");
  return {} as Settings;
};

export const isDevMode = (): boolean => {
  return import.meta.env.DEV;
};
