#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { inspect } from "util";
import { parseProject } from "./parsers/parse-project";
import { ProjectSchemaType } from "./schemas/project";
import { createTypeDefinition } from "./typegen/type-gen";
import yaml from "yaml";
import { sampleConfig } from "./example/sampleconfig";
import { sampleLog } from "./example/samplelog";
import { LogType } from "./schemas/log";
import { parseLog } from "./parsers/parse-log";

const ROOT = process.cwd();
const args = process.argv.slice(2);
const command = args[0];

const REQUIRED_PACKAGES = {
  typescript: "^5.0.0",
  daytalog: "^1.0.0",
} as const;

function detectPackageManager(): "npm" | "yarn" | "pnpm" {
  if (fs.existsSync(path.join(ROOT, "yarn.lock"))) return "yarn";
  if (fs.existsSync(path.join(ROOT, "pnpm-lock.yaml"))) return "pnpm";
  return "npm";
}

function getInstallCommand(pkg: string, isDev: boolean = false): string {
  const pm = detectPackageManager();
  switch (pm) {
    case "yarn":
      return `yarn add ${isDev ? "--dev" : ""} ${pkg}`;
    case "pnpm":
      return `pnpm add ${isDev ? "-D" : ""} ${pkg}`;
    default:
      return `npm install ${isDev ? "--save-dev" : ""} ${pkg}`;
  }
}

async function initTypeScriptConfig() {
  const tsconfigPath = path.join(ROOT, "tsconfig.json");

  if (!fs.existsSync(tsconfigPath)) {
    console.log("Creating TypeScript configuration...");
    try {
      // Use tsc to generate initial config
      require("child_process").execSync("npx tsc --init", {
        stdio: "inherit",
      });

      // Read the generated config
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf-8"));

      // Update with our specific settings
      const updatedConfig = {
        ...tsconfig,
        compilerOptions: {
          ...tsconfig.compilerOptions,
          target: "es2020",
          module: "esnext",
          lib: ["dom", "esnext"],
          jsx: "react",
          strict: true,
          esModuleInterop: true,
          skipLibCheck: true,
          forceConsistentCasingInFileNames: true,
        },
        include: ["src", "daytalog/generated/**/*.d.ts"],
        exclude: ["node_modules", "dist", "**/*.test.ts", "**/*.test.tsx"],
      };

      // Write the updated config
      fs.writeFileSync(tsconfigPath, JSON.stringify(updatedConfig, null, 2));
      console.log("• Created tsconfig.json with recommended settings");
    } catch (error) {
      console.error("❌ Failed to create TypeScript configuration:");
      console.error(error instanceof Error ? error.message : error);
      process.exit(1);
    }
  } else {
    // Update existing config
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf-8"));
    tsconfig.include = Array.from(
      new Set([...(tsconfig.include || []), "daytalog/generated/**/*.d.ts"])
    );
    fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
    console.log("• Updated tsconfig.json with generated types path");
  }
}

async function checkTypeScriptInstallation(): Promise<boolean> {
  try {
    const pkgPath = path.join(ROOT, "package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    const hasTypeScript =
      pkg.dependencies?.typescript || pkg.devDependencies?.typescript;

    if (!hasTypeScript) {
      console.log("\nTypeScript is not installed in this project.");
      console.log("TypeScript is required for type generation.");

      const answer = await promptUser(
        "Would you like to install TypeScript now? (y/N) "
      );

      if (answer.toLowerCase() === "y") {
        console.log("\nInstalling TypeScript...");
        try {
          const installCmd = getInstallCommand(
            `typescript@${REQUIRED_PACKAGES.typescript}`,
            true
          );
          require("child_process").execSync(installCmd, { stdio: "inherit" });
          console.log("✔️ TypeScript installed successfully");
          return true;
        } catch (installError) {
          console.error("❌ Failed to install TypeScript:");
          console.error(
            installError instanceof Error ? installError.message : installError
          );
          console.log("\nPlease install TypeScript manually with:");
          console.log(
            getInstallCommand(
              `typescript@${REQUIRED_PACKAGES.typescript}`,
              true
            )
          );
          console.log("\nThen run the init command again.");
          process.exit(1);
        }
      } else {
        console.log("\nSkipping TypeScript installation.");
        console.log(
          "Note: Type generation and some features may not work without TypeScript."
        );
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error("❌ Failed to check TypeScript installation:");
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

async function initProject() {
  const createdFiles: string[] = [];
  try {
    // Check TypeScript first
    const hasTypeScript = await checkTypeScriptInstallation();
    if (!hasTypeScript) {
      process.exit(0);
    }

    // Handle package.json
    const pkgPath = path.join(ROOT, "package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

    // Install daytalog if needed
    const hasDaytalog =
      pkg.dependencies?.daytalog || pkg.devDependencies?.daytalog;
    if (!hasDaytalog) {
      console.log("Installing daytalog package...");
      try {
        const installCmd = getInstallCommand(
          `daytalog@${REQUIRED_PACKAGES.daytalog}`
        );
        require("child_process").execSync(installCmd, { stdio: "inherit" });
      } catch (installError) {
        console.error("❌ Failed to install daytalog package:");
        console.error(
          installError instanceof Error ? installError.message : installError
        );
        console.log("\nPlease try installing manually with:");
        console.log(
          getInstallCommand(`daytalog@${REQUIRED_PACKAGES.daytalog}`)
        );
        console.log("\nThen run the init command again.");
        process.exit(1);
      }
    }

    // Update package.json scripts
    pkg.scripts = pkg.scripts || {};
    if (!pkg.scripts.start) pkg.scripts.start = "daytalog start";
    if (!pkg.scripts.dev) pkg.scripts.dev = "echo 'Please set your dev script'";
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

    // Create project folder for user files
    const projectDir = path.join(ROOT, "daytalog/project");
    const logsDir = path.join(projectDir, "logs");
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
      createdFiles.push(logsDir);
    }

    // Initialize TypeScript config
    await initTypeScriptConfig();

    // Create generated folder
    fs.mkdirSync(path.join(ROOT, "daytalog/generated"), { recursive: true });

    const answer = await promptUser(
      "Would you like to install a sample project now? (y/N) "
    );
    if (answer.toLowerCase() === "y") {
      // Create mock YAML files in daytalog/project/
      const configPath = path.join(projectDir, "config.yaml");
      const log1 = path.join(logsDir, `D01_250601.dayta`);
      if (!fs.existsSync(configPath)) {
        fs.writeFileSync(configPath, yaml.stringify(sampleConfig));
        createdFiles.push(configPath);
      }
      if (!fs.existsSync(log1)) {
        fs.writeFileSync(log1, yaml.stringify(sampleLog));
        createdFiles.push(log1);
      }
    } else {
      console.log("To-do: Add config.yaml and logs in daytalog/project/");
    }

    // Setup project and logs (ask user first)

    console.log("✅  Daytalog initialized");
  } catch (error) {
    // Cleanup on failure
    for (const file of createdFiles) {
      try {
        fs.unlinkSync(file);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
    throw error;
  }
}

async function start() {
  try {
    await generateTypeDef();
    await loadData();
    console.log("Daytalog started");
  } catch (error) {
    console.error(error);
  }
}

async function generateTypeDef() {
  const configPath = path.join(ROOT, "daytalog/project/config.yaml");
  const outFile = path.join(ROOT, "daytalog/generated/types.d.ts");

  let project: ProjectSchemaType = {
    project_name: "My Project",
    version: 1,
    match_schemas: true,
    match_sound: true,
  };
  if (fs.existsSync(configPath)) {
    project = await parseProject(configPath);
  }

  const { Clip, Custom } = createTypeDefinition(project);

  const decl =
    `import "daytalog" \n declare module "daytalog" {\n` +
    `interface Clip ${Clip}\n` +
    `interface Custom ${Custom}\n` +
    `}`;

  fs.writeFileSync(outFile, decl);
  console.log(`✔️ Success! Generated types at ${outFile}`);
}

async function loadData() {
  try {
    const projectDir = path.join(ROOT, "daytalog/project");
    const logsDir = path.join(projectDir, "logs");
    const outputDir = path.join(ROOT, "daytalog/generated");
    const outputPath = path.join(outputDir, "data.ts");

    // Read project file
    const projectYamlPath = path.join(projectDir, "config.yaml");
    if (!fs.existsSync(projectYamlPath)) {
      throw new Error(
        `Project file not found at ${projectYamlPath}. Run 'daytalog init' first.`
      );
    }
    const project = await parseProject(projectYamlPath);

    const files = await fs.promises.readdir(logsDir);
    const logPaths = files
      .filter((file) => file.endsWith(".dayta"))
      .map((file) => path.join(logsDir, file));

    const logs: LogType[] = [];
    for (const logPath of logPaths) {
      try {
        const log = await parseLog(logPath, project);
        logs.push(log);
      } catch (error) {
        console.warn(`Warning: Failed to parse log file ${logPath}:`, error);
      }
    }

    const projectCode = inspect(project, { depth: null, compact: false });
    const logsCode = inspect(logs, { depth: null, compact: false });

    const fileContent = `// This file is auto-generated by the Daytalog CLI.
    
    export const project = ${projectCode};
    export const logs = ${logsCode};
`;

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    fs.writeFileSync(outputPath, fileContent);
  } catch (error) {
    console.error("❌ An error occurred during data generation:");
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

function printHelp() {
  console.log(`
Daytalog CLI

Usage:
  daytalog <command>

Commands:
  init    Set up a Daytalog project in the current workspace:
          - Ensures TypeScript is installed (prompts if missing)
          - Ensures 'daytalog' dependency is present
          - Adds recommended scripts to package.json
          - Creates 'daytalog/project' with 'logs' directory
          - Optionally installs a sample project (config + sample log)
          - Updates/creates tsconfig.json with generated types path

  start   Runs the local workflow:
          - Generates TypeScript declaration file at 'daytalog/generated/types.d.ts'
          - Loads project and logs and writes 'daytalog/generated/data.ts'
          - Requires 'daytalog/project/config.yaml' and '.dayta' logs in 'daytalog/project/logs'

Options:
  -h, --help   Show this help message

Examples:
  daytalog init
  daytalog start
  daytalog --help
`);
}

// Main CLI handler
async function main() {
  try {
    switch (command) {
      case "init":
        await initProject();
        break;
      case "start":
        await start();
        break;
      case "help":
      case "-h":
      case "--help":
        printHelp();
        break;
      default:
        printHelp();
        break;
    }
  } catch (error) {
    console.error("❌ An unexpected error occurred:");
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Run the CLI
main().catch((error) => {
  console.error(
    "❌ Fatal error:",
    error instanceof Error ? error.message : error
  );
  process.exit(1);
});

async function promptUser(question: string): Promise<string> {
  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    return await new Promise<string>((resolve) => {
      readline.question(question, (answer: string) => {
        resolve(answer);
      });
    });
  } finally {
    readline.close();
  }
}
