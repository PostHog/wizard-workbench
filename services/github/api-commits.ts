/**
 * Commit-via-API: create signed commits using GitHub's createCommitOnBranch
 * GraphQL mutation, instead of `git commit` + `git push`.
 *
 * Commits created via the GraphQL mutation with an App installation token
 * are automatically signed by GitHub and pass branch protection rules that
 * require verified signatures.
 */
import { readFileSync } from "fs";
import { join } from "path";
import { Octokit } from "@octokit/rest";
import { getChangedFilesInPath } from "./git.js";

// ============================================================================
// Types
// ============================================================================

export interface FileAddition {
  path: string;
  contents: Buffer;
}

export interface FileDeletion {
  path: string;
}

export interface ApiCommitOptions {
  repoOwner: string;
  repoName: string;
  branch: string;
  baseSha: string;
  message: string;
  additions: FileAddition[];
  deletions: FileDeletion[];
  token: string;
}

export interface ApiCommitResult {
  commitSha: string;
  commitUrl: string;
}

export interface CollectChangesOptions {
  repoRoot: string;
  relativePath: string;
}

export interface CollectChangesResult {
  additions: FileAddition[];
  deletions: FileDeletion[];
}

// ============================================================================
// Working-tree → fileChanges
// ============================================================================

/**
 * Parse a `git status --porcelain` line into a {status, path} record.
 * Porcelain format: `XY <path>` where X is the index column and Y the
 * working-tree column. Renames look like `R<old> -> <new>`.
 */
interface PorcelainEntry {
  index: string;
  worktree: string;
  path: string;
  oldPath?: string;
}

function parsePorcelainLine(line: string): PorcelainEntry | null {
  if (line.length < 3) return null;
  const index = line[0];
  const worktree = line[1];
  const rest = line.slice(3);

  // Rename: "R<old> -> <new>" or "R  old -> new"
  if (index === "R" || worktree === "R") {
    const arrow = rest.indexOf(" -> ");
    if (arrow !== -1) {
      return {
        index,
        worktree,
        oldPath: rest.slice(0, arrow),
        path: rest.slice(arrow + 4),
      };
    }
  }

  return { index, worktree, path: rest };
}

/**
 * Inspect the working tree under `relativePath` and bucket each change into
 * `additions` (file should exist on the new commit) or `deletions` (file
 * should be removed).
 *
 * Wizard runs leave changes unstaged, so the index column is mostly empty.
 * We treat any present-on-disk file as an addition and any removed file as
 * a deletion, regardless of which column reports it.
 */
export function collectFileChanges(opts: CollectChangesOptions): CollectChangesResult {
  const { repoRoot, relativePath } = opts;
  const lines = getChangedFilesInPath(repoRoot, relativePath);

  const additions: FileAddition[] = [];
  const deletions: FileDeletion[] = [];
  const seen = new Set<string>();

  for (const line of lines) {
    const entry = parsePorcelainLine(line);
    if (!entry) continue;

    const status = (entry.index + entry.worktree).trim();
    const isDeletion = entry.index === "D" || entry.worktree === "D";
    const isRename = entry.index === "R" || entry.worktree === "R";

    if (isRename && entry.oldPath) {
      // Rename: delete old, add new
      if (!seen.has(entry.oldPath)) {
        deletions.push({ path: entry.oldPath });
        seen.add(entry.oldPath);
      }
      if (!seen.has(entry.path)) {
        additions.push({ path: entry.path, contents: readFileSync(join(repoRoot, entry.path)) });
        seen.add(entry.path);
      }
      continue;
    }

    if (isDeletion) {
      if (!seen.has(entry.path)) {
        deletions.push({ path: entry.path });
        seen.add(entry.path);
      }
      continue;
    }

    // Untracked, added, modified, type-changed: read from disk
    // Skip if status string is unexpected/empty
    if (status.length === 0 && entry.index !== "?" && entry.worktree !== "?") continue;

    if (!seen.has(entry.path)) {
      additions.push({ path: entry.path, contents: readFileSync(join(repoRoot, entry.path)) });
      seen.add(entry.path);
    }
  }

  return { additions, deletions };
}

// ============================================================================
// createCommitOnBranch mutation
// ============================================================================

const CREATE_COMMIT_MUTATION = `
  mutation($input: CreateCommitOnBranchInput!) {
    createCommitOnBranch(input: $input) {
      commit {
        oid
        url
      }
    }
  }
`;

interface CreateCommitResponse {
  createCommitOnBranch: {
    commit: {
      oid: string;
      url: string;
    };
  };
}

/**
 * Create a signed commit on a new branch via the GraphQL
 * createCommitOnBranch mutation.
 *
 * Steps:
 *   1. POST /repos/:owner/:repo/git/refs to create the branch ref at baseSha.
 *   2. Call createCommitOnBranch with fileChanges (base64-encoded contents).
 *
 * The mutation requires the branch ref to already exist. Commits created
 * via this path are auto-signed when authenticated with a GitHub App
 * installation token.
 */
export async function createSignedCommit(opts: ApiCommitOptions): Promise<ApiCommitResult> {
  const { repoOwner, repoName, branch, baseSha, message, additions, deletions, token } = opts;
  const octokit = new Octokit({ auth: token });

  // 1. Create the remote branch ref pointing at baseSha.
  await octokit.rest.git.createRef({
    owner: repoOwner,
    repo: repoName,
    ref: `refs/heads/${branch}`,
    sha: baseSha,
  });

  // 2. Create the signed commit on that branch.
  const response = await octokit.graphql<CreateCommitResponse>(CREATE_COMMIT_MUTATION, {
    input: {
      branch: {
        repositoryNameWithOwner: `${repoOwner}/${repoName}`,
        branchName: branch,
      },
      message: { headline: message },
      fileChanges: {
        additions: additions.map((a) => ({
          path: a.path,
          contents: a.contents.toString("base64"),
        })),
        deletions: deletions.map((d) => ({ path: d.path })),
      },
      expectedHeadOid: baseSha,
    },
  });

  return {
    commitSha: response.createCommitOnBranch.commit.oid,
    commitUrl: response.createCommitOnBranch.commit.url,
  };
}

// ============================================================================
// Repo identification
// ============================================================================

export interface RepoIdentity {
  owner: string;
  name: string;
}

/**
 * Resolve the GitHub repo identity (owner/name) for the current run.
 *
 * Priority:
 *   1. `GITHUB_REPOSITORY` env var (set by GitHub Actions).
 *   2. Parsing the origin remote URL.
 */
export function resolveRepoIdentity(remoteUrl: string | null): RepoIdentity | null {
  const fromEnv = process.env.GITHUB_REPOSITORY;
  if (fromEnv && fromEnv.includes("/")) {
    const [owner, name] = fromEnv.split("/");
    return { owner, name };
  }

  if (!remoteUrl) return null;

  // git@github.com:Owner/Repo.git  or  https://github.com/Owner/Repo(.git)
  const sshMatch = remoteUrl.match(/^git@github\.com:([^/]+)\/(.+?)(\.git)?$/);
  if (sshMatch) return { owner: sshMatch[1], name: sshMatch[2] };

  const httpsMatch = remoteUrl.match(/^https?:\/\/(?:[^@/]+@)?github\.com\/([^/]+)\/(.+?)(\.git)?\/?$/);
  if (httpsMatch) return { owner: httpsMatch[1], name: httpsMatch[2] };

  return null;
}
