#!/usr/bin/env node
import "dotenv/config";
import { mkdir } from "fs/promises";
import { join } from "path";
import * as readline from "readline";
import { evaluatePR } from "./evaluator.js";
import { fetchLocalBranch } from "./git-local.js";
import { fetchPR } from "../github/index.js";

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function printUsage(): void {
  console.log(`
PR Evaluator - Evaluate PostHog integration quality in pull requests or local branches

Usage:
  pnpm run evaluate --pr <number> [options]
  pnpm run evaluate --branch <name> [options]

Options:
  --pr, -p <number>       PR number to evaluate (from GitHub)
  --branch, -b <name>     Local branch to evaluate (use "HEAD" for current branch)
  --base <branch>         Base branch for comparison (default: main)
  --test-run [name]       Run evaluation without posting to GitHub, saves prompt and output to test-evaluations/<name>/
  --help, -h              Show this help message

Examples:
  pnpm run evaluate --pr 123
  pnpm run evaluate --pr 123 --test-run
  pnpm run evaluate --branch feature/my-feature
  pnpm run evaluate --branch HEAD --base develop
  pnpm run evaluate -b HEAD --test-run
`);
}

function parseArgs(args: string[]): {
  prNumber?: number;
  branch?: string;
  baseBranch: string;
  testRun: boolean;
  testRunName?: string;
  help: boolean;
} {
  const result = {
    prNumber: undefined as number | undefined,
    branch: undefined as string | undefined,
    baseBranch: "main",
    testRun: false,
    testRunName: undefined as string | undefined,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--help" || arg === "-h") {
      result.help = true;
    } else if (arg === "--test-run") {
      result.testRun = true;
      // Check if next arg is a name (not another flag)
      const nextArg = args[i + 1];
      if (nextArg && !nextArg.startsWith("-")) {
        result.testRunName = nextArg;
        i++;
      }
    } else if (arg === "--pr" || arg === "-p") {
      const value = args[++i];
      if (value) {
        result.prNumber = parseInt(value, 10);
      }
    } else if (arg === "--branch" || arg === "-b") {
      const value = args[++i];
      if (value) {
        result.branch = value;
      }
    } else if (arg === "--base") {
      const value = args[++i];
      if (value) {
        result.baseBranch = value;
      }
    }
  }

  return result;
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printUsage();
    process.exit(0);
  }

  // Validate that either --pr or --branch is provided
  let hasPr = args.prNumber && !isNaN(args.prNumber);
  let hasBranch = !!args.branch;

  if (hasPr && hasBranch) {
    console.error("Error: Cannot use both --pr and --branch. Choose one.\n");
    printUsage();
    process.exit(1);
  }

  // Interactive mode if neither --pr nor --branch is provided
  if (!hasPr && !hasBranch) {
    console.log("PR Evaluator - Evaluate PostHog integration quality\n");
    const choice = await prompt("Evaluate a [p]r number or local [b]ranch? (p/b): ");

    if (choice.toLowerCase() === "p" || choice.toLowerCase() === "pr") {
      const prInput = await prompt("Enter PR number: ");
      const prNum = parseInt(prInput, 10);
      if (isNaN(prNum)) {
        console.error("Error: Invalid PR number");
        process.exit(1);
      }
      args.prNumber = prNum;
      hasPr = true;
    } else if (choice.toLowerCase() === "b" || choice.toLowerCase() === "branch") {
      const branchInput = await prompt("Enter branch name (or 'HEAD' for current branch): ");
      if (!branchInput) {
        console.error("Error: Branch name is required");
        process.exit(1);
      }
      args.branch = branchInput;
      hasBranch = true;
      // Base branch defaults to 'main', use --base flag if you need a different one
    } else {
      console.error("Error: Please enter 'p' for PR or 'b' for branch");
      process.exit(1);
    }
  }

  // Validate environment
  // Use EVALUATOR_ANTHROPIC_API_KEY to avoid conflict with wizard's ANTHROPIC_API_KEY
  if (!process.env.EVALUATOR_ANTHROPIC_API_KEY) {
    console.error("Error: EVALUATOR_ANTHROPIC_API_KEY environment variable is required");
    process.exit(1);
  }
  // Set ANTHROPIC_API_KEY for the Claude Agent SDK from our namespaced variable
  process.env.ANTHROPIC_API_KEY = process.env.EVALUATOR_ANTHROPIC_API_KEY;

  // For local branch mode, always use test-run (can't post to GitHub without a PR)
  if (hasBranch && !args.testRun) {
    console.log("Note: Local branch mode always uses --test-run (no PR to post comments to).");
    args.testRun = true;
  }

  // Note: We use the gh CLI for GitHub operations, which handles authentication automatically

  // Create test run directory if needed
  let testRunDir: string | undefined;
  if (args.testRun) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    let dirName: string;
    if (args.testRunName) {
      dirName = args.testRunName;
    } else if (hasPr) {
      dirName = `pr-${args.prNumber}-${timestamp}`;
    } else {
      // For branches, sanitize the branch name (replace / with -)
      const safeBranchName = args.branch!.replace(/\//g, "-");
      dirName = `branch-${safeBranchName}-${timestamp}`;
    }
    testRunDir = join("test-evaluations", dirName);
    await mkdir(testRunDir, { recursive: true });
    console.log(`Test run directory: ${testRunDir}`);
  }

  try {
    // Fetch PR data from GitHub or local git
    let prData;
    if (hasPr) {
      console.log(`Fetching PR #${args.prNumber} from GitHub...`);
      prData = fetchPR(args.prNumber!, process.cwd());
    } else {
      console.log(`Fetching local branch "${args.branch}" (base: ${args.baseBranch})...`);
      prData = await fetchLocalBranch({
        branch: args.branch!,
        baseBranch: args.baseBranch,
      });
    }

    console.log(`Title: "${prData.title}" by ${prData.author}`);
    console.log(`Branch: ${prData.headBranch} → ${prData.baseBranch}`);
    console.log(`Files changed: ${prData.files.length}`);

    const result = await evaluatePR({
      prData,
      testRun: args.testRun,
      testRunDir,
    });

    console.log("\n=== Evaluation Complete ===");
    if (result.commentUrl) {
      console.log(`Comment URL: ${result.commentUrl}`);
    }
    if (testRunDir) {
      console.log(`Files saved to: ${testRunDir}`);
    }
  } catch (error) {
    // Show cleaner error messages for common errors
    if (error instanceof Error) {
      // GitHub API errors
      if (error.message.includes("Not Found")) {
        console.error(`Error: PR #${args.prNumber} not found. Check the PR number and try again.`);
      } else if (error.message.includes("rate limit")) {
        console.error("Error: GitHub API rate limit exceeded. Try again later or set GITHUB_TOKEN.");
      } else {
        // Show our custom error messages or other errors cleanly
        console.error(`Error: ${error.message}`);
      }
    } else {
      console.error("Error during evaluation:", error);
    }
    process.exit(1);
  }
}

main();
