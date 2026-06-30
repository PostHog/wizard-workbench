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
import { join } from "path";
import { spawnSync } from "child_process";
import { findApps, runWizard } from "../wizard-ci/utils.js";
import {
  WIZARD_COMMANDS,
  commandToSubcommand,
  commandToInvocation,
  commandToProgram,
  findCommand,
  MIGRATE_PRODUCTS,
  type WizardCommand,
} from "../wizard-commands.js";
import { prompt, promptChoice, selectCommand, selectApp } from "./picker.js";

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

async function main(): Promise<void> {
  const opts = parseArgs();

  // Run mode — a normal wizard run, a headless (--ci) run, or a real-TUI
  // snapshot capture + diff. Skipped when --ci already forced headless.
  let snapshots = false;
  if (!opts.ci) {
    const mode = await promptChoice("What do you want to run?", [
      "Wizard (interactive)",
      "Wizard (headless / --ci)",
      "Snapshots (real-TUI capture + diff)",
    ]);
    if (!mode) {
      console.error("A run mode is required.");
      process.exit(1);
    }
    if (mode.includes("headless")) opts.ci = true;
    else if (mode.includes("Snapshots")) snapshots = true;
  }

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
    // Only the snapshots flow is restricted to commands with an e2e.json;
    // interactive / headless runs offer every command.
    command = await selectCommand(opts.ci, snapshots);
  }

  // Wizard-invocation prompts below only apply to a real run, not snapshots.
  // If the skill command was selected, prompt for the skill ID
  let skillId: string | undefined;
  if (!snapshots && command.id === 'skill') {
    skillId = await prompt('Enter skill ID: ');
    if (!skillId) {
      console.error("Skill ID is required.");
      process.exit(1);
    }
  }

  // If the migrate command was selected, prompt for the source SDK
  let product: string | undefined;
  if (!snapshots && command.id === 'migrate') {
    product = await promptChoice(
      'Migrate from which source SDK?',
      MIGRATE_PRODUCTS as readonly string[],
    );
    if (!product) {
      console.error("Source SDK is required for migrate.");
      process.exit(1);
    }
  }

  // If self-driving was selected, ask whether to integrate the SDK first.
  // "Integrate first" passes --integrate (skips the in-wizard question);
  // otherwise the wizard asks "do you already have PostHog?" itself.
  let integrate = false;
  if (!snapshots && command.id === 'self-driving') {
    const choice = await promptChoice(
      'Set up the PostHog SDK first, or just Self-driving?',
      ['Ask me in the wizard', 'Integrate the SDK first (--integrate)'],
    );
    if (!choice) {
      console.error("A choice is required for self-driving.");
      process.exit(1);
    }
    integrate = choice.includes('--integrate');
  }

  const scopedAppsDir = join(APPS_DIR, command.appsDir);
  const apps = findApps(scopedAppsDir);
  if (apps.length === 0) {
    console.error(`No apps found in ${scopedAppsDir}`);
    process.exit(1);
  }

  const selectedApp = await selectApp(apps);

  // Snapshots mode: hand off to the real-TUI snapshot capture for this app
  // (the same tool the removed mprocs pane ran), then exit.
  if (snapshots) {
    // selectedApp.name is relative to the command's appsDir; snapshots.ts
    // resolves from apps/, so prepend the appsDir to get the full app path.
    const appPath = `${command.appsDir}/${selectedApp.name}`;
    const program = commandToProgram(command.id);
    console.log();
    console.log(`Snapshots: ${appPath}  (program: ${program})\n`);
    const res = spawnSync(
      "npx",
      [
        "tsx",
        "services/wizard-ci/snapshots.ts",
        appPath,
        "--program",
        program,
      ],
      { stdio: "inherit", cwd: WORKBENCH },
    );
    process.exit(res.status ?? 0);
  }

  console.log();
  console.log(
    `Command: ${commandToInvocation(command.id, { skillId, product, integrate })}`,
  );
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
    skillId,
    product,
    integrate,
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
