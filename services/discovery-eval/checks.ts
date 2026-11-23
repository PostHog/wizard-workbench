/**
 * Deterministic grading for `wizard --test-discovery=json` reports.
 *
 * Pure module: `services/discovery-eval/index.ts` spawns the wizard and reads
 * the JSON stdout; this module checks each scenario against its expected
 * goalpost in `services/discovery-eval/expectations/<name>.discovery.json`.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";

export type CheckStatus = "pass" | "fail" | "advisory";

export interface DiscoveryCheck {
  name: string;
  status: CheckStatus;
  detail: string;
}

export interface DiscoveryTestProject {
  path: string;
  traits: Record<string, unknown>;
  isRunProject: boolean;
  sources?: Record<string, unknown>;
  tools: string[];
  unsettled?: string[];
}

export interface DiscoveryTestReport {
  program: string;
  mode: string;
  runDir: string;
  rootDir: string;
  runProject: string;
  repoType: "monorepo" | "single";
  workspaceTool: string | null;
  walk: { files: number; complete: boolean; truncated: boolean };
  detection: {
    integration: string | null;
    label: string | null;
    posthogSdkDetected: boolean;
    discoveredFeatures: string[];
  };
  projects: DiscoveryTestProject[];
  toolsMatched: boolean;
  plan: {
    asks: boolean;
    picked: string;
    projects: Array<{
      path: string;
      offered: boolean;
      frameworkName?: string;
      mainApp?: boolean;
      reason?: string;
    }>;
  };
  matchKeys: Record<string, string[] | undefined>;
}

export interface DiscoveryScenarioExpect {
  /** Short label for this launch scenario (e.g. "from-root", "from-apps-web"). */
  name: string;
  /** Subdirectory inside the fixture to launch from. Default ".". */
  subdir?: string;
  /** Program subcommand to run (omit for default posthog-integration). */
  command?: string;
  /** Value for `wizard-project-discovery` flag override. Default "one-project". */
  mode?: "off" | "one-project" | "run-lists";
  repoType?: "monorepo" | "single";
  workspaceTool?: string | null;
  runProject?: string;
  walkComplete?: boolean;
  requiredProjects?: string[];
  forbiddenProjects?: string[];
  /** `{ "<projectPath>": { "<traitName>": expectedValue } }` */
  projectTraits?: Record<string, Record<string, unknown>>;
  /** Expected match keys on the run project (each expected value must be present). */
  matchKeys?: Record<string, string[]>;
  /** `{ "<projectPath>": ["Postgres", ...] }` — tools that must appear on that project. */
  projectTools?: Record<string, string[]>;
  /** `{ "<projectPath>": ["Postgres", ...] }` — tools that must NOT leak onto that project. */
  forbidProjectTools?: Record<string, string[]>;
  planAsks?: boolean;
  planPicked?: string;
  forbidPlanPicked?: string[];
  requiredPlanOffered?: string[];
  forbidPlanOffered?: string[];
  maxDurationMs?: number;
  /** Check names downgraded to `advisory` (reported, non-blocking unless `--strict`). */
  advisory?: string[];
}

export interface DiscoveryExpectFile {
  id: string;
  /** Path relative to `apps/project-discovery/` (e.g. "production/turbo-next-forge"). */
  fixture: string;
  kind: "production" | "custom";
  toolFamily: string;
  notes?: string;
  scenarios: DiscoveryScenarioExpect[];
}

export interface ScenarioResult {
  fixtureId: string;
  scenario: string;
  durationMs: number;
  checks: DiscoveryCheck[];
  error?: string;
}

function sameTraitValue(actual: unknown, expected: unknown): boolean {
  if (Array.isArray(expected)) {
    return (
      Array.isArray(actual) &&
      expected.every((item) => actual.includes(item)) &&
      actual.length === expected.length
    );
  }
  return actual === expected;
}

export function evaluateDiscoveryReport(
  report: DiscoveryTestReport,
  expect: DiscoveryScenarioExpect,
  durationMs: number,
  options: { strict?: boolean } = {},
): DiscoveryCheck[] {
  const advisorySet = new Set(options.strict ? [] : (expect.advisory ?? []));
  const checks: DiscoveryCheck[] = [];

  const record = (name: string, ok: boolean, detail: string): void => {
    const status: CheckStatus = ok
      ? "pass"
      : advisorySet.has(name)
        ? "advisory"
        : "fail";
    checks.push({ name, status, detail });
  };

  if (expect.repoType !== undefined) {
    record(
      "repoType",
      report.repoType === expect.repoType,
      `got ${JSON.stringify(report.repoType)}, expected ${JSON.stringify(expect.repoType)}`,
    );
  }

  if (expect.workspaceTool !== undefined) {
    record(
      "workspaceTool",
      report.workspaceTool === expect.workspaceTool,
      `got ${JSON.stringify(report.workspaceTool)}, expected ${JSON.stringify(expect.workspaceTool)}`,
    );
  }

  if (expect.runProject !== undefined) {
    record(
      "runProject",
      report.runProject === expect.runProject,
      `got ${JSON.stringify(report.runProject)}, expected ${JSON.stringify(expect.runProject)}`,
    );
  }

  if (expect.walkComplete !== undefined) {
    record(
      "walkComplete",
      report.walk.complete === expect.walkComplete,
      `complete=${String(report.walk.complete)} files=${report.walk.files}`,
    );
  }

  const projectsByPath = new Map(report.projects.map((p) => [p.path, p]));

  if (expect.requiredProjects && expect.requiredProjects.length > 0) {
    const missing = expect.requiredProjects.filter((p) => !projectsByPath.has(p));
    record(
      "requiredProjects",
      missing.length === 0,
      missing.length === 0
        ? `all ${expect.requiredProjects.length} required projects found`
        : `missing: ${missing.join(", ")}`,
    );
  }

  if (expect.forbiddenProjects && expect.forbiddenProjects.length > 0) {
    const present = expect.forbiddenProjects.filter((p) => projectsByPath.has(p));
    record(
      "forbiddenProjects",
      present.length === 0,
      present.length === 0
        ? "no excluded projects present"
        : `unexpectedly present: ${present.join(", ")}`,
    );
  }

  if (expect.projectTraits) {
    for (const [projPath, traitMap] of Object.entries(expect.projectTraits)) {
      const proj = projectsByPath.get(projPath);
      for (const [traitName, expectedVal] of Object.entries(traitMap)) {
        const checkName = `trait:${projPath}:${traitName}`;
        if (!proj) {
          record(checkName, false, `project ${projPath} not discovered`);
          continue;
        }
        const actualVal = proj.traits[traitName];
        record(
          checkName,
          sameTraitValue(actualVal, expectedVal),
          `got ${JSON.stringify(actualVal)}, expected ${JSON.stringify(expectedVal)}`,
        );
      }
    }
  }

  if (expect.matchKeys) {
    for (const [key, expectedVals] of Object.entries(expect.matchKeys)) {
      const actualVals = report.matchKeys[key];
      const ok =
        Array.isArray(actualVals) &&
        expectedVals.every((v) => actualVals.includes(v));
      record(
        `matchKey:${key}`,
        ok,
        `got ${JSON.stringify(actualVals)} (all keys: ${Object.keys(report.matchKeys).join(", ") || "none"}), expected ${JSON.stringify(expectedVals)}`,
      );
    }
  }

  if (expect.projectTools) {
    for (const [projPath, requiredTools] of Object.entries(expect.projectTools)) {
      const proj = projectsByPath.get(projPath);
      const checkName = `tools:${projPath}`;
      if (!proj) {
        record(checkName, false, `project ${projPath} not discovered`);
        continue;
      }
      const missing = requiredTools.filter((t) => !proj.tools.includes(t));
      record(
        checkName,
        missing.length === 0,
        missing.length === 0
          ? `found ${requiredTools.join(", ")}`
          : `missing ${missing.join(", ")} (got: ${proj.tools.join(", ") || "none"})`,
      );
    }
  }

  if (expect.forbidProjectTools) {
    for (const [projPath, forbiddenTools] of Object.entries(expect.forbidProjectTools)) {
      const proj = projectsByPath.get(projPath);
      const checkName = `forbidTools:${projPath}`;
      if (!proj) {
        record(checkName, false, `project ${projPath} not discovered`);
        continue;
      }
      const leaked = forbiddenTools.filter((t) => proj.tools.includes(t));
      record(
        checkName,
        leaked.length === 0,
        leaked.length === 0
          ? `none of ${forbiddenTools.join(", ")} leaked`
          : `leaked ${leaked.join(", ")} into ${projPath}`,
      );
    }
  }

  if (expect.planAsks !== undefined) {
    record(
      "planAsks",
      report.plan.asks === expect.planAsks,
      `got asks=${String(report.plan.asks)}, expected ${String(expect.planAsks)}`,
    );
  }

  if (expect.planPicked !== undefined) {
    record(
      "planPicked",
      report.plan.picked === expect.planPicked,
      `got picked=${JSON.stringify(report.plan.picked)}, expected ${JSON.stringify(expect.planPicked)}`,
    );
  }

  if (expect.forbidPlanPicked && expect.forbidPlanPicked.length > 0) {
    const forbiddenHit = expect.forbidPlanPicked.includes(report.plan.picked);
    record(
      "forbidPlanPicked",
      !forbiddenHit,
      forbiddenHit
        ? `picked forbidden default ${JSON.stringify(report.plan.picked)}`
        : `picked ${JSON.stringify(report.plan.picked)} (not in forbidden list)`,
    );
  }

  if (expect.requiredPlanOffered && expect.requiredPlanOffered.length > 0) {
    const offeredSet = new Set(
      report.plan.projects.filter((p) => p.offered).map((p) => p.path),
    );
    const missing = expect.requiredPlanOffered.filter((p) => !offeredSet.has(p));
    record(
      "requiredPlanOffered",
      missing.length === 0,
      missing.length === 0
        ? `all ${expect.requiredPlanOffered.length} subrepos offered on plan`
        : `missing from offered plan choices: ${missing.join(", ")}`,
    );
  }

  if (expect.forbidPlanOffered && expect.forbidPlanOffered.length > 0) {
    const offeredSet = new Set(
      report.plan.projects.filter((p) => p.offered).map((p) => p.path),
    );
    const bad = expect.forbidPlanOffered.filter((p) => offeredSet.has(p));
    record(
      "forbidPlanOffered",
      bad.length === 0,
      bad.length === 0
        ? "no forbidden projects offered in plan"
        : `offered non-app projects: ${bad.join(", ")}`,
    );
  }

  if (expect.maxDurationMs !== undefined) {
    record(
      "maxDurationMs",
      durationMs <= expect.maxDurationMs,
      `took ${durationMs}ms (limit ${expect.maxDurationMs}ms)`,
    );
  }

  return checks;
}

export function loadDiscoveryExpectations(
  expectationsDir: string,
): DiscoveryExpectFile[] {
  if (!existsSync(expectationsDir)) return [];
  return readdirSync(expectationsDir)
    .filter((f) => f.endsWith(".discovery.json"))
    .sort()
    .map((file) => {
      const fullPath = join(expectationsDir, file);
      const parsed = JSON.parse(readFileSync(fullPath, "utf8")) as DiscoveryExpectFile;
      if (!parsed.id || !parsed.fixture || !Array.isArray(parsed.scenarios)) {
        throw new Error(`Invalid discovery expectation file: ${basename(file)}`);
      }
      return parsed;
    });
}

export function hasBlockingFailure(checks: readonly DiscoveryCheck[]): boolean {
  return checks.some((c) => c.status === "fail");
}
