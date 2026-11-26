import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { join } from "node:path";
import {
  evaluateDiscoveryReport,
  hasBlockingFailure,
  loadDiscoveryExpectations,
  readDiscoveryReport,
  type DiscoveryTestReport,
} from "./checks.js";

function sampleReport(
  overrides: Partial<DiscoveryTestReport> = {},
): DiscoveryTestReport {
  return {
    program: "posthog-integration",
    mode: "one-project",
    runDir: "/tmp/repo",
    rootDir: "/tmp/repo",
    runProject: ".",
    repoType: "monorepo",
    workspaceTool: "pnpm",
    walk: { files: 24, complete: true, truncated: false },
    detection: {
      integration: "nextjs",
      label: "Next.js",
      posthogSdkDetected: false,
      discoveredFeatures: [],
    },
    projects: [
      {
        path: "apps/web",
        isRunProject: false,
        traits: {
          framework: "nextjs",
          frameworkVariant: "pages-router",
          posthogInstalled: "no",
        },
        tools: [],
      },
      {
        path: "apps/api",
        isRunProject: false,
        traits: {
          framework: "fastapi",
          posthogInstalled: "yes",
          callsLlmApi: "yes",
        },
        tools: ["Postgres"],
      },
    ],
    toolsMatched: true,
    projectSelection: {
      asks: true,
      selectedProjectPath: "apps/web",
      projects: [
        { path: "apps/web", eligible: true, frameworkName: "Next.js", isMainApp: true },
        { path: "apps/api", eligible: true, frameworkName: "FastAPI" },
      ],
    },
    matchKeys: {
      framework: ["nextjs"],
      frameworkVariant: ["pages-router"],
    },
    ...overrides,
  };
}

describe("evaluateDiscoveryReport", () => {
  it("passes when every expectation matches", () => {
    const checks = evaluateDiscoveryReport(
      sampleReport(),
      {
        name: "root",
        repoType: "monorepo",
        workspaceTool: "pnpm",
        runProject: ".",
        requiredProjects: ["apps/web", "apps/api"],
        forbiddenProjects: ["apps/legacy/old-app"],
        projectTraits: {
          "apps/api": { posthogInstalled: "yes", callsLlmApi: "yes" },
          "apps/web": { frameworkVariant: "pages-router" },
        },
        matchKeys: { frameworkVariant: ["pages-router"] },
        projectTools: { "apps/api": ["Postgres"] },
        forbidProjectTools: { "apps/web": ["Postgres"] },
        planAsks: true,
        planPicked: "apps/web",
        requiredPlanOffered: ["apps/web", "apps/api"],
        forbidPlanPicked: ["."],
        maxDurationMs: 5000,
      },
      420,
    );

    assert.equal(hasBlockingFailure(checks), false);
    assert.ok(checks.every((c) => c.status === "pass"));
  });

  it("fails on frameworkVariant matchKey mismatch, missing traits, and leaked tools", () => {
    const broken = sampleReport({
      matchKeys: { framework: ["nextjs"], variant: ["pages-router"] },
      projects: [
        {
          path: "apps/web",
          isRunProject: true,
          traits: { framework: "nextjs" },
          tools: ["Postgres"],
        },
        {
          path: "apps/api",
          isRunProject: false,
          traits: { framework: "fastapi", posthogInstalled: "no" },
          tools: [],
        },
      ],
      projectSelection: {
        asks: true,
        selectedProjectPath: ".",
        projects: [
          { path: ".", eligible: true },
          { path: "apps/web", eligible: true },
        ],
      },
    });

    const checks = evaluateDiscoveryReport(
      broken,
      {
        name: "broken",
        matchKeys: { frameworkVariant: ["pages-router"] },
        projectTraits: { "apps/api": { posthogInstalled: "yes" } },
        forbidProjectTools: { "apps/web": ["Postgres"] },
        forbidPlanPicked: ["."],
      },
      900,
    );

    const byName = new Map(checks.map((c) => [c.name, c.status]));
    assert.equal(byName.get("matchKey:frameworkVariant"), "fail");
    assert.equal(byName.get("trait:apps/api:posthogInstalled"), "fail");
    assert.equal(byName.get("forbidTools:apps/web"), "fail");
    assert.equal(byName.get("forbidPlanPicked"), "fail");
    assert.equal(hasBlockingFailure(checks), true);
  });

  it("downgrades advisory checks unless strict mode is enabled", () => {
    const report = sampleReport({ repoType: "single", workspaceTool: null });
    const expect = {
      name: "rush",
      repoType: "monorepo" as const,
      workspaceTool: "rush",
      advisory: ["repoType", "workspaceTool"],
    };

    const nonStrict = evaluateDiscoveryReport(report, expect, 200);
    assert.equal(hasBlockingFailure(nonStrict), false);
    assert.ok(nonStrict.every((c) => c.status === "advisory"));

    const strict = evaluateDiscoveryReport(report, expect, 200, { strict: true });
    assert.equal(hasBlockingFailure(strict), true);
    assert.ok(strict.every((c) => c.status === "fail"));
  });

  it("fails a plan reason when the row is missing, eligible, or has another reason", () => {
    const report = sampleReport({
      projectSelection: {
        asks: false,
        selectedProjectPath: "apps/admin",
        projects: [
          { path: "apps/admin", eligible: true },
          { path: "apps/web", eligible: false, exclusionReason: "has-posthog" },
          { path: "packages/ui", eligible: false, exclusionReason: "unsupported-framework" },
        ],
      },
    });

    const checks = evaluateDiscoveryReport(
      report,
      {
        name: "reasons",
        planReasons: {
          "apps/web": "has-posthog",
          "packages/ui": "library",
          "apps/admin": "has-posthog",
          "apps/docs": "library",
        },
      },
      200,
    );

    const byName = new Map(checks.map((c) => [c.name, c.status]));
    assert.equal(byName.get("planReason:apps/web"), "pass");
    assert.equal(byName.get("planReason:packages/ui"), "fail");
    assert.equal(byName.get("planReason:apps/admin"), "fail");
    assert.equal(byName.get("planReason:apps/docs"), "fail");
  });

  it("reads the selection from a report that uses the older names", () => {
    const { projectSelection, ...rest } = sampleReport();
    const older = readDiscoveryReport({
      ...rest,
      plan: {
        asks: projectSelection.asks,
        picked: projectSelection.selectedProjectPath,
        projects: [
          { path: "apps/web", offered: true, frameworkName: "Next.js", mainApp: true },
          { path: "apps/api", offered: false, reason: "has-posthog" },
        ],
      },
    });
    assert.equal("plan" in older, false);
    assert.deepEqual(older.projectSelection, {
      asks: projectSelection.asks,
      selectedProjectPath: projectSelection.selectedProjectPath,
      projects: [
        { path: "apps/web", frameworkName: "Next.js", eligible: true, isMainApp: true },
        { path: "apps/api", eligible: false, exclusionReason: "has-posthog" },
      ],
    });
    assert.deepEqual(readDiscoveryReport(sampleReport()).projectSelection, projectSelection);
    assert.throws(() => readDiscoveryReport(rest), /no `projectSelection`/);
  });

  it("loads all checked-in discovery expectations without schema errors", () => {
    const dir = join(import.meta.dirname, "expectations");
    const files = loadDiscoveryExpectations(dir);
    assert.ok(files.length >= 10, `expected >=10 expectation files, got ${files.length}`);
    for (const file of files) {
      assert.ok(file.scenarios.length >= 1, `${file.id} needs at least one scenario`);
    }
  });
});
