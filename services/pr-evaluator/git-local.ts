/**
 * Local branch utilities for pr-evaluator
 *
 * Fetches PR-like data from a local git branch for evaluation.
 * Uses the shared github service for generic git operations.
 */
import type { PRData, PRFile } from "../github/index.js";
import {
  branchExists,
  getCurrentBranch,
  getMergeBase,
  getDiff,
  getDiffNumstat,
  getDiffNameStatus,
  getFileDiff,
  getCommitAuthor,
  getFirstCommitMessage,
  getCommitMessages,
  isExcludedPath,
  filterDiff,
} from "../github/index.js";

// ── Local branch fetching ───────────────────────────────────────────────────

export interface LocalBranchOptions {
  branch: string;
  baseBranch?: string; // defaults to 'main'
  cwd?: string; // defaults to process.cwd()
}

export async function fetchLocalBranch(options: LocalBranchOptions): Promise<PRData> {
  const { branch, baseBranch = "main", cwd = process.cwd() } = options;

  // Get the current branch if "HEAD" is specified
  let actualBranch: string;
  if (branch === "HEAD") {
    try {
      actualBranch = getCurrentBranch(cwd);
    } catch {
      throw new Error("Not in a git repository or unable to determine current branch");
    }
  } else {
    actualBranch = branch;
  }

  // Validate that the branch exists
  if (!branchExists(cwd, actualBranch)) {
    throw new Error(`Branch "${actualBranch}" does not exist. Check the branch name and try again.`);
  }

  // Validate that the base branch exists
  if (!branchExists(cwd, baseBranch)) {
    throw new Error(`Base branch "${baseBranch}" does not exist. Use --base to specify a different base branch.`);
  }

  // Get the merge base (common ancestor)
  let mergeBase: string;
  try {
    mergeBase = getMergeBase(cwd, baseBranch, actualBranch);
  } catch {
    throw new Error(
      `Cannot find common ancestor between "${baseBranch}" and "${actualBranch}". ` +
        `Make sure the branches share history.`
    );
  }

  const rawDiff = getDiff(cwd, mergeBase, actualBranch);
  const diff = filterDiff(rawDiff);

  // Get file stats using diff --stat
  const diffStat = getDiffNumstat(cwd, mergeBase, actualBranch);

  // Get file statuses
  const diffNameStatus = getDiffNameStatus(cwd, mergeBase, actualBranch);

  // Parse file information and filter out excluded paths
  const allFiles = parseGitFiles(diffStat, diffNameStatus, mergeBase, actualBranch, cwd);
  const files = allFiles.filter((f) => !isExcludedPath(f.filename));

  // Try to get author from the most recent commit on the branch
  const author = getCommitAuthor(cwd, actualBranch) || "local";

  // Try to get a title from the first commit message after the merge base
  let title = `Local branch: ${actualBranch}`;
  const firstCommitMsg = getFirstCommitMessage(cwd, mergeBase, actualBranch);
  if (firstCommitMsg) {
    title = firstCommitMsg;
  }

  // Try to get description from commit messages
  let description = "";
  const commitMessages = getCommitMessages(cwd, mergeBase, actualBranch);
  if (commitMessages) {
    description = `Commits:\n${commitMessages}`;
  }

  return {
    number: 0, // Local branches don't have PR numbers
    title,
    description,
    author,
    baseBranch,
    headBranch: actualBranch,
    diff,
    files,
  };
}

function parseGitFiles(
  diffStat: string,
  diffNameStatus: string,
  mergeBase: string,
  branch: string,
  cwd: string
): PRFile[] {
  const files: PRFile[] = [];

  // Parse numstat for additions/deletions
  const statLines = diffStat.trim().split("\n").filter(Boolean);
  const statsMap = new Map<string, { additions: number; deletions: number }>();

  for (const line of statLines) {
    const [additions, deletions, filename] = line.split("\t");
    // Binary files show "-" for additions/deletions
    statsMap.set(filename, {
      additions: additions === "-" ? 0 : parseInt(additions, 10),
      deletions: deletions === "-" ? 0 : parseInt(deletions, 10),
    });
  }

  // Parse name-status for file status
  const statusLines = diffNameStatus.trim().split("\n").filter(Boolean);

  for (const line of statusLines) {
    const [statusCode, ...filenameParts] = line.split("\t");
    const filename = filenameParts[filenameParts.length - 1]; // Handle renames (old\tnew)

    let status: PRFile["status"];
    switch (statusCode[0]) {
      case "A":
        status = "added";
        break;
      case "D":
        status = "removed";
        break;
      case "R":
        status = "renamed";
        break;
      default:
        status = "modified";
    }

    const stats = statsMap.get(filename) || { additions: 0, deletions: 0 };

    // Get the patch for this file
    const patch = getFileDiff(cwd, mergeBase, branch, filename) || undefined;

    files.push({
      filename,
      status,
      additions: stats.additions,
      deletions: stats.deletions,
      patch,
    });
  }

  return files;
}
