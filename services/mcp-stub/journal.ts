/**
 * The journal — the evidence the assertion layer reads.
 *
 * Every tool call the wizard's agent makes lands here as one
 * `{ tool, input, at }` entry, in order. "Did the run actually create a
 * Postgres source?" is answered by reading this file, not by diffing a real
 * PostHog project.
 *
 * The file stays a valid JSON array after every write, so a run that is killed
 * mid-flight still leaves a readable journal.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

export interface JournalEntry {
  /**
   * The PostHog tool the agent asked for (e.g. `external-data-sources-create`),
   * or `exec:<verb>` for a grammar verb that is not a call (`exec:info`,
   * `exec:search`). Recording the verbs too is what lets an assertion check
   * that `info` came before the first `call`.
   */
  tool: string;
  input: unknown;
  /** ISO timestamp. */
  at: string;
}

/**
 * Values whose key is not known to be secret but whose *shape* is. Redaction
 * runs over these too, so a credential pasted into the wrong field is still
 * kept out of the journal.
 */
const KEY_SHAPED = /^(phx_|phc_|phs_|sk_(live|test)_|rk_(live|test)_|hf_|pat-|ghp_|xox[baprs]-)/;

const REDACTED = "<redacted>";

/** `MCP_STUB_REDACT=false` turns redaction off for local debugging. */
function redactionEnabled(): boolean {
  return process.env.MCP_STUB_REDACT !== "false";
}

/**
 * Replace secret values with `<redacted:N>` — the field name and the value's
 * length survive, the value does not.
 *
 * An assertion needs to know *that* a password was supplied and that the run
 * did not send an empty string. It never needs the password. Keeping the length
 * gives the first two answers without storing the third.
 */
export function redact(value: unknown, secretKeys: ReadonlySet<string>): unknown {
  if (!redactionEnabled()) return value;

  const walk = (node: unknown, key?: string): unknown => {
    if (Array.isArray(node)) return node.map((item) => walk(item));
    if (node && typeof node === "object") {
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
        out[k] = walk(v, k);
      }
      return out;
    }
    if (typeof node === "string") {
      if (key && secretKeys.has(key)) return `<redacted:${node.length}>`;
      if (KEY_SHAPED.test(node)) return REDACTED;
    }
    return node;
  };

  return walk(value);
}

/** Path the journal is written to, or null when `MCP_STUB_JOURNAL` is unset. */
export function journalPath(): string | null {
  return process.env.MCP_STUB_JOURNAL || null;
}

/** Read the journal back. Returns `[]` for a missing or unreadable file. */
export function readJournal(path: string): JournalEntry[] {
  if (!existsSync(path)) return [];
  try {
    const parsed: unknown = JSON.parse(readFileSync(path, "utf8"));
    return Array.isArray(parsed) ? (parsed as JournalEntry[]) : [];
  } catch {
    return [];
  }
}

/**
 * Append one entry. Read-modify-write of the whole array: a warehouse run makes
 * tens of calls, not thousands, and this keeps the file parseable at every
 * point in between.
 */
export function appendJournal(entry: JournalEntry, path = journalPath()): void {
  if (!path) return;
  mkdirSync(dirname(path), { recursive: true });
  const entries = readJournal(path);
  entries.push(entry);
  writeFileSync(path, `${JSON.stringify(entries, null, 2)}\n`, "utf8");
}

/** Start a run with an empty journal, so a stale file cannot pass a check. */
export function resetJournal(path = journalPath()): void {
  if (!path) return;
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, "[]\n", "utf8");
}
