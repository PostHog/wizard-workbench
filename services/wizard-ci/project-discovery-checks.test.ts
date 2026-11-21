import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, describe, it } from "node:test";
import { commandToProgram, findCommandByAppPath } from "../wizard-commands.js";
import { APPS_DIR, WIZARD_FLAG_KEYS } from "./e2e.js";
import {
  loadProjectDiscoveryExpect,
  projectDiscoveryChecks,
  resolveLaunchDir,
  type ProjectDiscoveryExpect,
} from "./project-discovery-checks.js";
import type { Check, E2eResult } from "./warehouse-checks.js";

const scratchDir = mkdtempSync(join(tmpdir(), "project-discovery-checks-test-"));
after(() => rmSync(scratchDir, { recursive: true, force: true }));

function failedCheckNames(checks: Check[]): string[] {
  return checks.filter((c) => !c.ok).map((c) => c.name);
}

function baseResult(over: Partial<E2eResult> = {}): E2eResult {
  return {
    runPhase: "completed",
    screenPath: ["welcome", "plan", "run", "keep-skills", "outro"],
    asks: [],
    notices: [],
    abort: null,
    ...over,
  };
}

function baseExpect(over: Partial<ProjectDiscoveryExpect> = {}): ProjectDiscoveryExpect {
  return {
    id: "lerna-yarn-workspaces",
    fixture: "custom/lerna-yarn-workspaces",
    program: "posthog-integration",
    flags: { "wizard-project-discovery": "one-project" },
    launchDir: ".",
    profile: { plan: "packages/web", notice: "decline" },
    expectations: {
      expectedOutcome: "success",
      expectAbort: null,
      expectedTargetProject: "packages/web",
      expectedChangedPrefix: "packages/web/",
      forbidChangedPrefixes: ["packages/api/", "packages/shared/"],
    },
    specPath: "project-discovery/expectations/lerna-yarn-workspaces.e2e.json",
    ...over,
  };
}

describe("projectDiscoveryChecks", () => {
  it("passes when edits and PostHog wiring stay inside the target subrepo (allowing root lockfile updates)", () => {
    const checks = projectDiscoveryChecks({
      expect: baseExpect(),
      result: baseResult(),
      changedFileContentsByPath: new Map([
        ["yarn.lock", "# updated workspace lockfile"],
        ["packages/web/package.json", '{"dependencies":{"posthog-js":"^1.0.0"}}'],
        ["packages/web/instrumentation-client.ts", 'import posthog from "posthog-js";'],
      ]),
    });
    assert.deepEqual(failedCheckNames(checks), []);
  });

  it("fails when a forbidden sibling subrepo is modified", () => {
    const checks = projectDiscoveryChecks({
      expect: baseExpect(),
      result: baseResult(),
      changedFileContentsByPath: new Map([
        ["packages/web/package.json", '{"dependencies":{"posthog-js":"^1.0.0"}}'],
        ["packages/api/src/index.ts", "// leaked edit"],
      ]),
    });
    assert.deepEqual(failedCheckNames(checks), ["no edits under packages/api/"]);
  });

  it("fails when no files change inside the expected target subrepo", () => {
    const checks = projectDiscoveryChecks({
      expect: baseExpect(),
      result: baseResult(),
      changedFileContentsByPath: new Map([["package.json", '{"dependencies":{"posthog-js":"^1.0.0"}}']]),
    });
    assert.deepEqual(failedCheckNames(checks), [
      "edits inside packages/web/",
      "posthog wired inside packages/web/",
    ]);
  });

  it("fails when target subrepo edits do not wire PostHog", () => {
    const checks = projectDiscoveryChecks({
      expect: baseExpect(),
      result: baseResult(),
      changedFileContentsByPath: new Map([["packages/web/README.md", "updated docs only"]]),
    });
    assert.deepEqual(failedCheckNames(checks), ["posthog wired inside packages/web/"]);
  });

  it("fails on unexpected abort", () => {
    const checks = projectDiscoveryChecks({
      expect: baseExpect(),
      result: baseResult({ runPhase: "error", abort: "no-framework" }),
      changedFileContentsByPath: new Map([
        ["packages/web/package.json", '{"dependencies":{"posthog-js":"^1.0.0"}}'],
      ]),
    });
    assert.deepEqual(failedCheckNames(checks), ["completed without abort"]);
  });

  it("grades expected aborts when expectAbort is set", () => {
    const expect = baseExpect({
      expectations: {
        expectedOutcome: "abort",
        expectAbort: "unsupported-monorepo",
        forbidChangedPrefixes: ["packages/api/"],
      },
    });
    assert.deepEqual(
      failedCheckNames(
        projectDiscoveryChecks({
          expect,
          result: baseResult({ runPhase: "error", abort: "unsupported-monorepo" }),
          changedFileContentsByPath: new Map(),
        }),
      ),
      [],
    );
    assert.deepEqual(
      failedCheckNames(
        projectDiscoveryChecks({
          expect,
          result: baseResult(),
          changedFileContentsByPath: new Map(),
        }),
      ),
      ['aborted with "unsupported-monorepo"'],
    );
  });
});

describe("resolveLaunchDir", () => {
  it("resolves root and nested subdirectories", () => {
    assert.equal(resolveLaunchDir("/tmp/monorepo", "."), "/tmp/monorepo");
    assert.equal(resolveLaunchDir("/tmp/monorepo", "apps/dashboard"), "/tmp/monorepo/apps/dashboard");
  });

  it("rejects absolute or escaping launchDir values", () => {
    assert.throws(() => resolveLaunchDir("/tmp/monorepo", "/etc"), /must be relative/);
    assert.throws(() => resolveLaunchDir("/tmp/monorepo", "../escape"), /escapes the fixture root/);
  });
});

describe("loadProjectDiscoveryExpect", () => {
  it("returns null for apps without an e2e.json spec", () => {
    assert.equal(loadProjectDiscoveryExpect(APPS_DIR, "basic-integration/next-js/15-app-router-todo"), null);
  });

  it("prefers inline .wizard-ci/e2e.json when present", () => {
    const appDir = join(scratchDir, "custom-inline");
    mkdirSync(join(appDir, ".wizard-ci"), { recursive: true });
    writeFileSync(
      join(appDir, ".wizard-ci", "e2e.json"),
      JSON.stringify({
        id: "custom-inline",
        flags: { "wizard-project-discovery": "one-project" },
        launchDir: "apps/web",
        expectations: { expectedChangedPrefix: "apps/web/" },
      }),
    );
    const loaded = loadProjectDiscoveryExpect(scratchDir, "custom-inline");
    assert.equal(loaded?.id, "custom-inline");
    assert.equal(loaded?.launchDir, "apps/web");
    assert.equal(loaded?.specPath, "custom-inline/.wizard-ci/e2e.json");
  });

  it("loads every checked-in project-discovery E2E spec with valid flags, manifest routing, and deterministic gates", () => {
    const expectationsDir = join(APPS_DIR, "project-discovery", "expectations");
    const e2eFiles = readdirSync(expectationsDir)
      .filter((f) => f.endsWith(".e2e.json"))
      .sort();
    assert.ok(e2eFiles.length >= 6, `expected at least 6 E2E specs, found ${e2eFiles.length}`);

    for (const file of e2eFiles) {
      const id = file.replace(/\.e2e\.json$/, "");
      const raw = JSON.parse(readFileSync(join(expectationsDir, file), "utf8")) as { fixture?: string };
      assert.ok(raw.fixture, `${file} must declare fixture`);

      const appPath = `project-discovery/${raw.fixture}`;
      const loaded = loadProjectDiscoveryExpect(APPS_DIR, appPath);
      assert.ok(loaded, `failed to load E2E spec for ${appPath}`);
      assert.equal(loaded.id, id);

      for (const flagKey of Object.keys(loaded.flags)) {
        assert.ok(
          WIZARD_FLAG_KEYS.includes(flagKey),
          `${file} uses unknown flag "${flagKey}" (add to WIZARD_FLAG_KEYS if real)`,
        );
      }

      if (loaded.expectations.gateOnDeterministic) {
        assert.ok(
          existsSync(join(APPS_DIR, "project-discovery", loaded.expectations.gateOnDeterministic)),
          `${file} gateOnDeterministic missing: ${loaded.expectations.gateOnDeterministic}`,
        );
      }

      const cmd = findCommandByAppPath(appPath);
      assert.equal(cmd?.id, "project-discovery", `${appPath} must resolve to project-discovery command`);
      assert.equal(commandToProgram(cmd!.id), "posthog-integration");
    }
  });
});
