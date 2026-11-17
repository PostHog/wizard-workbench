import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { genericChecks } from "./e2e.js";
import type { WarehouseExpect } from "./warehouse-checks.js";

function warehouseExpect(overrides: Partial<WarehouseExpect> = {}): WarehouseExpect {
  return {
    minKinds: [],
    optionalKinds: [],
    forbidKinds: [],
    created: [],
    attemptedFailOk: [],
    deepLink: [],
    askBatches: [0, 0],
    askMaxPerBatch: 0,
    askMaxBatchesPerSubject: 0,
    expectAbort: null,
    seeded: false,
    expectNotices: 0,
    expectSkipReason: null,
    ...overrides,
  };
}

describe("genericChecks", () => {
  for (const program of [undefined, "posthog-integration"]) {
    it(`passes integration run (${program ?? "default"}) when outro and flowComplete hold`, () => {
      const checks = genericChecks(
        {
          runPhase: "completed",
          hasPosthogDep: true,
          screenPath: ["intro", "auth", "run", "outro", "mcp", "exit"],
          flowComplete: true,
        },
        { program },
        null,
      );

      assert.deepEqual(checks, [
        ["agent run completed", true],
        ["posthog dependency added or .env written", true],
        ["reached the outro", true],
        ["flowComplete", true],
      ]);
    });
  }

  it("fails flowComplete on integration run that stops before exit", () => {
    const checks = genericChecks(
      {
        runPhase: "completed",
        hasPosthogDep: true,
        screenPath: ["intro", "auth", "run", "outro", "mcp"],
        flowComplete: false,
      },
      { program: "posthog-integration" },
      null,
    );

    assert.deepEqual(checks, [
      ["agent run completed", true],
      ["posthog dependency added or .env written", true],
      ["reached the outro", true],
      ["flowComplete", false],
    ]);
  });

  it("fails reached the outro on integration run missing outro screen", () => {
    const checks = genericChecks(
      {
        runPhase: "completed",
        envFile: ".env",
        screenPath: ["intro", "auth", "run", "exit"],
        flowComplete: true,
      },
      {},
      null,
    );

    assert.deepEqual(checks, [
      ["agent run completed", true],
      ["posthog dependency added or .env written", true],
      ["reached the outro", false],
      ["flowComplete", true],
    ]);
  });

  it("grades non-integration programs on outro suffix without flowComplete", () => {
    const checks = genericChecks(
      {
        runPhase: "completed",
        envFile: ".env",
        screenPath: ["source-maps-intro", "auth", "run", "source-maps-outro", "exit"],
      },
      { program: "error-tracking-upload-source-maps" },
      null,
    );

    assert.deepEqual(checks, [
      ["agent run completed", true],
      ["posthog dependency added or .env written", true],
      ["reached the outro", true],
    ]);
  });

  it("skips dependency and flowComplete checks for unseeded warehouse runs", () => {
    const checks = genericChecks(
      {
        runPhase: "completed",
        hasPosthogDep: false,
        screenPath: ["warehouse-intro", "auth", "run", "outro", "exit"],
      },
      { program: "warehouse-source" },
      warehouseExpect({ seeded: false }),
    );

    assert.deepEqual(checks, [
      ["agent run completed", true],
      ["reached the outro", true],
    ]);
  });

  it("returns empty checks when expectAbort is set", () => {
    const checks = genericChecks(
      { runPhase: "error", screenPath: [] },
      {},
      warehouseExpect({ expectAbort: "unsupported platform" }),
    );

    assert.deepEqual(checks, []);
  });
});
