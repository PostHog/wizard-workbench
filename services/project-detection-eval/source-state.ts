import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, lstatSync, readFileSync, readlinkSync } from "node:fs";
import { basename, join, resolve, sep } from "node:path";

export type SourceState = {
  sha: string;
  dirty: boolean;
  workingTreeDigest?: string;
};

function git(cwd: string, args: string[]): Buffer {
  return execFileSync("git", args, {
    cwd,
    encoding: "buffer",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function sensitiveSourcePath(path: string): boolean {
  const normalized = path.replaceAll("\\", "/").toLowerCase();
  const name = basename(path).toLowerCase();
  return (
    /^\.env(?:\.|$)/.test(name) ||
    [
      ".npmrc",
      ".pypirc",
      ".netrc",
      "credentials.json",
      "id_rsa",
      "id_ed25519",
    ].includes(name) ||
    /\.(?:key|pem|p12|pfx)$/.test(name) ||
    /(?:^|\/)\.ssh\//.test(normalized) ||
    /(?:^|\/)\.aws\/(?:credentials|config)$/.test(normalized) ||
    /(?:^|\/)\.(?:docker\/config\.json|kube\/config)$/.test(normalized) ||
    /service[-_]account.*\.json$/.test(name)
  );
}

/** Hash local paths without following symlinks or reading secret-named files. */
function sourcePathDigest(
  cwd: string,
  paths: string[],
  kind: "tracked" | "untracked"
): Buffer {
  const hash = createHash("sha256");
  const root = resolve(cwd);
  for (const path of [...paths].sort()) {
    const fullPath = resolve(root, path);
    if (fullPath !== root && !fullPath.startsWith(root + sep))
      throw new Error(`source path escapes repository: ${path}`);
    hash.update(`\0${kind}\0`);
    hash.update(path);
    hash.update("\0");
    if (sensitiveSourcePath(path)) {
      hash.update("sensitive-content-excluded");
    } else {
      try {
        const stat = lstatSync(fullPath);
        hash.update(`mode:${stat.mode}\0`);
        if (stat.isSymbolicLink()) {
          hash.update("symlink\0");
          hash.update(readlinkSync(fullPath));
        } else if (stat.isFile()) {
          hash.update(readFileSync(fullPath));
        } else if (stat.isDirectory() && existsSync(join(fullPath, ".git"))) {
          hash.update("gitlink\0");
          hash.update(git(fullPath, ["rev-parse", "HEAD"]));
        } else {
          hash.update("unsupported-entry");
        }
      } catch (error) {
        const code = (error as NodeJS.ErrnoException).code;
        if (code !== "ENOENT") throw error;
        hash.update("deleted");
      }
    }
  }
  return hash.digest();
}

export function untrackedSourceDigest(cwd: string, paths: string[]): Buffer {
  return sourcePathDigest(cwd, paths, "untracked");
}

export function trackedSourceDigest(cwd: string, paths: string[]): Buffer {
  return sourcePathDigest(cwd, paths, "tracked");
}

/** Identify both the committed baseline and any local code evaluated on top. */
export function sourceState(cwd: string): SourceState {
  const sha = git(cwd, ["rev-parse", "HEAD"]).toString("utf8").trim();
  const status = git(cwd, [
    "status",
    "--porcelain=v1",
    "-z",
    "--untracked-files=all",
  ]);
  if (status.length === 0) return { sha, dirty: false };

  const hash = createHash("sha256");
  hash.update(status);
  const tracked = git(cwd, [
    "diff",
    "--name-only",
    "-z",
    "--no-renames",
    "--no-ext-diff",
    "HEAD",
    "--",
  ])
    .toString("utf8")
    .split("\0")
    .filter(Boolean);
  hash.update(trackedSourceDigest(cwd, tracked));
  const untracked = git(cwd, [
    "ls-files",
    "--others",
    "--exclude-standard",
    "-z",
  ])
    .toString("utf8")
    .split("\0")
    .filter(Boolean)
    .sort();
  hash.update(untrackedSourceDigest(cwd, untracked));
  return {
    sha,
    dirty: true,
    workingTreeDigest: `sha256:${hash.digest("hex")}`,
  };
}
