import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { EvaluationResult } from "../types.js";
import { redactValue } from "./redaction.js";
import type { SourceState } from "../source-state.js";

export type EvaluationArtifact = {
  schemaVersion: 1;
  runId: string;
  generatedAt: string;
  mode: "registry-crosscheck" | "simulated";
  wizardSha: string;
  workbenchSha: string;
  wizardSource?: SourceState;
  workbenchSource?: SourceState;
  reproductionCommand: string;
  rawArtifactPath: "results.json";
  liveClaims: "blocked-until-credentialed-isolated-run";
  results: EvaluationResult[];
};

export function markdownSummary(artifact: EvaluationArtifact): string {
  const passed = artifact.results.filter(
    (result) => result.status === "passed"
  );
  const failed = artifact.results.filter(
    (result) => result.status === "failed"
  );
  const blocked = artifact.results.filter(
    (result) => result.status === "blocked"
  );
  const lines = [
    "# Project detection evaluation",
    "",
    `${artifact.results.length} checks: ${passed.length} passed, ${failed.length} failed, ${blocked.length} blocked.`,
    "",
    `Mode: \`${artifact.mode}\` · Wizard: \`${artifact.wizardSha}\` · Workbench: \`${artifact.workbenchSha}\``,
    "",
  ];
  if (artifact.wizardSource?.dirty || artifact.workbenchSource?.dirty) {
    lines.push(
      `Local source: Wizard ${
        artifact.wizardSource?.workingTreeDigest ?? "clean"
      }; Workbench ${artifact.workbenchSource?.workingTreeDigest ?? "clean"}.`,
      ""
    );
  }
  lines.push("Executed runtime: deterministic Wizard framework registry.", "");
  lines.push(
    "> Live model accuracy, recommendation quality, observed tool discipline, latency/cost/stability, and production-path isolation remain blocked.",
    ""
  );
  lines.push(
    `Reproduce: \`${artifact.reproductionCommand}\``,
    "",
    `Raw artifact: \`${artifact.rawArtifactPath}\``,
    ""
  );
  for (const result of artifact.results) {
    const label =
      result.status === "passed"
        ? "PASS"
        : result.status === "blocked"
        ? "BLOCKED"
        : "FAIL";
    lines.push(
      `## ${label} ${result.caseId} / ${result.profile}${
        result.attempt ? ` / attempt ${result.attempt}` : ""
      }`,
      ""
    );
    lines.push(`Evidence: ${result.evidenceClass}.`, "");
    if (result.fieldEvidence) {
      lines.push("| Field | Evidence |", "| --- | --- |");
      for (const [field, evidence] of Object.entries(result.fieldEvidence))
        lines.push(`| ${field} | ${evidence} |`);
      lines.push("");
    }
    if (!result.mismatches.length) lines.push("No mismatches.", "");
    for (const mismatch of result.mismatches)
      lines.push(
        `- **${mismatch.severity} ${mismatch.field}${
          mismatch.projectPath ? ` (${inlineCode(mismatch.projectPath)})` : ""
        }:** ${inlineCode(mismatch.message)}; expected ${renderValue(
          mismatch.expected
        )}, received ${renderValue(mismatch.actual)}.`
      );
    lines.push("");
  }
  return lines.join("\n");
}

function inlineCode(value: string): string {
  const singleLine = value.replace(/[\r\n]+/g, " ");
  const longest = Math.max(
    0,
    ...Array.from(singleLine.matchAll(/`+/g), (match) => match[0].length)
  );
  const fence = "`".repeat(longest + 1);
  return `${fence} ${singleLine} ${fence}`;
}

function renderValue(value: unknown): string {
  const serialized = JSON.stringify(value);
  return inlineCode(serialized === undefined ? String(value) : serialized);
}

export function writeArtifacts(
  outputDir: string,
  artifact: EvaluationArtifact,
  additionalRedactionRoots: string[] = []
): EvaluationArtifact {
  mkdirSync(outputDir, { recursive: true });
  const sanitized = redactValue(
    artifact,
    process.cwd(),
    additionalRedactionRoots
  ) as EvaluationArtifact;
  writeFileSync(
    join(outputDir, "results.json"),
    `${JSON.stringify(sanitized, null, 2)}\n`
  );
  writeFileSync(
    join(outputDir, "summary.md"),
    `${markdownSummary(sanitized)}\n`
  );
  return sanitized;
}

export function evaluationExitCode(artifact: EvaluationArtifact): 0 | 1 {
  if (artifact.results.some((result) => result.status !== "passed")) return 1;
  return 0;
}
