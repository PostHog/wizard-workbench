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

  it("fails a constants module that other files only mention in a comment or string", () => {
    const evidence = passingEvidence();
    evidence.changedFileContentsByPath.set("app/page.tsx", "// set up feature-flags here\nexport default function Page() {}");
    evidence.changedFileContentsByPath.set("app/api/route.ts", `export const label = "feature-flags";`);
    assert.deepEqual(failedCheckNames(featureFlagChecks(evidence)), [
      `constants module for ${FRONTEND_KEY} used by another changed file`,
      `constants module for ${BACKEND_KEY} used by another changed file`,
    ]);
  });

  it("fails a Python constants module that other files only mention in a comment", () => {
    const evidence: FeatureFlagEvidence = {
      ...passingEvidence(),
      expectedFlagKeys: [BACKEND_KEY],
      changedFileContentsByPath: new Map([
        ["config/posthog_flags.py", `BACKEND_FLAG = "${BACKEND_KEY}"`],
        ["dashboard/views.py", "# see posthog_flags for the key\ndef index(request): pass"],
      ]),
    };
    assert.deepEqual(failedCheckNames(featureFlagChecks(evidence)), [
      `constants module for ${BACKEND_KEY} used by another changed file`,
    ]);
  });

  it("passes a Python constants module imported by its dotted path", () => {
    const evidence: FeatureFlagEvidence = {
      ...passingEvidence(),
      expectedFlagKeys: [BACKEND_KEY],
      changedFileContentsByPath: new Map([
        ["config/posthog_flags.py", `BACKEND_FLAG = "${BACKEND_KEY}"`],
        ["dashboard/views.py", "from config.posthog_flags import BACKEND_FLAG"],
      ]),
    };
    assert.deepEqual(failedCheckNames(featureFlagChecks(evidence)), []);
  });

  for (const submoduleImport of [
    "from config import posthog_flags",
    "from . import posthog_flags",
    "from .. import posthog_flags",
    "from config import urls, posthog_flags",
    "from config import posthog_flags as flags",
    "from config import (\n    urls as routes,\n    posthog_flags,\n)",
    "from config import (urls,  # routes\n    posthog_flags)",
    "import os, posthog_flags",
    "import os as operating_system, config.posthog_flags as flags",
  ]) {
    it(`passes a Python constants module imported as a submodule via ${JSON.stringify(submoduleImport)}`, () => {
      const evidence: FeatureFlagEvidence = {
        ...passingEvidence(),
        expectedFlagKeys: [BACKEND_KEY],
        changedFileContentsByPath: new Map([
          ["config/posthog_flags.py", `BACKEND_FLAG = "${BACKEND_KEY}"`],
          ["dashboard/views.py", submoduleImport],
        ]),
      };
      assert.deepEqual(failedCheckNames(featureFlagChecks(evidence)), []);
    });
  }

  it("fails a Python constants module when another file imports a differently named submodule", () => {
    const evidence: FeatureFlagEvidence = {
      ...passingEvidence(),
      expectedFlagKeys: [BACKEND_KEY],
      changedFileContentsByPath: new Map([
        ["config/posthog_flags.py", `BACKEND_FLAG = "${BACKEND_KEY}"`],
        ["dashboard/views.py", "from config import posthog_flags_extra"],
      ]),
    };
    assert.deepEqual(failedCheckNames(featureFlagChecks(evidence)), [
      `constants module for ${BACKEND_KEY} used by another changed file`,
    ]);
  });

  it("fails a Python constants module when another file plainly imports a differently named module after others", () => {
    const evidence: FeatureFlagEvidence = {
      ...passingEvidence(),
      expectedFlagKeys: [BACKEND_KEY],
      changedFileContentsByPath: new Map([
        ["config/posthog_flags.py", `BACKEND_FLAG = "${BACKEND_KEY}"`],
        ["dashboard/views.py", "import os, posthog_flags_extra"],
      ]),
    };
    assert.deepEqual(failedCheckNames(featureFlagChecks(evidence)), [
      `constants module for ${BACKEND_KEY} used by another changed file`,
    ]);
  });

  function rubyEvidenceWithConstants(constantsContents: string, controllerContents: string): FeatureFlagEvidence {
    return {
      ...passingEvidence(),
      expectedFlagKeys: [BACKEND_KEY],
      changedFileContentsByPath: new Map([
        ["app/models/post_hog_feature_flags.rb", constantsContents],
        ["app/controllers/events_controller.rb", controllerContents],
      ]),
    };
  }

  function rubyEvidence(controllerContents: string): FeatureFlagEvidence {
    return rubyEvidenceWithConstants(
      `module PostHogFeatureFlags\n  WIZARD_EXAMPLE_BACKEND = "${BACKEND_KEY}"\nend`,
      controllerContents,
    );
  }

  const NESTED_RUBY_CONSTANTS = `module PostHog\n  module FeatureFlags\n    WIZARD_EXAMPLE_BACKEND = "${BACKEND_KEY}"\n  end\nend`;
  const COMPACT_RUBY_CONSTANTS = `module PostHog::FeatureFlags\n  WIZARD_EXAMPLE_BACKEND = "${BACKEND_KEY}"\nend`;

  it("fails a nested Ruby constants module when another file only references the outer namespace", () => {
    const evidence = rubyEvidenceWithConstants(NESTED_RUBY_CONSTANTS, "client = PostHog::Client.new(api_key)");
    assert.deepEqual(failedCheckNames(featureFlagChecks(evidence)), [
      `constants module for ${BACKEND_KEY} used by another changed file`,
    ]);
  });

  it("passes a nested Ruby constants module that another file references by its full path", () => {
    const evidence = rubyEvidenceWithConstants(
      NESTED_RUBY_CONSTANTS,
      "flags.enabled?(PostHog::FeatureFlags::WIZARD_EXAMPLE_BACKEND)",
    );
    assert.deepEqual(failedCheckNames(featureFlagChecks(evidence)), []);
  });

  it("passes a nested Ruby constants module that another file references by its innermost name", () => {
    const evidence = rubyEvidenceWithConstants(
      NESTED_RUBY_CONSTANTS,
      "module PostHog\n  class Client\n    KEY = FeatureFlags::WIZARD_EXAMPLE_BACKEND\n  end\nend",
    );
    assert.deepEqual(failedCheckNames(featureFlagChecks(evidence)), []);
  });

  const NESTED_RUBY_CONSTANTS_AFTER_METHOD = `module PostHog\n  module FeatureFlags\n    def self.all\n      constants\n    end\n\n    WIZARD_EXAMPLE_BACKEND = "${BACKEND_KEY}"\n  end\nend`;
  const RUBY_CONSTANTS_AFTER_SINGLETON_CLASS = `module PostHogFeatureFlags\n  class << self\n    def refresh; 1; end\n  end\n\n  WIZARD_EXAMPLE_BACKEND = "${BACKEND_KEY}"\nend`;
  const RUBY_CONSTANTS_AFTER_DO_BLOCK = `module PostHogFeatureFlags\n  %w[a b].each do |name|\n    const_set(name, name)\n  end\n\n  WIZARD_EXAMPLE_BACKEND = "${BACKEND_KEY}"\nend`;

  it("fails a nested Ruby constants module with a method before the key when another file only references the outer namespace", () => {
    const evidence = rubyEvidenceWithConstants(
      NESTED_RUBY_CONSTANTS_AFTER_METHOD,
      "client = PostHog::Client.new(api_key)",
    );
    assert.deepEqual(failedCheckNames(featureFlagChecks(evidence)), [
      `constants module for ${BACKEND_KEY} used by another changed file`,
    ]);
  });

  it("passes a nested Ruby constants module with a method before the key when another file references its full path", () => {
    const evidence = rubyEvidenceWithConstants(
      NESTED_RUBY_CONSTANTS_AFTER_METHOD,
      "flags.enabled?(PostHog::FeatureFlags::WIZARD_EXAMPLE_BACKEND)",
    );
    assert.deepEqual(failedCheckNames(featureFlagChecks(evidence)), []);
  });

  const NESTED_RUBY_CONSTANTS_AFTER_MEMOIZED_BEGIN = `module PostHog\n  module FeatureFlags\n    def self.all\n      @all ||= begin\n        constants\n      end\n    end\n\n    WIZARD_EXAMPLE_BACKEND = "${BACKEND_KEY}"\n  end\nend`;
  const NESTED_RUBY_CONSTANTS_AFTER_PRIVATE_DEF = `module PostHog\n  module FeatureFlags\n    private def helper\n      1\n    end\n\n    WIZARD_EXAMPLE_BACKEND = "${BACKEND_KEY}"\n  end\nend`;

  for (const [blockForm, constantsContents] of [
    ["a memoized begin block", NESTED_RUBY_CONSTANTS_AFTER_MEMOIZED_BEGIN],
    ["a private def", NESTED_RUBY_CONSTANTS_AFTER_PRIVATE_DEF],
  ]) {
    it(`fails a nested Ruby constants module with ${blockForm} before the key when another file only references the outer namespace`, () => {
      const evidence = rubyEvidenceWithConstants(constantsContents, "client = PostHog::Client.new(api_key)");
      assert.deepEqual(failedCheckNames(featureFlagChecks(evidence)), [
        `constants module for ${BACKEND_KEY} used by another changed file`,
      ]);
    });

    it(`passes a nested Ruby constants module with ${blockForm} before the key when another file references its full path`, () => {
      const evidence = rubyEvidenceWithConstants(
        constantsContents,
        "flags.enabled?(PostHog::FeatureFlags::WIZARD_EXAMPLE_BACKEND)",
      );
      assert.deepEqual(failedCheckNames(featureFlagChecks(evidence)), []);
    });
  }

  it("passes a Ruby constants module with a singleton class before the key when another file references it", () => {
    const evidence = rubyEvidenceWithConstants(
      RUBY_CONSTANTS_AFTER_SINGLETON_CLASS,
      "flags.enabled?(PostHogFeatureFlags::WIZARD_EXAMPLE_BACKEND)",
    );
    assert.deepEqual(failedCheckNames(featureFlagChecks(evidence)), []);
  });

  it("passes a Ruby constants module with a do block before the key when another file references it", () => {
    const evidence = rubyEvidenceWithConstants(
      RUBY_CONSTANTS_AFTER_DO_BLOCK,
      "flags.enabled?(PostHogFeatureFlags::WIZARD_EXAMPLE_BACKEND)",
    );
    assert.deepEqual(failedCheckNames(featureFlagChecks(evidence)), []);
  });

  it("passes a compact nested Ruby constants module that another file references by its full path", () => {
    const evidence = rubyEvidenceWithConstants(
      COMPACT_RUBY_CONSTANTS,
      "flags.enabled?(PostHog::FeatureFlags::WIZARD_EXAMPLE_BACKEND)",
    );
    assert.deepEqual(failedCheckNames(featureFlagChecks(evidence)), []);
  });

  it("passes a Ruby constants module that another file references with a top-level qualifier", () => {
    const evidence = rubyEvidence("flags.enabled?(::PostHogFeatureFlags::WIZARD_EXAMPLE_BACKEND)");
    assert.deepEqual(failedCheckNames(featureFlagChecks(evidence)), []);
  });

  it("fails a Ruby constants module when another file references a same-named constant in a different namespace", () => {
    const evidence = rubyEvidence("Other::PostHogFeatureFlags::WIZARD_EXAMPLE_BACKEND");
    assert.deepEqual(failedCheckNames(featureFlagChecks(evidence)), [
      `constants module for ${BACKEND_KEY} used by another changed file`,
    ]);
  });

  it("passes a Ruby constants module that another file references by its autoloaded name", () => {
    const evidence = rubyEvidence("flags.enabled?(PostHogFeatureFlags::WIZARD_EXAMPLE_BACKEND)");
    assert.deepEqual(failedCheckNames(featureFlagChecks(evidence)), []);
  });

  it("fails a Ruby constants module that other files only mention in a comment", () => {
    const evidence = rubyEvidence("# PostHogFeatureFlags holds the keys\nclass EventsController; end");
    assert.deepEqual(failedCheckNames(featureFlagChecks(evidence)), [
      `constants module for ${BACKEND_KEY} used by another changed file`,
    ]);
  });

  it("fails a Ruby constants module when another file references a longer namespace name", () => {
    const evidence = rubyEvidence("MyPostHogFeatureFlags::WIZARD_EXAMPLE_BACKEND");
    assert.deepEqual(failedCheckNames(featureFlagChecks(evidence)), [
      `constants module for ${BACKEND_KEY} used by another changed file`,
    ]);
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
        inactiveFlag(`${BACKEND_KEY}-old`),
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
