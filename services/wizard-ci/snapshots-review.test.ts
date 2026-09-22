import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { chmodSync, existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

const WORKBENCH = join(import.meta.dirname, "..", "..");

test("snapshot review publishes captured frames but reports failed assertions", () => {
  const temp = mkdtempSync(join(tmpdir(), "snapshot-review-test-"));
  const app = temp.split("/").at(-1)!;
  const reportDir = join("/tmp/wizard-snapshots", app);
  const fakeBin = join(temp, "bin");
  mkdirSync(fakeBin);
  const fakeNpx = join(fakeBin, "npx");
  writeFileSync(fakeNpx, `#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const script = process.argv[3];
if (script.endsWith("/snapshots.ts")) {
  const reportDir = path.join("/tmp/wizard-snapshots", path.basename(process.argv[4]));
  if (process.env.FAKE_CAPTURE_REPORT !== "false") {
    fs.mkdirSync(reportDir, { recursive: true });
    fs.writeFileSync(path.join(reportDir, "report.html"), "<html>captured</html>");
  }
  process.exit(Number(process.env.FAKE_E2E_EXIT || 1));
}
if (script.endsWith("/screenshot.ts")) {
  const shotsDir = process.argv[5];
  fs.mkdirSync(shotsDir, { recursive: true });
  fs.writeFileSync(path.join(shotsDir, "01-intro.png"), "png");
  fs.writeFileSync(path.join(shotsDir, "shots.json"), JSON.stringify([{frame:"01-intro.ans",file:"01-intro.png"}]));
  process.exit(0);
}
process.exit(2);
`);
  chmodSync(fakeNpx, 0o755);

  try {
    const result = spawnSync(process.execPath, ["--import", "tsx", "services/wizard-ci/snapshots-review.ts", app, "--dry-run"], {
      cwd: WORKBENCH,
      encoding: "utf8",
      env: { ...process.env, PATH: `${fakeBin}:${process.env.PATH}` },
    });
    assert.equal(result.status, 1, result.stderr);
    const review = join(reportDir, "review");
    assert.equal(existsSync(join(review, "01-intro.png")), true, result.stdout);
    assert.match(readFileSync(join(review, "PR_BODY.md"), "utf8"), /E2E assertions: FAIL/);

    const passed = spawnSync(process.execPath, ["--import", "tsx", "services/wizard-ci/snapshots-review.ts", app, "--dry-run"], {
      cwd: WORKBENCH,
      encoding: "utf8",
      env: { ...process.env, PATH: `${fakeBin}:${process.env.PATH}`, FAKE_E2E_EXIT: "0" },
    });
    assert.equal(passed.status, 0, passed.stderr);
    assert.match(readFileSync(join(review, "PR_BODY.md"), "utf8"), /E2E assertions: PASS/);

    // An earlier run's report must not be reused after a capture crash.
    const missing = spawnSync(process.execPath, ["--import", "tsx", "services/wizard-ci/snapshots-review.ts", app, "--dry-run"], {
      cwd: WORKBENCH,
      encoding: "utf8",
      env: { ...process.env, PATH: `${fakeBin}:${process.env.PATH}`, FAKE_CAPTURE_REPORT: "false" },
    });
    assert.equal(missing.status, 1, missing.stderr);
    assert.equal(existsSync(review), false);
  } finally {
    rmSync(reportDir, { recursive: true, force: true });
    rmSync(temp, { recursive: true, force: true });
  }
});
