#!/usr/bin/env node
/**
 * Wizard Run - Interactive command + app selector for running the PostHog wizard
 *
 * Scans /apps for test applications and presents:
 *   1. A command picker (integration, revenue analytics, …)
 *   2. An app picker scoped to that command
 *
 * Usage:
 *   npx tsx services/wizard-run/index.ts                         # Full interactive flow
 *   npx tsx services/wizard-run/index.ts --command revenue       # Skip command picker
 *   npx tsx services/wizard-run/index.ts --ci                    # CI mode
 *
 * Adding a new wizard command: append to WIZARD_COMMANDS in wizard-commands.ts.
 * Adding a new test app: drop a project under /apps; it appears automatically.
 */
import "dotenv/config";
import { createInterface } from "readline";
import { join } from "path";
import { findApps, runWizard, type App } from "../wizard-ci/utils.js";
import {
  WIZARD_COMMANDS,
  commandToSubcommand,
  commandToInvocation,
  findCommand,
  type WizardCommand,
} from "../wizard-commands.js";

const WORKBENCH = join(import.meta.dirname, "../..");
const APPS_DIR = join(WORKBENCH, "apps");

interface Options {
  ci: boolean;
  region: "us" | "eu";
  command?: string;
}

function parseArgs(): Options {
  const args = process.argv.slice(2);
  const opts: Options = {
    ci: false,
    region: "us",
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--ci") opts.ci = true;
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
wizard-run: Interactive command + app selector for the PostHog wizard

Usage:
  pnpm wizard-run                         Interactive (pick command + app)
  pnpm wizard-run --command <id>          Skip command picker
  pnpm wizard-run --ci                    Run in CI mode (non-interactive)
  pnpm wizard-run --region <us|eu>        PostHog region (default: us)

Available commands:
${WIZARD_COMMANDS.map((c) => `  ${commandToInvocation(c.id).padEnd(28)}  ${c.description}`).join("\n")}

Options:
  --command <id>     Wizard command (see above)
  --ci               CI mode. Requires POSTHOG_PERSONAL_API_KEY in .env
  --region <us|eu>   PostHog region (default: us)
  -h, --help         Show this help message
`);
      process.exit(0);
    }
  }

  return opts;
}

function prompt(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function selectCommand(ciMode: boolean): Promise<WizardCommand> {
  const available = ciMode
    ? WIZARD_COMMANDS.filter((c) => c.ciCapable)
    : WIZARD_COMMANDS;

  if (available.length === 0) {
    console.error("No wizard commands available for this mode.");
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

async function selectApp(apps: App[]): Promise<App> {
  console.log("Select an app to run the wizard on:\n");
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

async function main(): Promise<void> {
  const opts = parseArgs();

  // Resolve command: either from --command flag or interactive picker
  let command: WizardCommand;
  if (opts.command) {
    const found = findCommand(opts.command);
    if (!found) {
      console.error(
        `Unknown command: ${opts.command}. Valid: ${WIZARD_COMMANDS.map((c) => c.id).join(", ")}`,
      );
      process.exit(1);
    }
    if (opts.ci && !found.ciCapable) {
      console.error(`Command "${found.id}" does not support CI mode.`);
      process.exit(1);
    }
    command = found;
  } else {
    command = await selectCommand(opts.ci);
  }

  const apps = findApps(APPS_DIR);
  if (apps.length === 0) {
    console.error(`No apps found in ${APPS_DIR}`);
    process.exit(1);
  }

  const selectedApp = await selectApp(apps);

  console.log();
  console.log(`Command: ${commandToInvocation(command.id)}`);
  console.log(`App:     ${selectedApp.name}`);
  console.log(`Path:    ${selectedApp.path}`);
  if (opts.ci) {
    console.log(`Mode:    CI (non-interactive)`);
  }
  console.log();

  const result = await runWizard(selectedApp.path, {
    ci: opts.ci,
    region: opts.region,
    command: commandToSubcommand(command.id),
  });

  if (!result.success) {
    console.error(`Wizard failed: ${result.error}`);
    process.exit(1);
  }

  process.exit(0);
}

main().catch((e) => {
  console.error("Error:", e);
  process.exit(1);
});
