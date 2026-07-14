import {
  cpSync,
  existsSync,
  lstatSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, relative, resolve, sep } from "node:path";
import type {
  ConsumerExpectation,
  DetectedProject,
  DetectionCase,
  DetectionReport,
  EvaluationResult,
  Mismatch,
} from "./types.js";
import { parseDetectionCase, validateCatalog } from "./schema.js";
import { compareReport } from "./compare/compare.js";
import { normalizeReport } from "./compare/normalize.js";
import { detectIntegrations, productionTargets } from "./wizard-runner.js";

const MANIFESTS = new Set([
  "package.json",
  "pyproject.toml",
  "requirements.txt",
  "setup.py",
  "Pipfile",
  "manage.py",
  "Gemfile",
  "composer.json",
  "Cargo.toml",
  "go.mod",
  "mix.exs",
  "pom.xml",
  "Package.swift",
  "Podfile",
  "project.yml",
  "pubspec.yaml",
  "build.gradle",
  "build.gradle.kts",
  "settings.gradle",
  "settings.gradle.kts",
]);
const IGNORED = new Set([
  "node_modules",
  "dist",
  "build",
  ".next",
  "out",
  "coverage",
  "vendor",
  ".venv",
  "target",
  "Pods",
  "Carthage",
  "DerivedData",
  ".git",
]);

function walk(
  root: string,
  current = root,
  found = new Set<string>()
): Set<string> {
  for (const entry of readdirSync(current)) {
    if (IGNORED.has(entry)) continue;
    const path = join(current, entry);
    const stat = lstatSync(path);
    if (stat.isSymbolicLink()) continue;
    if (stat.isDirectory()) walk(root, path, found);
    else if (
      MANIFESTS.has(entry) ||
      entry.endsWith(".csproj") ||
      entry === "project.pbxproj"
    ) {
      let project = dirname(path);
      if (
        entry === "project.pbxproj" &&
        basename(project).endsWith(".xcodeproj")
      )
        project = dirname(project);
      found.add(project);
    }
  }
  return found;
}

function hasPostHog(path: string): boolean {
  for (const file of readdirSync(path)) {
    if (
      !MANIFESTS.has(file) &&
      !file.endsWith(".csproj") &&
      file !== "project.pbxproj"
    )
      continue;
    try {
      if (/posthog/i.test(readFileSync(join(path, file), "utf8"))) return true;
    } catch {
      /* reported as a comparison mismatch */
    }
  }
  return false;
}

function detectRepoType(root: string): "single" | "monorepo" {
  if (
    ["pnpm-workspace.yaml", "turbo.json", "nx.json", "lerna.json"].some(
      (file) => existsSync(join(root, file))
    )
  )
    return "monorepo";
  const packageJson = join(root, "package.json");
  if (existsSync(packageJson))
    try {
      if (JSON.parse(readFileSync(packageJson, "utf8")).workspaces)
        return "monorepo";
    } catch {
      /* malformed input remains a fixture signal */
    }
  return "single";
}

function fixtureRelative(root: string, path: string): string {
  return relative(root, path).split(sep).join("/") || ".";
}

export function materialize(
  testCase: DetectionCase,
  workbenchRoot: string
): { root: string; cleanup(): void } {
  const source = resolve(workbenchRoot, testCase.fixture.path);
  if (!source.startsWith(resolve(workbenchRoot) + sep) || !existsSync(source))
    throw new Error(`fixture unavailable: ${testCase.fixture.path}`);
  if (!testCase.fixture.copyBeforeRun) return { root: source, cleanup() {} };
  const parent = mkdtempSync(
    join(tmpdir(), `wizard-detection-${testCase.id}-`)
  );
  const root = join(parent, "fixture");
  cpSync(source, root, { recursive: true, dereference: false });
  return {
    root,
    cleanup: () => rmSync(parent, { recursive: true, force: true }),
  };
}

export function validateTargets(testCase: DetectionCase): string[] {
  const integration = new Set(productionTargets("integration"));
  const sourceMaps = new Set(productionTargets("source-maps"));
  const errors: string[] = [];
  for (const consumer of testCase.consumers)
    for (const project of consumer.projects ?? []) {
      if (project.targetId === undefined || project.targetId === null) continue;
      const valid =
        consumer.profile === "source-maps" ? sourceMaps : integration;
      if (!valid.has(project.targetId))
        errors.push(
          `${testCase.id}/${consumer.profile}: invalid production target ${project.targetId}`
        );
    }
  return errors;
}

export function runRegistryCase(
  testCase: DetectionCase,
  workbenchRoot: string
): EvaluationResult[] {
  const consumer = testCase.consumers.find(
    (item) => item.profile === "registry-crosscheck"
  );
  if (!consumer) return [];
  const started = Date.now();
  const targetErrors = validateTargets(testCase);
  if (targetErrors.length)
    return [
      {
        caseId: testCase.id,
        profile: consumer.profile,
        mode: "registry-crosscheck",
        status: "failed",
        evidenceClass: "Deterministic integration-proven",
        checks: { schema: "failed" },
        mismatches: targetErrors.map((message) => ({
          field: "schema",
          severity: "critical",
          expected: "production target",
          actual: message,
          message,
        })),
        durationMs: Date.now() - started,
      },
    ];
  let materialized: ReturnType<typeof materialize> | undefined;
  try {
    materialized = materialize(testCase, workbenchRoot);
    const roots = [...walk(materialized.root)];
    const targets = detectIntegrations(roots);
    const projects: DetectedProject[] = roots.map((path, index) => ({
      path: fixtureRelative(materialized!.root, path),
      targetId: targets[index],
      hasPostHog: hasPostHog(path),
    }));
    const report: DetectionReport = normalizeReport({
      repoType: detectRepoType(materialized.root),
      projects,
    });
    const mismatches: Mismatch[] = [];
    if (consumer.expectedOutcome === "no-manifests" && projects.length !== 0)
      mismatches.push({
        field: "outcome",
        severity: "error",
        expected: "no-manifests",
        actual: "success",
        message: "manifest projects were detected",
      });
    if (consumer.expectedOutcome === "success" && projects.length === 0)
      mismatches.push({
        field: "outcome",
        severity: "error",
        expected: "success",
        actual: "no-manifests",
        message: "no manifest projects were detected",
      });
    mismatches.push(...compareReport(consumer, report));
    return [
      {
        caseId: testCase.id,
        profile: consumer.profile,
        mode: "registry-crosscheck",
        status: mismatches.some((item) => item.severity !== "warning")
          ? "failed"
          : "passed",
        evidenceClass: "Deterministic integration-proven",
        checks: {
          schema: "passed",
          discovery: mismatches.some((item) => item.field === "projectPresence")
            ? "failed"
            : "passed",
          classification: mismatches.some(
            (item) => item.field === "targetId" || item.field === "hasPostHog"
          )
            ? "failed"
            : "passed",
          recommendation: "skipped",
          selection: "skipped",
          liveEvidence: "blocked",
        },
        mismatches,
        durationMs: Date.now() - started,
      },
    ];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return [
      {
        caseId: testCase.id,
        profile: consumer.profile,
        mode: "registry-crosscheck",
        status: "failed",
        evidenceClass: "Deterministic integration-proven",
        checks: { infrastructure: "failed" },
        mismatches: [
          {
            field: "outcome",
            severity: "critical",
            expected: consumer.expectedOutcome,
            actual: "infrastructure-error",
            message,
          },
        ],
        durationMs: Date.now() - started,
      },
    ];
  } finally {
    materialized?.cleanup();
  }
}

/** Evaluate a corpus through one Wizard subprocess so detector timeout timers overlap. */
export function runRegistryCases(
  cases: DetectionCase[],
  workbenchRoot: string
): EvaluationResult[] {
  const prepared: Array<{
    testCase: DetectionCase;
    consumer: ConsumerExpectation;
    materialized: ReturnType<typeof materialize>;
    roots: string[];
    started: number;
  }> = [];
  const early: EvaluationResult[] = [];
  try {
    for (const testCase of cases) {
      const consumer = testCase.consumers.find(
        (item) => item.profile === "registry-crosscheck"
      );
      if (!consumer) continue;
      const errors = validateTargets(testCase);
      if (errors.length) {
        early.push({
          caseId: testCase.id,
          profile: consumer.profile,
          mode: "registry-crosscheck",
          status: "failed",
          evidenceClass: "Deterministic integration-proven",
          checks: { schema: "failed" },
          mismatches: errors.map((message) => ({
            field: "schema",
            severity: "critical",
            expected: "production target",
            actual: message,
            message,
          })),
          durationMs: 0,
        });
        continue;
      }
      try {
        const materialized = materialize(testCase, workbenchRoot);
        prepared.push({
          testCase,
          consumer,
          materialized,
          roots: [...walk(materialized.root)],
          started: Date.now(),
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        early.push({
          caseId: testCase.id,
          profile: consumer.profile,
          mode: "registry-crosscheck",
          status: "failed",
          evidenceClass: "Deterministic integration-proven",
          checks: { infrastructure: "failed" },
          mismatches: [
            {
              field: "outcome",
              severity: "critical",
              expected: consumer.expectedOutcome,
              actual: "infrastructure-error",
              message,
            },
          ],
          durationMs: 0,
        });
      }
    }
    const allRoots = prepared.flatMap((item) => item.roots);
    const allTargets = detectIntegrations(allRoots);
    let offset = 0;
    const results = prepared.map(
      ({ testCase, consumer, materialized, roots, started }) => {
        const targets = allTargets.slice(offset, offset + roots.length);
        offset += roots.length;
        const projects: DetectedProject[] = roots.map((path, index) => ({
          path: fixtureRelative(materialized.root, path),
          targetId: targets[index],
          hasPostHog: hasPostHog(path),
        }));
        const report = normalizeReport({
          repoType: detectRepoType(materialized.root),
          projects,
        });
        const mismatches: Mismatch[] = [];
        if (consumer.expectedOutcome === "no-manifests" && projects.length)
          mismatches.push({
            field: "outcome",
            severity: "error",
            expected: "no-manifests",
            actual: "success",
            message: "manifest projects were detected",
          });
        if (consumer.expectedOutcome === "success" && !projects.length)
          mismatches.push({
            field: "outcome",
            severity: "error",
            expected: "success",
            actual: "no-manifests",
            message: "no manifest projects were detected",
          });
        mismatches.push(...compareReport(consumer, report));
        return {
          caseId: testCase.id,
          profile: consumer.profile,
          mode: "registry-crosscheck" as const,
          status: mismatches.some((item) => item.severity !== "warning")
            ? ("failed" as const)
            : ("passed" as const),
          evidenceClass: "Deterministic integration-proven" as const,
          checks: {
            schema: "passed" as const,
            discovery: mismatches.some(
              (item) => item.field === "projectPresence"
            )
              ? ("failed" as const)
              : ("passed" as const),
            classification: mismatches.some(
              (item) => item.field === "targetId" || item.field === "hasPostHog"
            )
              ? ("failed" as const)
              : ("passed" as const),
            recommendation: "skipped" as const,
            selection: "skipped" as const,
            liveEvidence: "blocked" as const,
          },
          mismatches,
          durationMs: Date.now() - started,
        };
      }
    );
    return [...early, ...results];
  } finally {
    for (const item of prepared) item.materialized.cleanup();
  }
}

export function loadCases(directory: string): DetectionCase[] {
  const cases = readdirSync(directory)
    .filter((file) => file.endsWith(".json"))
    .sort()
    .map((file) =>
      parseDetectionCase(
        JSON.parse(readFileSync(join(directory, file), "utf8"))
      )
    );
  validateCatalog(cases);
  return cases;
}

export function expectation(
  testCase: DetectionCase,
  profile: ConsumerExpectation["profile"]
): ConsumerExpectation | undefined {
  return testCase.consumers.find((item) => item.profile === profile);
}
