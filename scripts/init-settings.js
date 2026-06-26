import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const settingsDir = path.join(rootDir, "src/settings");
const downloadedSettingsPath = path.join(settingsDir, "index.json");
const generatedSettingsPath = path.join(settingsDir, ".generated.json");

/**
 * Initialize settings with priority system:
 *
 * 1. ALWAYS regenerate .generated.json from schema defaults (ephemeral)
 * 2. If index.json exists (downloaded manually), keep it (persistent)
 * 3. App will use index.json if it exists, otherwise .generated.json
 *
 * To download settings from an installation:
 *   yarn download-settings <installation-id>
 */
async function initSettings() {
  console.log("⚙️  Initializing settings...");

  // Ensure settings directory exists
  if (!fs.existsSync(settingsDir)) {
    fs.mkdirSync(settingsDir, { recursive: true });
  }

  // ALWAYS regenerate .generated.json from schema
  await generateFromSchema();

  // Check if downloaded settings exist
  if (fs.existsSync(downloadedSettingsPath)) {
    console.log("✅ Using downloaded settings from src/settings/index.json");
    console.log(
      "ℹ️  To use schema defaults instead, delete src/settings/index.json"
    );
    return;
  }

  // No downloaded settings - app will use .generated.json
  console.log("ℹ️  Using schema defaults from src/settings/.generated.json");
  console.log("💡 To download from installation:");
  console.log("   yarn download-settings <installation-id>");
}

/**
 * Always regenerate settings from schema defaults (ephemeral)
 */
async function generateFromSchema() {
  try {
    console.log("🔨 Generating settings from schema defaults...");

    const schemaPath = path.join(rootDir, "src/schema.ts");
    const tempSchemaPath = path.join(rootDir, "build/schema.json");

    // Ensure build directory exists
    if (!fs.existsSync(path.join(rootDir, "build"))) {
      fs.mkdirSync(path.join(rootDir, "build"), { recursive: true });
    }

    // Generate schema with ts-schema
    await execAsync(
      `npx ts-schema ${schemaPath} ${path.join(rootDir, "build")}`,
      {
        cwd: rootDir,
      }
    );

    // Read the generated schema
    const schemaJson = JSON.parse(fs.readFileSync(tempSchemaPath, "utf-8"));

    // Extract default values from schema
    const defaults = extractDefaults(schemaJson);

    // Create settings in phystack format
    const settings = {
      app: {
        gridApp: {
          settings: defaults,
        },
      },
    };

    fs.writeFileSync(generatedSettingsPath, JSON.stringify(settings, null, 2));
    console.log("✅ Generated ephemeral settings from schema");
  } catch (error) {
    console.error("❌ Failed to generate settings from schema:", error.message);

    // Create minimal empty generated settings
    const minimalSettings = {
      app: {
        gridApp: {
          settings: {},
        },
      },
    };

    fs.writeFileSync(
      generatedSettingsPath,
      JSON.stringify(minimalSettings, null, 2)
    );
    console.log("⚠️  Created empty generated settings");
  }
}

/**
 * Extract default values from JSON schema
 */
function extractDefaults(schema) {
  const defaults = {};

  if (schema.properties) {
    for (const [key, prop] of Object.entries(schema.properties)) {
      if (prop.default !== undefined) {
        defaults[key] = prop.default;
      } else if (prop.type === "object" && prop.properties) {
        // Recursively extract defaults from nested objects
        defaults[key] = extractDefaults(prop);
      } else if (prop.type === "array" && prop.default) {
        defaults[key] = prop.default;
      }
    }
  }

  return defaults;
}

// Run the initialization
initSettings().catch((error) => {
  console.error("❌ Settings initialization failed:", error);
  process.exit(1);
});
