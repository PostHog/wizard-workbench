/**
 * Fixture loading for the stub MCP server.
 *
 * Everything the stub answers with comes from `fixtures/`, and everything in
 * `fixtures/` is recorded from production by `record.ts`. Nothing here invents
 * a response — if a fixture is missing, the stub says so rather than guessing,
 * because a guessed schema is exactly the kind of drift these tests exist to
 * catch.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export const FIXTURES_DIR = join(import.meta.dirname, "fixtures");

/** Provenance header every fixture file carries. */
export interface RecordedHeader {
  recordedAt?: string;
  recordedFrom?: string;
  recordedBy?: string;
  command?: string;
  note?: string;
  redaction?: string;
}

/** One tool as `info <tool>` describes it. */
export interface ToolInfo {
  name: string;
  title: string;
  description: string;
  annotations: Record<string, boolean>;
  inputSchema: JsonValue;
}

export interface ToolInfoFixture {
  _recorded: RecordedHeader;
  tools: Record<string, ToolInfo>;
}

export interface ToolSearchFixture {
  _recorded: RecordedHeader;
  names: string[];
}

/** One credential field from `external-data-sources-wizard`. */
export interface SourceField {
  name: string;
  label?: string;
  type?: string;
  required?: boolean;
  secret?: boolean;
  placeholder?: string | null;
  /** `select` fields nest a field set per option; `switch-group` nests directly. */
  options?: Array<{ value: string; label: string; fields?: SourceField[] }>;
  fields?: SourceField[];
}

export interface SourceWizardEntry {
  name: string;
  caption: string;
  docsUrl: string;
  featured: boolean;
  fields: SourceField[];
}

export interface SourcesWizardFixture {
  _recorded: RecordedHeader;
  sources: Record<string, SourceWizardEntry>;
}

export interface DbSchemaError {
  _recorded?: RecordedHeader;
  status: number;
  /** The full error string prod returns, including the `URL:` and status lines. */
  text: string;
  /** Just the `message` body, for callers that only want the sentence. */
  message: string;
}

export interface DbSchemaTable {
  table: string;
  incremental_available: boolean;
  append_available: boolean;
  cdc_available: boolean;
  supports_webhooks: boolean;
  detected_primary_keys: string[];
  available_columns: Array<{ name: string; type: string; nullable: boolean }>;
  rows: number;
  incremental_fields: Array<{
    field: string;
    field_type: string;
    label: string;
    type: string;
  }>;
}

export interface DbSchemaFixture {
  _recorded: RecordedHeader;
  errors: Record<string, DbSchemaError>;
  tables: Record<
    string,
    { source: "recorded" | "synthesized"; note: string; rows: DbSchemaTable[] }
  >;
}

export interface Fixtures {
  toolInfo: ToolInfoFixture;
  toolSearch: ToolSearchFixture;
  sourcesWizard: SourcesWizardFixture;
  dbSchema: DbSchemaFixture;
}

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

function readFixture<T>(file: string): T {
  const path = join(FIXTURES_DIR, file);
  try {
    return JSON.parse(readFileSync(path, "utf8")) as T;
  } catch (error) {
    throw new Error(
      `mcp-stub: could not read fixture ${file} — ${(error as Error).message}. ` +
        `Refresh it with: POSTHOG_PERSONAL_API_KEY=phx_... pnpm mcp-stub:record`,
    );
  }
}

/** Load every fixture. Throws with a fixable message if one is missing. */
export function loadFixtures(): Fixtures {
  return {
    toolInfo: readFixture<ToolInfoFixture>("tool-info.json"),
    toolSearch: readFixture<ToolSearchFixture>("tool-search.json"),
    sourcesWizard: readFixture<SourcesWizardFixture>("sources-wizard.json"),
    dbSchema: readFixture<DbSchemaFixture>("db-schema.json"),
  };
}

/** Write one fixture back. Used only by `record.ts`. */
export function writeFixture(file: string, value: unknown): void {
  writeFileSync(
    join(FIXTURES_DIR, file),
    `${JSON.stringify(value, null, 2)}\n`,
    "utf8",
  );
}

/**
 * Flatten a source's credential fields, descending through `select` options and
 * `switch-group` nests. The stub needs the flat list to know which field names
 * are valid and which ones hold a secret.
 */
export function flattenFields(fields: SourceField[]): SourceField[] {
  const flat: SourceField[] = [];
  for (const field of fields) {
    flat.push(field);
    if (field.fields) flat.push(...flattenFields(field.fields));
    for (const option of field.options ?? []) {
      if (option.fields) flat.push(...flattenFields(option.fields));
    }
  }
  return flat;
}

/** Field names a source marks `secret: true` — the values the stub redacts. */
export function secretFieldNames(entry: SourceWizardEntry): Set<string> {
  return new Set(
    flattenFields(entry.fields)
      .filter((f) => f.secret === true)
      .map((f) => f.name),
  );
}

/**
 * Required field names for one payload, so the stub can return prod's
 * missing-field error.
 *
 * A `select` field branches: only the chosen option's fields are required, and
 * the choice comes from the payload (or the field's `defaultValue`). Stripe is
 * the case that matters — `auth_method: "api_key"` requires a secret key,
 * `"oauth"` requires an integration id instead. `oauth` and `ssh-tunnel` fields
 * are never asked for in the terminal, so they are never required here.
 */
export function requiredFieldNames(
  entry: SourceWizardEntry,
  payload: Record<string, unknown>,
): string[] {
  const required: string[] = [];

  const visit = (fields: SourceField[]): void => {
    for (const field of fields) {
      if (field.type === "oauth" || field.type === "ssh-tunnel") continue;
      if (field.type === "select") {
        const chosen =
          payload[field.name] ??
          (field as { defaultValue?: string }).defaultValue;
        const option = field.options?.find((o) => o.value === chosen);
        if (option?.fields) visit(option.fields);
        continue;
      }
      if (field.fields) continue; // switch-group: its fields are all optional
      if (field.required === true) required.push(field.name);
    }
  };

  visit(entry.fields);
  return required;
}
