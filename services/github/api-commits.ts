/**
 * Commit-via-API: create signed commits using GitHub's createCommitOnBranch
 * GraphQL mutation, instead of `git commit` + `git push`.
 *
 * Commits created via the GraphQL mutation with an App installation token
 * are automatically signed by GitHub and pass branch protection rules that
 * require verified signatures.
 */
import { execSync } from "child_process";
import { lstatSync, readFileSync } from "fs";
import { join } from "path";
import { Octokit } from "@octokit/rest";

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

interface PorcelainEntry {
  index: string;
  worktree: string;
  path: string;
  oldPath?: string;
}

/**
 * Read porcelain v1 entries scoped to `relativePath`, using -z (NUL-
 * separated) so the parser doesn't have to worry about whitespace in
 * paths or about a leading-space first line getting trimmed.
 *
 * Each entry from -z output is `XY <space> <path>` (no newline). Renames
 * use TWO records: the first record (new path), then the next (old path).
 */
function readPorcelainEntries(repoRoot: string, relativePath: string): PorcelainEntry[] {
  // -uall expands untracked directories to individual files; without it,
  // an untracked dir appears as a single trailing-slash entry that would
  // make readFileSync fail with EISDIR.
  const raw = execSync(`git status -z -uall --porcelain=v1 -- "${relativePath}"`, {
    cwd: repoRoot,
    encoding: "utf-8",
    stdio: "pipe",
  });

  const records = raw.split("\0").filter((r) => r.length > 0);
  const entries: PorcelainEntry[] = [];

  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    if (record.length < 3) continue;
    const index = record[0];
    const worktree = record[1];
    const path = record.slice(3);

    if (index === "R" || worktree === "R") {
      // Next record is the old path
      const oldPath = records[++i];
      entries.push({ index, worktree, path, oldPath });
      continue;
    }
    entries.push({ index, worktree, path });
  }

  return entries;
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
  const entries = readPorcelainEntries(repoRoot, relativePath);

  const additions: FileAddition[] = [];
  const deletions: FileDeletion[] = [];
  const seen = new Set<string>();

  const addFile = (path: string) => {
    if (seen.has(path)) return;
    seen.add(path);
    const absolute = join(repoRoot, path);
    // createCommitOnBranch can only write regular files. Symlinks (like the
    // `lib64 -> lib` link a Python venv creates) and nested repos still show
    // up in git status, and readFileSync would follow them into a directory
    // and throw EISDIR.
    if (!lstatSync(absolute).isFile()) {
      console.warn(`      Skipping non-regular file: ${path}`);
      return;
    }
    additions.push({ path, contents: readFileSync(absolute) });
  };

  for (const entry of entries) {
    const isDeletion = entry.index === "D" || entry.worktree === "D";
    const isRename = entry.index === "R" || entry.worktree === "R";

    if (isRename && entry.oldPath) {
      if (!seen.has(entry.oldPath)) {
        deletions.push({ path: entry.oldPath });
        seen.add(entry.oldPath);
      }
      addFile(entry.path);
      continue;
    }

    if (isDeletion) {
      if (!seen.has(entry.path)) {
        deletions.push({ path: entry.path });
        seen.add(entry.path);
      }
      continue;
    }

    addFile(entry.path);
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

type BatchedChange =
  | { kind: "addition"; value: FileAddition; bytes: number }
  | { kind: "deletion"; value: FileDeletion; bytes: number };

/** Keep each GraphQL mutation small enough for large snapshot reviews. */
export function batchFileChanges(
  additions: FileAddition[],
  deletions: FileDeletion[],
  maxBytes = 750_000,
  maxFiles = 20,
): BatchedChange[][] {
  const changes: BatchedChange[] = [
    ...additions.map((value) => ({
      kind: "addition" as const,
      value,
      bytes: Math.ceil(value.contents.length / 3) * 4,
    })),
    ...deletions.map((value) => ({
      kind: "deletion" as const,
      value,
      bytes: value.path.length,
    })),
  ];
  const batches: BatchedChange[][] = [];
  let batch: BatchedChange[] = [];
  let bytes = 0;
  for (const change of changes) {
    if (batch.length && (batch.length >= maxFiles || bytes + change.bytes > maxBytes)) {
      batches.push(batch);
      batch = [];
      bytes = 0;
    }
    batch.push(change);
    bytes += change.bytes;
  }
  if (batch.length) batches.push(batch);
  return batches;
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

  // GraphQL commits carry every file as base64 inside one request. Snapshot
  // reviews can contain hundreds of frames, and one giant mutation times out
  // at GitHub's edge. Each batch becomes a GitHub-signed commit on the same
  // branch, with the previous commit as its expected head.
  const batches = batchFileChanges(additions, deletions);

  let headOid = baseSha;
  let commitUrl = "";
  for (const [index, group] of batches.entries()) {
    const response = await octokit.graphql<CreateCommitResponse>(CREATE_COMMIT_MUTATION, {
      input: {
        branch: {
          repositoryNameWithOwner: `${repoOwner}/${repoName}`,
          branchName: branch,
        },
        message: { headline: batches.length === 1 ? message : `${message} (${index + 1}/${batches.length})` },
        fileChanges: {
          additions: group.filter((change) => change.kind === "addition").map((change) => ({
            path: change.value.path,
            contents: change.value.contents.toString("base64"),
          })),
          deletions: group.filter((change) => change.kind === "deletion").map((change) => ({ path: change.value.path })),
        },
        expectedHeadOid: headOid,
      },
    });
    headOid = response.createCommitOnBranch.commit.oid;
    commitUrl = response.createCommitOnBranch.commit.url;
  }

  return { commitSha: headOid, commitUrl };
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
