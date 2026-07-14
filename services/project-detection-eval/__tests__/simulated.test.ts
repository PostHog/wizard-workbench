import assert from "node:assert/strict";
import test from "node:test";
import { SimulatedRunner } from "../runners/simulated.js";
import { compareReport, compareToolPolicy } from "../compare/compare.js";
import { selectHeadlessProject } from "../compare/selection.js";
import type { ConsumerExpectation, DetectedProject } from "../types.js";

const expectation: ConsumerExpectation = {
  profile: "headless-integration",
  expectedOutcome: "success",
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
const projects: DetectedProject[] = [
  { path: "apps/api", targetId: "javascript_node", hasPostHog: false },
  { path: "apps/web", targetId: "nextjs", hasPostHog: true, recommended: true },
];

test("simulated PR #884 contract covers recommendation and selection without claiming live evidence", () => {
  const selection = selectHeadlessProject(projects);
  const runner = new SimulatedRunner(
    new Map([
      [
        "case",
        {
          status: "completed",
          report: { repoType: "monorepo", projects, ...selection },
          toolCalls: [
            {
              tool: "Glob",
              input: { pattern: "**/{package.json}" },
              sequence: 0,
            },
          ],
          durationMs: 10,
        },
      ],
    ])
  );
  const run = runner.run("case");
  assert.equal(run.mode, "simulated");
  assert.deepEqual(compareReport(expectation, run.report!), []);
  assert.deepEqual(compareToolPolicy(run.toolCalls), []);
});

test("missing scripted response is infrastructure failure", () =>
  assert.equal(
    new SimulatedRunner(new Map()).run("missing").status,
    "infrastructure-error"
  ));
test("preserves timeout as a distinct runner result", () =>
  assert.equal(
    new SimulatedRunner(
      new Map([
        [
          "slow",
          {
            status: "timeout",
            toolCalls: [],
            durationMs: 30_000,
            error: "deadline exceeded",
          },
        ],
      ])
    ).run("slow").status,
    "timeout"
  ));
