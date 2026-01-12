#!/usr/bin/env node
/**
 * Wizard Run - Interactive app selector for running the PostHog wizard
 *
 * This script scans the /apps directory for test applications and presents
 * an interactive menu to select which app to run the wizard on.
 *
 * Usage: npx tsx services/wizard-run/index.ts
 *        npx tsx services/wizard-run/index.ts --ci  # Run in CI mode (non-interactive)
 *
 * To add new test apps:
 *   1. Create a new directory under /apps/<framework>/<app-name>
 *   2. Ensure it has a package.json
 *   3. The app will automatically appear in the selection menu
 */
import "dotenv/config";
import { createInterface } from "readline";
import { join } from "path";
import { findApps, runWizard, type App } from "../wizard-ci/utils.js";

const WORKBENCH = join(import.meta.dirname, "../..");
const APPS_DIR = join(WORKBENCH, "apps");

interface Options {
  ci: boolean;
  region: "us" | "eu";
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
    else if (arg === "--region") {
      const value = args[++i];
      if (value === "us" || value === "eu") {
        opts.region = value;
      } else {
        console.error(`Invalid region: ${value}. Must be "us" or "eu".`);
        process.exit(1);
      }
    } else if (arg === "--help" || arg === "-h") {
      console.log(`
wizard-run: Interactive app selector for running the PostHog wizard

Usage:
  pnpm wizard-run                    Interactive mode (default)
  pnpm wizard-run --ci               Run in CI mode (non-interactive)
  pnpm wizard-run --region <us|eu>   Specify PostHog region (default: us)

Options:
  --ci              Run in CI mode (non-interactive)
                    Requires POSTHOG_PERSONAL_API_KEY in .env
  --region <value>  PostHog region: "us" or "eu" (default: us)
  --help, -h        Show this help message
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
  const apps = findApps(APPS_DIR);

  if (apps.length === 0) {
    console.error(`No apps found in ${APPS_DIR}`);
    process.exit(1);
  }

  const selectedApp = await selectApp(apps);

  console.log();
  console.log(`Running wizard on: ${selectedApp.name}`);
  console.log(`Path: ${selectedApp.path}`);
  if (opts.ci) {
    console.log(`Mode: CI (non-interactive)`);
  }
  console.log();

  const result = await runWizard(selectedApp.path, { ci: opts.ci, region: opts.region });

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
