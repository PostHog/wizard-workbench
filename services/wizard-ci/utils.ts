/**
 * Reusable utilities for wizard testing
 *
 * Git and GitHub operations are imported from the shared github service.
 * This file contains only wizard-ci specific utilities.
 */
import { spawn } from "child_process";
import { existsSync, readdirSync, readFileSync, writeFileSync, statSync } from "fs";
import { join, extname } from "path";

// Re-export git operations from shared service
export {
  git,
  gitSafe,
  hasChanges,
  getChangedFiles,
  getChangedFilesInPath,
  hasChangesInPath,
  createBranch,
  commitAll,
  commitPath,
  getRemoteUrl,
  push,
  checkout,
  getCurrentBranch,
  getRepoRoot,
  deleteBranch,
  listBranches,
  branchExists,
  restoreWorkingDirectory,
} from "../github/index.js";

// Re-export GitHub CLI operations from shared service
export {
  createPR,
  extractPRNumber,
  type CreatePROptions,
} from "../github/index.js";

// Re-export high-level operations from shared service
export {
  pushAndCreatePR,
  switchOrCreateBranch,
  deleteBranches,
  type PushAndPROptions,
  type PushAndPRResult,
  type SwitchOrCreateBranchOptions,
  type SwitchOrCreateBranchResult,
  type DeleteBranchesResult,
} from "../github/index.js";

// ============================================================================
// App-specific git operations
// ============================================================================

import { restoreWorkingDirectory, git, getChangedFilesInPath } from "../github/index.js";

/**
 * Reset an app directory to HEAD state (discard all changes).
 * Convenience wrapper around restoreWorkingDirectory for app paths.
 */
export function resetApp(appPath: string): void {
  restoreWorkingDirectory(".", appPath);
}

// ============================================================================
// App discovery
// ============================================================================

export interface App {
  name: string;
  path: string;
}

export function findApps(appsDir: string): App[] {
  const apps: App[] = [];

  function scan(dir: string, prefix: string = ""): void {
    if (!existsSync(dir)) return;

    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      // Skip hidden entries, node_modules, and venv directories
      if (entry.name.startsWith(".") || entry.name === "node_modules" || entry.name === "venv") {
        continue;
      }

      const fullPath = join(dir, entry.name);

      // Handle both directories and symlinks to directories
      // For symlinks, we need to check if the target is actually a directory
      if (entry.isSymbolicLink()) {
        try {
          const stat = statSync(fullPath);
          if (!stat.isDirectory()) continue;
        } catch {
          continue; // Skip broken symlinks
        }
      } else if (!entry.isDirectory()) {
        continue;
      }
      const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;

      // A `.wizard-root` marker file forces this directory to register as a
      // single app and skip recursion into children. Use this for monorepo
      // roots (e.g. `stripe/stripe-saas-demo` containing backend/ + frontend/)
      // where the wizard should operate on the whole tree as one target.
      const isWizardRoot = existsSync(join(fullPath, ".wizard-root"));

      // Check for JS/TS projects (package.json), Python projects (manage.py for Django, requirements.txt),
      // Android projects (build.gradle or build.gradle.kts), or Swift/Xcode projects
      const isJsProject = existsSync(join(fullPath, "package.json"));
      const isDjangoProject = existsSync(join(fullPath, "manage.py"));
      const isPythonProject = existsSync(join(fullPath, "requirements.txt")) || existsSync(join(fullPath, "pyproject.toml"));
      const isAndroidProject = existsSync(join(fullPath, "build.gradle")) || existsSync(join(fullPath, "build.gradle.kts"));
      const isRailsProject = existsSync(join(fullPath, "Gemfile")) && existsSync(join(fullPath, "config.ru"));
      const isSwiftProject = existsSync(join(fullPath, "Package.swift")) ||
        readdirSync(fullPath).some(f => f.endsWith(".xcodeproj"));

      if (isWizardRoot || isJsProject || isDjangoProject || isPythonProject || isAndroidProject || isRailsProject || isSwiftProject) {
        apps.push({ name: relativePath, path: fullPath });
      } else {
        scan(fullPath, relativePath);
      }
    }
  }

  scan(appsDir);
  return apps.sort((a, b) => a.name.localeCompare(b.name));
}

// ============================================================================
// Wizard runner
// ============================================================================

export function getWizardBin(): string {
  const wizardPath = process.env.WIZARD_PATH?.replace(/^~/, process.env.HOME || "");
  return join(wizardPath || `${process.env.HOME}/development/wizard`, "dist/bin.js");
}

export interface YaraViolation {
  rule: string;
  severity: string;
  action: string;
  phase: string;
  tool: string;
}

export interface YaraReport {
  summary: {
    totalScans: number;
    violations: number;
    clean: number;
  };
  violations: YaraViolation[];
}

export interface WizardResult {
  success: boolean;
  duration: number;
  error?: string;
  yaraReport?: YaraReport;
}

export interface WizardOptions {
  ci?: boolean;
  region?: "us" | "eu";
  apiKey?: string;
  command?: string;
  skillId?: string;
  areas?: string;
}

/**
 * Run wizard on an app - spawns with inherited stdio for full interactivity.
 * In CI mode, uses --ci flag with required region and api-key.
 * Always passes --yara-report; after exit, reads the JSON report from /tmp.
 */
export function runWizard(appPath: string, options: WizardOptions = {}): Promise<WizardResult> {
  const wizardBin = getWizardBin();
  const start = Date.now();

  if (!existsSync(wizardBin)) {
    return Promise.resolve({
      success: false,
      duration: 0,
      error: `Wizard not found: ${wizardBin}`,
    });
  }

  // Build wizard args — subcommand (e.g. 'revenue') must come before flags
  const args = [wizardBin];
  if (options.command) {
    args.push(options.command);
  }
  if (options.skillId) {
    args.push(`--skill=${options.skillId}`);
  }
  if (options.areas) {
    args.push(`--areas=${options.areas}`);
  }
  args.push("--local-mcp");

  if (options.ci) {
    // Validate CI mode requirements - read from options first, then env vars, with fallback
    const region = options.region || (process.env.POSTHOG_REGION as "us" | "eu") || "us";
    const apiKey = options.apiKey || process.env.POSTHOG_PERSONAL_API_KEY;

    if (!apiKey) {
      return Promise.resolve({
        success: false,
        duration: 0,
        error: "CI mode requires POSTHOG_PERSONAL_API_KEY to be defined in .env file",
      });
    }

    args.push("--ci", "--region", region, "--api-key", apiKey, "--install-dir", appPath);
  }

  // Always request YARA report — the wizard writes a JSON file to /tmp
  // and prints a human-readable summary to stdout
  args.push("--yara-report");

  return new Promise((resolve) => {
    const child = spawn("node", args, {
      cwd: appPath,
      stdio: "inherit",
      env: process.env,
    });

    child.on("close", (code) => {
      const yaraReport = readYaraReport();
      resolve({
        success: code === 0,
        duration: Date.now() - start,
        error: code !== 0 ? `Exit code: ${code}` : undefined,
        yaraReport,
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
// YARA report
// ============================================================================

const YARA_REPORT_PATH = "/tmp/posthog-wizard-yara-report.json";

/**
 * Read the YARA scanner JSON report written by the wizard CLI.
 * Returns undefined if the file doesn't exist (no scans occurred or flag not supported).
 */
export function readYaraReport(): YaraReport | undefined {
  try {
    if (!existsSync(YARA_REPORT_PATH)) return undefined;
    const raw = readFileSync(YARA_REPORT_PATH, "utf-8");
    return JSON.parse(raw) as YaraReport;
  } catch {
    return undefined;
  }
}

/**
 * Format a YARA report as a human-readable string for logs and PR bodies.
 */
export function formatYaraReport(report: YaraReport): string {
  const { totalScans, violations: violationCount } = report.summary;
  const cleanCount = totalScans - violationCount;
  const lines = [
    `✓ ${totalScans} tool calls scanned, ${violationCount} violation${violationCount !== 1 ? "s" : ""} detected`,
  ];
  if (report.violations.length > 0) {
    lines.push("");
    for (const v of report.violations) {
      lines.push(`  [${v.action.toUpperCase()}] ${v.rule} (${v.severity.toUpperCase()}) — ${v.phase}:${v.tool}`);
    }
  }
  if (cleanCount > 0) {
    lines.push("");
    lines.push(`No violations: ✓ ${cleanCount} clean scan${cleanCount !== 1 ? "s" : ""}`);
  }
  return lines.join("\n");
}

// ============================================================================
// API key redaction
// ============================================================================

/** PostHog API keys match phc_ or phx_ followed by 20+ alphanumeric characters */
const PHX_KEY_PATTERN = /ph[cx]_[A-Za-z0-9]{20,}/g;
const PHX_REDACTED = "phx_API_KEY_IS_HARDCODED";

/** Binary file extensions to skip during redaction */
const BINARY_EXTENSIONS = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".ico", ".svg", ".webp",
  ".woff", ".woff2", ".ttf", ".eot", ".otf",
  ".zip", ".tar", ".gz", ".br",
  ".pdf", ".mp4", ".mp3", ".wav",
  ".lock",
]);

export interface RedactResult {
  filesModified: string[];
  keysRedacted: number;
}

/**
 * Scan only changed files in a path for hardcoded PostHog API keys (phx_...)
 * and replace them with a safe placeholder. Re-stages any modified files.
 */
export function redactApiKeys(repoRoot: string, relativePath: string): RedactResult {
  const result: RedactResult = { filesModified: [], keysRedacted: 0 };
  const changedFiles = getChangedFilesInPath(repoRoot, relativePath);

  for (const statusLine of changedFiles) {
    // git status --porcelain format: "XY filename" or "XY orig -> renamed"
    const filePath = statusLine.slice(3).split(" -> ").pop()!;
    const fullPath = join(repoRoot, filePath);

    if (!existsSync(fullPath)) continue;
    if (BINARY_EXTENSIONS.has(extname(filePath).toLowerCase())) continue;

    try {
      const content = readFileSync(fullPath, "utf-8");
      const matches = content.match(PHX_KEY_PATTERN);
      if (matches) {
        const redacted = content.replace(PHX_KEY_PATTERN, PHX_REDACTED);
        writeFileSync(fullPath, redacted, "utf-8");
        result.filesModified.push(filePath);
        result.keysRedacted += matches.length;
        // Re-stage the file so the redacted version is committed
        git(`add "${filePath}"`, repoRoot);
      }
    } catch {
      // Skip files that can't be read as text
    }
  }

  return result;
}

// ============================================================================
// Formatting
// ============================================================================

export function formatMs(ms: number): string {
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
}

/**
 * Generate a short unique ID (7 characters, like git short hashes).
 * Uses crypto.randomUUID() and takes the first 7 chars.
 */
export function shortId(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 7);
}

// ============================================================================
// PR Evaluation
// ============================================================================

export interface EvaluateResult {
  success: boolean;
  error?: string;
}

/**
 * Run pr-evaluator on a PR
 */
export function runEvaluator(
  prNumber: number,
  options: { command?: string } = {},
): Promise<EvaluateResult> {
  return new Promise((resolve) => {
    const args = ["run", "evaluate", "--pr", String(prNumber)];
    if (options.command) {
      args.push("--command", options.command);
    }
    const child = spawn("pnpm", args, {
      cwd: process.cwd(),
      stdio: "inherit",
      env: process.env,
    });

    child.on("close", (code) => {
      resolve({
        success: code === 0,
        error: code !== 0 ? `Exit code: ${code}` : undefined,
      });
    });

    child.on("error", (err) => {
      resolve({
        success: false,
        error: err.message,
      });
    });
  });
}

export interface EvaluateOnBranchOptions {
  branch: string;
  baseBranch?: string;
  testRunName?: string;
  command?: string;
}

/**
 * Run pr-evaluator on a local branch (--test-run mode)
 * This is used when --local and --evaluate are combined
 */
export function runEvaluatorOnBranch(options: EvaluateOnBranchOptions): Promise<EvaluateResult> {
  return new Promise((resolve) => {
    const args = ["run", "evaluate", "--branch", options.branch];

    if (options.baseBranch) {
      args.push("--base", options.baseBranch);
    }

    if (options.testRunName) {
      args.push("--test-run", options.testRunName);
    }

    if (options.command) {
      args.push("--command", options.command);
    }

    const child = spawn("pnpm", args, {
      cwd: process.cwd(),
      stdio: "inherit",
      env: process.env,
    });

    child.on("close", (code) => {
      resolve({
        success: code === 0,
        error: code !== 0 ? `Exit code: ${code}` : undefined,
      });
    });

    child.on("error", (err) => {
      resolve({
        success: false,
        error: err.message,
      });
    });
  });
}

