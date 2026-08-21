#!/usr/bin/env node
/**
 * Wizard Benchmark - Interactive benchmark runner
 *
 * Select an app, optionally customize plugins, then run the wizard
 * in CI + benchmark mode. Resets the app directory before each run.
 *
 * Usage:
 *   pnpm benchmark                  Interactive plugin selection
 *   pnpm benchmark --defaults       Skip plugin prompts, use all defaults
 */
import "dotenv/config";
import { join } from "path";
import { existsSync, writeFileSync } from "fs";
import { spawn } from "child_process";
import { createInterface } from "readline";
import { findApps, getWizardBin, resetApp, type App } from "../wizard-ci/utils.js";
import {
  WIZARD_COMMANDS,
  commandToSubcommand,
  commandToInvocation,
  findCommand,
  type WizardCommand,
} from "../wizard-commands.js";
import { checkbox } from "./prompts.js";

const WORKBENCH = join(import.meta.dirname, "../..");
const APPS_DIR = join(WORKBENCH, "apps");

// ============================================================================
// Config
// ============================================================================

interface BenchmarkConfig {
  plugins: Record<string, boolean>;
  output: {
    benchmarkPath: string;
    benchmarkEnabled: boolean;
    logPath: string;
    logEnabled: boolean;
    suppressWizardLogs: boolean;
  };
}

const PLUGIN_NAMES = [
  "tokens",
  "cache",
  "turns",
  "compactions",
  "contextSize",
  "cost",
  "duration",
  "summary",
  "jsonWriter",
] as const;

function defaultConfig(): BenchmarkConfig {
  return {
    plugins: Object.fromEntries(PLUGIN_NAMES.map((p) => [p, true])),
    output: {
      benchmarkPath: "/tmp/posthog-wizard-benchmark.json",
      benchmarkEnabled: true,
      logPath: "/tmp/posthog-wizard.log",
      logEnabled: true,
      suppressWizardLogs: false,
    },
  };
}

// ============================================================================
// CLI args
// ============================================================================

interface Options {
  region: "us" | "eu";
  defaults: boolean;
  command?: string;
}

function parseArgs(): Options {
  const args = process.argv.slice(2);
  const opts: Options = { region: "us", defaults: false };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--defaults") opts.defaults = true;
    else if (arg === "--command" && i + 1 < args.length) {
      opts.command = args[++i];
    } else if (arg === "--region") {
      const value = args[++i];
      if (value !== "us" && value !== "eu") {
        console.error(`Invalid region: ${value}. Must be 'us' or 'eu'.`);
        process.exit(1);
      }
      opts.region = value;
    } else if (arg === "--help" || arg === "-h") {
      console.log(`
wizard-benchmark: Interactive benchmark runner for the PostHog wizard

Usage:
  pnpm benchmark                     Interactive mode (default)
  pnpm benchmark --command <id>      Skip command picker
  pnpm benchmark --defaults          Skip plugin prompts, use all defaults
  pnpm benchmark --region <us|eu>    Specify PostHog region (default: us)

Available commands:
${WIZARD_COMMANDS.filter((c) => c.ciCapable)
  .map((c) => `  ${commandToInvocation(c.id).padEnd(28)}  ${c.description}`)
  .join("\n")}

Options:
  --command <id>       Wizard command (CI-capable only)
  --defaults           Use default benchmark config without prompting
  --region <us|eu>     PostHog region (default: us)
  -h, --help           Show this help message
`);
      process.exit(0);
    }
  }

  return opts;
}

// ============================================================================
// App selection
// ============================================================================

function prompt(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function selectApp(apps: App[]): Promise<App> {
  console.log("Select an app to benchmark:\n");
  apps.forEach((app, i) => console.log(`  ${i + 1}) ${app.name}`));
  console.log();

  const selection = await prompt(`Enter number (1-${apps.length}): `);
  const index = parseInt(selection, 10) - 1;

  if (index < 0 || index >= apps.length) {
    console.error("Invalid selection");
    process.exit(1);
  }

  return apps[index];
}

async function selectCommand(): Promise<WizardCommand> {
  // Benchmark always uses --ci, so only CI-capable commands are valid.
  const available = WIZARD_COMMANDS.filter((c) => c.ciCapable);
  if (available.length === 0) {
    console.error("No CI-capable wizard commands available.");
    process.exit(1);
  }

  console.log("Select a wizard command:\n");
  available.forEach((cmd, i) =>
    console.log(
      `  ${i + 1}) ${commandToInvocation(cmd.id).padEnd(28)} ${cmd.description}`,
    ),
  );
  console.log();

  const selection = await prompt(`Enter number (1-${available.length}): `);
  const index = parseInt(selection, 10) - 1;

  if (index < 0 || index >= available.length) {
    console.error("Invalid selection");
    process.exit(1);
  }

  return available[index];
}

// ============================================================================
// Wizard runner
// ============================================================================

interface BenchmarkResult {
  success: boolean;
  duration: number;
  error?: string;
}

function runBenchmark(
  appPath: string,
  opts: Options,
  command: WizardCommand,
): Promise<BenchmarkResult> {
  const wizardBin = getWizardBin();
  const start = Date.now();

  if (!existsSync(wizardBin)) {
    return Promise.resolve({
      success: false,
      duration: 0,
      error: `Wizard not found: ${wizardBin}`,
    });
  }

  const region = opts.region || (process.env.POSTHOG_REGION as "us" | "eu") || "us";
  const apiKey = process.env.POSTHOG_PERSONAL_API_KEY;

  if (!apiKey) {
    return Promise.resolve({
      success: false,
      duration: 0,
      error: "POSTHOG_PERSONAL_API_KEY must be set in .env",
    });
  }

  // Subcommand (e.g. 'revenue', or a family leaf like 'audit events') must come
  // before flags. Split on whitespace so multi-token subcommands become
  // separate argv entries.
  const subcommand = commandToSubcommand(command.id);
  const args: string[] = [wizardBin];
  if (subcommand) args.push(...subcommand.split(' '));
  args.push(
    // Local skills, production MCP — same as the CI runner.
    "--local-context-mill",
    "--benchmark",
    "--ci",
    "--region",
    region,
    "--api-key",
    apiKey,
    "--install-dir",
    appPath,
  );

  return new Promise((resolve) => {
    const child = spawn("node", args, {
      cwd: appPath,
      stdio: "inherit",
      env: process.env,
    });

    child.on("close", (code) => {
      resolve({
        success: code === 0,
        duration: Date.now() - start,
        error: code !== 0 ? `Exit code: ${code}` : undefined,
      });
    });

    child.on("error", (err) => {
      resolve({
        success: false,
        duration: Date.now() - start,
        error: err.message,
      });
    });
  });
}

// ============================================================================
// Main
// ============================================================================

async function main(): Promise<void> {
  const opts = parseArgs();

  // Resolve command: from --command flag or interactive picker
  let command: WizardCommand;
  if (opts.command) {
    const found = findCommand(opts.command);
    if (!found) {
      console.error(
        `Unknown command: ${opts.command}. Valid: ${WIZARD_COMMANDS.map((c) => c.id).join(", ")}`,
      );
      process.exit(1);
    }
    if (!found.ciCapable) {
      console.error(
        `Command "${found.id}" does not support CI mode (benchmark requires --ci).`,
      );
      process.exit(1);
    }
    command = found;
  } else {
    command = await selectCommand();
  }

  const scopedAppsDir = join(APPS_DIR, command.appsDir);
  const apps = findApps(scopedAppsDir);

  if (apps.length === 0) {
    console.error(`No apps found in ${scopedAppsDir}`);
    process.exit(1);
  }

  const selectedApp = await selectApp(apps);
  const config = defaultConfig();

  if (!opts.defaults) {
    const pluginResults = await checkbox(
      "Plugins",
      PLUGIN_NAMES.map((name) => ({ label: name, checked: config.plugins[name] })),
    );
    for (const result of pluginResults) {
      config.plugins[result.label] = result.checked;
    }
  }

  // Reset app to clean state
  console.log(`\nResetting ${selectedApp.name}...`);
  resetApp(selectedApp.path);

  // Write config to workbench root
  const configPath = join(WORKBENCH, ".benchmark-config.json");
  writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n", "utf-8");
  process.env.POSTHOG_WIZARD_BENCHMARK_CONFIG = configPath;

  console.log(`Running benchmark: ${commandToInvocation(command.id)}`);
  console.log(`App: ${selectedApp.name}\n`);

  const result = await runBenchmark(selectedApp.path, opts, command);

  if (!result.success) {
    console.error(`\nBenchmark failed: ${result.error}`);
    process.exit(1);
  }

  const seconds = (result.duration / 1000).toFixed(1);
  console.log(`\nBenchmark completed in ${seconds}s`);
  console.log(`Results: ${config.output.benchmarkPath}`);

  process.exit(0);
}

main().catch((e) => {
  console.error("Error:", e);
  process.exit(1);
});
