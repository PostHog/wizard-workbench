import assert from "node:assert/strict";
import {
  mkdtempSync,
  rmSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { trackedSourceDigest, untrackedSourceDigest } from "../source-state.js";

test("source digests include ordinary files without reading secret files or symlink targets", () => {
  const root = mkdtempSync(join(tmpdir(), "source-state-"));
  const outside = join(tmpdir(), `source-state-outside-${process.pid}`);
  try {
    writeFileSync(join(root, "source.ts"), "first");
    writeFileSync(join(root, ".env.local"), "first-secret");
    writeFileSync(outside, "first-outside");
    symlinkSync(outside, join(root, "outside-link"));
    assert.throws(
      () => untrackedSourceDigest(root, ["../outside"]),
      /escapes repository/
    );
    const first = untrackedSourceDigest(root, [
      "source.ts",
      ".env.local",
      "outside-link",
    ]);

    writeFileSync(join(root, ".env.local"), "second-secret");
    writeFileSync(outside, "second-outside");
    const excludedChanges = untrackedSourceDigest(root, [
      "source.ts",
      ".env.local",
      "outside-link",
    ]);
    assert.deepEqual(excludedChanges, first);

    writeFileSync(join(root, "source.ts"), "second");
    const sourceChange = untrackedSourceDigest(root, [
      "source.ts",
      ".env.local",
      "outside-link",
    ]);
    assert.notDeepEqual(sourceChange, first);
  } finally {
    rmSync(root, { recursive: true, force: true });
    try {
      unlinkSync(outside);
    } catch {
      /* already absent */
    }
  }
});

test("tracked source digests also exclude secret-named file contents", () => {
  const root = mkdtempSync(join(tmpdir(), "tracked-source-state-"));
  try {
    writeFileSync(join(root, "source.ts"), "first");
    writeFileSync(join(root, ".env.production"), "first-secret");
    const first = trackedSourceDigest(root, ["source.ts", ".env.production"]);

    writeFileSync(join(root, ".env.production"), "second-secret");
    assert.deepEqual(
      trackedSourceDigest(root, ["source.ts", ".env.production"]),
      first
    );

    writeFileSync(join(root, "source.ts"), "second");
    assert.notDeepEqual(
      trackedSourceDigest(root, ["source.ts", ".env.production"]),
      first
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
