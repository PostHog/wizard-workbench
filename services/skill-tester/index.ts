#!/usr/bin/env node
/**
 * Skill detect — lightweight detection debugger
 *
 * Point it at any directory to see what the wizard's detection logic finds.
 * Run without arguments for an interactive app picker.
 *
 *   pnpm skill-detect                     Interactive picker
 *   pnpm skill-detect <dir> [--verbose]   Direct path
 */
import "dotenv/config";
import { createInterface } from "readline";
import { readdir, stat } from "fs/promises";
import { join, resolve } from "path";
import { runDetection } from "./runners/detection.js";
import type { DetectionResult } from "./runners/detection.js";
import { findApps } from "../wizard-ci/utils.js";

const WORKBENCH = join(import.meta.dirname, "../..");
const APPS_DIR = join(WORKBENCH, "apps");

// ─── Output ──────────────────────────────────────────────────────────────────

function printDetectionResult(result: DetectionResult, label: string, verbose: boolean): void {
  console.log(`Detecting: ${label}\n`);

  if (result.detected) {
    console.log(`  Result:  ${result.detectedName} (${result.detected})`);
  } else {
    console.log(`  Result:  No framework detected`);
  }
  console.log(`  Time:    ${result.totalMs}ms\n`);

  if (verbose) {
    console.log(`  ${"─".repeat(56)}`);
    console.log(`  ${"Integration".padEnd(22)} ${"Name".padEnd(22)} ${"Match".padEnd(8)} Time`);
    console.log(`  ${"─".repeat(56)}`);

    for (const t of result.trace) {
      const matchStr = t.matched ? "✓ YES" : "  no";
      const suffix = t.matched && t.integration === result.detected
        ? " ← winner"
        : t.matched
          ? " (matched but lost — earlier detector won)"
          : "";
      console.log(
        `  ${t.integration.padEnd(22)} ${t.name.padEnd(22)} ${matchStr.padEnd(8)} ${t.durationMs}ms${suffix}`,
      );
    }

    console.log(`  ${"─".repeat(56)}\n`);
  }
}

// ─── Detect ──────────────────────────────────────────────────────────────────

async function detect(dir: string, verbose: boolean): Promise<void> {
  const installDir = resolve(dir);

  console.log();
  const result = await runDetection(installDir);
  printDetectionResult(result, installDir, verbose);

  // If nothing detected, try immediate subdirectories
  if (!result.detected) {
    const entries = await readdir(installDir);
    const subdirs: string[] = [];

    for (const entry of entries) {
      const fullPath = join(installDir, entry);
      const s = await stat(fullPath);
      if (s.isDirectory() && !entry.startsWith(".") && entry !== "node_modules") {
        subdirs.push(entry);
      }
    }

    if (subdirs.length === 0) return;

    console.log(`  Nothing detected at root — scanning ${subdirs.length} subdirectories...\n`);

    for (const subdir of subdirs) {
      const subPath = join(installDir, subdir);
      const subResult = await runDetection(subPath);
      if (subResult.detected) {
        printDetectionResult(subResult, `${subdir}/`, verbose);
      }
    }
  }
}

// ─── Interactive Picker ──────────────────────────────────────────────────────

function prompt(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function interactiveMode(verbose: boolean): Promise<void> {
  const apps = findApps(APPS_DIR);

  if (apps.length === 0) {
    console.error(`No apps found in ${APPS_DIR}`);
    process.exit(1);
  }

  console.log("\nSelect an app to detect:\n");
  apps.forEach((app, i) => console.log(`  ${String(i + 1).padStart(2)}) ${app.name}`));
  console.log();

  const selection = await prompt(`Enter number (1-${apps.length}): `);
  const index = parseInt(selection, 10) - 1;

  if (index < 0 || index >= apps.length) {
    console.error("Invalid selection");
    process.exit(1);
  }

  await detect(apps[index].path, verbose);
}

// ─── CLI ─────────────────────────────────────────────────────────────────────

function printUsage(): void {
  console.log(`
Skill Detect — what does the wizard see?

Usage:
  pnpm skill-detect                      Interactive app picker
  pnpm skill-detect <dir>                Run detection on a directory
  pnpm skill-detect <dir> --verbose      Show full detection trace

Options:
  --verbose, -v    Show which detectors ran and matched
  --help, -h       Show this help message

Examples:
  pnpm skill-detect
  pnpm skill-detect apps/python/meeting-summarizer
  pnpm skill-detect apps/django --verbose
  pnpm skill-detect apps/angular -v
`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  let verbose = false;
  let help = false;
  const positional: string[] = [];

  for (const arg of args) {
    if (arg === "--verbose" || arg === "-v") verbose = true;
    else if (arg === "--help" || arg === "-h") help = true;
    else positional.push(arg);
  }

  if (help) {
    printUsage();
    process.exit(0);
  }

  // Validate WIZARD_PATH
  if (!process.env.WIZARD_PATH) {
    console.error("Error: WIZARD_PATH environment variable is required.");
    console.error("Set it in .env or export it (path to your local wizard repo).\n");
    process.exit(1);
  }

  if (positional.length === 0) {
    await interactiveMode(verbose);
  } else {
    await detect(positional[0], verbose);
  }
}

main().catch((e) => {
  console.error("Error:", e instanceof Error ? e.message : e);
  process.exit(1);
});
