import assert from "node:assert/strict";
import test from "node:test";
import { compareReport, compareToolPolicy } from "../compare/compare.js";
import { normalizeReport } from "../compare/normalize.js";
import type { ConsumerExpectation, DetectionReport } from "../types.js";

const expected: ConsumerExpectation = {
  profile: "headless-integration",
  expectedOutcome: "success",
  repoType: "monorepo",
  projects: [
    {
      path: "apps/web",
      presence: "required",
      targetId: "nextjs",
      hasPostHog: false,
    },
  ],
  recommendation: {
    required: true,
    acceptablePaths: ["apps/web"],
    forbiddenPaths: ["packages/docs"],
    rationale: "primary client",
  },
  selectedPath: {
    acceptablePaths: ["apps/web"],
    expectedStrategy: "recommended",
  },
};
const report: DetectionReport = {
  repoType: "monorepo",
  projects: [
    {
      path: "apps/web",
      framework: "Next.js",
      targetId: "nextjs",
      hasPostHog: false,
      recommended: true,
    },
  ],
  selectedPath: "apps/web",
  selectedStrategy: "recommended",
};

test("matching report has no mismatches", () =>
  assert.deepEqual(compareReport(expected, report), []));
test("reports every field mismatch", () => {
  const mismatches = compareReport(expected, {
    repoType: "single",
    projects: [
      {
        path: "packages/docs",
        targetId: "javascript_web",
        hasPostHog: true,
        recommended: true,
      },
    ],
    selectedPath: "packages/docs",
    selectedStrategy: "first-instrumentable",
  });
  assert.deepEqual(
    new Set(mismatches.map((item) => item.field)),
    new Set([
      "repoType",
      "projectPresence",
      "recommendation",
      "selectedPath",
      "selectedStrategy",
    ])
  );
});
test("multiple recommendations hard-fail", () =>
  assert.equal(
    compareReport(expected, {
      ...report,
      projects: [
        ...report.projects,
        {
          path: "apps/mobile",
          targetId: "react-native",
          hasPostHog: false,
          recommended: true,
        },
      ],
    }).find((item) => item.field === "recommendation")?.severity,
    "critical"
  ));
test("every tool outside the read-only allowlist hard-fails", () => {
  for (const tool of [
    "Write",
    "Edit",
    "Bash",
    "WebFetch",
    "WebSearch",
    "Agent",
    "TaskCreate",
    "mcp__posthog__query",
    "mcp__wizard-tools__read_file",
    "UnknownTool",
  ])
    assert.equal(
      compareToolPolicy([{ tool, input: {}, sequence: 1 }])[0].severity,
      "critical"
    );
});
test("read-only tools pass", () =>
  assert.deepEqual(
    compareToolPolicy(
      ["Read", "Grep", "Glob"].map((tool, sequence) => ({
        tool,
        input: {},
        sequence,
      }))
    ),
    []
  ));
test("normalization rejects POSIX and Windows escapes and duplicate paths", () => {
  for (const path of [
    "../x",
    "/tmp/x",
    "C:\\\\temp\\\\x",
    "\\\\\\\\server\\\\share",
  ])
    assert.throws(() =>
      normalizeReport({
        repoType: "single",
        projects: [{ path, targetId: null, hasPostHog: false }],
      })
    );
  assert.throws(() =>
    normalizeReport({
      repoType: "single",
      projects: [
        { path: "a", targetId: null, hasPostHog: false },
        { path: "./a", targetId: null, hasPostHog: false },
      ],
    })
  );
});
test("selected path must belong to the detected project set", () =>
  assert.equal(
    compareReport(
      {
        profile: "headless-integration",
        expectedOutcome: "success",
        selectedPath: {
          acceptablePaths: ["apps/web"],
          expectedStrategy: "recommended",
        },
      },
      {
        repoType: "monorepo",
        projects: [],
        selectedPath: "apps/web",
        selectedStrategy: "recommended",
      }
    ).find((item) => item.field === "pathContainment")?.severity,
    "critical"
  ));
test("source-map profile uses its own production vocabulary", () =>
  assert.deepEqual(
    compareReport(
      {
        profile: "source-maps",
        expectedOutcome: "success",
        projects: [
          {
            path: "frontend",
            presence: "required",
            targetId: "vite",
            hasPostHog: true,
          },
        ],
      },
      {
        repoType: "monorepo",
        projects: [{ path: "frontend", targetId: "vite", hasPostHog: true }],
      }
    ),
    []
  ));
test("reports target, PostHog-presence, and framework fields independently", () => {
  const mismatches = compareReport(
    {
      profile: "registry-crosscheck",
      expectedOutcome: "success",
      projects: [
        {
          path: "apps/web",
          presence: "required",
          targetId: "nextjs",
          hasPostHog: false,
          acceptedLabels: ["Next.js"],
        },
      ],
    },
    {
      repoType: "single",
      projects: [
        {
          path: "apps/web",
          framework: "Invented",
          targetId: "javascript_node",
          hasPostHog: true,
        },
      ],
    }
  );
  assert.deepEqual(
    new Set(mismatches.map((item) => item.field)),
    new Set(["targetId", "hasPostHog", "framework"])
  );
  assert.equal(
    mismatches.find((item) => item.field === "framework")?.severity,
    "warning"
  );
  assert.equal(
    mismatches.find((item) => item.field === "hasPostHog")?.severity,
    "critical"
  );
});
