/**
 * GitHub service - shared utilities for git and GitHub CLI operations
 */

// Git operations
export {
  git,
  gitSafe,
  getRepoRoot,
  getRemoteUrl,
  hasChanges,
  getChangedFiles,
  getChangedFilesInPath,
  hasChangesInPath,
  getCurrentBranch,
  branchExists,
  createBranch,
  checkout,
  deleteBranch,
  listBranches,
  commitAll,
  commitPath,
  restoreWorkingDirectory,
  push,
  getMergeBase,
  getDiff,
  getDiffNumstat,
  getDiffNameStatus,
  getFileDiff,
  getCommitAuthor,
  getFirstCommitMessage,
  getCommitMessages,
} from "./git.js";

// GitHub CLI operations
export {
  createPR,
  fetchPR,
  postPRComment,
  getPRNumber,
  getPRUrl,
  isGhAuthenticated,
  extractPRNumber,
  EXCLUDED_PATH_PATTERNS,
  isExcludedPath,
  filterDiff,
  type CreatePROptions,
} from "./gh-cli.js";

// High-level operations
export {
  pushAndCreatePR,
  commitAndCreatePR,
  switchOrCreateBranch,
  deleteBranches,
  type PushAndPROptions,
  type PushAndPRResult,
  type CommitAndPROptions,
  type CommitAndPRResult,
  type SwitchOrCreateBranchOptions,
  type SwitchOrCreateBranchResult,
  type DeleteBranchesResult,
} from "./operations.js";

// API-commit primitives (signed-commit path)
export {
  createSignedCommit,
  collectFileChanges,
  resolveRepoIdentity,
  type ApiCommitOptions,
  type ApiCommitResult,
  type FileAddition,
  type FileDeletion,
  type CollectChangesOptions,
  type CollectChangesResult,
  type RepoIdentity,
} from "./api-commits.js";

// Shared types
export type { PRData, PRFile } from "./types.js";
