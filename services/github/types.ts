/**
 * Shared types for GitHub/PR operations
 */

export interface PRData {
  number: number;
  title: string;
  description: string;
  author: string;
  baseBranch: string;
  headBranch: string;
  diff: string;
  files: PRFile[];
  /** Local repository root when available, used to inspect unmodified manifests. */
  repoPath?: string;
}

export interface PRFile {
  filename: string;
  status: "added" | "removed" | "modified" | "renamed";
  additions: number;
  deletions: number;
  patch?: string;
}
