/**
 * Generic GitHub CLI (gh) wrappers
 *
 * These functions use the `gh` CLI which handles authentication via `gh auth login`.
 * No GITHUB_TOKEN environment variable is needed.
 */
import { execSync } from "child_process";
import type { PRData, PRFile } from "./types.js";

// ============================================================================
// Shell escaping
// ============================================================================

function escapeForShell(str: string): string {
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/`/g, "\\`");
}

// ============================================================================
// PR operations
// ============================================================================

export interface CreatePROptions {
  cwd: string;
  title: string;
  body: string;
  base: string;
  draft?: boolean;
}

/**
 * Create a pull request using gh CLI.
 * Returns the PR URL.
 */
export function createPR(opts: CreatePROptions): string {
  const { cwd, title, body, base, draft } = opts;
  const draftFlag = draft ? " --draft" : "";
  const result = execSync(
    `gh pr create --title "${escapeForShell(title)}" --body "${escapeForShell(body)}" --base "${base}"${draftFlag}`,
    { cwd, encoding: "utf-8", stdio: "pipe" }
  );
  return result.trim();
}

/**
 * Fetch PR data by number using gh CLI.
 * Works without authentication for public repos.
 */
export function fetchPR(prNumber: number, cwd: string): PRData {
  // Fetch PR metadata
  const prJson = execSync(
    `gh pr view ${prNumber} --json number,title,body,author,baseRefName,headRefName`,
    { cwd, encoding: "utf-8", stdio: "pipe" }
  );
  const pr = JSON.parse(prJson);

  // Fetch PR diff
  const diff = execSync(`gh pr diff ${prNumber}`, { cwd, encoding: "utf-8", stdio: "pipe" });

  // Fetch PR files
  const filesJson = execSync(`gh pr view ${prNumber} --json files`, { cwd, encoding: "utf-8", stdio: "pipe" });
  const filesData = JSON.parse(filesJson);

  const files: PRFile[] = (filesData.files || []).map((f: { path: string; additions: number; deletions: number }) => ({
    filename: f.path,
    status: "modified" as const, // gh CLI doesn't provide status, default to modified
    additions: f.additions,
    deletions: f.deletions,
    patch: undefined, // Would need separate call per file
  }));

  return {
    number: pr.number,
    title: pr.title,
    description: pr.body || "",
    author: pr.author?.login || "unknown",
    baseBranch: pr.baseRefName,
    headBranch: pr.headRefName,
    diff,
    files,
  };
}

/**
 * Post a comment on a PR using gh CLI.
 * Returns the comment URL.
 */
export function postPRComment(prNumber: number, body: string, cwd: string): string {
  const result = execSync(`gh pr comment ${prNumber} --body "${escapeForShell(body)}"`, {
    cwd,
    encoding: "utf-8",
    stdio: "pipe",
  });
  // gh pr comment doesn't return the URL directly, construct it
  const repoUrl = execSync("gh repo view --json url -q .url", { cwd, encoding: "utf-8", stdio: "pipe" }).trim();
  return `${repoUrl}/pull/${prNumber}#issuecomment-new`;
}

/**
 * Get PR number for a branch (if a PR exists).
 * Returns null if no PR exists for the branch.
 */
export function getPRNumber(branch: string, cwd: string): number | null {
  try {
    const result = execSync(`gh pr view ${branch} --json number -q .number`, {
      cwd,
      encoding: "utf-8",
      stdio: "pipe",
    });
    return parseInt(result.trim(), 10);
  } catch {
    return null;
  }
}

/**
 * Get PR URL for a branch (if a PR exists).
 * Returns null if no PR exists for the branch.
 */
export function getPRUrl(branch: string, cwd: string): string | null {
  try {
    const result = execSync(`gh pr view ${branch} --json url -q .url`, {
      cwd,
      encoding: "utf-8",
      stdio: "pipe",
    });
    return result.trim();
  } catch {
    return null;
  }
}

/**
 * Check if gh CLI is installed and authenticated.
 */
export function isGhAuthenticated(): boolean {
  try {
    execSync("gh auth status", { encoding: "utf-8", stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

/**
 * Extract PR number from GitHub PR URL
 * e.g., "https://github.com/owner/repo/pull/123" -> 123
 */
export function extractPRNumber(prUrl: string): number | null {
  const match = prUrl.match(/\/pull\/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}
