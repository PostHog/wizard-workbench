import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { after, describe, it } from "node:test";
import { APPS_DIR } from "./e2e.js";
import {
  changedFiles,
  featureFlagChecks,
  fetchFlagsByKey,
  loadFeatureFlagsExpect,
  FEATURE_FLAGS_REPORT_FILE,
  type FeatureFlagEvidence,
  type RemoteFlag,
} from "./feature-flag-checks.js";
import type { Check } from "./warehouse-checks.js";

const FRONTEND_KEY = "wizard-example-frontend-flag";
const BACKEND_KEY = "wizard-example-backend-flag";

const scratchDir = mkdtempSync(join(tmpdir(), "feature-flag-checks-test-"));
after(() => rmSync(scratchDir, { recursive: true, force: true }));

function inactiveFlag(key: string): RemoteFlag {
  return { key, active: false, filters: { groups: [{ rollout_percentage: 0 }] } };
}

function passingEvidence(): FeatureFlagEvidence {
  return {
    expectedFlagKeys: [FRONTEND_KEY, BACKEND_KEY],
    changedFileContentsByPath: new Map([
      ["lib/feature-flags.ts", `export const FRONTEND = "${FRONTEND_KEY}";\nexport const BACKEND = "${BACKEND_KEY}";`],
      ["app/page.tsx", `import { FRONTEND } from "@/lib/feature-flags";`],
      ["app/api/route.ts", `import { BACKEND } from "@/lib/feature-flags";`],
      [FEATURE_FLAGS_REPORT_FILE, `Turn on ${FRONTEND_KEY} and ${BACKEND_KEY}.`],
    ]),
    remoteFlagsByKey: new Map([
      [FRONTEND_KEY, inactiveFlag(FRONTEND_KEY)],
      [BACKEND_KEY, inactiveFlag(BACKEND_KEY)],
    ]),
    flagsApiError: null,
    isReportWritten: true,
  };
}

function failedCheckNames(checks: Check[]): string[] {
  return checks.filter((c) => !c.ok).map((c) => c.name);
}

function writeTree(root: string, contentsByPath: Record<string, string>): void {
  for (const [path, contents] of Object.entries(contentsByPath)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), contents);
  }
}

describe("featureFlagChecks", () => {
  it("passes a run that wired both flags through one constants module", () => {
    assert.deepEqual(failedCheckNames(featureFlagChecks(passingEvidence())), []);
  });

  it("fails a flag missing from the project", () => {
    const evidence = passingEvidence();
    evidence.remoteFlagsByKey.delete(BACKEND_KEY);
    assert.deepEqual(failedCheckNames(featureFlagChecks(evidence)), [`flag ${BACKEND_KEY} exists`]);
  });

  it("fails an active flag", () => {
    const evidence = passingEvidence();
    evidence.remoteFlagsByKey.set(FRONTEND_KEY, { ...inactiveFlag(FRONTEND_KEY), active: true });
    assert.deepEqual(failedCheckNames(featureFlagChecks(evidence)), [`flag ${FRONTEND_KEY} inactive`]);
  });

  for (const rollout of [100, null]) {
    it(`fails a flag rolled out at ${rollout}`, () => {
      const evidence = passingEvidence();
      evidence.remoteFlagsByKey.set(FRONTEND_KEY, {
        key: FRONTEND_KEY,
        active: false,
        filters: { groups: [{ rollout_percentage: rollout }] },
      });
      assert.deepEqual(failedCheckNames(featureFlagChecks(evidence)), [`flag ${FRONTEND_KEY} at 0%`]);
    });
  }

  it("fails every flag when the Flags API is unreachable", () => {
    const evidence = passingEvidence();
    evidence.flagsApiError = "Flags API returned HTTP 401";
    assert.deepEqual(failedCheckNames(featureFlagChecks(evidence)), [
      `flag ${FRONTEND_KEY} exists`,
      `flag ${BACKEND_KEY} exists`,
    ]);
  });

  it("fails a key written inline outside the constants module", () => {
    const evidence = passingEvidence();
    evidence.changedFileContentsByPath.set("app/page.tsx", `useFeatureFlagEnabled("${FRONTEND_KEY}")`);
    assert.deepEqual(failedCheckNames(featureFlagChecks(evidence)), [
      `key ${FRONTEND_KEY} in one constants module`,
    ]);
  });

  it("fails a key in no changed file", () => {
    const evidence = passingEvidence();
    evidence.changedFileContentsByPath.set("lib/feature-flags.ts", `export const BACKEND = "${BACKEND_KEY}";`);
    assert.deepEqual(failedCheckNames(featureFlagChecks(evidence)), [
      `key ${FRONTEND_KEY} in one constants module`,
    ]);
  });

  it("fails a constants module nothing imports", () => {
    const evidence = passingEvidence();
    evidence.changedFileContentsByPath.set("app/page.tsx", "export default function Page() {}");
    evidence.changedFileContentsByPath.set("app/api/route.ts", "export function GET() {}");
    assert.deepEqual(failedCheckNames(featureFlagChecks(evidence)), [
      `constants module for ${FRONTEND_KEY} used by another changed file`,
      `constants module for ${BACKEND_KEY} used by another changed file`,
    ]);
  });

  it("names a Python package constants module by its directory", () => {
    const evidence: FeatureFlagEvidence = {
      ...passingEvidence(),
      expectedFlagKeys: [BACKEND_KEY],
      changedFileContentsByPath: new Map([
        ["flags/__init__.py", `BACKEND_FLAG = "${BACKEND_KEY}"`],
        ["dashboard/views.py", "from flags import BACKEND_FLAG"],
      ]),
    };
    assert.deepEqual(failedCheckNames(featureFlagChecks(evidence)), []);
  });

  it("fails an example key the app does not expect", () => {
    const evidence = passingEvidence();
    evidence.expectedFlagKeys = [BACKEND_KEY];
    assert.deepEqual(failedCheckNames(featureFlagChecks(evidence)), ["no unexpected flag key"]);
  });

  it("fails a run without a report", () => {
    const evidence = passingEvidence();
    evidence.isReportWritten = false;
    assert.deepEqual(failedCheckNames(featureFlagChecks(evidence)), ["report file written"]);
  });
});

describe("changedFiles", () => {
  it("returns files the run added or edited, skipping unchanged and dependency trees", () => {
    const sourceDir = join(scratchDir, "source");
    const copyDir = join(scratchDir, "copy");
    writeTree(sourceDir, { "app/page.tsx": "original", "README.md": "same" });
    writeTree(copyDir, {
      "app/page.tsx": "edited",
      "README.md": "same",
      "lib/flags.ts": "added",
      "node_modules/pkg/index.js": "installed",
      "venv/lib/site.py": "installed",
    });
    assert.deepEqual(
      [...changedFiles(sourceDir, copyDir)].sort(),
      [
        ["app/page.tsx", "edited"],
        ["lib/flags.ts", "added"],
      ],
    );
  });
});

describe("fetchFlagsByKey", () => {
  it("keeps only exact, undeleted key matches", async () => {
    const requestedUrls: string[] = [];
    const fetchFlags = (async (url: string) => {
      requestedUrls.push(url);
      const results: RemoteFlag[] = [
        { ...inactiveFlag(`${BACKEND_KEY}-old`) },
        { ...inactiveFlag(BACKEND_KEY), deleted: true },
        inactiveFlag(BACKEND_KEY),
      ];
      return new Response(JSON.stringify({ results }));
    }) as typeof fetch;
    const flagsByKey = await fetchFlagsByKey({
      host: "https://us.posthog.com",
      projectId: "483112",
      apiKey: "phx_test",
      flagKeys: [BACKEND_KEY],
      fetchFlags,
    });
    assert.deepEqual(requestedUrls, [
      `https://us.posthog.com/api/projects/483112/feature_flags/?search=${BACKEND_KEY}`,
    ]);
    assert.deepEqual(flagsByKey.get(BACKEND_KEY), inactiveFlag(BACKEND_KEY));
  });

  it("throws on an HTTP error", async () => {
    const fetchFlags = (async () => new Response("denied", { status: 403 })) as typeof fetch;
    await assert.rejects(
      fetchFlagsByKey({ host: "https://us.posthog.com", projectId: "1", apiKey: "x", flagKeys: [BACKEND_KEY], fetchFlags }),
      /HTTP 403/,
    );
  });
});

describe("feature-flags app expectations", () => {
  it("expects both keys for Next.js and only the backend key for Django", () => {
    assert.deepEqual(loadFeatureFlagsExpect(APPS_DIR, "feature-flags/next-js/15-app-router-saas")?.flagKeys, [
      FRONTEND_KEY,
      BACKEND_KEY,
    ]);
    assert.deepEqual(loadFeatureFlagsExpect(APPS_DIR, "feature-flags/django/django3-saas")?.flagKeys, [BACKEND_KEY]);
  });
});
