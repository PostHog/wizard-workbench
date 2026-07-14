import assert from "node:assert/strict";
import test from "node:test";
import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runRegistryCases, type RegistryDependencies } from "../evaluator.js";
import type { DetectionCase } from "../types.js";

function fixtureCase(root: string): DetectionCase {
  const fixture = join(root, "fixture");
  mkdirSync(fixture);
  writeFileSync(join(fixture, "package.json"), '{ "name": "fixture" }\n');
  return {
    schemaVersion: 1,
    id: "infrastructure-boundary",
    description: "Exercises registry runner failures",
    provenance: { reason: "Regression coverage" },
    fixture: { kind: "synthetic", path: "fixture", copyBeforeRun: true },
    tiers: ["pr"],
    consumers: [
      {
        profile: "registry-crosscheck",
        expectedOutcome: "success",
        repoType: "single",
        projects: [
          {
            path: ".",
            presence: "required",
            targetId: "javascript_node",
            hasPostHog: false,
          },
        ],
      },
    ],
    tags: ["infrastructure"],
  };
}

const targets: RegistryDependencies["productionTargets"] = (profile) =>
  profile === "integration" ? ["javascript_node"] : [];

test("batched detector exceptions become structured infrastructure failures", () => {
  const root = mkdtempSync(join(tmpdir(), "registry-infrastructure-"));
  try {
    const results = runRegistryCases([fixtureCase(root)], root, {
      productionTargets: targets,
      detectIntegrations: () => {
        throw new Error("intentional detector failure");
      },
    });
    assert.equal(results.length, 1);
    assert.equal(results[0].status, "failed");
    assert.equal(results[0].checks.infrastructure, "failed");
    assert.equal(results[0].mismatches[0].actual, "infrastructure-error");
    assert.match(results[0].mismatches[0].message, /intentional detector/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("batched detector result-count mismatches fail as infrastructure", () => {
  const root = mkdtempSync(join(tmpdir(), "registry-result-count-"));
  try {
    const results = runRegistryCases([fixtureCase(root)], root, {
      productionTargets: targets,
      detectIntegrations: () => [],
    });
    assert.equal(results.length, 1);
    assert.equal(results[0].status, "failed");
    assert.equal(results[0].checks.infrastructure, "failed");
    assert.match(results[0].mismatches[0].message, /0 results for 1 projects/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
