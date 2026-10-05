import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import { mkdirSync, mkdtempSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { batchFileChanges, collectFileChanges, commitBatch } from "./api-commits.js";

test("large snapshot bundles retain every file in bounded commit requests", () => {
  const additions = Array.from({ length: 86 }, (_, i) => ({
    path: `.wizard-snapshots/express-todo/${i}.png`,
    contents: Buffer.alloc(42_000),
  }));
  const deletions = [{ path: ".wizard-snapshots/express-todo/old.png" }];

  const batches = batchFileChanges(additions, deletions);
  assert.ok(batches.length > 1);
  assert.ok(batches.every((batch) => batch.length <= 20));
  assert.ok(batches.every((batch) => batch.reduce((size, change) => size + change.bytes, 0) <= 750_000));
  assert.deepEqual(
    batches.flat().map((change) => change.value.path),
    [...additions.map((file) => file.path), ...deletions.map((file) => file.path)],
  );
});

test("symlinks in the working tree are skipped instead of read", () => {
  const repoRoot = mkdtempSync(join(tmpdir(), "api-commits-"));
  const git = (args: string) => execSync(`git ${args}`, { cwd: repoRoot, stdio: "pipe" });
  git("init -q");
  mkdirSync(join(repoRoot, "app/env/lib"), { recursive: true });
  writeFileSync(join(repoRoot, "app/main.py"), "print('hi')\n");
  writeFileSync(join(repoRoot, "app/env/lib/site.py"), "\n");
  symlinkSync("lib", join(repoRoot, "app/env/lib64"));

  const { additions } = collectFileChanges({ repoRoot, relativePath: "app" });
  assert.deepEqual(additions.map((file) => file.path).sort(), ["app/env/lib/site.py", "app/main.py"]);
});

function fakeOctokit(responses: Array<() => unknown>, branchHead: string) {
  let calls = 0;
  return {
    get calls() {
      return calls;
    },
    graphql: (async () => {
      const next = responses[calls++];
      return next();
    }) as never,
    rest: { git: { getRef: (async () => ({ data: { object: { sha: branchHead } } })) as never } },
  };
}

const httpError = (status: number) => Object.assign(new Error(`HTTP ${status}`), { status });
const target = { repoOwner: "PostHog", repoName: "wizard-workbench", branch: "ci/x", headOid: "base" };
const landed = { createCommitOnBranch: { commit: { oid: "new", url: "https://example.test/new" } } };

test("a 504 that did not write the commit is retried", async () => {
  const octokit = fakeOctokit([() => Promise.reject(httpError(504)), () => landed], "base");
  const commit = await commitBatch(octokit, target, {}, 0);
  assert.equal(commit.oid, "new");
  assert.equal(octokit.calls, 2);
});

test("a 504 after GitHub wrote the commit returns that commit instead of resending", async () => {
  const octokit = fakeOctokit([() => Promise.reject(httpError(504))], "written-by-github");
  const commit = await commitBatch(octokit, target, {}, 0);
  assert.equal(commit.oid, "written-by-github");
  assert.equal(octokit.calls, 1);
});

test("a 4xx from createCommitOnBranch is not retried", async () => {
  const octokit = fakeOctokit([() => Promise.reject(httpError(422))], "base");
  await assert.rejects(commitBatch(octokit, target, {}, 0), /HTTP 422/);
  assert.equal(octokit.calls, 1);
});

test("a commit that keeps returning 5xx gives up after three attempts", async () => {
  const fail = () => Promise.reject(httpError(502));
  const octokit = fakeOctokit([fail, fail, fail], "base");
  await assert.rejects(commitBatch(octokit, target, {}, 0), /HTTP 502/);
  assert.equal(octokit.calls, 3);
});
