import assert from "node:assert/strict";
import test from "node:test";
import { batchFileChanges } from "./api-commits.js";

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
