/**
 * The `exec` grammar.
 *
 * The wizard reaches PostHog through exactly one MCP tool, `posthog_exec`, and
 * drives it with a CLI-style string: `tools`, `search <regex>`, `info <tool>`,
 * `schema <tool> <path>`, `call <tool> <json>`. This module is that grammar,
 * answered from recorded fixtures, plus the small amount of state a stub needs
 * to be useful: the sources a run created, so `-list` can reflect them.
 *
 * Nothing here reaches the network. A run against this module creates no real
 * warehouse source and consumes no real credential.
 */

import {
  flattenFields,
  requiredFieldNames,
  secretFieldNames,
  type DbSchemaError,
  type Fixtures,
  type SourceWizardEntry,
} from "./fixtures.js";
import { appendJournal, redact } from "./journal.js";

/** One source a run created, in the shape `external-data-sources-list` returns. */
export interface CreatedSource {
  id: string;
  source_type: string;
  prefix: string | null;
  description: string | null;
  status: string;
  created_at: string;
  access_method: string;
  schemas: Array<{ name: string; should_sync: boolean; sync_type: string | null }>;
  /** The payload the agent sent, with secret values redacted. */
  recorded_payload: unknown;
}

export interface ExecResult {
  text: string;
  isError: boolean;
}

/**
 * Per-run state. One instance per stub server, shared across HTTP requests —
 * the wizard's client is stateless per request but the run is not.
 */
export class StubState {
  readonly created: CreatedSource[] = [];
  /** Tools the agent has run `info` on, so an assertion can check the order. */
  readonly infoSeen = new Set<string>();
  private seq = 0;

  /**
   * A synthetic source id shaped like the UUIDv7 prod returns, but with a
   * `5747` marker in the middle so a real id can never be confused for one.
   */
  nextSourceId(): string {
    this.seq += 1;
    const counter = this.seq.toString(16).padStart(12, "0");
    return `00000000-0000-7000-5747-${counter}`;
  }
}

/** Kinds the stub must reject, from `MCP_STUB_FAIL_KINDS` (comma-separated). */
function failKinds(): Set<string> {
  return new Set(
    (process.env.MCP_STUB_FAIL_KINDS ?? "")
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean),
  );
}

/** `info` before the first `call`, enforced only when explicitly asked for. */
function requireInfo(): boolean {
  return process.env.MCP_STUB_REQUIRE_INFO === "true";
}

// ============================================================================
// Grammar
// ============================================================================

/** Run one `exec` command string. Never throws — errors come back as results. */
export function runExec(
  command: string,
  state: StubState,
  fixtures: Fixtures,
): ExecResult {
  const trimmed = command.trim();
  const [verb, ...rest] = trimmed.split(/\s+/);

  try {
    switch (verb) {
      case "tools":
        return handleTools(fixtures);
      case "search":
        return handleSearch(rest.join(" "), fixtures);
      case "info":
        return handleInfo(rest, state, fixtures);
      case "schema":
        return handleSchema(rest, fixtures);
      case "call":
        return handleCall(trimmed, state, fixtures);
      default:
        return error(
          `Unknown command "${verb || "(empty)"}". Supported: tools, search <regex>, ` +
            `info <tool>, schema <tool> [path], call <tool> <json>.`,
        );
    }
  } catch (err) {
    return error(`mcp-stub failed to handle "${trimmed}": ${(err as Error).message}`);
  }
}

function ok(text: string): ExecResult {
  return { text, isError: false };
}

function error(text: string): ExecResult {
  return { text, isError: true };
}

/** Every tool name the stub knows about. */
function knownNames(fixtures: Fixtures): string[] {
  return [
    ...new Set([
      ...fixtures.toolSearch.names,
      ...Object.keys(fixtures.toolInfo.tools),
    ]),
  ].sort();
}

function handleTools(fixtures: Fixtures): ExecResult {
  journal("exec:tools", {});
  return ok(JSON.stringify(knownNames(fixtures)));
}

function handleSearch(pattern: string, fixtures: Fixtures): ExecResult {
  journal("exec:search", { pattern });
  if (!pattern) return error("search needs a pattern: search <regex>");
  let re: RegExp;
  try {
    re = new RegExp(pattern, "i");
  } catch {
    // Prod falls back to word matching for a query that is not valid regex.
    const words = pattern.toLowerCase().split(/\s+/);
    const hits = knownNames(fixtures).filter((n) =>
      words.every((w) => n.toLowerCase().includes(w)),
    );
    return ok(JSON.stringify(hits));
  }
  return ok(JSON.stringify(knownNames(fixtures).filter((n) => re.test(n))));
}

/** Strip flags and a `posthog:` namespace prefix from a tool argument. */
function toolNameFrom(args: string[]): { name: string; json: boolean } {
  const json = args.includes("--json");
  const name = args.find((a) => !a.startsWith("--")) ?? "";
  return { name: name.replace(/^posthog:/, ""), json };
}

function handleInfo(
  args: string[],
  state: StubState,
  fixtures: Fixtures,
): ExecResult {
  const { name, json } = toolNameFrom(args);
  journal("exec:info", { tool: name });

  if (!name) return error("info needs a tool name: info <tool>");
  const info = fixtures.toolInfo.tools[name];
  if (!info) return unknownTool(name, fixtures);

  state.infoSeen.add(name);

  if (json) return ok(JSON.stringify(info));

  // Same layout prod prints: scalar lines, then the schema as a JSON string.
  const annotations = Object.entries(info.annotations)
    .map(([k, v]) => `  ${k}: ${v}`)
    .join("\n");
  return ok(
    [
      `name: ${info.name}`,
      `title: ${info.title}`,
      `description: ${JSON.stringify(info.description)}`,
      "annotations:",
      annotations,
      `inputSchema: ${JSON.stringify(JSON.stringify(info.inputSchema))}`,
    ].join("\n"),
  );
}

function handleSchema(args: string[], fixtures: Fixtures): ExecResult {
  const { name } = toolNameFrom(args);
  const path = args.filter((a) => !a.startsWith("--"))[1] ?? "";
  journal("exec:schema", { tool: name, path });

  if (!name) return error("schema needs a tool name: schema <tool> [path]");
  const info = fixtures.toolInfo.tools[name];
  if (!info) return unknownTool(name, fixtures);
  if (!path) return ok(JSON.stringify(info.inputSchema));

  let node: unknown = info.inputSchema;
  for (const segment of path.split(".")) {
    const props = (node as { properties?: Record<string, unknown> })?.properties;
    const next = props?.[segment] ?? (node as Record<string, unknown>)?.[segment];
    if (next === undefined) {
      const available = Object.keys(props ?? {}).join(", ") || "(none)";
      return error(
        `Unknown path "${path}" on ${name}. Available: ${available}`,
      );
    }
    node = next;
  }
  return ok(JSON.stringify(node));
}

function unknownTool(name: string, fixtures: Fixtures): ExecResult {
  const near = knownNames(fixtures)
    .filter((n) => n.split("-").some((part) => name.includes(part)))
    .slice(0, 5);
  return error(
    `Unknown tool "${name}". ` +
      (near.length
        ? `Similar: ${near.join(", ")}.`
        : "Run `tools` for the list.") +
      " (mcp-stub only carries the data-warehouse tools.)",
  );
}

// ============================================================================
// call
// ============================================================================

function handleCall(
  command: string,
  state: StubState,
  fixtures: Fixtures,
): ExecResult {
  // `call [--json] [--confirm] <tool> <json…>` — the JSON payload is the rest
  // of the line, so split on the tool name rather than on whitespace.
  const match = command.match(
    /^call\s+((?:--\w+\s+)*)(\S+)\s*([\s\S]*)$/,
  );
  if (!match) return error("call needs a tool and JSON: call <tool> <json>");

  const name = match[2].replace(/^posthog:/, "");
  const raw = match[3].trim() || "{}";

  let input: Record<string, unknown>;
  try {
    input = JSON.parse(raw) as Record<string, unknown>;
  } catch (err) {
    journal(name, { parseError: raw.slice(0, 200) });
    return error(
      `Input for ${name} is not valid JSON: ${(err as Error).message}`,
    );
  }

  const secrets = secretKeysFor(input, fixtures);
  journal(name, redact(input, secrets));

  if (!fixtures.toolInfo.tools[name]) return unknownTool(name, fixtures);
  if (requireInfo() && !state.infoSeen.has(name)) {
    return error(
      `Run \`info ${name}\` before calling it — the schema is not in context yet.`,
    );
  }

  switch (name) {
    case "external-data-sources-wizard":
      return callWizard(input, fixtures);
    case "external-data-sources-db-schema":
      return callDbSchema(input, fixtures);
    case "external-data-sources-create":
      return callCreate(input, state, fixtures);
    case "external-data-sources-list":
      return callList(input, state);
    default:
      return error(
        `mcp-stub has no handler for "${name}". It implements the data-warehouse ` +
          "tools only; add one in services/mcp-stub/exec.ts if the flow needs it.",
      );
  }
}

/** Secret field names for whatever kind this input names, for the journal. */
function secretKeysFor(
  input: Record<string, unknown>,
  fixtures: Fixtures,
): Set<string> {
  const kind = typeof input.source_type === "string" ? input.source_type : "";
  const entry = fixtures.sourcesWizard.sources[kind];
  if (entry) return secretFieldNames(entry);
  // Unknown kind: fall back to the union of every source's secret fields, so a
  // credential still never lands in the journal.
  const all = new Set<string>();
  for (const source of Object.values(fixtures.sourcesWizard.sources)) {
    for (const field of secretFieldNames(source)) all.add(field);
  }
  return all;
}

function callWizard(
  input: Record<string, unknown>,
  fixtures: Fixtures,
): ExecResult {
  const all = fixtures.sourcesWizard.sources;
  const requested =
    typeof input.source_type === "string"
      ? input.source_type.split(",").map((s) => s.trim()).filter(Boolean)
      : Object.keys(all);

  const missing = requested.filter((kind) => !all[kind]);
  const found = requested.filter((kind) => all[kind]);
  if (found.length === 0) {
    return error(
      `No recorded source config for: ${missing.join(", ")}. ` +
        `mcp-stub carries ${Object.keys(all).join(", ")}. ` +
        "Add the kind to record.ts and re-run `pnpm mcp-stub:record`.",
    );
  }

  const fields = Array.isArray(input.fields)
    ? (input.fields as string[]).map((f) => f.replace(/^\*\./, ""))
    : null;

  const out: Record<string, unknown> = {};
  for (const kind of found) {
    const entry = all[kind] as unknown as Record<string, unknown>;
    if (!fields) {
      out[kind] = entry;
      continue;
    }
    const projected: Record<string, unknown> = {};
    for (const key of fields) projected[key] = entry[key];
    out[kind] = projected;
  }
  return ok(JSON.stringify(out));
}

/**
 * Validate credentials the way prod does, and return the table list on success.
 *
 * Three failures are intrinsic and always apply: an unknown source type, a
 * missing required field, and a kind named in `MCP_STUB_FAIL_KINDS`. The last
 * one is how a fixture drives its `attemptedFailOk` case — the credentials the
 * e2e profile supplies are placeholders, so the stub cannot decide "invalid"
 * by looking at them.
 */
function callDbSchema(
  input: Record<string, unknown>,
  fixtures: Fixtures,
): ExecResult {
  const kind = String(input.source_type ?? "");
  const payload = (input.payload ?? {}) as Record<string, unknown>;

  const failure = validate(kind, payload, fixtures);
  if (failure) return error(failure);

  const tables = fixtures.dbSchema.tables[kind];
  if (!tables) {
    return error(
      `mcp-stub has no recorded table list for "${kind}". ` +
        "Add it to fixtures/db-schema.json via `pnpm mcp-stub:record`.",
    );
  }
  return ok(JSON.stringify(tables.rows));
}

function callCreate(
  input: Record<string, unknown>,
  state: StubState,
  fixtures: Fixtures,
): ExecResult {
  const kind = String(input.source_type ?? "");
  const payload = (input.payload ?? {}) as Record<string, unknown>;

  const failure = validate(kind, payload, fixtures);
  if (failure) return error(failure);

  const declared = Array.isArray(payload.schemas)
    ? (payload.schemas as Array<Record<string, unknown>>)
    : null;
  const discovered = fixtures.dbSchema.tables[kind]?.rows ?? [];

  const created: CreatedSource = {
    id: state.nextSourceId(),
    source_type: kind,
    prefix: typeof input.prefix === "string" ? input.prefix : null,
    description: typeof input.description === "string" ? input.description : null,
    status: "Running",
    created_at: new Date().toISOString(),
    access_method:
      typeof input.access_method === "string" ? input.access_method : "warehouse",
    // `schemas` is optional: omit it and prod syncs every discovered table.
    schemas: (declared ?? discovered.map((t) => ({ name: t.table }))).map((s) => ({
      name: String((s as { name?: unknown }).name ?? ""),
      should_sync: (s as { should_sync?: boolean }).should_sync ?? true,
      sync_type: ((s as { sync_type?: string }).sync_type ?? null) as string | null,
    })),
    recorded_payload: redact(payload, secretKeysFor(input, fixtures)),
  };

  state.created.push(created);
  return ok(JSON.stringify(created));
}

function callList(
  input: Record<string, unknown>,
  state: StubState,
): ExecResult {
  const search =
    typeof input.search === "string" ? input.search.toLowerCase() : null;
  const offset = Number(input.offset ?? 0);
  const limit = Number(input.limit ?? 100);

  const matching = state.created.filter(
    (s) =>
      !search ||
      s.source_type.toLowerCase().includes(search) ||
      (s.prefix ?? "").toLowerCase().includes(search),
  );

  return ok(
    JSON.stringify({
      count: matching.length,
      next: null,
      previous: null,
      results: matching.slice(offset, offset + limit),
    }),
  );
}

/** Returns the prod error text for the first problem found, or null. */
function validate(
  kind: string,
  payload: Record<string, unknown>,
  fixtures: Fixtures,
): string | null {
  const entry: SourceWizardEntry | undefined =
    fixtures.sourcesWizard.sources[kind];

  if (!entry) {
    return fill(fixtures.dbSchema.errors["unknown-source-type"], {
      source_type: kind || "(missing)",
    });
  }

  if (failKinds().has(kind)) {
    // Pick the failure that fits the source: a database gets the host error, a
    // key-authenticated SaaS gets the rejected-key one.
    const hasHost = flattenFields(entry.fields).some((f) => f.name === "host");
    const key = hasHost ? "unresolvable-host" : "rejected-api-key";
    return fill(fixtures.dbSchema.errors[key], {});
  }

  const missing = requiredFieldNames(entry, payload).filter((name) => {
    const value = payload[name];
    return value === undefined || value === null || value === "";
  });
  if (missing.length > 0) {
    return fill(fixtures.dbSchema.errors["missing-field"], {
      source_type: kind,
      fields: missing.join(", "),
    });
  }

  return null;
}

/** Substitute `{placeholders}` in a recorded error string. */
function fill(
  recorded: DbSchemaError | undefined,
  values: Record<string, string>,
): string {
  if (!recorded) return "mcp-stub: no recorded error for this case.";
  let text = recorded.text;
  for (const [key, value] of Object.entries(values)) {
    text = text.replaceAll(`{${key}}`, value);
  }
  return text.replaceAll("{project_id}", process.env.PROJECT_ID ?? "0");
}

function journal(tool: string, input: unknown): void {
  appendJournal({ tool, input, at: new Date().toISOString() });
}
