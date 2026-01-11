#!/usr/bin/env node
/**
 * wizard-ci: Run wizard on a single test app and optionally create a PR
 *
 * Usage:
 *   pnpm wizard-ci                              # Interactive selection
 *   pnpm wizard-ci --app next-js/15-app-router-saas
 *   pnpm wizard-ci --app next-js/15-app-router-saas --local
 *
 * For running all apps, use the wizard-trigger GitHub workflow.
 */
import "dotenv/config";
import { createInterface } from "readline";
import { join, relative } from "path";
import {
  findApps,
  resetApp,
  hasChanges,
  getChangedFiles,
  hasChangesInPath,
  getChangedFilesInPath,
  runWizard,
  commitPath,
  checkout,
  getCurrentBranch,
  getRepoRoot,
  getRemoteUrl,
  listBranches,
  pushAndCreatePR,
  switchOrCreateBranch,
  deleteBranches,
  formatMs,
  shortId,
  extractPRNumber,
  runEvaluator,
  runEvaluatorOnBranch,
  createBranch,
  type App,
} from "./utils.js";

// ============================================================================
// Config
// ============================================================================

const WORKBENCH = join(import.meta.dirname, "../..");
const APPS_DIR = join(WORKBENCH, "apps");

interface Options {
  app?: string;
  triggerId?: string;
  local: boolean;
  base: string;
  remote: string;
  deleteBranch: boolean;
  clean: boolean;
  pushOnly: boolean;
  branch?: string;
  evaluate: boolean;
}

// ============================================================================
// PR Helpers
// ============================================================================

interface PRMetadata {
  appName: string;
  shortId: string;
  branch: string;
  duration?: number;
}

function buildPRTitle(meta: PRMetadata): string {
  return `[CI] (${meta.shortId}) ${meta.appName}`;
}

function buildPRBody(meta: PRMetadata): string {
  const lines = [
    `Automated wizard CI run. Trigger ID: ${meta.shortId}`,
    "",
    `App: \`${meta.appName}\``,
    `App directory: \`apps/${meta.appName}\``,
    `Branch: \`${meta.branch}\``,
    `Timestamp: ${new Date().toISOString()}`,
  ];
  if (meta.duration !== undefined) {
    lines.push(`Duration: ${formatMs(meta.duration)}`);
  }
  return lines.join("\n");
}

interface EvaluationInfo {
  success: boolean;
  prNumber?: number;
  prUrl?: string;
}

async function runEvaluation(prUrl: string): Promise<EvaluationInfo> {
  const prNumber = extractPRNumber(prUrl);
  if (!prNumber) {
    console.warn(`      Could not extract PR number from URL: ${prUrl}\n`);
    return { success: false };
  }
  console.log(`      PR #${prNumber}\n`);
  const evalResult = await runEvaluator(prNumber);
  if (!evalResult.success) {
    console.warn(`      Evaluation failed: ${evalResult.error}\n`);
    return { success: false, prNumber, prUrl };
  } else {
    console.log(`      Evaluation complete\n`);
    return { success: true, prNumber, prUrl };
  }
}

interface LocalEvaluationInfo {
  success: boolean;
  branch: string;
  baseBranch: string;
  testRunDir?: string;
}

async function runLocalEvaluation(branch: string, baseBranch: string, testRunName?: string): Promise<LocalEvaluationInfo> {
  console.log(`      Branch: ${branch} (base: ${baseBranch})\n`);
  const evalResult = await runEvaluatorOnBranch({
    branch,
    baseBranch,
    testRunName,
  });
  const testRunDir = testRunName ? `test-evaluations/${testRunName}` : undefined;
  if (!evalResult.success) {
    console.warn(`      Evaluation failed: ${evalResult.error}\n`);
    return { success: false, branch, baseBranch, testRunDir };
  } else {
    console.log(`      Evaluation complete\n`);
    return { success: true, branch, baseBranch, testRunDir };
  }
}

function printSummary(info: {
  prUrl?: string;
  prNumber?: number;
  branch?: string;
  shortId?: string;
  testRunDir?: string;
}): void {
  console.log(`\n${"═".repeat(50)}`);
  console.log("Summary");
  console.log(`${"═".repeat(50)}`);
  if (info.prUrl) {
    console.log(`  PR:            ${info.prUrl}`);
  }
  if (info.prNumber) {
    console.log(`  PR Number:     #${info.prNumber}`);
  }
  if (info.branch) {
    console.log(`  Branch:        ${info.branch}`);
  }
  if (info.shortId) {
    console.log(`  ID:            ${info.shortId}`);
  }
  if (info.testRunDir) {
    console.log(`  Evaluation:    ${info.testRunDir}`);
  }
  console.log(`${"═".repeat(50)}\n`);
}

// ============================================================================
// CLI
// ============================================================================

function parseArgs(): Options {
  const args = process.argv.slice(2);
  const opts: Options = {
    local: false,
    base: "main",
    remote: "origin",
    deleteBranch: false,
    clean: false,
    pushOnly: false,
    evaluate: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--app" || arg === "-a") opts.app = args[++i];
    else if (arg === "--trigger-id" || arg === "-t") opts.triggerId = args[++i];
    else if (arg === "--local" || arg === "-l") opts.local = true;
    else if (arg === "--base") opts.base = args[++i];
    else if (arg === "--remote" || arg === "-r") opts.remote = args[++i];
    else if (arg === "--delete-branch" || arg === "-d") opts.deleteBranch = true;
    else if (arg === "--clean") opts.clean = true;
    else if (arg === "--push-only" || arg === "-p") opts.pushOnly = true;
    else if (arg === "--branch" || arg === "-b") {
      const nextArg = args[i + 1];
      // If next arg is missing or is another flag, mark for prompt
      if (!nextArg || nextArg.startsWith("-")) {
        opts.branch = ""; // Empty string signals "prompt for branch"
      } else {
        opts.branch = args[++i];
      }
    } else if (arg === "--evaluate" || arg === "-e") opts.evaluate = true;
    else if (arg === "--help" || arg === "-h") {
      console.log(`
wizard-ci: Run wizard on a single test app and create a PR

Runs wizard in CI mode (non-interactive). Requires POSTHOG_REGION and
POSTHOG_PERSONAL_API_KEY to be defined in .env file.

For running all apps, use the wizard-trigger GitHub workflow.

Usage:
  pnpm wizard-ci                     Interactive app selection
  pnpm wizard-ci --app <name>        Test specific app
  pnpm wizard-ci --trigger-id <id>   Trigger ID (inherited from orchestrator)
  pnpm wizard-ci --local             Skip PR creation
  pnpm wizard-ci --base <branch>     Base branch for PR (default: main)
  pnpm wizard-ci --remote <name>     Git remote to push to (default: origin)

Branch Management:
  pnpm wizard-ci --branch, -b [name] Specify branch (prompts if no name given)
                                     Full flow: reuse existing branch
                                     Push-only: select branch to push
  pnpm wizard-ci --delete-branch     Delete local branch after push
  pnpm wizard-ci --clean             Delete old wizard-ci branches
  pnpm wizard-ci --push-only         Skip reset/wizard, just push and create PR

Evaluation:
  pnpm wizard-ci --evaluate, -e      Run pr-evaluator after PR creation
                                     With --local: runs evaluation on local branch
                                     (creates branch, commits, runs test-run mode)
`);
      process.exit(0);
    }
  }
  return opts;
}

async function prompt(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function selectApp(apps: App[]): Promise<App> {
  console.log("\nAvailable apps:\n");
  apps.forEach((app, i) => console.log(`  ${i + 1}) ${app.name}`));
  const choice = await prompt(`\nSelect app (1-${apps.length}): `);
  const index = parseInt(choice, 10) - 1;
  if (index < 0 || index >= apps.length) {
    console.error("Invalid selection");
    process.exit(1);
  }
  return apps[index];
}

// ============================================================================
// Branch management
// ============================================================================

async function cleanBranches(): Promise<void> {
  const repoRoot = getRepoRoot(WORKBENCH);
  const branches = listBranches(repoRoot, "wizard-ci/*");

  if (branches.length === 0) {
    console.log("No wizard-ci branches found.\n");
    return;
  }

  console.log(`\nFound ${branches.length} wizard-ci branch(es):\n`);
  branches.forEach((branch, i) => console.log(`  ${i + 1}) ${branch}`));

  const answer = await prompt(`\nDelete all ${branches.length} branch(es)? (y/n): `);
  if (answer.toLowerCase() !== "y") {
    console.log("Cancelled.\n");
    return;
  }

  const { deleted, failed } = deleteBranches(repoRoot, branches);
  for (const branch of branches.filter((b) => !failed.includes(b))) {
    console.log(`  Deleted: ${branch}`);
  }
  for (const branch of failed) {
    console.error(`  Failed to delete: ${branch}`);
  }

  console.log(`\nDeleted ${deleted}/${branches.length} branch(es).\n`);
}

// ============================================================================
// Push-only mode
// ============================================================================

async function pushOnlyMode(opts: Options): Promise<void> {
  const repoRoot = getRepoRoot(WORKBENCH);
  const originalBranch = getCurrentBranch(repoRoot);

  // If --branch was provided without an argument, prompt for branch name
  if (opts.branch === "") {
    const allBranches = listBranches(repoRoot);
    // Filter out the current branch and base branch
    const branches = allBranches.filter((b) => b !== originalBranch && b !== opts.base);
    if (branches.length === 0) {
      console.error("\nNo branches found to push.\n");
      process.exit(1);
    }

    console.log("\nAvailable branches:\n");
    branches.forEach((branch, i) => console.log(`  ${i + 1}) ${branch}`));
    const choice = await prompt(`\nSelect branch (1-${branches.length}): `);
    const index = parseInt(choice, 10) - 1;
    if (index < 0 || index >= branches.length) {
      console.error("Invalid selection");
      process.exit(1);
    }
    opts.branch = branches[index];
  }

  // Determine which branch to push
  const targetBranch = opts.branch || originalBranch;

  // Switch to target branch if specified and different from current
  if (opts.branch && opts.branch !== originalBranch) {
    try {
      checkout(repoRoot, opts.branch);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      if (message.includes("would be overwritten")) {
        console.error(`\nError: Cannot switch branches - you have uncommitted changes.`);
        console.error("Please commit or stash your changes first.\n");
      } else {
        console.error(`\nError: Failed to checkout branch "${opts.branch}": ${message}`);
      }
      process.exit(1);
    }
  }

  console.log(`\n${"─".repeat(50)}`);
  console.log(`Push-only mode`);
  console.log(`${"─".repeat(50)}\n`);

  console.log(`      Branch: ${targetBranch}`);
  console.log(`      Base: ${opts.base}`);

  if (targetBranch === opts.base) {
    console.error(`\nError: Target branch is the base branch (${opts.base}).`);
    console.error("Specify a different branch with --branch.\n");
    if (opts.branch && opts.branch !== originalBranch) {
      checkout(repoRoot, originalBranch);
    }
    process.exit(1);
  }

  // Check for uncommitted changes
  if (hasChanges(repoRoot)) {
    console.log("\n      WARNING: You have uncommitted changes.\n");
    const changedFiles = getChangedFiles(repoRoot);
    for (const file of changedFiles) {
      console.log(`        ${file}`);
    }
    const confirm = await prompt("\n      Continue anyway? (y/n): ");
    if (confirm.toLowerCase() !== "y") {
      console.log("      Cancelled.\n");
      return;
    }
  }

  // Push and create PR
  console.log("\n[1/2] Pushing to remote...");
  const remoteUrl = getRemoteUrl(repoRoot, opts.remote);
  console.log(`      Remote: ${opts.remote} (${remoteUrl})`);

  // Extract app name and shortId from branch name if it follows wizard-ci pattern
  const branchMatch = targetBranch.match(/^wizard-ci\/(.+)\/([a-f0-9]{7})$/);
  const appName = branchMatch?.[1] || targetBranch;
  const branchShortId = branchMatch?.[2] || shortId();

  const prMeta: PRMetadata = {
    appName,
    shortId: branchShortId,
    branch: targetBranch,
  };

  const result = pushAndCreatePR({
    repoRoot,
    branch: targetBranch,
    remote: opts.remote,
    base: opts.base,
    title: buildPRTitle(prMeta),
    body: buildPRBody(prMeta),
    draft: true,
    deleteBranchAfter: opts.deleteBranch,
    returnToBranch: originalBranch,
  });

  if (!result.success) {
    console.error(`      ${result.error}`);
    if (opts.branch && opts.branch !== originalBranch) {
      checkout(repoRoot, originalBranch);
    }
    process.exit(1);
  }

  console.log(`      Pushed: ${targetBranch}\n`);
  console.log("[2/2] Creating PR...");
  console.log(`      PR: ${result.prUrl}\n`);

  // Run evaluation if requested
  let evalInfo: EvaluationInfo | undefined;
  if (opts.evaluate && result.prUrl) {
    console.log("[3/3] Running PR evaluation...");
    evalInfo = await runEvaluation(result.prUrl);
  }

  if (opts.deleteBranch) {
    console.log(`      Deleted local branch: ${targetBranch}\n`);
  } else if (targetBranch !== originalBranch) {
    // Return to original branch if we switched
    checkout(repoRoot, originalBranch);
  }

  // Print summary
  printSummary({
    prUrl: result.prUrl,
    prNumber: evalInfo?.prNumber,
    branch: targetBranch,
    shortId: branchShortId,
  });
}

// ============================================================================
// Run Wizard CI flow
// ============================================================================

async function runCI(app: App, opts: Options, triggerId: string): Promise<boolean> {
  const repoRoot = getRepoRoot(WORKBENCH);
  const appRelativePath = relative(repoRoot, app.path);

  console.log(`\n${"─".repeat(50)}`);
  console.log(`Running CI: ${app.name}`);
  console.log(`${"─".repeat(50)}\n`);

  // 1. Reset app only (with confirmation)
  console.log("[1/5] Reset app to clean state");
  console.log(`      Path: ${app.path}\n`);

  const changedFiles = getChangedFilesInPath(repoRoot, appRelativePath);
  if (changedFiles.length > 0) {
    console.log(`      WARNING: This will discard ${changedFiles.length} uncommitted change(s) in ${app.name}:\n`);
    for (const file of changedFiles) {
      console.log(`        ${file}`);
    }
    console.log();

    const confirm = await prompt("      Proceed with git restore? (y/n): ");
    if (confirm.toLowerCase() !== "y") {
      console.log("      Skipped\n");
      return false;
    }
  } else {
    console.log("      No uncommitted changes in app\n");
  }

  try {
    resetApp(app.path);
    console.log("      Done\n");
  } catch (e) {
    console.error(`      Failed: ${e}`);
    return false;
  }

  // 2. Run wizard (always in CI mode)
  console.log("[2/5] Running wizard...\n");
  const result = await runWizard(app.path, { ci: true });
  console.log();

  if (!result.success) {
    console.error(`      Failed: ${result.error}`);
    return false;
  }
  console.log(`      Completed in ${formatMs(result.duration)}\n`);

  // 3. Check changes in app directory only
  console.log("[3/5] Checking changes...");
  if (!hasChangesInPath(repoRoot, appRelativePath)) {
    console.log("      No changes detected\n");
    return true;
  }
  console.log("      Changes detected\n");

  // Stop here if local mode (unless --evaluate is also set)
  if (opts.local) {
    if (opts.evaluate) {
      // Create a branch and commit changes for evaluation
      console.log("[4/5] Creating branch and committing for local evaluation...");
      const originalBranch = getCurrentBranch(repoRoot);

      const branchName = `wizard-ci/${triggerId}/${app.name.replace(/\//g, "-")}`;

      try {
        createBranch(repoRoot, branchName);
        console.log(`      Branch: ${branchName}`);
      } catch (e) {
        console.error(`      Failed to create branch: ${e}`);
        return false;
      }

      try {
        const hash = commitPath(repoRoot, appRelativePath, `wizard-ci: ${app.name}`);
        console.log(`      Commit: ${hash}\n`);
      } catch (e) {
        console.error(`      Failed to commit: ${e}`);
        checkout(repoRoot, originalBranch);
        return false;
      }

      // Run evaluation on the branch
      console.log("[5/5] Running local evaluation (test-run mode)...");
      const testRunName = `local-${triggerId}-${app.name.replace(/\//g, "-")}`;
      const evalInfo = await runLocalEvaluation(branchName, opts.base, testRunName);

      // Return to original branch
      checkout(repoRoot, originalBranch);

      // Print summary
      printSummary({
        branch: branchName,
        shortId: triggerId,
        testRunDir: evalInfo.testRunDir,
      });
    } else {
      console.log("[LOCAL] Skipping branch/PR creation\n");
    }
    return true;
  }

  // 4. Create branch and commit only app files
  console.log("[4/5] Creating branch and committing...");
  const originalBranch = getCurrentBranch(repoRoot);

  // Switch to existing or create new branch
  // If --branch was specified with a value, use it; if empty string, it was already prompted in push-only mode
  const generateBranchName = () => `wizard-ci/${triggerId}/${app.name.replace(/\//g, "-")}`;
  const specifiedBranch = opts.branch && opts.branch !== "" ? opts.branch : undefined;
  let branchResult;
  try {
    branchResult = switchOrCreateBranch({
      repoRoot,
      branchName: specifiedBranch,
      generateName: generateBranchName,
    });
    if (!branchResult.created) {
      console.log(`      Reusing branch: ${branchResult.branch}`);
    }
  } catch (e) {
    console.error(`      Failed to switch/create branch: ${e}`);
    checkout(repoRoot, originalBranch);
    return false;
  }

  const branchName = branchResult.branch;

  try {
    // Only commit files within the app directory
    const hash = commitPath(repoRoot, appRelativePath, `wizard-ci: ${app.name}`);
    console.log(`      Branch: ${branchName}`);
    console.log(`      Commit: ${hash}\n`);
  } catch (e) {
    console.error(`      Failed to commit: ${e}`);
    checkout(repoRoot, originalBranch);
    return false;
  }

  // 5. Push and create PR
  console.log("[5/5] Pushing and creating PR...");
  const remoteUrl = getRemoteUrl(repoRoot, opts.remote);
  console.log(`      Remote: ${opts.remote} (${remoteUrl})`);

  const prMeta: PRMetadata = {
    appName: app.name,
    shortId: triggerId,
    branch: branchName,
    duration: result.duration,
  };

  const prResult = pushAndCreatePR({
    repoRoot,
    branch: branchName,
    remote: opts.remote,
    base: opts.base,
    title: buildPRTitle(prMeta),
    body: buildPRBody(prMeta),
    draft: true,
    deleteBranchAfter: opts.deleteBranch,
    returnToBranch: originalBranch,
  });

  if (!prResult.success) {
    console.error(`      ${prResult.error}`);
    checkout(repoRoot, originalBranch);
    return false;
  }

  console.log(`      PR: ${prResult.prUrl}\n`);

  // Run evaluation if requested
  let evalInfo: EvaluationInfo | undefined;
  if (opts.evaluate && prResult.prUrl) {
    console.log("[6/6] Running PR evaluation...");
    evalInfo = await runEvaluation(prResult.prUrl);
  }

  if (opts.deleteBranch) {
    console.log(`      Deleted local branch: ${branchName}\n`);
  } else {
    // Return to original branch
    checkout(repoRoot, originalBranch);
  }

  // Print summary if evaluation was run
  if (opts.evaluate) {
    printSummary({
      prUrl: prResult.prUrl,
      prNumber: evalInfo?.prNumber,
      branch: branchName,
      shortId: triggerId,
    });
  }

  return true;
}

// ============================================================================
// Main
// ============================================================================

async function main(): Promise<void> {
  const opts = parseArgs();

  // Handle --clean command
  if (opts.clean) {
    await cleanBranches();
    return;
  }

  // Handle --push-only command
  if (opts.pushOnly) {
    await pushOnlyMode(opts);
    return;
  }

  const apps = findApps(APPS_DIR);

  if (apps.length === 0) {
    console.error("No apps found");
    process.exit(1);
  }

  // Determine which app to test
  let target: App;

  if (opts.app) {
    const app = apps.find((a) => a.name === opts.app || a.name.endsWith(opts.app!));
    if (!app) {
      console.error(`App not found: ${opts.app}`);
      console.log("Available:", apps.map((a) => a.name).join(", "));
      process.exit(1);
    }
    target = app;
  } else {
    target = await selectApp(apps);
  }

  // Generate or use provided trigger ID
  const triggerId = opts.triggerId || shortId();

  // Run test
  console.log(`\nWizard CI`);
  console.log(`App: ${target.name}`);
  console.log(`Trigger ID: ${triggerId}`);
  console.log(`Mode: ${opts.local ? "local" : "create PR"}`);

  const success = await runCI(target, opts, triggerId);

  process.exit(success ? 0 : 1);
}

main().catch((e) => {
  console.error("Error:", e);
  process.exit(1);
});
