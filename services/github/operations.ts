/**
 * High-level git/GitHub operations
 *
 * These are composed operations that combine multiple git/gh commands
 * into common workflows used across services.
 */
import { push, checkout, createBranch, deleteBranch, branchExists } from "./git.js";
import { createPR } from "./gh-cli.js";
import { collectFileChanges, createSignedCommit } from "./api-commits.js";

// ============================================================================
// Push and PR creation
// ============================================================================

export interface PushAndPROptions {
  repoRoot: string;
  branch: string;
  remote?: string;
  base: string;
  title: string;
  body: string;
  draft?: boolean;
  deleteBranchAfter?: boolean;
  returnToBranch?: string;
}

export interface PushAndPRResult {
  success: boolean;
  prUrl?: string;
  error?: string;
}

/**
 * Push a branch and create a PR. Optionally delete local branch after.
 */
export function pushAndCreatePR(opts: PushAndPROptions): PushAndPRResult {
  const {
    repoRoot,
    branch,
    remote = "origin",
    base,
    title,
    body,
    draft = false,
    deleteBranchAfter = false,
    returnToBranch,
  } = opts;

  try {
    push(repoRoot, branch, remote);
  } catch (e) {
    return { success: false, error: `Failed to push: ${e}` };
  }

  let prUrl: string;
  try {
    prUrl = createPR({ cwd: repoRoot, title, body, base, draft });
  } catch (e) {
    return { success: false, error: `Failed to create PR: ${e}` };
  }

  if (deleteBranchAfter && returnToBranch) {
    checkout(repoRoot, returnToBranch);
    try {
      deleteBranch(repoRoot, branch);
    } catch {
      // Ignore delete errors - PR was created successfully
    }
  }

  return { success: true, prUrl };
}

// ============================================================================
// API commit + PR creation (signed commits via GraphQL)
// ============================================================================

export interface CommitAndPROptions {
  repoOwner: string;
  repoName: string;
  repoRoot: string;
  branch: string;
  baseBranch: string;
  baseSha: string;
  relativePath: string;
  commitMessage: string;
  title: string;
  body: string;
  draft?: boolean;
  token: string;
}

export interface CommitAndPRResult {
  success: boolean;
  prUrl?: string;
  commitSha?: string;
  error?: string;
  noChanges?: boolean;
}

/**
 * Create a signed commit on a new remote branch via the GitHub GraphQL
 * createCommitOnBranch mutation, then open a PR with `gh pr create`.
 *
 * Replaces the local-commit + push flow for environments where branch
 * protection requires verified signatures. Local working-tree changes
 * within `relativePath` are bundled into a single signed commit; the
 * caller's checkout is NOT modified.
 */
export async function commitAndCreatePR(opts: CommitAndPROptions): Promise<CommitAndPRResult> {
  const {
    repoOwner,
    repoName,
    repoRoot,
    branch,
    baseBranch,
    baseSha,
    relativePath,
    commitMessage,
    title,
    body,
    draft = false,
    token,
  } = opts;

  const { additions, deletions } = collectFileChanges({ repoRoot, relativePath });
  if (additions.length === 0 && deletions.length === 0) {
    return { success: false, noChanges: true, error: "No changes to commit" };
  }

  let commitSha: string;
  try {
    const result = await createSignedCommit({
      repoOwner,
      repoName,
      branch,
      baseSha,
      message: commitMessage,
      additions,
      deletions,
      token,
    });
    commitSha = result.commitSha;
  } catch (e) {
    return { success: false, error: `Failed to create signed commit: ${e}` };
  }

  let prUrl: string;
  try {
    // The local checkout was not switched to `branch` — it only exists on
    // the remote — so we must tell gh which head to use.
    prUrl = createPR({ cwd: repoRoot, title, body, base: baseBranch, head: branch, draft });
  } catch (e) {
    return { success: false, commitSha, error: `Failed to create PR: ${e}` };
  }

  return { success: true, prUrl, commitSha };
}

// ============================================================================
// Branch switching
// ============================================================================

export interface SwitchOrCreateBranchOptions {
  repoRoot: string;
  branchName?: string;
  generateName: () => string;
}

export interface SwitchOrCreateBranchResult {
  branch: string;
  created: boolean;
}

/**
 * Switch to an existing branch or create a new one.
 */
export function switchOrCreateBranch(opts: SwitchOrCreateBranchOptions): SwitchOrCreateBranchResult {
  const { repoRoot, branchName, generateName } = opts;

  if (branchName && branchExists(repoRoot, branchName)) {
    checkout(repoRoot, branchName);
    return { branch: branchName, created: false };
  }

  const newBranch = branchName || generateName();
  createBranch(repoRoot, newBranch);
  return { branch: newBranch, created: true };
}

// ============================================================================
// Batch operations
// ============================================================================

export interface DeleteBranchesResult {
  deleted: number;
  failed: string[];
}

/**
 * Delete multiple branches, returning count of deleted.
 */
export function deleteBranches(repoRoot: string, branches: string[]): DeleteBranchesResult {
  let deleted = 0;
  const failed: string[] = [];

  for (const branch of branches) {
    try {
      deleteBranch(repoRoot, branch);
      deleted++;
    } catch {
      failed.push(branch);
    }
  }

  return { deleted, failed };
}
