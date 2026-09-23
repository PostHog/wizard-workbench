import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import { mkdirSync, mkdtempSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { batchFileChanges, collectFileChanges } from "./api-commits.js";

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
