/**
 * Stub MCP server tests.
 *
 *   pnpm test:mcp-stub
 *
 * These cover the four things the assertion layer depends on: fixtures load,
 * the journal records what happened, a create shows up in a list, and an
 * unknown tool fails cleanly instead of returning a plausible lie.
 */

import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, beforeEach, describe, it } from "node:test";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

import { runExec, StubState } from "./exec.js";
import {
  flattenFields,
  loadFixtures,
  requiredFieldNames,
  secretFieldNames,
  type Fixtures,
} from "./fixtures.js";
import { readJournal } from "./journal.js";
import { startMcpStub, type McpStub } from "./index.js";

let fixtures: Fixtures;
let tmp: string;
let journal: string;

before(() => {
  fixtures = loadFixtures();
  tmp = mkdtempSync(join(tmpdir(), "mcp-stub-test-"));
  journal = join(tmp, "journal.json");
  process.env.MCP_STUB_JOURNAL = journal;
});

after(() => {
  delete process.env.MCP_STUB_JOURNAL;
  delete process.env.MCP_STUB_FAIL_KINDS;
  delete process.env.MCP_STUB_REQUIRE_INFO;
  rmSync(tmp, { recursive: true, force: true });
});

beforeEach(() => {
  // Every test starts from an empty journal so entry indexes are stable.
  writeFileSync(journal, "[]\n", "utf8");
});

const PG_PAYLOAD = {
  host: "db.example.com",
  port: 5432,
  database: "app",
  user: "reader",
  password: "placeholder-password",
};

function call(state: StubState, tool: string, input: unknown): ReturnType<typeof runExec> {
  return runExec(`call --json ${tool} ${JSON.stringify(input)}`, state, fixtures);
}

// ============================================================================

describe("fixtures", () => {
  it("loads every file with a provenance header", () => {
    for (const file of [
      fixtures.toolInfo,
      fixtures.toolSearch,
      fixtures.sourcesWizard,
      fixtures.dbSchema,
    ]) {
      assert.ok(file._recorded, "fixture is missing its _recorded header");
      assert.ok(file._recorded.recordedAt, "fixture is missing recordedAt");
    }
  });

  it("carries every kind the fixture apps under apps/warehouse detect", () => {
    for (const kind of ["Postgres", "Stripe", "Supabase", "HuggingFace", "Hubspot"]) {
      assert.ok(
        fixtures.sourcesWizard.sources[kind],
        `no recorded source config for ${kind}`,
      );
    }
  });

  it("carries the four tools the warehouse flow uses", () => {
    for (const tool of [
      "external-data-sources-wizard",
      "external-data-sources-db-schema",
      "external-data-sources-create",
      "external-data-sources-list",
    ]) {
      assert.ok(fixtures.toolInfo.tools[tool], `no recorded info for ${tool}`);
    }
  });

  it("holds no credential-shaped value", () => {
    const text = JSON.stringify(fixtures);
    for (const pattern of [
      /\bphx_[A-Za-z0-9]{10,}/,
      /\bphc_[A-Za-z0-9]{10,}/,
      /\b(sk|rk)_(live|test)_[A-Za-z0-9]{10,}/,
      /\bhf_[A-Za-z0-9]{10,}/,
    ]) {
      assert.equal(pattern.test(text), false, `fixture matched ${pattern}`);
    }
  });

  it("names no internal PostHog host", () => {
    const text = JSON.stringify(fixtures);
    assert.equal(text.includes("svc.cluster.local"), false);
    assert.equal(text.includes("posthog-web-django"), false);
  });
});

describe("field helpers", () => {
  it("flattens the fields nested inside a select option", () => {
    const stripe = fixtures.sourcesWizard.sources.Stripe;
    const names = flattenFields(stripe.fields).map((f) => f.name);
    assert.ok(names.includes("auth_method"));
    assert.ok(names.includes("stripe_secret_key"), "select option field missing");
  });

  it("requires only the chosen auth branch's fields", () => {
    const stripe = fixtures.sourcesWizard.sources.Stripe;
    assert.deepEqual(requiredFieldNames(stripe, { auth_method: "api_key" }), [
      "stripe_secret_key",
    ]);
    assert.deepEqual(requiredFieldNames(stripe, { auth_method: "oauth" }), []);
    // No explicit choice falls back to the field's recorded defaultValue.
    assert.deepEqual(requiredFieldNames(stripe, {}), ["stripe_secret_key"]);
  });

  it("reads the secret flag off the recorded field metadata", () => {
    const secrets = secretFieldNames(fixtures.sourcesWizard.sources.Postgres);
    assert.ok(secrets.has("password"));
    assert.ok(secrets.has("connection_string"));
    assert.equal(secrets.has("host"), false);
  });
});

describe("journal", () => {
  it("records one entry per call, in order", () => {
    const state = new StubState();
    runExec("tools", state, fixtures);
    runExec("info external-data-sources-create", state, fixtures);
    call(state, "external-data-sources-create", {
      source_type: "Postgres",
      payload: PG_PAYLOAD,
    });

    const entries = readJournal(journal);
    assert.deepEqual(
      entries.map((e) => e.tool),
      ["exec:tools", "exec:info", "external-data-sources-create"],
    );
    assert.ok(entries.every((e) => !Number.isNaN(Date.parse(e.at))));
  });

  it("keeps the field names but redacts the secret values", () => {
    const state = new StubState();
    call(state, "external-data-sources-create", {
      source_type: "Postgres",
      payload: PG_PAYLOAD,
    });

    const [entry] = readJournal(journal);
    const payload = (entry.input as { payload: Record<string, unknown> }).payload;
    assert.equal(payload.host, "db.example.com", "non-secret field was redacted");
    assert.equal(
      payload.password,
      `<redacted:${PG_PAYLOAD.password.length}>`,
      "password value survived into the journal",
    );
  });

  it("redacts a key-shaped value even under a field it does not know", () => {
    const state = new StubState();
    call(state, "external-data-sources-create", {
      source_type: "Stripe",
      payload: { auth_method: "api_key", stripe_secret_key: "x", note: "rk_live_abcdefghijklmno" },
    });

    const raw = readFileSync(journal, "utf8");
    assert.equal(raw.includes("rk_live_abcdefghijklmno"), false);
  });

  it("stays a valid JSON array after every write", () => {
    const state = new StubState();
    for (let i = 0; i < 5; i += 1) runExec("tools", state, fixtures);
    assert.equal(readJournal(journal).length, 5);
    assert.ok(Array.isArray(JSON.parse(readFileSync(journal, "utf8"))));
  });
});

describe("create → list round trip", () => {
  it("starts empty", () => {
    const state = new StubState();
    const result = call(state, "external-data-sources-list", {});
    assert.deepEqual(JSON.parse(result.text).results, []);
  });

  it("reflects a create, with a synthetic id and the prefix", () => {
    const state = new StubState();
    const created = JSON.parse(
      call(state, "external-data-sources-create", {
        source_type: "Postgres",
        payload: PG_PAYLOAD,
        prefix: "e2e_1234_",
      }).text,
    );

    assert.equal(created.source_type, "Postgres");
    assert.equal(created.prefix, "e2e_1234_");
    assert.match(created.id, /^0{8}-0000-7000-5747-/, "id is not a stub id");

    const listed = JSON.parse(call(state, "external-data-sources-list", {}).text);
    assert.equal(listed.count, 1);
    assert.equal(listed.results[0].id, created.id);
  });

  it("gives each create a distinct id and filters by search", () => {
    const state = new StubState();
    call(state, "external-data-sources-create", {
      source_type: "Postgres",
      payload: PG_PAYLOAD,
    });
    call(state, "external-data-sources-create", {
      source_type: "Stripe",
      payload: { auth_method: "api_key", stripe_secret_key: "placeholder" },
    });

    const ids = state.created.map((s) => s.id);
    assert.equal(new Set(ids).size, 2);

    const listed = JSON.parse(
      call(state, "external-data-sources-list", { search: "stripe" }).text,
    );
    assert.equal(listed.count, 1);
    assert.equal(listed.results[0].source_type, "Stripe");
  });

  it("syncs every discovered table when schemas is omitted", () => {
    const state = new StubState();
    const created = JSON.parse(
      call(state, "external-data-sources-create", {
        source_type: "Stripe",
        payload: { auth_method: "api_key", stripe_secret_key: "placeholder" },
      }).text,
    );
    assert.ok(created.schemas.length > 10, "no default schemas");
    assert.ok(created.schemas.every((s: { should_sync: boolean }) => s.should_sync));
  });

  it("keeps the schemas the agent picked", () => {
    const state = new StubState();
    const created = JSON.parse(
      call(state, "external-data-sources-create", {
        source_type: "Postgres",
        payload: {
          ...PG_PAYLOAD,
          schemas: [{ name: "orders", should_sync: true, sync_type: "incremental" }],
        },
      }).text,
    );
    assert.deepEqual(created.schemas, [
      { name: "orders", should_sync: true, sync_type: "incremental" },
    ]);
  });
});

describe("db-schema", () => {
  it("returns the recorded table list for a known kind", () => {
    const state = new StubState();
    const rows = JSON.parse(
      call(state, "external-data-sources-db-schema", {
        source_type: "Stripe",
        payload: { auth_method: "api_key", stripe_secret_key: "placeholder" },
      }).text,
    );
    assert.ok(rows.some((r: { table: string }) => r.table === "Invoice"));
  });

  it("returns the recorded 400 when a required field is missing", () => {
    const state = new StubState();
    const result = call(state, "external-data-sources-db-schema", {
      source_type: "Postgres",
      payload: { host: "db.example.com" },
    });
    assert.equal(result.isError, true);
    assert.match(result.text, /Missing required field\(s\) for Postgres/);
    assert.match(result.text, /port/);
    assert.match(result.text, /400 \(Bad Request\)/);
  });

  it("substitutes the project it was handed into the recorded API path", () => {
    // The stub lives in the runner's process, while the project id is exported
    // onto the wizard subprocess' env — so it has to be passed in, not read
    // from `process.env`, or every replayed error names project 0.
    const state = new StubState("98765");
    const result = call(state, "external-data-sources-db-schema", {
      source_type: "Postgres",
      payload: { host: "db.example.com" },
    });
    assert.match(result.text, /\/api\/projects\/98765\//);
    assert.doesNotMatch(result.text, /\{project_id\}/);
  });

  it("falls back to project 0 when no project was handed over", () => {
    const state = new StubState();
    const result = call(state, "external-data-sources-db-schema", {
      source_type: "Postgres",
      payload: { host: "db.example.com" },
    });
    assert.match(result.text, /\/api\/projects\/0\//);
  });

  it("returns the recorded 400 for a kind PostHog does not have", () => {
    const state = new StubState();
    const result = call(state, "external-data-sources-db-schema", {
      source_type: "NotARealSource",
      payload: {},
    });
    assert.equal(result.isError, true);
    assert.match(result.text, /Unknown source type 'NotARealSource'/);
  });

  it("fails a kind named in MCP_STUB_FAIL_KINDS, with prod's own wording", () => {
    process.env.MCP_STUB_FAIL_KINDS = "Postgres,HuggingFace";
    try {
      const state = new StubState();
      const db = call(state, "external-data-sources-db-schema", {
        source_type: "Postgres",
        payload: PG_PAYLOAD,
      });
      assert.equal(db.isError, true);
      assert.match(db.text, /Could not resolve the database host/);

      // A key-authenticated SaaS gets the key error, not the host one.
      const hf = call(state, "external-data-sources-db-schema", {
        source_type: "HuggingFace",
        payload: { api_token: "placeholder", author: "acme" },
      });
      assert.equal(hf.isError, true);
      assert.match(hf.text, /rejected the API key/);

      // And a create for a failing kind is refused too, so nothing is recorded.
      const create = call(state, "external-data-sources-create", {
        source_type: "Postgres",
        payload: PG_PAYLOAD,
      });
      assert.equal(create.isError, true);
      assert.equal(state.created.length, 0);
    } finally {
      delete process.env.MCP_STUB_FAIL_KINDS;
    }
  });
});

describe("grammar", () => {
  it("lists and searches tool names", () => {
    const state = new StubState();
    const all = JSON.parse(runExec("tools", state, fixtures).text) as string[];
    assert.ok(all.includes("external-data-sources-create"));

    const hits = JSON.parse(
      runExec("search external-data-sources-wizard$", state, fixtures).text,
    ) as string[];
    assert.deepEqual(hits, ["external-data-sources-wizard"]);
  });

  it("prints info in prod's layout and drills into the schema", () => {
    const state = new StubState();
    const info = runExec("info external-data-sources-create", state, fixtures);
    assert.match(info.text, /^name: external-data-sources-create$/m);
    assert.match(info.text, /^inputSchema: /m);

    const field = JSON.parse(
      runExec("schema external-data-sources-create payload", state, fixtures).text,
    );
    assert.equal(field.type, "object");
  });

  it("rejects an unknown schema path and says what is available", () => {
    const state = new StubState();
    const result = runExec(
      "schema external-data-sources-create nope",
      state,
      fixtures,
    );
    assert.equal(result.isError, true);
    assert.match(result.text, /Available: source_type, payload/);
  });

  it("errors cleanly on an unknown tool, for info and for call", () => {
    const state = new StubState();
    for (const command of [
      "info external-data-sources-invented",
      'call external-data-sources-invented {"a": 1}',
    ]) {
      const result = runExec(command, state, fixtures);
      assert.equal(result.isError, true, `${command} did not error`);
      assert.match(result.text, /Unknown tool/);
    }
  });

  it("errors cleanly on an unknown verb", () => {
    const result = runExec("frobnicate everything", new StubState(), fixtures);
    assert.equal(result.isError, true);
    assert.match(result.text, /Unknown command "frobnicate"/);
  });

  it("errors cleanly on malformed JSON input", () => {
    const state = new StubState();
    const result = runExec(
      "call external-data-sources-create {not json}",
      state,
      fixtures,
    );
    assert.equal(result.isError, true);
    assert.match(result.text, /not valid JSON/);
  });

  it("strips a posthog: namespace prefix", () => {
    const state = new StubState();
    const result = runExec("info posthog:external-data-sources-list", state, fixtures);
    assert.equal(result.isError, false);
    assert.match(result.text, /^name: external-data-sources-list$/m);
  });

  it("demands info before a call only when asked to", () => {
    process.env.MCP_STUB_REQUIRE_INFO = "true";
    try {
      const state = new StubState();
      const first = call(state, "external-data-sources-list", {});
      assert.equal(first.isError, true);
      assert.match(first.text, /Run `info external-data-sources-list` before/);

      runExec("info external-data-sources-list", state, fixtures);
      assert.equal(call(state, "external-data-sources-list", {}).isError, false);
    } finally {
      delete process.env.MCP_STUB_REQUIRE_INFO;
    }
  });
});

describe("wizard config", () => {
  it("returns only the kinds asked for", () => {
    const state = new StubState();
    const out = JSON.parse(
      call(state, "external-data-sources-wizard", {
        source_type: "Postgres,Stripe",
      }).text,
    );
    assert.deepEqual(Object.keys(out).sort(), ["Postgres", "Stripe"]);
  });

  it("projects the requested fields", () => {
    const state = new StubState();
    const out = JSON.parse(
      call(state, "external-data-sources-wizard", {
        source_type: "Postgres",
        fields: ["*.name", "*.caption"],
      }).text,
    );
    assert.deepEqual(Object.keys(out.Postgres).sort(), ["caption", "name"]);
  });

  it("says which kinds it carries when none of them match", () => {
    const state = new StubState();
    const result = call(state, "external-data-sources-wizard", {
      source_type: "NotARealSource",
    });
    assert.equal(result.isError, true);
    assert.match(result.text, /mcp-stub carries/);
  });
});

describe("over the wire", () => {
  let stub: McpStub;
  let client: Client;

  before(async () => {
    stub = await startMcpStub({ port: 0, journalPath: journal });
    client = new Client({ name: "mcp-stub-test", version: "1.0.0" });
    await client.connect(new StreamableHTTPClientTransport(new URL(stub.url)));
  });

  after(async () => {
    await client.close().catch(() => undefined);
    await stub.stop();
  });

  it("exposes exactly one tool, named exec", async () => {
    const { tools } = await client.listTools();
    assert.deepEqual(
      tools.map((t) => t.name),
      ["exec"],
    );
  });

  it("serves instructions the wizard can put in its system prompt", () => {
    assert.match(client.getInstructions() ?? "", /call <tool> <json_input>/);
  });

  it("runs a create and a list through the transport", async () => {
    const create = await client.callTool({
      name: "exec",
      arguments: {
        command: `call --json external-data-sources-create ${JSON.stringify({
          source_type: "Postgres",
          payload: PG_PAYLOAD,
          prefix: "e2e_wire_",
        })}`,
      },
    });
    assert.notEqual(create.isError, true);

    const list = await client.callTool({
      name: "exec",
      arguments: { command: "call --json external-data-sources-list {}" },
    });
    const text = ((list.content ?? []) as Array<{ text?: string }>)[0]?.text ?? "";
    const parsed = JSON.parse(text);
    assert.equal(parsed.count, 1);
    assert.equal(parsed.results[0].prefix, "e2e_wire_");
  });

  it("reports an unknown MCP tool as an error rather than a lie", async () => {
    const result = await client.callTool({ name: "not-exec", arguments: {} });
    assert.equal(result.isError, true);
  });
});
