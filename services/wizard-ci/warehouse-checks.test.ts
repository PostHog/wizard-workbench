/**
 * Warehouse assertion tests.
 *
 *   pnpm test:warehouse-checks
 *
 * The evidence these run against is not hand-written. Each scenario drives the
 * real `runExec` grammar against the real recorded fixtures, so the journal and
 * the created-source list are exactly what a wizard run would leave behind. A
 * check that passes here passes against the same bytes in CI.
 *
 * Every check is exercised twice: once on a run that did the right thing, and
 * once on a run that did the specific wrong thing the check exists to catch.
 */

import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, beforeEach, describe, it } from "node:test";

import { runExec, StubState } from "../mcp-stub/exec.js";
import { loadFixtures, type Fixtures } from "../mcp-stub/fixtures.js";
import { readJournal } from "../mcp-stub/journal.js";
import { mergeFlagOverrides } from "./e2e.js";
import {
  checksPassed,
  claimedConnected,
  deepLinkedKinds,
  formatCheck,
  formatResultLine,
  loadExpect,
  skipReasons,
  warehouseChecks,
  type Check,
  type E2eResult,
  type WarehouseExpect,
} from "./warehouse-checks.js";

let fixtures: Fixtures;
let tmp: string;
let journalFile: string;

before(() => {
  fixtures = loadFixtures();
  tmp = mkdtempSync(join(tmpdir(), "warehouse-checks-"));
  journalFile = join(tmp, "journal.json");
  process.env.MCP_STUB_JOURNAL = journalFile;
});

after(() => {
  delete process.env.MCP_STUB_JOURNAL;
  delete process.env.MCP_STUB_FAIL_KINDS;
  rmSync(tmp, { recursive: true, force: true });
});

beforeEach(() => {
  writeFileSync(journalFile, "[]\n", "utf8");
  delete process.env.MCP_STUB_FAIL_KINDS;
});

// ============================================================================
// Helpers — build evidence by really running the stub
// ============================================================================

const PG_PAYLOAD = {
  host: "e2e-warehouse-fixture.invalid",
  port: 5432,
  database: "e2e_fixture_db",
  user: "e2e_fixture_user",
  password: "e2e-fixture-placeholder-password",
};

const STRIPE_PAYLOAD = { stripe_secret_key: "sk_test_e2efixtureplaceholder000000" };

/** Payload the stub accepts for a kind, so a create succeeds when it should. */
function payloadFor(kind: string): Record<string, unknown> {
  if (kind === "Stripe") return STRIPE_PAYLOAD;
  if (kind === "HuggingFace") return { api_key: "hf_placeholder0000000" };
  return PG_PAYLOAD;
}

/** Run real creates through the stub and return the journal it wrote. */
function driveCreates(kinds: string[], state = new StubState()) {
  for (const kind of kinds) {
    runExec(
      `call external-data-sources-create ${JSON.stringify({
        source_type: kind,
        prefix: "e2e_test_",
        payload: payloadFor(kind),
      })}`,
      state,
      fixtures,
    );
  }
  return { state, journal: readJournal(journalFile) };
}

function expectation(over: Partial<WarehouseExpect> = {}): WarehouseExpect {
  return {
    minKinds: [],
    optionalKinds: [],
    forbidKinds: [],
    created: [],
    attemptedFailOk: [],
    deepLink: [],
    askBatches: [0, 99],
    askMaxPerBatch: 99,
    expectAbort: null,
    seeded: false,
    expectNotices: 0,
    expectSkipReason: null,
    ...over,
  };
}

function result(over: Partial<E2eResult> = {}): E2eResult {
  return {
    runPhase: "completed",
    screenPath: ["warehouse-intro", "auth", "run", "outro"],
    asks: [],
    unansweredAsks: 0,
    notices: [],
    tasks: [],
    detectedSources: [],
    reportFile: { path: "/tmp/app/posthog-warehouse-report.md", exists: true, text: "" },
    abort: null,
    ...over,
  };
}

function detect(kind: string, label = kind, signal = "found `X` in .env") {
  return { kind, label, mode: "in-cli", matchedSignal: signal };
}

function grade(
  expect: WarehouseExpect,
  res: E2eResult | null,
  over: {
    createdKinds?: string[];
    journal?: ReturnType<typeof readJournal>;
    injectedSecrets?: string[];
    frameText?: string;
  } = {},
): Check[] {
  const journal = over.journal ?? [];
  return warehouseChecks({
    expect,
    result: res,
    resultText: JSON.stringify(res ?? {}),
    journal,
    journalText: JSON.stringify(journal),
    createdKinds: over.createdKinds ?? [],
    registryKinds: Object.keys(fixtures.sourcesWizard.sources),
    injectedSecrets: over.injectedSecrets ?? [],
    frameText: over.frameText ?? "",
  });
}

function named(checks: Check[], name: string): Check {
  const found = checks.find((c) => c.name === name);
  assert.ok(found, `no check named "${name}" (have: ${checks.map((c) => c.name).join(", ")})`);
  return found;
}

// ============================================================================
// Tests
// ============================================================================

describe("expect.json", () => {
  const appsDir = join(import.meta.dirname, "..", "..", "apps");

  for (const app of [
    "warehouse/stripe-node",
    "warehouse/multi-source-next",
    "warehouse/monorepo-env",
    "warehouse/zero-source",
    "warehouse-seeded/next-stripe",
    "warehouse-seeded/next-stripe-declined",
  ]) {
    it(`loads and is well-formed: ${app}`, () => {
      const loaded = loadExpect(appsDir, app);
      assert.ok(loaded, `apps/${app}/.wizard-ci/expect.json is missing`);
      assert.equal(loaded.askBatches.length, 2);
      assert.ok(loaded.askBatches[0] <= loaded.askBatches[1]);
      // A kind cannot be both required and forbidden.
      for (const kind of loaded.minKinds) {
        assert.ok(!loaded.forbidKinds.includes(kind), `${kind} is both required and forbidden`);
      }
      // Everything the run must create must first be detected.
      for (const kind of loaded.created) {
        assert.ok(
          loaded.minKinds.includes(kind),
          `${kind} is expected to be created but is not in minKinds`,
        );
      }
      // A deep-link source is never created in the CLI.
      for (const kind of loaded.deepLink) {
        assert.ok(!loaded.created.includes(kind), `${kind} is both deep-linked and created`);
      }
    });
  }

  it("returns null for an app with no expectation file", () => {
    assert.equal(loadExpect(appsDir, "basic-integration"), null);
  });
});

describe("detection", () => {
  it("passes when every required kind is detected and none is forbidden", () => {
    const checks = grade(
      expectation({ minKinds: ["Postgres", "Stripe"], forbidKinds: ["MySQL"] }),
      result({ detectedSources: [detect("Postgres"), detect("Stripe")] }),
    );
    assert.equal(named(checks, "detection").ok, true);
  });

  it("fails on a missing required kind, and names it", () => {
    const checks = grade(
      expectation({ minKinds: ["Postgres", "Stripe"] }),
      result({ detectedSources: [detect("Postgres")] }),
    );
    const c = named(checks, "detection");
    assert.equal(c.ok, false);
    assert.match(c.detail, /Stripe/);
  });

  it("fails on a forbidden kind", () => {
    const checks = grade(
      expectation({ forbidKinds: ["Supabase"] }),
      result({ detectedSources: [detect("Supabase")] }),
    );
    assert.equal(named(checks, "detection").ok, false);
  });

  it("reports an optional kind without enforcing it", () => {
    const checks = grade(
      expectation({ optionalKinds: ["HuggingFace"] }),
      result({ detectedSources: [] }),
    );
    const c = named(checks, "detection");
    assert.equal(c.ok, true);
    assert.match(c.detail, /not enforced/);
  });
});

describe("signal path", () => {
  it("passes when the reported signal names the real file", () => {
    const checks = grade(
      expectation({ expectSignalPath: { Stripe: "apps/api/.env" } }),
      result({
        detectedSources: [detect("Stripe", "Stripe", "found `STRIPE_SECRET_KEY` in apps/api/.env")],
      }),
    );
    assert.equal(named(checks, "signal path").ok, true);
  });

  it("fails when the signal names a file the key is not in", () => {
    const checks = grade(
      expectation({ expectSignalPath: { Stripe: "apps/api/.env" } }),
      result({
        detectedSources: [detect("Stripe", "Stripe", "found `STRIPE_SECRET_KEY` in .env")],
      }),
    );
    const c = named(checks, "signal path");
    assert.equal(c.ok, false);
    assert.match(c.detail, /apps\/api\/\.env/);
  });

  it("never fails the leg when the check is advisory", () => {
    const checks = grade(
      expectation({
        expectSignalPath: { Stripe: "apps/api/.env" },
        advisory: ["signal path"],
      }),
      result({ detectedSources: [detect("Stripe", "Stripe", "found `X` in .env")] }),
    );
    const c = named(checks, "signal path");
    assert.equal(c.ok, false);
    assert.equal(c.advisory, true);
    assert.equal(checksPassed(checks), true);
    assert.match(formatCheck(c), /^E2E_CHECK ADVISORY /);
  });

  it("reads PASS, not ADVISORY, once an advisory expectation starts holding", () => {
    const checks = grade(
      expectation({
        expectSignalPath: { Stripe: "apps/api/.env" },
        advisory: ["signal path"],
      }),
      result({
        detectedSources: [detect("Stripe", "Stripe", "found `STRIPE_SECRET_KEY` in `apps/api/.env`")],
      }),
    );
    assert.match(formatCheck(named(checks, "signal path")), /^E2E_CHECK PASS /);
  });
});

describe("no silent no-op", () => {
  it("passes when every expected create really happened and is reported", () => {
    const { state, journal } = driveCreates(["Postgres", "Stripe"]);
    const checks = grade(
      expectation({ minKinds: ["Postgres", "Stripe"], created: ["Postgres", "Stripe"] }),
      result({
        detectedSources: [detect("Postgres"), detect("Stripe")],
        reportFile: {
          path: "/tmp/r.md",
          exists: true,
          text: "- Postgres: connected\n- Stripe: connected\n",
        },
      }),
      { createdKinds: state.created.map((s) => s.source_type), journal },
    );
    assert.equal(named(checks, "no silent no-op").ok, true);
  });

  it("fails when the report claims a source that was never created", () => {
    const { state, journal } = driveCreates(["Postgres"]);
    const checks = grade(
      expectation({ minKinds: ["Postgres", "Stripe"], created: ["Postgres", "Stripe"] }),
      result({
        detectedSources: [detect("Postgres"), detect("Stripe")],
        reportFile: {
          path: "/tmp/r.md",
          exists: true,
          text: "- Postgres: connected\n- Stripe: connected\n",
        },
      }),
      { createdKinds: state.created.map((s) => s.source_type), journal },
    );
    const c = named(checks, "no silent no-op");
    assert.equal(c.ok, false);
    assert.match(c.detail, /Stripe/);
  });

  it("fails when a source was created but the report never names it", () => {
    const { state, journal } = driveCreates(["Postgres", "Stripe"]);
    const checks = grade(
      expectation({ minKinds: ["Postgres", "Stripe"], created: ["Postgres", "Stripe"] }),
      result({
        detectedSources: [detect("Postgres"), detect("Stripe")],
        reportFile: { path: "/tmp/r.md", exists: true, text: "- Postgres: connected\n" },
      }),
      { createdKinds: state.created.map((s) => s.source_type), journal },
    );
    const c = named(checks, "no silent no-op");
    assert.equal(c.ok, false);
    assert.match(c.detail, /Stripe.*never names it/);
  });

  it("fails when a create was attempted but the stub rejected it", () => {
    process.env.MCP_STUB_FAIL_KINDS = "Postgres";
    const { state, journal } = driveCreates(["Postgres"]);
    assert.equal(state.created.length, 0, "the stub must have refused the create");
    const checks = grade(
      expectation({ minKinds: ["Postgres"], created: ["Postgres"] }),
      result({ detectedSources: [detect("Postgres")] }),
      { createdKinds: [], journal },
    );
    const c = named(checks, "no silent no-op");
    assert.equal(c.ok, false);
    assert.match(c.detail, /attempted but it did not succeed/);
  });

  it("reads a source's display label as a mention of the source", () => {
    const { state, journal } = driveCreates(["Postgres"]);
    const checks = grade(
      expectation({ minKinds: ["Postgres"], created: ["Postgres"] }),
      result({
        detectedSources: [detect("Postgres", "PostgreSQL")],
        reportFile: { path: "/tmp/r.md", exists: true, text: "PostgreSQL was connected.\n" },
      }),
      { createdKinds: state.created.map((s) => s.source_type), journal },
    );
    assert.equal(named(checks, "no silent no-op").ok, true);
  });
});

describe("honest failure", () => {
  it("passes when a failed create is reported as failed", () => {
    process.env.MCP_STUB_FAIL_KINDS = "HuggingFace";
    const { state, journal } = driveCreates(["HuggingFace"]);
    const checks = grade(
      expectation({ minKinds: ["HuggingFace"], attemptedFailOk: ["HuggingFace"] }),
      result({
        detectedSources: [detect("HuggingFace", "Hugging Face")],
        reportFile: {
          path: "/tmp/r.md",
          exists: true,
          text: "- Hugging Face: could not connect, the API key was rejected\n",
        },
      }),
      { createdKinds: state.created.map((s) => s.source_type), journal },
    );
    assert.equal(named(checks, "honest failure").ok, true);
  });

  it("fails when a failed create is reported as a success", () => {
    process.env.MCP_STUB_FAIL_KINDS = "HuggingFace";
    const { state, journal } = driveCreates(["HuggingFace"]);
    const checks = grade(
      expectation({ minKinds: ["HuggingFace"], attemptedFailOk: ["HuggingFace"] }),
      result({
        detectedSources: [detect("HuggingFace", "Hugging Face")],
        reportFile: { path: "/tmp/r.md", exists: true, text: "- Hugging Face: connected\n" },
      }),
      { createdKinds: state.created.map((s) => s.source_type), journal },
    );
    const c = named(checks, "honest failure");
    assert.equal(c.ok, false);
    assert.match(c.detail, /claims success/);
  });

  it("fails when the create was never attempted at all", () => {
    const checks = grade(
      expectation({ attemptedFailOk: ["HuggingFace"] }),
      result({ detectedSources: [detect("HuggingFace")] }),
    );
    const c = named(checks, "honest failure");
    assert.equal(c.ok, false);
    assert.match(c.detail, /never attempted/);
  });
});

describe("ask contract", () => {
  const ask = (over: Record<string, unknown> = {}) => ({
    id: "ask_1",
    source: "integration-v2-warehouse",
    subject: null,
    questionCount: 2,
    questionIds: ["host", "port"],
    prompts: ["Postgres host", "Port"],
    answeredIds: ["host", "port"],
    sentinelIds: [],
    at: "2026-08-27T10:00:00.000Z",
    ...over,
  });

  it("passes inside the declared bounds with nothing unanswered", () => {
    const checks = grade(
      expectation({ askBatches: [1, 2], askMaxPerBatch: 8 }),
      result({ asks: [ask()], unansweredAsks: 0 }),
    );
    assert.equal(named(checks, "ask contract").ok, true);
  });

  it("fails when there are too many batches", () => {
    const checks = grade(
      expectation({ askBatches: [1, 1] }),
      result({ asks: [ask(), ask({ id: "ask_2" })] }),
    );
    const c = named(checks, "ask contract");
    assert.equal(c.ok, false);
    assert.match(c.detail, /want 1\.\.1/);
  });

  it("fails when a batch is bigger than the per-batch limit", () => {
    const checks = grade(
      expectation({ askBatches: [1, 1], askMaxPerBatch: 3 }),
      result({ asks: [ask({ questionCount: 9 })] }),
    );
    const c = named(checks, "ask contract");
    assert.equal(c.ok, false);
    assert.match(c.detail, /over 3 questions/);
  });

  it("fails when a question fell back to the sentinel", () => {
    const checks = grade(
      expectation({ askBatches: [1, 1] }),
      result({ asks: [ask({ sentinelIds: ["port"] })], unansweredAsks: 1 }),
    );
    const c = named(checks, "ask contract");
    assert.equal(c.ok, false);
    assert.match(c.detail, /sentinel/);
  });

  it("fails when two batches for one subject are split by a third", () => {
    const checks = grade(
      expectation({ askBatches: [1, 3] }),
      result({
        asks: [
          ask({ id: "a1", subject: "Stripe" }),
          ask({ id: "a2", subject: "Postgres" }),
          ask({ id: "a3", subject: "Stripe" }),
        ],
      }),
    );
    const c = named(checks, "ask contract");
    assert.equal(c.ok, false);
    assert.match(c.detail, /not adjacent/);
  });

  it("passes when batches for one subject sit together", () => {
    const checks = grade(
      expectation({ askBatches: [1, 3] }),
      result({
        asks: [
          ask({ id: "a1", subject: "Stripe" }),
          ask({ id: "a2", subject: "Stripe" }),
          ask({ id: "a3", subject: "Postgres" }),
        ],
      }),
    );
    assert.equal(named(checks, "ask contract").ok, true);
  });
});

describe("kind not label", () => {
  it("passes when every source_type is a registry kind", () => {
    const { journal } = driveCreates(["Postgres", "Stripe"]);
    const checks = grade(expectation(), result(), { journal });
    assert.equal(named(checks, "kind not label").ok, true);
  });

  it("fails when the agent sent a display label instead of the kind", () => {
    const state = new StubState();
    runExec(
      `call external-data-sources-create ${JSON.stringify({
        source_type: "Hugging Face",
        payload: { api_key: "hf_x" },
      })}`,
      state,
      fixtures,
    );
    const checks = grade(expectation(), result(), { journal: readJournal(journalFile) });
    const c = named(checks, "kind not label");
    assert.equal(c.ok, false);
    assert.match(c.detail, /Hugging Face/);
  });
});

describe("deep link", () => {
  const link =
    "https://us.posthog.com/project/123/data-warehouse/new-source?kind=Hubspot&utm_source=wizard";

  it("passes when the report carries the link and nothing was asked or created", () => {
    const checks = grade(
      expectation({ deepLink: ["Hubspot"] }),
      result({
        detectedSources: [detect("Hubspot", "HubSpot")],
        reportFile: { path: "/tmp/r.md", exists: true, text: `Open ${link} to finish.\n` },
      }),
    );
    assert.equal(named(checks, "deep link").ok, true);
    assert.deepEqual(
      deepLinkedKinds(result({ reportFile: { path: "x", exists: true, text: link } })),
      ["Hubspot"],
    );
  });

  it("fails when the report has no link for the kind", () => {
    const checks = grade(
      expectation({ deepLink: ["Hubspot"] }),
      result({ detectedSources: [detect("Hubspot")] }),
    );
    const c = named(checks, "deep link");
    assert.equal(c.ok, false);
    assert.match(c.detail, /no new-source deep link/);
  });

  it("fails when a deep-link source was asked about anyway", () => {
    const checks = grade(
      expectation({ deepLink: ["Hubspot"] }),
      result({
        detectedSources: [detect("Hubspot")],
        reportFile: { path: "/tmp/r.md", exists: true, text: link },
        asks: [
          {
            id: "ask_1",
            source: "s",
            subject: null,
            questionCount: 1,
            questionIds: ["hubspot_key"],
            prompts: ["Hubspot API key"],
            answeredIds: ["hubspot_key"],
            sentinelIds: [],
            at: "2026-08-27T10:00:00.000Z",
          },
        ],
      }),
    );
    const c = named(checks, "deep link");
    assert.equal(c.ok, false);
    assert.match(c.detail, /asked for credentials/);
  });

  it("fails when a deep-link source was created in the CLI", () => {
    const state = new StubState();
    runExec(
      `call external-data-sources-create ${JSON.stringify({
        source_type: "Hubspot",
        payload: {},
      })}`,
      state,
      fixtures,
    );
    const checks = grade(
      expectation({ deepLink: ["Hubspot"] }),
      result({
        detectedSources: [detect("Hubspot")],
        reportFile: { path: "/tmp/r.md", exists: true, text: link },
      }),
      { journal: readJournal(journalFile) },
    );
    const c = named(checks, "deep link");
    assert.equal(c.ok, false);
    assert.match(c.detail, /called create/);
  });
});

describe("report written", () => {
  it("fails when no report file exists", () => {
    const checks = grade(
      expectation(),
      result({ reportFile: { path: "/tmp/r.md", exists: false } }),
    );
    assert.equal(named(checks, "report written").ok, false);
  });

  it("is not expected when the run is meant to abort", () => {
    const checks = grade(
      expectation({ expectAbort: "No data source detected" }),
      result({ reportFile: { path: "/tmp/r.md", exists: false }, abort: "No data source detected" }),
    );
    const c = named(checks, "report written");
    assert.equal(c.ok, true);
    assert.match(c.detail, /not expected/);
  });
});

describe("abort", () => {
  it("passes when the run aborted with the expected reason", () => {
    const checks = grade(
      expectation({ expectAbort: "No data source detected" }),
      result({ abort: "No data source detected" }),
    );
    assert.equal(named(checks, "abort").ok, true);
  });

  it("fails when an abort was expected and none happened", () => {
    const checks = grade(expectation({ expectAbort: "No data source detected" }), result());
    assert.equal(named(checks, "abort").ok, false);
  });

  it("fails on an unexpected abort", () => {
    const checks = grade(expectation(), result({ abort: "Source creation failed" }));
    const c = named(checks, "abort");
    assert.equal(c.ok, false);
    assert.match(c.detail, /unexpected abort/);
  });
});

describe("notices and skip reason", () => {
  const notice = (decision: "keep" | "decline") => ({
    title: "Connect your data sources",
    items: ["Stripe"],
    decision,
    at: "2026-08-27T10:00:00.000Z",
  });

  it("fails when fewer notices were shown than expected", () => {
    const checks = grade(expectation({ expectNotices: 1 }), result({ notices: [] }));
    const c = named(checks, "notices");
    assert.equal(c.ok, false);
    assert.match(c.detail, /at least 1/);
  });

  it("derives user-declined from a declined notice plus a skipped task", () => {
    const res = result({
      notices: [notice("decline")],
      tasks: [{ label: "Connect your data sources", status: "skipped" }],
    });
    assert.ok(skipReasons(res).has("user-declined"));
    const checks = grade(
      expectation({ expectNotices: 1, expectSkipReason: "user-declined" }),
      res,
    );
    assert.equal(named(checks, "notices").ok, true);
  });

  it("fails when the notice was kept but a decline was expected", () => {
    const checks = grade(
      expectation({ expectNotices: 1, expectSkipReason: "user-declined" }),
      result({
        notices: [notice("keep")],
        tasks: [{ label: "Connect your data sources", status: "completed" }],
      }),
    );
    const c = named(checks, "notices");
    assert.equal(c.ok, false);
    assert.match(c.detail, /user-declined/);
  });
});

describe("seeded task", () => {
  it("passes when the warehouse task reached a terminal status", () => {
    const checks = grade(
      expectation({ seeded: true }),
      result({ tasks: [{ label: "Connect your data sources", status: "completed" }] }),
    );
    assert.equal(named(checks, "seeded task").ok, true);
  });

  it("fails when the task is still running at the end of the run", () => {
    const checks = grade(
      expectation({ seeded: true }),
      result({ tasks: [{ label: "Connect your data sources", status: "in_progress" }] }),
    );
    assert.equal(named(checks, "seeded task").ok, false);
  });

  it("fails when the run never queued a warehouse task", () => {
    const checks = grade(
      expectation({ seeded: true }),
      result({ tasks: [{ label: "Install the SDK", status: "completed" }] }),
    );
    const c = named(checks, "seeded task");
    assert.equal(c.ok, false);
    assert.match(c.detail, /no warehouse task/);
  });

  it("is absent for a standalone run", () => {
    const checks = grade(expectation(), result());
    assert.equal(checks.find((c) => c.name === "seeded task"), undefined);
  });
});

describe("no secret leakage", () => {
  const secret = "e2e-fixture-placeholder-password";

  it("passes when the stub redacted the credential out of the journal", () => {
    const { journal } = driveCreates(["Postgres"]);
    const journalText = JSON.stringify(journal);
    assert.ok(!journalText.includes(secret), "the stub must have redacted the password");
    const checks = warehouseChecks({
      expect: expectation(),
      result: result(),
      resultText: "{}",
      journal,
      journalText,
      createdKinds: ["Postgres"],
      registryKinds: Object.keys(fixtures.sourcesWizard.sources),
      injectedSecrets: [secret],
      frameText: "",
    });
    assert.equal(named(checks, "no secret leakage").ok, true);
  });

  it("fails when a captured frame echoes an injected secret", () => {
    const checks = grade(expectation(), result(), {
      injectedSecrets: [secret],
      frameText: `Password: ${secret}`,
    });
    const c = named(checks, "no secret leakage");
    assert.equal(c.ok, false);
    assert.match(c.detail, /frames/);
  });

  it("fails when the report echoes an injected secret", () => {
    const checks = grade(
      expectation(),
      result({ reportFile: { path: "/tmp/r.md", exists: true, text: `pw=${secret}` } }),
      { injectedSecrets: [secret] },
    );
    assert.equal(named(checks, "no secret leakage").ok, false);
  });
});

describe("a missing result payload", () => {
  it("is one ungradeable failure, not a wall of false passes", () => {
    const checks = grade(expectation({ minKinds: ["Stripe"] }), null);
    assert.equal(checks.length, 1);
    assert.equal(checks[0].ok, false);
    assert.equal(checksPassed(checks), false);
  });
});

describe("claim reading", () => {
  it("does not read a failure line as a success claim", () => {
    const res = result({
      detectedSources: [detect("Stripe")],
      reportFile: {
        path: "/tmp/r.md",
        exists: true,
        text: "- Stripe: could not be created, the key was rejected\n",
      },
    });
    assert.deepEqual(claimedConnected(res, ["Stripe"]), []);
  });

  it("does not read a deep-link line as a success claim", () => {
    const res = result({
      detectedSources: [detect("Hubspot")],
      reportFile: {
        path: "/tmp/r.md",
        exists: true,
        text: "- Hubspot: open the deep link to finish setting it up\n",
      },
    });
    assert.deepEqual(claimedConnected(res, ["Hubspot"]), []);
  });
});

describe("output lines (contract §7)", () => {
  it("counts advisory checks in the total but never fails on them", () => {
    const checks: Check[] = [
      { name: "detection", ok: true, detail: "ok", advisory: false },
      { name: "signal path", ok: false, detail: "known-red on main", advisory: true },
    ];
    assert.equal(checksPassed(checks), true);
    assert.equal(
      formatResultLine({ app: "warehouse/monorepo-env", checks, created: 2, asks: 1, passed: true }),
      "E2E_RESULT app=warehouse/monorepo-env status=PASS checks=1/2 created=2 asks=1",
    );
    assert.equal(formatCheck(checks[0]), "E2E_CHECK PASS detection — ok");
    assert.equal(formatCheck(checks[1]), "E2E_CHECK ADVISORY signal path — known-red on main");
  });

  it("marks the run FAIL when a non-advisory check fails", () => {
    const checks: Check[] = [{ name: "detection", ok: false, detail: "missing Stripe", advisory: false }];
    assert.equal(checksPassed(checks), false);
    assert.match(
      formatResultLine({ app: "warehouse/stripe-node", checks, created: 0, asks: 0, passed: false }),
      /status=FAIL checks=0\/1/,
    );
  });
});

describe("flag overrides", () => {
  it("merges the seeded flag into whatever CI already set", () => {
    const merged = JSON.parse(
      mergeFlagOverrides('{"wizard-orchestrator":"true","wizard-use-pi-harness":"true"}', {
        "wizard-orchestrator-seeded-tasks": "true",
      }),
    );
    assert.deepEqual(merged, {
      "wizard-orchestrator": "true",
      "wizard-use-pi-harness": "true",
      "wizard-orchestrator-seeded-tasks": "true",
    });
  });

  it("works from nothing at all", () => {
    assert.deepEqual(JSON.parse(mergeFlagOverrides(undefined, { a: "true" })), { a: "true" });
  });

  it("replaces an unparseable value rather than crashing the run", () => {
    assert.deepEqual(JSON.parse(mergeFlagOverrides("not json", { a: "true" })), { a: "true" });
  });
});
