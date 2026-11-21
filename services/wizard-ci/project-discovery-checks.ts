/**
 * Project-discovery monorepo E2E assertions.
 *
 * Loads `apps/<app>/.wizard-ci/e2e.json` (or `apps/project-discovery/expectations/<id>.e2e.json`
 * for fixtures under `project-discovery/`, including production git submodules),
 * resolves safe launch directories inside the `/tmp` copy, and grades the run's
 * outcome and monorepo diff scope.
 *
 * Everything in this module is pure aside from reading the spec file; `runE2e`
 * collects the result payload and `changedFiles`, and this module grades them.
 */

import { existsSync, readFileSync } from "node:fs";
import { basename, isAbsolute, join, normalize, relative, resolve } from "node:path";
import type { Check, E2eResult } from "./warehouse-checks.js";

export interface ProjectDiscoveryE2eProfile {
  plan?: string;
  notice?: "keep" | "decline";
}

export interface ProjectDiscoveryE2eExpectations {
  expectedOutcome?: "success" | "abort";
  expectAbort?: string | null;
  expectedTargetProject?: string;
  expectedFramework?: string;
  expectedFrameworkVariant?: string;
  expectedChangedPrefix?: string;
  forbidChangedPrefixes?: string[];
  forbidToolsInTarget?: string[];
  gateOnDeterministic?: string;
}

export interface ProjectDiscoveryExpect {
  id: string;
  fixture?: string;
  program?: string;
  summary?: string;
  flags: Record<string, string>;
  launchDir: string;
  profile: ProjectDiscoveryE2eProfile;
  expectations: ProjectDiscoveryE2eExpectations;
  /** Path to the loaded spec file, relative to `apps/`. */
  specPath: string;
}

export interface ProjectDiscoveryEvidence {
  expect: ProjectDiscoveryExpect;
  result:
    | (E2eResult & {
        hasPosthogDep?: boolean;
        envFile?: string | null;
      })
    | null;
  changedFileContentsByPath: Map<string, string>;
}

const POSTHOG_EVIDENCE_PATTERN = /posthog/i;

function normalizeRelPath(p: string): string {
  return p.replace(/\\/g, "/").replace(/^\.\//, "");
}

function normalizePrefix(prefix: string): string {
  const clean = normalizeRelPath(prefix);
  return clean.endsWith("/") ? clean : `${clean}/`;
}

/**
 * Resolve `launchDir` inside `rootDir` and reject absolute or escaping paths.
 */
export function resolveLaunchDir(rootDir: string, launchDir: string): string {
  const clean = launchDir.trim() || ".";
  if (clean === ".") return rootDir;
  if (isAbsolute(clean)) {
    throw new Error(`launchDir must be relative, got "${launchDir}"`);
  }
  const normalized = normalize(clean);
  const target = resolve(rootDir, normalized);
  const rel = relative(resolve(rootDir), target);
  if (rel.startsWith("..") || isAbsolute(rel)) {
    throw new Error(`launchDir "${launchDir}" escapes the fixture root`);
  }
  return target;
}

function findSpecFile(appsDir: string, app: string): { absPath: string; relPath: string } | null {
  const inlineRel = join(app, ".wizard-ci", "e2e.json");
  const inlineAbs = join(appsDir, inlineRel);
  if (existsSync(inlineAbs)) {
    return { absPath: inlineAbs, relPath: normalizeRelPath(inlineRel) };
  }

  if (app.startsWith("project-discovery/")) {
    const id = basename(app);
    const sharedRel = join("project-discovery", "expectations", `${id}.e2e.json`);
    const sharedAbs = join(appsDir, sharedRel);
    if (existsSync(sharedAbs)) {
      return { absPath: sharedAbs, relPath: normalizeRelPath(sharedRel) };
    }
  }

  return null;
}

function isStringRecord(value: unknown): value is Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return Object.values(value).every((v) => typeof v === "string");
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === "string" && v !== "");
}

export function loadProjectDiscoveryExpect(
  appsDir: string,
  app: string,
): ProjectDiscoveryExpect | null {
  const found = findSpecFile(appsDir, app);
  if (!found) return null;

  const raw = readFileSync(found.absPath, "utf8");
  const parsed = JSON.parse(raw) as Partial<ProjectDiscoveryExpect>;

  if (typeof parsed.id !== "string" || parsed.id.trim() === "") {
    throw new Error(`apps/${found.relPath} needs a non-empty "id"`);
  }
  if (parsed.flags !== undefined && !isStringRecord(parsed.flags)) {
    throw new Error(`apps/${found.relPath} "flags" must be a string map`);
  }
  if (parsed.launchDir !== undefined && typeof parsed.launchDir !== "string") {
    throw new Error(`apps/${found.relPath} "launchDir" must be a string`);
  }
  const launchDir = parsed.launchDir ?? ".";
  resolveLaunchDir("/fixture-root", launchDir);

  if (!parsed.expectations || typeof parsed.expectations !== "object") {
    throw new Error(`apps/${found.relPath} needs an "expectations" object`);
  }
  const exp = parsed.expectations;
  if (exp.forbidChangedPrefixes !== undefined && !isStringArray(exp.forbidChangedPrefixes)) {
    throw new Error(`apps/${found.relPath} "expectations.forbidChangedPrefixes" must be a string list`);
  }
  if (
    exp.expectedChangedPrefix !== undefined &&
    (typeof exp.expectedChangedPrefix !== "string" || exp.expectedChangedPrefix.trim() === "")
  ) {
    throw new Error(`apps/${found.relPath} "expectations.expectedChangedPrefix" must be a non-empty string`);
  }

  const profile = parsed.profile ?? {};
  if (
    profile.notice !== undefined &&
    profile.notice !== "keep" &&
    profile.notice !== "decline"
  ) {
    throw new Error(`apps/${found.relPath} "profile.notice" must be "keep" or "decline"`);
  }

  return {
    id: parsed.id,
    fixture: parsed.fixture,
    program: parsed.program,
    summary: parsed.summary,
    flags: parsed.flags ?? {},
    launchDir,
    profile: {
      plan: typeof profile.plan === "string" && profile.plan !== "" ? profile.plan : undefined,
      notice: profile.notice,
    },
    expectations: exp,
    specPath: found.relPath,
  };
}

function check(name: string, ok: boolean, detail: string): Check {
  return { name, ok, detail, advisory: false };
}

export function projectDiscoveryChecks(evidence: ProjectDiscoveryEvidence): Check[] {
  const { expect, result, changedFileContentsByPath } = evidence;
  const exp = expect.expectations;
  const checks: Check[] = [];

  const normalizedDiff = [...changedFileContentsByPath.entries()].map(
    ([filePath, contents]) => [normalizeRelPath(filePath), contents] as const,
  );

  if (exp.expectAbort) {
    const abort = result?.abort ?? "";
    checks.push(
      check(
        `aborted with "${exp.expectAbort}"`,
        abort.includes(exp.expectAbort),
        abort ? `abort="${abort}"` : "run did not abort",
      ),
    );
  } else {
    const aborted = Boolean(result?.abort);
    const completed = result?.runPhase === "completed";
    checks.push(
      check(
        "completed without abort",
        !aborted && completed,
        aborted
          ? `abort="${result?.abort}"`
          : `runPhase=${result?.runPhase ?? "missing"}`,
      ),
    );
  }

  if (exp.expectedChangedPrefix) {
    const prefix = normalizePrefix(exp.expectedChangedPrefix);
    const inTarget = normalizedDiff.filter(([filePath]) => filePath.startsWith(prefix));

    checks.push(
      check(
        `edits inside ${prefix}`,
        inTarget.length > 0,
        inTarget.length > 0
          ? inTarget.map(([filePath]) => filePath).sort().join(", ")
          : `no changed files under ${prefix}`,
      ),
    );

    if (!exp.expectAbort) {
      const posthogFiles = inTarget
        .filter(([filePath, contents]) =>
          POSTHOG_EVIDENCE_PATTERN.test(filePath) || POSTHOG_EVIDENCE_PATTERN.test(contents),
        )
        .map(([filePath]) => filePath)
        .sort();

      checks.push(
        check(
          `posthog wired inside ${prefix}`,
          posthogFiles.length > 0,
          posthogFiles.length > 0
            ? posthogFiles.join(", ")
            : `no changed file under ${prefix} mentions posthog`,
        ),
      );
    }
  }

  for (const rawForbid of exp.forbidChangedPrefixes ?? []) {
    const prefix = normalizePrefix(rawForbid);
    const leaked = normalizedDiff
      .filter(([filePath]) => filePath.startsWith(prefix))
      .map(([filePath]) => filePath)
      .sort();
    checks.push(
      check(
        `no edits under ${prefix}`,
        leaked.length === 0,
        leaked.length === 0 ? "clean" : `leaked: ${leaked.join(", ")}`,
      ),
    );
  }

  return checks;
}
