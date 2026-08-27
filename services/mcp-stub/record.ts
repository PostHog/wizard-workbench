/**
 * Refresh the stub's fixtures from production.
 *
 *   POSTHOG_PERSONAL_API_KEY=phx_... pnpm mcp-stub:record
 *
 * Connects to the real PostHog MCP over the same Streamable HTTP transport the
 * wizard uses, drives the same `exec` grammar, redacts, and writes
 * `fixtures/*.json`. Rerun it whenever a source's credential fields change,
 * whenever a validation message is reworded, or whenever a fixture app starts
 * using a kind the stub has never seen.
 *
 * Why record rather than hand-author: these tests exist to catch the wizard
 * drifting from PostHog's real API. A hand-written fixture drifts with the
 * wizard and catches nothing.
 *
 * Options:
 *   --kinds Postgres,Stripe   which source kinds to capture (default: the ones
 *                             the fixture apps under apps/warehouse use)
 *   --url <url>               MCP url (default https://mcp.posthog.com/mcp)
 *   --dry-run                 print what would be written, write nothing
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

import { writeFixture, type RecordedHeader } from "./fixtures.js";

const PROD_MCP_URL = "https://mcp.posthog.com/mcp";

/** The kinds the fixture apps under `apps/warehouse` detect today. */
const DEFAULT_KINDS = [
  "Postgres",
  "Stripe",
  "Supabase",
  "HuggingFace",
  "Hubspot",
];

/** The tools the warehouse flow uses. */
const TOOLS = [
  "external-data-sources-wizard",
  "external-data-sources-db-schema",
  "external-data-sources-create",
  "external-data-sources-list",
];

const SEARCH_PATTERN = "external-data-sources";

/**
 * Redaction, applied to everything before it is written.
 *
 * 1. Prod error messages quote the request URL, which names an internal cluster
 *    service. Rewrite that origin — the status code and message body, which are
 *    what the agent reads, stay byte-for-byte.
 * 2. Anything key-shaped is replaced outright.
 * 3. Project ids in paths become a placeholder the stub fills in at run time.
 */
const REDACTIONS: Array<[RegExp, string]> = [
  [/https?:\/\/[a-z0-9.-]*posthog-web[a-z0-9.-]*(?::\d+)?/gi, "https://app.posthog.example"],
  [/https?:\/\/[a-z0-9.-]+\.svc\.cluster\.local(?::\d+)?/gi, "https://app.posthog.example"],
  [/\/api\/projects\/\d+\//g, "/api/projects/{project_id}/"],
  [/\b(phx|phc|phs)_[A-Za-z0-9]{10,}/g, "<redacted>"],
  [/\b(sk|rk)_(live|test)_[A-Za-z0-9]{10,}/g, "<redacted>"],
  [/\bhf_[A-Za-z0-9]{10,}/g, "<redacted>"],
  [/\bacct_[A-Za-z0-9]{8,}/g, "<redacted>"],
  [/\bpat-[A-Za-z0-9-]{10,}/g, "<redacted>"],
  [/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, "redacted@example.com"],
];

export function redactText(text: string): string {
  let out = text;
  for (const [pattern, replacement] of REDACTIONS) {
    out = out.replace(pattern, replacement);
  }
  return out;
}

function redactDeep<T>(value: T): T {
  return JSON.parse(redactText(JSON.stringify(value))) as T;
}

interface Options {
  kinds: string[];
  url: string;
  dryRun: boolean;
}

function parseArgs(argv: string[]): Options {
  const opts: Options = {
    kinds: DEFAULT_KINDS,
    url: process.env.MCP_URL || PROD_MCP_URL,
    dryRun: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--kinds") {
      opts.kinds = argv[i + 1].split(",").map((k) => k.trim()).filter(Boolean);
      i += 1;
    } else if (argv[i] === "--url") {
      opts.url = argv[i + 1];
      i += 1;
    } else if (argv[i] === "--dry-run") {
      opts.dryRun = true;
    }
  }
  return opts;
}

/** Run one `exec` command against prod and return its text. */
async function exec(client: Client, command: string): Promise<string> {
  const result = await client.callTool({
    name: "exec",
    arguments: { command, context: "Recording fixtures for the wizard-workbench stub MCP server." },
  });
  const content = (result.content ?? []) as Array<{ type: string; text?: string }>;
  const text = content
    .filter((c) => c.type === "text")
    .map((c) => c.text ?? "")
    .join("\n");
  if (result.isError) throw new Error(`exec "${command}" failed: ${text}`);
  return text;
}

/**
 * Run a command that is expected to fail, and return the error text. Used to
 * capture the validation errors — the load-bearing half of `db-schema.json`.
 */
async function execExpectingError(
  client: Client,
  command: string,
): Promise<string> {
  try {
    const text = await exec(client, command);
    throw new Error(
      `expected "${command}" to fail, but it returned: ${text.slice(0, 200)}`,
    );
  } catch (error) {
    return (error as Error).message.replace(/^exec ".*?" failed: /, "");
  }
}

/** Pull the `message` body out of a prod error string. */
function messageFrom(text: string): string {
  const match = text.match(/"message"\s*:\s*"((?:[^"\\]|\\.)*)"/);
  return match ? JSON.parse(`"${match[1]}"`) : text;
}

function header(command: string): RecordedHeader {
  return {
    recordedAt: new Date().toISOString(),
    recordedFrom: PROD_MCP_URL,
    recordedBy: "services/mcp-stub/record.ts",
    command,
    note: "Recorded from production. Do not hand-edit — run `pnpm mcp-stub:record`.",
  };
}

/** Parse the scalar+schema block `info` prints back into an object. */
function parseInfo(text: string): Record<string, unknown> {
  const line = (key: string): string => {
    const match = text.match(new RegExp(`^${key}: (.*)$`, "m"));
    return match ? match[1] : "";
  };
  const annotations: Record<string, boolean> = {};
  for (const match of text.matchAll(/^ {2}(\w+): (true|false)$/gm)) {
    annotations[match[1]] = match[2] === "true";
  }
  const schemaLine = line("inputSchema");
  return {
    name: line("name"),
    title: line("title"),
    description: JSON.parse(line("description") || '""'),
    annotations,
    inputSchema: JSON.parse(JSON.parse(schemaLine || '"{}"') as string),
  };
}

async function main(): Promise<void> {
  const opts = parseArgs(process.argv.slice(2));
  const apiKey = process.env.POSTHOG_PERSONAL_API_KEY;
  if (!apiKey) {
    console.error(
      "✖ POSTHOG_PERSONAL_API_KEY is required (the phx key). Fixtures are recorded from prod.",
    );
    process.exit(2);
  }

  const client = new Client({ name: "wizard-workbench-mcp-stub-recorder", version: "1.0.0" });
  const transport = new StreamableHTTPClientTransport(new URL(opts.url), {
    requestInit: { headers: { Authorization: `Bearer ${apiKey}` } },
  });
  await client.connect(transport);
  console.log(`connected to ${opts.url}`);

  try {
    // ---- tool-search.json -------------------------------------------------
    const searchText = await exec(client, `search ${SEARCH_PATTERN}`);
    const names = JSON.parse(searchText) as string[];
    const search = {
      _recorded: header(`exec search ${SEARCH_PATTERN}`),
      names,
    };

    // ---- tool-info.json ---------------------------------------------------
    const tools: Record<string, unknown> = {};
    for (const tool of TOOLS) {
      tools[tool] = redactDeep(parseInfo(await exec(client, `info ${tool}`)));
      console.log(`  info ${tool}`);
    }
    const info = { _recorded: header("exec info <tool>"), tools };

    // ---- sources-wizard.json ---------------------------------------------
    const kinds = opts.kinds.join(",");
    const wizardText = await exec(
      client,
      `call --json external-data-sources-wizard {"source_type": ${JSON.stringify(kinds)}}`,
    );
    const sources = redactDeep(JSON.parse(wizardText) as Record<string, unknown>);
    console.log(`  wizard config for ${Object.keys(sources).join(", ")}`);
    const sourcesWizard = {
      _recorded: header(
        `exec call --json external-data-sources-wizard {"source_type": "${kinds}"}`,
      ),
      sources,
    };

    // ---- db-schema.json errors -------------------------------------------
    // Two failures prod can be made to produce without a real credential.
    const hostError = redactText(
      await execExpectingError(
        client,
        'call --json external-data-sources-db-schema {"source_type": "Postgres", "payload": {"host": "db.invalid.example.com", "port": 5432, "database": "postgres", "user": "postgres", "password": "not-a-real-password"}}',
      ),
    );
    const keyError = redactText(
      await execExpectingError(
        client,
        'call --json external-data-sources-db-schema {"source_type": "Stripe", "payload": {"auth_method": "api_key", "stripe_secret_key": "rk_live_not_a_real_key_0000"}}',
      ),
    );
    console.log("  validation errors captured");

    // The table lists are left alone. A database's table list belongs to the
    // customer's database, so prod cannot supply a generic one; the SaaS lists
    // are stable and already recorded. Merging rather than overwriting keeps a
    // refresh from wiping them.
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const existing = JSON.parse(
      readFileSync(join(import.meta.dirname, "fixtures", "db-schema.json"), "utf8"),
    ) as { tables: unknown; errors: Record<string, unknown> };

    const dbSchema = {
      _recorded: header("exec call --json external-data-sources-db-schema …"),
      // Merge, don't replace: the `missing-field` and `unknown-source-type`
      // entries are templates the stub fills in, and prod cannot be made to
      // emit them on demand. A refresh must not drop them.
      errors: {
        ...existing.errors,
        "unresolvable-host": {
          status: 400,
          text: hostError,
          message: messageFrom(hostError),
        },
        "rejected-api-key": {
          status: 400,
          text: keyError,
          message: messageFrom(keyError),
        },
      },
      tables: existing.tables,
    };

    if (opts.dryRun) {
      console.log("\n--dry-run: nothing written. Would write:");
      console.log(`  tool-search.json      ${names.length} names`);
      console.log(`  tool-info.json        ${Object.keys(tools).length} tools`);
      console.log(`  sources-wizard.json   ${Object.keys(sources).length} kinds`);
      console.log(`  db-schema.json        2 errors + existing table lists`);
      return;
    }

    writeFixture("tool-search.json", search);
    writeFixture("tool-info.json", info);
    writeFixture("sources-wizard.json", sourcesWizard);
    writeFixture("db-schema.json", dbSchema);
    console.log("\n✓ fixtures written to services/mcp-stub/fixtures/");
    console.log(
      "  Review the diff before committing — a recording is only as safe as its redactions.",
    );
  } finally {
    await client.close().catch(() => undefined);
  }
}

void main().catch((error: unknown) => {
  console.error(`✖ ${(error as Error).message}`);
  process.exit(1);
});
