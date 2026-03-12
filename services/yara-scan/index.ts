#!/usr/bin/env node
/**
 * Standalone YARA Scanner - Scan app files against wizard YARA rules
 *
 * Runs the wizard's YARA rule engine against files in a selected app
 * directory, without needing to run a full wizard session. Useful for
 * testing rules and troubleshooting violations.
 *
 * Usage: pnpm yara-scan [--app <name>]
 */
import "dotenv/config";
import { createInterface } from "readline";
import { join, extname } from "path";
import { readFileSync, readdirSync } from "fs";
import { findApps, type App } from "../wizard-ci/utils.js";
import { scan, RULES } from "./scanner.js";

// ── Config ───────────────────────────────────────────────────────

const WORKBENCH = join(import.meta.dirname, "../..");
const APPS_DIR = join(WORKBENCH, "apps");

const SOURCE_EXTENSIONS = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
  ".py", ".rb", ".java", ".kt", ".kts",
  ".swift", ".dart", ".go",
  ".vue", ".svelte", ".astro",
  ".html", ".htm", ".ejs", ".hbs",
  ".json", ".yaml", ".yml", ".toml",
  ".env", ".env.local", ".env.development", ".env.production",
  ".sh", ".bash", ".zsh",
  ".md", ".mdx",
]);

const SKIP_DIRS = new Set([
  "node_modules", ".next", ".nuxt", "dist", "build", ".git",
  "__pycache__", ".venv", "venv", ".gradle", ".idea",
  "coverage", ".turbo", ".cache",
]);

// ── Types ────────────────────────────────────────────────────────

interface Violation {
  file: string;
  rule: string;
  severity: string;
  category: string;
  description: string;
  matchedText: string;
  phase: string;
  tool: string;
}

interface ScanOptions {
  appName?: string;
}

// ── File Discovery ───────────────────────────────────────────────

function collectFiles(dir: string): string[] {
  const files: string[] = [];

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") && entry.name !== ".env") continue;

    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      files.push(...collectFiles(fullPath));
    } else if (entry.isFile()) {
      const ext = extname(entry.name);
      if (SOURCE_EXTENSIONS.has(ext) || SOURCE_EXTENSIONS.has(entry.name)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

// ── Scanning ─────────────────────────────────────────────────────

type PhaseToolPair = { phase: "PreToolUse" | "PostToolUse"; tool: "Bash" | "Write" | "Edit" | "Read" | "Grep" };

// File content is scanned as if it were written (Write) and read (Read)
const FILE_SCAN_MODES: PhaseToolPair[] = [
  { phase: "PostToolUse", tool: "Write" },
  { phase: "PostToolUse", tool: "Read" },
];

function scanFile(filePath: string, basePath: string): Violation[] {
  const violations: Violation[] = [];
  let content: string;

  try {
    content = readFileSync(filePath, "utf-8");
  } catch {
    return violations;
  }

  if (!content.trim()) return violations;

  const relativePath = filePath.replace(basePath + "/", "");

  for (const mode of FILE_SCAN_MODES) {
    const result = scan(content, mode.phase, mode.tool);
    if (result.matched) {
      for (const match of result.matches) {
        violations.push({
          file: relativePath,
          rule: match.rule.name,
          severity: match.rule.severity,
          category: match.rule.category,
          description: match.rule.description,
          matchedText: match.matchedText.substring(0, 120),
          phase: mode.phase,
          tool: mode.tool,
        });
      }
    }
  }

  if (violations.length === 0) {
    console.log(`  . ${relativePath}`);
  }

  return violations;
}

// ── UI ───────────────────────────────────────────────────────────

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
  console.log("Select an app to scan:\n");
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

function parseArgs(): ScanOptions {
  const args = process.argv.slice(2);
  const opts: ScanOptions = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--app") opts.appName = args[++i];
    else if (arg === "--help" || arg === "-h") {
      console.log(`
yara-scan: Standalone YARA scanner for wizard test apps

Usage:
  pnpm yara-scan                          Interactive app selector
  pnpm yara-scan -- --app <name>          Scan a specific app

Options:
  --app <name>     App name (e.g. "javascript-web/nextjs-app")
  -h, --help       Show this help message
`);
      process.exit(0);
    }
  }

  return opts;
}

// ── Main ─────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const opts = parseArgs();
  const apps = findApps(APPS_DIR);

  if (apps.length === 0) {
    console.error(`No apps found in ${APPS_DIR}`);
    process.exit(1);
  }

  let selectedApp: App;
  if (opts.appName) {
    const match = apps.find((a) => a.name === opts.appName);
    if (!match) {
      console.error(`App not found: ${opts.appName}`);
      console.error(`Available: ${apps.map((a) => a.name).join(", ")}`);
      process.exit(1);
    }
    selectedApp = match;
  } else {
    selectedApp = await selectApp(apps);
  }

  console.log();
  console.log(`${"=".repeat(60)}`);
  console.log(`YARA Scanner — ${selectedApp.name}`);
  console.log(`${"=".repeat(60)}`);
  console.log(`Path: ${selectedApp.path}`);
  console.log(`Rules: ${RULES.length} loaded`);
  console.log();

  const files = collectFiles(selectedApp.path);
  console.log(`Scanning ${files.length} files...\n`);

  const allViolations: Violation[] = [];
  for (const file of files) {
    const violations = scanFile(file, selectedApp.path);
    allViolations.push(...violations);
  }

  // ── Report ──
  console.log();
  console.log(`${"─".repeat(60)}`);
  console.log("YARA Scan Report");
  console.log(`${"─".repeat(60)}`);
  console.log(`Files scanned: ${files.length}`);
  console.log(`Violations:    ${allViolations.length}`);

  if (allViolations.length > 0) {
    const bySeverity = new Map<string, Violation[]>();
    for (const v of allViolations) {
      const list = bySeverity.get(v.severity) || [];
      list.push(v);
      bySeverity.set(v.severity, list);
    }

    const severityOrder = ["critical", "high", "medium", "low"];
    for (const severity of severityOrder) {
      const violations = bySeverity.get(severity);
      if (!violations) continue;

      console.log(`\n  [${severity.toUpperCase()}] — ${violations.length} violation${violations.length !== 1 ? "s" : ""}`);
      for (const v of violations) {
        console.log(`    ${v.file}`);
        console.log(`      Rule: ${v.rule} (${v.category})`);
        console.log(`      ${v.description}`);
        console.log(`      Match: "${v.matchedText}"`);
        console.log(`      Scan mode: ${v.phase}:${v.tool}`);
        console.log();
      }
    }
  } else {
    console.log("\nNo violations found.");
  }

  console.log(`${"─".repeat(60)}`);
  process.exit(allViolations.length > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error("Error:", e);
  process.exit(1);
});
