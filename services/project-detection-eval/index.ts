#!/usr/bin/env node
import { join, resolve } from "node:path";
import { loadCases, runRegistryCases } from "./evaluator.js";
import {
  evaluationExitCode,
  writeArtifacts,
  type EvaluationArtifact,
} from "./reporting/reporter.js";
import { productionRuntime, wizardPath } from "./wizard-runner.js";
import { sourceState } from "./source-state.js";

function valueAfter(args: string[], name: string): string | undefined {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

const root = resolve(import.meta.dirname, "../..");
const args = process.argv.slice(2);
const json = args.includes("--json");
const optionValues = new Set(
  ["--case", "--output-dir"]
    .map((name) => valueAfter(args, name))
    .filter((value): value is string => value !== undefined)
);
const caseId =
  valueAfter(args, "--case") ??
  args.find((arg) => !arg.startsWith("--") && !optionValues.has(arg));
const outputDir = resolve(
  valueAfter(args, "--output-dir") ??
    join(
      root,
      "artifacts",
      "project-detection-eval",
      new Date().toISOString().replaceAll(/[:.]/g, "-")
    )
);
const wizardRoot = wizardPath();
const wizardSource = sourceState(wizardRoot);
const workbenchSource = sourceState(root);
const cases = loadCases(join(import.meta.dirname, "cases")).filter(
  (item) => !caseId || item.id === caseId
);
if (!cases.length)
  throw new Error(caseId ? `Unknown case: ${caseId}` : "No cases found");

const artifact: EvaluationArtifact = {
  schemaVersion: 1,
  runId: `local-${Date.now()}`,
  generatedAt: new Date().toISOString(),
  mode: "registry-crosscheck",
  wizardSha: wizardSource.sha,
  workbenchSha: workbenchSource.sha,
  wizardSource,
  workbenchSource,
  runtime: productionRuntime(),
  reproductionCommand: `WIZARD_PATH="$WIZARD_REPO" pnpm project-detection-eval${
    caseId ? ` --case ${caseId}` : ""
  } --output-dir "$OUTPUT_DIR"`,
  rawArtifactPath: "results.json",
  liveClaims: "blocked-until-credentialed-isolated-run",
  results: runRegistryCases(cases, root),
};

const sanitizedArtifact = writeArtifacts(outputDir, artifact, [wizardRoot]);
console.log(
  json
    ? JSON.stringify(sanitizedArtifact, null, 2)
    : `${artifact.results.filter((result) => result.status === "passed").length}/${artifact.results.length} checks passed\nArtifacts: ${outputDir}`
);
process.exitCode = evaluationExitCode(artifact);
