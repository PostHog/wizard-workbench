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
  switchOrCreateBranch,
  deleteBranches,
  type PushAndPROptions,
  type PushAndPRResult,
  type SwitchOrCreateBranchOptions,
  type SwitchOrCreateBranchResult,
  type DeleteBranchesResult,
} from "./operations.js";

// Shared types
export type { PRData, PRFile } from "./types.js";
