/**
 * Warehouse e2e assertions.
 *
 * A warehouse run changes almost no code. It detects sources, asks for
 * credentials, calls the PostHog MCP, and writes a report. So a diff tells you
 * nothing, and the only useful question is: **did the run do what it said it
 * did?**
 *
 * Every check here answers one part of that question from two independent
 * records:
 *
 * - the wizard's result payload (`E2E_RESULT_JSON`) — what the run *claims*
 * - the stub MCP's journal and created-source list — what the run *did*
 *
 * The headline check compares the two in both directions. A run that reports a
 * source it never created fails, and so does a run that creates a source it
 * never reports.
 *
 * Everything in this module is pure. `runE2e` collects the evidence; this
 * module grades it, so the grading is unit-testable without a wizard.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

// ============================================================================
// Inputs
// ============================================================================

/** `apps/<app>/.wizard-ci/expect.json` — the per-fixture expectation file. */
export interface WarehouseExpect {
  /** Wizard program id to drive. Default `warehouse-source`. */
  program?: string;
  /** Kinds that must ALL be detected. Green on the wizard's main. */
  minKinds: string[];
  /** Kinds reported when detected, never enforced (unmerged-branch teeth). */
  optionalKinds: string[];
  /** Kinds that must NOT be detected. */
  forbidKinds: string[];
  /** Kinds the stub must have created. */
  created: string[];
  /**
   * Kinds whose connection attempt may fail, as long as the report says so.
   *
   * "Attempt" is any call that carries a credential payload — production
   * rejects a bad key during schema discovery, before create is ever reached,
   * and the stub reproduces that. So an agent that stops at the first
   * rejection has still attempted the source. See {@link CREDENTIAL_TOOLS}.
   */
  attemptedFailOk: string[];
  /** Kinds that must produce a deep link, and no ask batch and no create. */
  deepLink: string[];
  /**
   * Inclusive [min, max] number of `wizard_ask` batches.
   *
   * A loose sanity bound, not the batching contract. How the model groups a
   * multi-source collection is not stable run to run — the same app and the
   * same config produced 8 batches and then 4 — so a tight total is a coin
   * flip, not a check. Set the ceiling from the in-CLI source count (see
   * {@link askMaxBatchesPerSubject}, which carries the real teeth).
   */
  askBatches: [number, number];
  askMaxPerBatch: number;
  /**
   * Most `wizard_ask` batches one subject may open.
   *
   * This is the credential-batching contract (wizard#1146 / context-mill#360):
   * a source's questions go out together, not one at a time. Per-subject, so
   * it holds however the model spreads the sources across the run, which the
   * total batch count cannot. Two allows one collect plus one follow-up.
   *
   * Only enforced when the wizard supplies batch subjects. An older wizard
   * groups every batch under one ask source, where the count means nothing.
   */
  askMaxBatchesPerSubject: number;
  /** Substring of the expected abort reason, or null for "must not abort". */
  expectAbort: string | null;
  /** True ⇒ the orchestrator seeded-task scenario. */
  seeded: boolean;
  /** Minimum number of task notices the run must show. */
  expectNotices: number;
  /** e.g. `user-declined` when the notice is declined. */
  expectSkipReason: string | null;
  /** `{ "<kind>": "<substring>" }` — assert the reported signal names the file. */
  expectSignalPath?: Record<string, string>;
  /** Check names that report but never fail the leg. */
  advisory?: string[];
  /** `keep` | `decline` — the notice policy this scenario drives. */
  notice?: "keep" | "decline";
  /**
   * Sibling app whose source tree this scenario runs against, e.g.
   * `warehouse-seeded/next-stripe`. Lets a variation be its own matrix leg
   * without a second copy of the fixture. Relative to `apps/`.
   */
  sourceApp?: string;
}

/** One `wizard_ask` batch, from the result payload (contract §2). */
export interface AskRecord {
  id: string;
  source: string;
  subject: string | null;
  questionCount: number;
  questionIds: string[];
  prompts: string[];
  answeredIds: string[];
  sentinelIds: string[];
  /**
   * Ids a `secret` askAnswers rule refused, because the question claimed a
   * credential field without being sensitive free text.
   *
   * Counted in `unansweredAsks` alongside `sentinelIds`, but it is a different
   * failure: the profile *had* a value and withheld it, rather than having none
   * to give. Optional — a wizard from before the split omits the key.
   */
  refusedIds?: string[];
  at: string;
}

/** One task notice the run showed. */
export interface NoticeRecord {
  title: string;
  items: string[];
  decision: "keep" | "decline" | null;
  at: string;
}

/** One source detection reported. */
export interface DetectedSource {
  kind: string;
  label: string;
  mode: string;
  matchedSignal: string;
}

/** The wizard's `E2E_RESULT_JSON` payload, as far as the warehouse cares. */
export interface E2eResult {
  runPhase?: string;
  screenPath?: string[];
  asks?: AskRecord[];
  unansweredAsks?: number;
  /** Of `unansweredAsks`, how many a `secret` rule refused. */
  refusedAsks?: number;
  notices?: NoticeRecord[];
  tasks?: Array<{ label: string; status: string }>;
  detectedSources?: DetectedSource[];
  reportFile?: { path: string; exists: boolean; text?: string } | null;
  abort?: string | null;
}

/** One `{tool, input, at}` entry the stub MCP wrote. */
export interface JournalEntry {
  tool: string;
  input: unknown;
  at: string;
}

/** Everything a check can read. */
export interface WarehouseEvidence {
  expect: WarehouseExpect;
  /** Null when the harness crashed before writing the payload. */
  result: E2eResult | null;
  /** Raw result-JSON text, for the leakage scan. */
  resultText: string;
  journal: JournalEntry[];
  /** Raw journal text, for the leakage scan. */
  journalText: string;
  /** `source_type` of every source the stub actually created, in order. */
  createdKinds: string[];
  /** Source kinds the stub knows about — the registry, recorded from prod. */
  registryKinds: string[];
  /** Secret values the runner injected. None may appear anywhere. */
  injectedSecrets: string[];
  /** Captured TUI frames, concatenated. */
  frameText: string;
}

/** One graded assertion. */
export interface Check {
  name: string;
  ok: boolean;
  detail: string;
  /** True ⇒ reports as ADVISORY and never fails the leg. */
  advisory: boolean;
}

export const CREATE_TOOL = "external-data-sources-create";
export const SCHEMA_TOOL = "external-data-sources-db-schema";

/**
 * Tools whose input carries the credentials a person just typed, and which can
 * therefore reject them.
 *
 * Both count as a connection attempt. `external-data-sources-wizard` does not —
 * it is a config lookup for every kind at once, so counting it would make every
 * kind look attempted.
 */
export const CREDENTIAL_TOOLS: ReadonlySet<string> = new Set([
  SCHEMA_TOOL,
  CREATE_TOOL,
]);

/** Deep-link shape the data-warehouse-source-setup skill emits. */
const DEEP_LINK = /data-warehouse\/new-source\?kind=([A-Za-z0-9_%.-]+)/gi;

/** Statuses a task can no longer leave. */
const TERMINAL_TASK_STATUSES = new Set(["completed", "skipped"]);

// ============================================================================
// expect.json
// ============================================================================

const EXPECT_DEFAULTS: WarehouseExpect = {
  minKinds: [],
  optionalKinds: [],
  forbidKinds: [],
  created: [],
  attemptedFailOk: [],
  deepLink: [],
  askBatches: [0, 99],
  askMaxPerBatch: 99,
  askMaxBatchesPerSubject: 99,
  expectAbort: null,
  seeded: false,
  expectNotices: 0,
  expectSkipReason: null,
};

/** Load `apps/<app>/.wizard-ci/expect.json`, or null when the app has none. */
export function loadExpect(
  appsDir: string,
  app: string,
): WarehouseExpect | null {
  const file = join(appsDir, app, ".wizard-ci", "expect.json");
  let raw: string;
  try {
    raw = readFileSync(file, "utf8");
  } catch {
    return null;
  }
  const parsed = JSON.parse(raw) as Partial<WarehouseExpect>;
  return { ...EXPECT_DEFAULTS, ...parsed };
}

// ============================================================================
// Reading the evidence
// ============================================================================

/** Every `external-data-sources-create` the agent attempted, in order. */
export function attemptedCreates(journal: JournalEntry[]): Array<{
  kind: string;
  input: Record<string, unknown>;
}> {
  return journal
    .filter((e) => e.tool === CREATE_TOOL)
    .map((e) => {
      const input = (e.input ?? {}) as Record<string, unknown>;
      return { kind: String(input.source_type ?? ""), input };
    });
}

/**
 * Every kind the run put real credentials behind, at any stage.
 *
 * Broader than {@link attemptedCreates} on purpose. Production validates a
 * credential during schema discovery and returns a 400 there, so a rejected key
 * never reaches create — an agent that stops at that first rejection and
 * reports it has done the right thing, and must not be graded as if it never
 * tried.
 */
export function credentialAttempts(journal: JournalEntry[]): Set<string> {
  const kinds = new Set<string>();
  for (const entry of journal) {
    if (!CREDENTIAL_TOOLS.has(entry.tool)) continue;
    const input = (entry.input ?? {}) as Record<string, unknown>;
    if (typeof input.source_type === "string" && input.source_type) {
      kinds.add(input.source_type);
    }
  }
  return kinds;
}

/** The report text, or an empty string when no report was written. */
function reportText(result: E2eResult | null): string {
  return result?.reportFile?.text ?? "";
}

/**
 * Every name a source can be called by, so a text scan can find it however the
 * agent chose to write it. `Postgres` also answers to `PostgreSQL`.
 */
function namesFor(kind: string, result: E2eResult | null): string[] {
  const detected = (result?.detectedSources ?? []).find((s) => s.kind === kind);
  return detected ? [kind, detected.label] : [kind];
}

function mentions(text: string, names: string[]): boolean {
  const lower = text.toLowerCase();
  return names.some((n) => n && lower.includes(n.toLowerCase()));
}

/**
 * Kinds the report presents as connected.
 *
 * Line-level and deliberately blunt: a line that names a source and reads like
 * success, with no failure word on it, is a claim. The claim is only ever used
 * to *catch* a run — a missed claim weakens the check, it never invents a
 * failure — so a blunt reading is the safe direction to be wrong in.
 */
export function claimedConnected(
  result: E2eResult | null,
  kinds: string[],
): string[] {
  return claimedConnectedLines(result, kinds).map((c) => c.kind);
}

/**
 * The same claims, each with the report line that produced it.
 *
 * The check is blunt by design, so a reviewer has to be able to tell a real
 * false claim ("Stripe was connected — Source ID …") from a line the reading
 * over-claimed on. Naming the line is what makes that call possible from the
 * CI output alone.
 *
 * Instruction lines are dropped before the reading — see
 * {@link instructionLines}.
 */
export function claimedConnectedLines(
  result: E2eResult | null,
  kinds: string[],
): Array<{ kind: string; line: string }> {
  const success = /\b(connected|created|added|set up|configured|syncing)\b|✅|✓/i;
  const failure =
    /\b(fail|failed|error|could not|couldn't|cannot|can not|can't|unable|not created|skipped|declined|deep.?link|manually|yourself)\b|❌|✖/i;

  const lines = reportText(result).split("\n");
  const instruction = instructionLines(lines);
  const claims: Array<{ kind: string; line: string }> = [];
  for (const kind of kinds) {
    const names = namesFor(kind, result);
    const index = lines.findIndex(
      (line, i) =>
        !instruction[i] &&
        mentions(line, names) &&
        success.test(line) &&
        !failure.test(line),
    );
    if (index >= 0) claims.push({ kind, line: lines[index] as string });
  }
  return claims;
}

/**
 * Which report lines are instructions rather than claims, by index.
 *
 * The success reading stays blunt; this only removes three shapes that are
 * always the agent telling the user to go and do something. Each was a real
 * false positive: a run failed "no silent no-op" on a line telling the user to
 * make a Stripe key, while the deep-link check passed for that same source in
 * the same run — the check contradicted itself.
 *
 * Deliberately narrow. A claim wrongly dropped here weakens the check, and a
 * missed claim is still safer than an invented one, so every rule has to name
 * a shape a genuine "I connected it" line does not take.
 */
function instructionLines(lines: string[]): boolean[] {
  // A heading that opens a section of work left for the user. Everything under
  // it is an instruction, until the next heading.
  const instructionHeading =
    /\b(next steps?|to.?dos?|remaining|manual|action required|what you need|follow.?ups?|before you|still to do|outstanding)\b/i;
  // `## Heading`, or a line that is nothing but bold text — the agent's two
  // usual ways of opening a section.
  const heading = /^\s{0,3}(?:#{1,6}\s+(.*)|\*\*([^*]+)\*\*:?)\s*$/;

  // A line that opens by telling the user to act. List markers, numbering and
  // bold come off first, because an instruction is nearly always a bullet.
  const marker = /^[\s>]*(?:[-*+]|\d+[.)])?\s*\**\s*/;
  const imperative =
    /^(add|create|connect|configure|set up|open|go|visit|navigate|copy|paste|generate|enable|run|click|follow|finish|complete|log ?in|sign ?in|head|make|get|install|provide|enter|choose|select)\b/i;
  // Second person only where it commands. Bare "your" stays a claim — "Your
  // Stripe source is now connected" is a genuine one.
  const directive = /\b(you(?:'ll)? (?:must|need|should|can|will)|please)\b/i;

  // Any http(s) host that is not PostHog's. A line that sends the reader to a
  // vendor dashboard is telling them to do something there, so the success
  // word on it belongs to the credential they must make — not to a source this
  // run connected. PostHog links are exempt: a real claim often carries one.
  const url = /https?:\/\/([^\s/)\]"'<>]+)/gi;
  const posthogHost = /(?:^|\.)posthog\.com$/i;
  const hasVendorUrl = (line: string): boolean => {
    for (const match of line.matchAll(url)) {
      const host = (match[1] ?? "").split(":")[0] ?? "";
      if (!posthogHost.test(host)) return true;
    }
    return false;
  };

  let inInstructionSection = false;
  return lines.map((line) => {
    const isHeading = heading.exec(line);
    if (isHeading) {
      // A `#` heading opens a new section either way, so it can also close an
      // instruction one. A bold-only line cannot: the agent uses it for a
      // per-source sub-heading, and "**Stripe**" under "## Next steps" is
      // still inside those next steps.
      const hashHeading = isHeading[1] !== undefined;
      const text = isHeading[1] ?? isHeading[2] ?? "";
      if (instructionHeading.test(text)) inInstructionSection = true;
      else if (hashHeading) inInstructionSection = false;
      return true;
    }
    if (inInstructionSection) return true;
    if (hasVendorUrl(line)) return true;
    return imperative.test(line.replace(marker, "")) || directive.test(line);
  });
}

/** One question no real answer reached, and why. */
export interface UnansweredQuestion {
  /** The ask batch's id. */
  askId: string;
  /** The batch's subject, or its ask source when the wizard supplies none. */
  subject: string;
  questionId: string;
  /** The question text the agent wrote, clipped to `EXCERPT_MAX` characters. */
  prompt: string;
  /**
   * `sentinel` — no rule matched and the question had no options to fall back
   * on. `refused` — a `secret` rule matched but withheld its value, because the
   * question was not sensitive free text.
   */
  reason: "sentinel" | "refused";
}

/** How much of a question prompt or a report line a check detail carries. */
const EXCERPT_MAX = 120;

/**
 * Every question that got no real answer, named.
 *
 * `unansweredAsks` is only a count, and the count alone cannot tell you which
 * question to write a rule for — that gap is what made the first real run of
 * this tier take a trace archaeology dig to explain. The ids and prompts are
 * already in the result payload, so this is pure reporting.
 */
export function unansweredQuestions(
  result: E2eResult | null,
): UnansweredQuestion[] {
  const out: UnansweredQuestion[] = [];
  for (const ask of result?.asks ?? []) {
    const promptFor = (id: string): string => {
      const i = ask.questionIds.indexOf(id);
      return i >= 0 ? (ask.prompts[i] ?? "") : "";
    };
    const push = (id: string, reason: UnansweredQuestion["reason"]) =>
      out.push({
        askId: ask.id,
        subject: ask.subject ?? ask.source,
        questionId: id,
        prompt: excerpt(promptFor(id)),
        reason,
      });
    for (const id of ask.sentinelIds ?? []) push(id, "sentinel");
    for (const id of ask.refusedIds ?? []) push(id, "refused");
  }
  return out;
}

/** One line, collapsed and clipped, so a check detail stays one line. */
function excerpt(text: string): string {
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length > EXCERPT_MAX ? `${flat.slice(0, EXCERPT_MAX)}…` : flat;
}

/**
 * Replace any injected secret with a marker.
 *
 * These details are printed into a CI log, and a report line or a prompt is
 * agent-written text that may quote back whatever it was given. The leakage
 * check exists to catch that, and it must not be the diagnostics that leak it.
 */
function redactSecrets(text: string, secrets: readonly string[]): string {
  let out = text;
  for (const secret of secrets) {
    if (secret) out = out.split(secret).join("<redacted>");
  }
  return out;
}

/** Kinds named by a deep link in the report. */
export function deepLinkedKinds(result: E2eResult | null): string[] {
  const found = new Set<string>();
  for (const m of reportText(result).matchAll(DEEP_LINK)) {
    found.add(decodeURIComponent(m[1]));
  }
  return [...found];
}

/** Whether any ask batch in the run was about this kind. */
function askedAbout(result: E2eResult | null, names: string[]): boolean {
  return (result?.asks ?? []).some((ask) =>
    mentions([ask.subject ?? "", ...ask.prompts, ...ask.questionIds].join("\n"), names),
  );
}

// ============================================================================
// Checks
// ============================================================================

function check(
  name: string,
  ok: boolean,
  detail: string,
  advisory: Set<string>,
): Check {
  return { name, ok, detail, advisory: advisory.has(name) };
}

/**
 * Grade a run. Returns one {@link Check} per assertion, in reading order —
 * detection first, then what the run did with what it found.
 */
export function warehouseChecks(evidence: WarehouseEvidence): Check[] {
  const { expect, result, journal, createdKinds } = evidence;
  const advisory = new Set(expect.advisory ?? []);
  const add = (name: string, ok: boolean, detail: string): Check =>
    check(name, ok, detail, advisory);

  if (!result) {
    return [
      add(
        "result payload",
        false,
        "the wizard harness wrote no E2E_RESULT_JSON — every warehouse check is ungradeable",
      ),
    ];
  }

  const checks: Check[] = [];
  const detected = result.detectedSources ?? [];
  const detectedKinds = detected.map((s) => s.kind);
  const succeeded = new Set(createdKinds);
  const attempted = attemptedCreates(journal);
  const attemptedKinds = new Set(attempted.map((a) => a.kind));

  // ── detection ────────────────────────────────────────────────────────
  {
    const missing = expect.minKinds.filter((k) => !detectedKinds.includes(k));
    const forbidden = expect.forbidKinds.filter((k) =>
      detectedKinds.includes(k),
    );
    const optionalSeen = expect.optionalKinds.filter((k) =>
      detectedKinds.includes(k),
    );
    const optionalNote = expect.optionalKinds.length
      ? `; optional ${optionalSeen.length}/${expect.optionalKinds.length} seen (${optionalSeen.join(", ") || "none"}, not enforced)`
      : "";
    checks.push(
      add(
        "detection",
        missing.length === 0 && forbidden.length === 0,
        missing.length || forbidden.length
          ? `missing ${missing.join(", ") || "none"}; forbidden but detected ${forbidden.join(", ") || "none"}${optionalNote}`
          : `detected ${detectedKinds.join(", ") || "nothing"}${optionalNote}`,
      ),
    );
  }

  // ── signal path ──────────────────────────────────────────────────────
  {
    const wanted = Object.entries(expect.expectSignalPath ?? {});
    if (wanted.length === 0) {
      checks.push(add("signal path", true, "no expectSignalPath declared"));
    } else {
      const wrong = wanted.filter(([kind, needle]) => {
        const source = detected.find((s) => s.kind === kind);
        return !source || !source.matchedSignal.includes(needle);
      });
      checks.push(
        add(
          "signal path",
          wrong.length === 0,
          wrong.length === 0
            ? `every signal names its real file (${wanted.map(([k]) => k).join(", ")})`
            : wrong
                .map(([kind, needle]) => {
                  const source = detected.find((s) => s.kind === kind);
                  return `${kind}: want a signal naming \`${needle}\`, got ${source ? `\`${source.matchedSignal}\`` : "no detection"}`;
                })
                .join("; "),
        ),
      );
    }
  }

  // ── no silent no-op (the headline) ───────────────────────────────────
  {
    const problems: string[] = [];

    // The run must have created what the fixture says it must create.
    const notCreated = expect.created.filter((k) => !succeeded.has(k));
    for (const kind of notCreated) {
      problems.push(
        attemptedKinds.has(kind)
          ? `${kind}: create attempted but it did not succeed`
          : `${kind}: expected a create, the stub never saw one`,
      );
    }

    // Claimed but absent: the report says connected, the stub says otherwise.
    // Quote the line that carried the claim — the reading is deliberately
    // blunt, so a reviewer needs the line to tell a false success report from
    // an over-reading of an instruction line.
    const claimable = [...new Set([...expect.created, ...detectedKinds])];
    for (const claim of claimedConnectedLines(result, claimable)) {
      if (!succeeded.has(claim.kind)) {
        const line = redactSecrets(
          excerpt(claim.line),
          evidence.injectedSecrets,
        );
        problems.push(
          `${claim.kind}: the report claims it is connected, but no create succeeded — report line: "${line}"`,
        );
      }
    }

    // Created but unreported: a source exists that the run never mentioned.
    for (const kind of succeeded) {
      if (!mentions(reportText(result), namesFor(kind, result))) {
        problems.push(`${kind}: created in PostHog, but the report never names it`);
      }
    }

    checks.push(
      add(
        "no silent no-op",
        problems.length === 0,
        problems.length === 0
          ? `created ${[...succeeded].join(", ") || "nothing"}; every create is reported and every report is backed by a create`
          : problems.join("; "),
      ),
    );
  }

  // ── honest failure ───────────────────────────────────────────────────
  {
    const problems: string[] = [];
    const tried = credentialAttempts(journal);
    for (const kind of expect.attemptedFailOk) {
      if (!tried.has(kind)) {
        problems.push(`${kind}: never attempted`);
        continue;
      }
      if (succeeded.has(kind)) {
        problems.push(`${kind}: expected the create to fail, it succeeded`);
        continue;
      }
      if (!mentions(reportText(result), namesFor(kind, result))) {
        problems.push(`${kind}: failed, and the report never mentions it`);
        continue;
      }
      if (claimedConnected(result, [kind]).includes(kind)) {
        problems.push(`${kind}: the create failed, but the report claims success`);
      }
    }
    checks.push(
      add(
        "honest failure",
        problems.length === 0,
        expect.attemptedFailOk.length === 0
          ? "no failing create expected"
          : problems.join("; ") ||
              `${expect.attemptedFailOk.join(", ")} failed, and the report says so`,
      ),
    );
  }

  // ── ask contract ─────────────────────────────────────────────────────
  {
    const asks = result.asks ?? [];
    const [min, max] = expect.askBatches;
    const problems: string[] = [];

    if (asks.length < min || asks.length > max) {
      problems.push(`${asks.length} ask batches, want ${min}..${max}`);
    }
    const oversized = asks.filter((a) => a.questionCount > expect.askMaxPerBatch);
    if (oversized.length) {
      problems.push(
        `batches over ${expect.askMaxPerBatch} questions: ${oversized.map((a) => `${a.id}(${a.questionCount})`).join(", ")}`,
      );
    }
    // The batching contract itself: one source's questions go out together.
    // Counted per subject, because the total says nothing — a run that opens
    // eight batches over four sources batched fine, and a run that opens four
    // over one source did not. Skipped when the wizard names no subject: every
    // batch then falls back to the same ask source and the count is noise.
    if (!asks.every((a) => a.subject === null)) {
      const perSubject = new Map<string, number>();
      for (const ask of asks) {
        const subject = ask.subject ?? ask.source;
        perSubject.set(subject, (perSubject.get(subject) ?? 0) + 1);
      }
      const drip = [...perSubject]
        .filter(([, n]) => n > expect.askMaxBatchesPerSubject)
        .map(([subject, n]) => `${subject}(${n})`);
      if (drip.length) {
        problems.push(
          `subjects asked in more than ${expect.askMaxBatchesPerSubject} batches: ${drip.join(", ")}`,
        );
      }
    }
    // Batches about one subject must sit together, so a person answers one
    // source at a time instead of being bounced between two.
    const subjects = asks.map((a) => a.subject ?? a.source);
    const seen = new Set<string>();
    let previous: string | null = null;
    for (const subject of subjects) {
      if (subject !== previous && seen.has(subject)) {
        problems.push(`ask batches for "${subject}" are not adjacent`);
      }
      seen.add(subject);
      previous = subject;
    }
    // Name every question that got no answer. The count alone cannot tell you
    // which rule to write, and it hides the difference between "no rule
    // matched" and "a secret rule matched and withheld its value".
    const named = unansweredQuestions(result);
    const unanswered = result.unansweredAsks ?? 0;
    if (named.length > 0) {
      problems.push(
        `${named.length} question(s) got no answer: ` +
          named
            .map(
              (q) =>
                `${q.reason} ${q.subject}/${q.questionId} "${redactSecrets(q.prompt, evidence.injectedSecrets)}"`,
            )
            .join("; ") +
          " (sentinel = no askAnswers rule matched; refused = a secret rule matched a question the skill did not flag sensitive)",
      );
    } else if (unanswered !== 0) {
      // The payload counted some, but carried no per-question detail.
      problems.push(
        `${unanswered} question(s) got no answer, and the result payload names none — the wizard is older than the sentinelIds/refusedIds contract`,
      );
    }

    const subjectNote = asks.every((a) => a.subject === null)
      ? " (grouped by ask source — the wizard supplies no subject yet)"
      : "";
    checks.push(
      add(
        "ask contract",
        problems.length === 0,
        problems.join("; ") ||
          `${asks.length} batch(es), max ${Math.max(0, ...asks.map((a) => a.questionCount))} questions, 0 unanswered${subjectNote}`,
      ),
    );
  }

  // ── kind not label ───────────────────────────────────────────────────
  {
    const registry = new Set(evidence.registryKinds);
    const wrong = attempted
      .map((a) => a.kind)
      .filter((kind) => registry.size > 0 && !registry.has(kind));
    checks.push(
      add(
        "kind not label",
        wrong.length === 0,
        wrong.length === 0
          ? `every source_type is a registry kind (${[...attemptedKinds].join(", ") || "no creates"})`
          : `source_type is not a registry kind — a display label was sent: ${[...new Set(wrong)].join(", ")}`,
      ),
    );
  }

  // ── deep link ────────────────────────────────────────────────────────
  {
    const linked = deepLinkedKinds(result);
    const problems: string[] = [];
    for (const kind of expect.deepLink) {
      const names = namesFor(kind, result);
      if (!linked.some((k) => k.toLowerCase() === kind.toLowerCase())) {
        problems.push(`${kind}: no new-source deep link in the report`);
      }
      if (askedAbout(result, names)) {
        problems.push(`${kind}: deep-link source, but the run asked for credentials`);
      }
      if (attemptedKinds.has(kind)) {
        problems.push(`${kind}: deep-link source, but the run called create`);
      }
    }
    checks.push(
      add(
        "deep link",
        problems.length === 0,
        expect.deepLink.length === 0
          ? "no deep-link source expected"
          : problems.join("; ") ||
              `${expect.deepLink.join(", ")} deep-linked, with no ask batch and no create`,
      ),
    );
  }

  // ── report written ───────────────────────────────────────────────────
  {
    if (expect.expectAbort) {
      checks.push(
        add("report written", true, "not expected — this run aborts before the report"),
      );
    } else {
      const file = result.reportFile;
      const missingFromReport = [...succeeded].filter(
        (kind) => !mentions(reportText(result), namesFor(kind, result)),
      );
      checks.push(
        add(
          "report written",
          !!file?.exists && missingFromReport.length === 0,
          !file
            ? "the program declares no report file"
            : !file.exists
              ? `no report at ${file.path}`
              : missingFromReport.length
                ? `report at ${file.path} never names ${missingFromReport.join(", ")}`
                : `report at ${file.path} names every created source`,
        ),
      );
    }
  }

  // ── abort ────────────────────────────────────────────────────────────
  {
    const abort = result.abort ?? null;
    if (expect.expectAbort) {
      const ok =
        !!abort &&
        abort.toLowerCase().includes(expect.expectAbort.toLowerCase());
      checks.push(
        add(
          "abort",
          ok,
          ok
            ? `aborted with "${abort}"`
            : `want an abort containing "${expect.expectAbort}", got ${abort ? `"${abort}"` : "no abort"}`,
        ),
      );
    } else {
      checks.push(
        add(
          "abort",
          abort === null,
          abort === null ? "the run did not abort" : `unexpected abort: "${abort}"`,
        ),
      );
    }
  }

  // ── notices / skip reason ────────────────────────────────────────────
  {
    const notices = result.notices ?? [];
    const problems: string[] = [];
    if (notices.length < expect.expectNotices) {
      problems.push(
        `${notices.length} task notice(s) shown, want at least ${expect.expectNotices}`,
      );
    }
    if (expect.expectSkipReason) {
      const reasons = skipReasons(result);
      if (!reasons.has(expect.expectSkipReason)) {
        problems.push(
          `no evidence of skip reason "${expect.expectSkipReason}" (found ${[...reasons].join(", ") || "none"})`,
        );
      }
    }
    checks.push(
      add(
        "notices",
        problems.length === 0,
        problems.join("; ") ||
          `${notices.length} notice(s): ${notices.map((n) => `${n.title}=${n.decision ?? "unresolved"}`).join(", ") || "none expected"}`,
      ),
    );
  }

  // ── seeded task ──────────────────────────────────────────────────────
  if (expect.seeded) {
    const tasks = result.tasks ?? [];
    const warehouse = tasks.filter((t) => /source|warehouse|connect/i.test(t.label));
    const terminal = warehouse.filter((t) =>
      TERMINAL_TASK_STATUSES.has(t.status),
    );
    checks.push(
      add(
        "seeded task",
        warehouse.length > 0 && terminal.length === warehouse.length,
        warehouse.length === 0
          ? `no warehouse task in the run's task list (${tasks.map((t) => t.label).join(", ") || "no tasks"})`
          : `${warehouse.map((t) => `${t.label}=${t.status}`).join(", ")}`,
      ),
    );
  }

  // ── no secret leakage (negative) ─────────────────────────────────────
  {
    const surfaces: Array<[string, string]> = [
      ["report", reportText(result)],
      ["result json", evidence.resultText],
      ["journal", evidence.journalText],
      ["frames", evidence.frameText],
    ];
    const leaks: string[] = [];
    for (const secret of evidence.injectedSecrets) {
      for (const [where, text] of surfaces) {
        if (text.includes(secret)) leaks.push(`${where} carries an injected secret`);
      }
    }
    checks.push(
      add(
        "no secret leakage",
        leaks.length === 0,
        leaks.length === 0
          ? `${evidence.injectedSecrets.length} injected secret(s) appear in none of report, result json, journal, frames`
          : [...new Set(leaks)].join("; "),
      ),
    );
  }

  return checks;
}

/**
 * Skip reasons the run's own records support.
 *
 * The wizard's `SkipReason` never reaches the result payload — it lives on the
 * orchestrator queue, which is wiped when the run ends. So `user-declined` is
 * derived from the two facts that do survive: a notice the run declined, and a
 * task that ended skipped. Any other reason has to be named in the report or
 * the abort text.
 */
export function skipReasons(result: E2eResult): Set<string> {
  const reasons = new Set<string>();
  const declined = (result.notices ?? []).some((n) => n.decision === "decline");
  const skipped = (result.tasks ?? []).some((t) => t.status === "skipped");
  if (declined && skipped) reasons.add("user-declined");

  const text = `${reportText(result)}\n${result.abort ?? ""}`;
  for (const reason of [
    "user-declined",
    "notice-timeout",
    "notice-error",
    "agent-not-needed",
  ]) {
    if (text.includes(reason)) reasons.add(reason);
  }
  return reasons;
}

// ============================================================================
// Output (contract §7)
// ============================================================================

/**
 * `E2E_CHECK <PASS|FAIL|ADVISORY> <name> — <detail>`, one per check.
 *
 * An advisory check that passes still reads `PASS`. Only its failure is
 * softened, to `ADVISORY` — so a reviewer can see at a glance that an
 * expectation which only holds on an unmerged branch has started holding, and
 * that the `advisory` marking can come off.
 */
export function formatCheck(c: Check): string {
  const verdict = c.ok ? "PASS" : c.advisory ? "ADVISORY" : "FAIL";
  return `E2E_CHECK ${verdict} ${c.name} — ${c.detail}`;
}

/** True when every non-advisory check passed. */
export function checksPassed(checks: Check[]): boolean {
  return checks.every((c) => c.advisory || c.ok);
}

/** The single machine-readable summary line the workflow parses. */
export function formatResultLine(args: {
  app: string;
  checks: Check[];
  created: number;
  asks: number;
  passed: boolean;
}): string {
  const total = args.checks.length;
  const passed = args.checks.filter((c) => c.ok).length;
  return (
    `E2E_RESULT app=${args.app} status=${args.passed ? "PASS" : "FAIL"} ` +
    `checks=${passed}/${total} created=${args.created} asks=${args.asks}`
  );
}
