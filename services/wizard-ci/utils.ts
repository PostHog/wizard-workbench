/**
 * Reusable utilities for wizard testing
 *
 * Git and GitHub operations are imported from the shared github service.
 * This file contains only wizard-ci specific utilities.
 */
import { spawn } from "child_process";
import { existsSync, readdirSync } from "fs";
import { join } from "path";

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

import { restoreWorkingDirectory } from "../github/index.js";

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
      if (!entry.isDirectory() || entry.name.startsWith(".") || entry.name === "node_modules") {
        continue;
      }

      const fullPath = join(dir, entry.name);
      const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;

      if (existsSync(join(fullPath, "package.json"))) {
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

export interface WizardResult {
  success: boolean;
  duration: number;
  error?: string;
}

export interface WizardOptions {
  ci?: boolean;
  region?: "us" | "eu";
  apiKey?: string;
}

/**
 * Run wizard on an app - spawns with inherited stdio for full interactivity.
 * In CI mode, uses --ci flag with required region and api-key.
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

  // Build wizard args
  const args = [wizardBin, "--local-mcp"];

  if (options.ci) {
    // Validate CI mode requirements - read from env vars (loaded from .env)
    const region = process.env.POSTHOG_REGION as "us" | "eu" | undefined;
    const apiKey = process.env.POSTHOG_PERSONAL_API_KEY;

    if (!region) {
      return Promise.resolve({
        success: false,
        duration: 0,
        error: "CI mode requires POSTHOG_REGION to be defined in .env file (us or eu)",
      });
    }
    if (!apiKey) {
      return Promise.resolve({
        success: false,
        duration: 0,
        error: "CI mode requires POSTHOG_PERSONAL_API_KEY to be defined in .env file",
      });
    }

    args.push("--ci", "--region", region, "--api-key", apiKey, "--install-dir", appPath);
  }

  return new Promise((resolve) => {
    // Spawn exactly like wizard-run does - full stdio inherit for interactivity
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
export function runEvaluator(prNumber: number): Promise<EvaluateResult> {
  return new Promise((resolve) => {
    const child = spawn("pnpm", ["run", "evaluate", "--pr", String(prNumber)], {
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
