import assert from "node:assert/strict";
import test from "node:test";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  evaluationExitCode,
  markdownSummary,
  writeArtifacts,
  type EvaluationArtifact,
} from "../reporting/reporter.js";

const artifact: EvaluationArtifact = {
  schemaVersion: 1,
  runId: "test",
  generatedAt: "2026-07-13T00:00:00Z",
  mode: "simulated",
  wizardSha: "wizard",
  workbenchSha: "workbench",
  reproductionCommand: "pnpm project-detection-eval --case mutated",
  rawArtifactPath: "results.json",
  liveClaims: "blocked-until-credentialed-isolated-run",
  results: [
    {
      caseId: "mutated",
      profile: "registry-crosscheck",
      mode: "simulated",
      status: "failed",
      evidenceClass: "Unit-proven",
      checks: { classification: "failed", liveEvidence: "blocked" },
      mismatches: [
        {
          field: "targetId",
          severity: "error",
          projectPath: "apps/web",
          expected: "nextjs",
          actual: "javascript_node",
          message: "target ID differs",
        },
      ],
      durationMs: 1,
    },
  ],
};

test("summary exposes the mismatch, mode, evidence, reproduction, artifact, and live boundary", () => {
  const markdown = markdownSummary(artifact);
  for (const value of [
    "FAIL mutated",
    "targetId",
    "nextjs",
    "javascript_node",
    "simulated",
    "Unit-proven",
    "pnpm project-detection-eval",
    "results.json",
    "remain blocked",
  ])
    assert.match(markdown, new RegExp(value));
});
test("writes parseable JSON and Markdown artifacts", () => {
  const dir = mkdtempSync(join(tmpdir(), "detection-report-"));
  try {
    writeArtifacts(dir, artifact);
    assert.equal(
      JSON.parse(readFileSync(join(dir, "results.json"), "utf8")).runId,
      "test"
    );
    assert.match(readFileSync(join(dir, "summary.md"), "utf8"), /FAIL mutated/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
test("returns the same sanitized artifact written to disk", () => {
  const dir = mkdtempSync(join(tmpdir(), "detection-report-redacted-"));
  try {
    const copy = structuredClone(artifact);
    copy.results[0].mismatches[0].message =
      "failed in /workspace/wizard/node_modules/.bin/tsx";
    const written = writeArtifacts(dir, copy, ["/workspace/wizard"]);
    const persisted = JSON.parse(
      readFileSync(join(dir, "results.json"), "utf8")
    );
    assert.deepEqual(written, persisted);
    assert.doesNotMatch(JSON.stringify(written), /\/workspace\/wizard/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
test("deliberate target mutation produces the intended field-level failure", () =>
  assert.equal(artifact.results[0].mismatches[0].field, "targetId"));
test("deliberate mutation drives the CI command to a nonzero exit", () =>
  assert.equal(evaluationExitCode(artifact), 1));
test("blocked checks are reported separately and exit nonzero", () => {
  const copy = structuredClone(artifact);
  copy.results[0].status = "blocked";
  const markdown = markdownSummary(copy);
  assert.match(markdown, /0 passed, 0 failed, 1 blocked/);
  assert.match(markdown, /BLOCKED mutated/);
  assert.equal(evaluationExitCode(copy), 1);
});
test("undefined mismatch values render without crashing", () => {
  const copy = structuredClone(artifact);
  copy.results[0].mismatches[0].actual = undefined;
  assert.match(markdownSummary(copy), /received ` undefined `\./);
});
test("malicious backticks cannot escape mismatch code spans", () => {
  const copy = structuredClone(artifact);
  copy.results[0].mismatches[0].actual = "`injected`";
  assert.match(markdownSummary(copy), /`` "`injected`" ``/);
});
test("model-controlled project paths cannot inject Markdown or new lines", () => {
  const copy = structuredClone(artifact);
  copy.results[0].mismatches[0].projectPath = "apps/`**injected**`\n# heading";
  const markdown = markdownSummary(copy);
  assert.match(markdown, /\(`` apps\/`\*\*injected\*\*` # heading ``\)/);
  assert.doesNotMatch(markdown, /\n# heading/);
});
test("detector error messages cannot inject Markdown or new lines", () => {
  const copy = structuredClone(artifact);
  copy.results[0].mismatches[0].message = "failed `breakout`\n# heading";
  const markdown = markdownSummary(copy);
  assert.match(markdown, /`` failed `breakout` # heading ``/);
  assert.doesNotMatch(markdown, /\n# heading/);
});
