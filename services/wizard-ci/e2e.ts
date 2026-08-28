/**
 * `wizard-ci --e2e` — full end-to-end run against prod cloud, driven through the
 * REAL wizard TUI.
 *
 * The wizard repo's `scripts/tui-snapshots.no-jest.ts` runs the real `startTUI`
 * in a PTY and drives it through the fixed happy path (skip MCP, skip Slack,
 * delete skills, continue past health issues) by store state manipulation — auth
 * via the phx key, no browser. It captures every key-moment screen as real-TUI
 * text and writes a structured result JSON; this is the orchestration + assertion
 * layer over it.
 *
 *   pnpm wizard-ci basic-integration/javascript-node/express-todo --e2e
 *   pnpm wizard-ci basic-integration/next-js/15-app-router-todo --e2e --project-id 228144
 */
import { join, basename } from "path";
import {
  existsSync,
  mkdirSync,
  rmSync,
  readFileSync,
  writeFileSync,
  readdirSync,
  statSync,
} from "fs";
import { spawnSync } from "child_process";

import { loadFixtures } from "../mcp-stub/fixtures.js";
import { startMcpStub, type McpStub } from "../mcp-stub/index.js";
import { readJournal } from "../mcp-stub/journal.js";
import {
  checksPassed,
  formatCheck,
  formatResultLine,
  loadExpect,
  warehouseChecks,
  type Check,
  type E2eResult,
  type WarehouseExpect,
} from "./warehouse-checks.js";

const WORKBENCH = join(import.meta.dirname, "..", "..");
export const APPS_DIR = join(WORKBENCH, "apps");

/**
 * Placeholder credentials the runner injects for the wizard e2e profile's
 * `askAnswers` rules to route to each credential question.
 *
 * Every value is fake and unroutable. The MCP is the stub, so nothing here is
 * ever checked against a real service — the point is that *a* value arrives,
 * so a run is graded on whether it asked and created, not on whether it had a
 * working database. A var whose name reads as a secret is also scanned for: it
 * must not appear in the report, the result payload, the journal, or a frame.
 */
const INJECTED_CREDENTIALS: Record<string, string> = {
  E2E_PG_HOST: "e2e-warehouse-fixture.invalid",
  E2E_PG_PORT: "5432",
  E2E_PG_DATABASE: "e2e_fixture_db",
  E2E_PG_USER: "e2e_fixture_user",
  E2E_PG_PASSWORD: "e2e-fixture-placeholder-password",
  E2E_STRIPE_API_KEY: "sk_test_e2efixtureplaceholder000000",
  // The catch-all the wizard profile routes every other credential-shaped
  // question to — a Hugging Face access token, a bare `api_key`. Without it
  // those questions reach the `e2e` sentinel, and the create they feed fails.
  E2E_API_TOKEN: "e2e-fixture-placeholder-token",
};

/** Which injected values must never be echoed back. */
const SECRET_VAR = /PASSWORD|SECRET|API_KEY|TOKEN/;

/** Flags a seeded-orchestrator scenario needs on top of whatever CI already sets. */
const SEEDED_FLAG_OVERRIDES: Record<string, string> = {
  "wizard-orchestrator": "true",
  "wizard-use-pi-harness": "true",
  "wizard-orchestrator-seeded-tasks": "true",
};

// Host Claude Code / Anthropic auth vars: when the wizard's agent subprocess is
// spawned from inside a Claude Code session it defers auth to the host
// (apiKeySource=none → 401). Strip them so it auths with the phx key, exactly
// like a plain CI shell (where these are simply unset, so the strip is a no-op).
// Same predicate the wizard's MCP host uses, so the two can't drift.
const STRIP_HOST_AUTH = /^(CLAUDE|ANTHROPIC|AI_AGENT)/;

export interface E2eOptions {
  app?: string;
  region?: string;
  projectId?: string;
  /** true → keep installed skills; default deletes them. */
  keepSkills?: boolean;
  /** Wizard program id to drive (e.g. 'self-driving'); default integration. */
  program?: string;
  /** CI trigger id — makes the run's source prefix unique per trigger. */
  triggerId?: string;
}

function wizardRepo(): string {
  const p = process.env.WIZARD_PATH?.replace(/^~/, process.env.HOME || "");
  if (p) return p;
  // Default to a sibling wizard checkout next to the workbench.
  for (const name of ["wizard-e2e", "wizard"]) {
    const sibling = join(WORKBENCH, "..", name);
    if (existsSync(sibling)) return sibling;
  }
  return `${process.env.HOME}/development/wizard`;
}

/** Where a run drops its real-TUI snapshots — shared with the snapshots flow. */
export function snapsDirFor(app: string): string {
  return `/tmp/wizard-e2e-${basename(app)}-snaps`;
}

/**
 * Where the stub MCP writes the run's journal — the evidence that a source was
 * really created. The workflow uploads this file, so keep the path derivable.
 */
export function journalPathFor(app: string): string {
  return `/tmp/wizard-e2e-${basename(app)}-mcp-journal.json`;
}

/** Root for rendered reports + screenshots (the snapshots / review flow). */
export const OUT_ROOT = "/tmp/wizard-snapshots";

/** Per-app report dir — the write/read contract shared by snapshots + review. */
export function reportDirFor(app: string): string {
  return join(OUT_ROOT, basename(app));
}

/**
 * Seconds-since-the-first-frame for each captured frame, keyed by filename —
 * derived from the frames' write times so headings can show time-since-start.
 */
export function frameTimings(dir: string): Record<string, number> {
  if (!existsSync(dir)) return {};
  const stamped = readdirSync(dir)
    .filter((f) => f.endsWith(".txt") || f.endsWith(".ans"))
    .map((f) => ({ f, t: statSync(join(dir, f)).mtimeMs }));
  if (!stamped.length) return {};
  const start = Math.min(...stamped.map((s) => s.t));
  const out: Record<string, number> = {};
  for (const { f, t } of stamped) out[f] = (t - start) / 1000;
  return out;
}

/** Human elapsed: "+5s", "+1m05s". */
export function fmtElapsed(seconds: number): string {
  const s = Math.round(seconds);
  return s < 60
    ? `+${s}s`
    : `+${Math.floor(s / 60)}m${String(s % 60).padStart(2, "0")}s`;
}

/** One rasterized frame: the source frame name and its PNG file. */
export interface Shot {
  frame: string;
  file: string;
}

/**
 * Merge extra feature-flag overrides into whatever the caller already set.
 *
 * CI exports `WIZARD_CI_FLAG_OVERRIDES` for every leg. A seeded scenario needs
 * one more flag on top, so this merges rather than replaces — clobbering it
 * would silently drop the orchestrator flags the rest of the run depends on.
 */
export function mergeFlagOverrides(
  current: string | undefined,
  extra: Record<string, string>,
): string {
  let base: Record<string, string> = {};
  if (current) {
    try {
      const parsed: unknown = JSON.parse(current);
      if (parsed && typeof parsed === "object") {
        base = parsed as Record<string, string>;
      }
    } catch {
      // Nothing environment-derived goes in this message — not the value, not
      // its length. This lands in a CI log, and the `if (current)` guard above
      // already means the only reachable case is "set, and malformed".
      console.warn("⚠ WIZARD_CI_FLAG_OVERRIDES is not valid JSON; replacing it.");
    }
  }
  return JSON.stringify({ ...base, ...extra });
}

/** Every captured frame's text, concatenated — the leakage scan reads this. */
function readFrames(dir: string): string {
  if (!existsSync(dir)) return "";
  return readdirSync(dir)
    .filter((f) => f.endsWith(".txt") || f.endsWith(".ans"))
    .map((f) => {
      try {
        return readFileSync(join(dir, f), "utf8");
      } catch {
        return "";
      }
    })
    .join("\n");
}

/** Read a file, returning "" rather than throwing. */
function readOrEmpty(file: string): string {
  try {
    return readFileSync(file, "utf8");
  } catch {
    return "";
  }
}

/** Run a single app through the real-TUI e2e and assert. Returns exit code. */
export async function runE2e(opts: E2eOptions): Promise<number> {
  const app = opts.app;
  const region = opts.region || process.env.POSTHOG_REGION || "us";
  const projectId = opts.projectId || process.env.POSTHOG_WIZARD_PROJECT_ID || "";
  const apiKey = process.env.POSTHOG_PERSONAL_API_KEY;

  if (!app) {
    console.error("✖ --e2e requires an app: pnpm wizard-ci <app-path> --e2e");
    return 2;
  }
  if (!apiKey) {
    console.error("✖ POSTHOG_PERSONAL_API_KEY is required (the phx key).");
    return 2;
  }
  if (!projectId) {
    console.error("✖ project id required: --project-id or POSTHOG_WIZARD_PROJECT_ID.");
    return 2;
  }

  // A scenario may run against a sibling app's source tree (`sourceApp`), so a
  // run variation gets its own matrix leg without a second copy of the fixture.
  const expect = loadExpect(APPS_DIR, app);
  const sourceApp = expect?.sourceApp ?? app;
  const appSrc = join(APPS_DIR, sourceApp);
  if (!existsSync(appSrc)) {
    console.error(`✖ app not found: apps/${sourceApp}`);
    return 2;
  }

  const name = basename(app);
  const appDir = `/tmp/wizard-e2e-${name}`;
  const resultJson = `/tmp/wizard-e2e-${name}.json`;
  const journalPath = journalPathFor(app);
  const snapsDir = snapsDirFor(app);

  // Always a /tmp copy — never the real fixture.
  rmSync(appDir, { recursive: true, force: true });
  mkdirSync(appDir, { recursive: true });
  spawnSync("rsync", ["-a", "--exclude", "node_modules", "--exclude", ".git", `${appSrc}/`, `${appDir}/`], {
    stdio: "inherit",
  });
  rmSync(snapsDir, { recursive: true, force: true });
  mkdirSync(snapsDir, { recursive: true });
  rmSync(resultJson, { force: true });

  const repo = wizardRepo();
  const harness = join(repo, "scripts", "tui-snapshots.no-jest.ts");
  if (!existsSync(harness)) {
    console.error(`✖ wizard e2e harness not found: ${harness}\n  Set WIZARD_PATH to the wizard repo.`);
    return 2;
  }

  console.log(`\n=== wizard-ci --e2e: ${app}  (project ${projectId}, ${region}) ===`);
  console.log(`    policy: skip mcp · skip slack · ${opts.keepSkills ? "keep" : "delete"} skills · continue past health issues`);
  if (expect) {
    console.log(`    expectations: apps/${app}/.wizard-ci/expect.json${sourceApp === app ? "" : `  (source: apps/${sourceApp})`}`);
  }
  console.log("");

  const childEnv: NodeJS.ProcessEnv = { ...process.env };
  for (const k of Object.keys(childEnv))
    if (STRIP_HOST_AUTH.test(k)) delete childEnv[k];
  childEnv.POSTHOG_PERSONAL_API_KEY = apiKey;
  childEnv.APP_DIR = appDir;
  childEnv.PROJECT_ID = projectId;
  childEnv.POSTHOG_REGION = region;
  childEnv.SNAP_OUT = snapsDir;
  childEnv.E2E_RESULT_JSON = resultJson;
  childEnv.E2E_KEEP_SKILLS = opts.keepSkills ? "true" : "false";
  // Which program the real-TUI host drives — defaults to integration.
  if (opts.program) childEnv.PROGRAM = opts.program;

  // ── Warehouse wiring: the stub MCP, the answers, the run variation ────
  let stub: McpStub | null = null;
  const injectedSecrets: string[] = [];

  if (expect) {
    // Ephemeral port: matrix legs run in parallel, and a fixed 8799 would make
    // two runs fight over the same socket.
    stub = await startMcpStub({ port: 0, journalPath, projectId });
    childEnv.MCP_URL = stub.url;
    childEnv.MCP_STUB_JOURNAL = journalPath;
    // The stub cannot judge a placeholder credential, so the fixture names the
    // kinds whose create must fail and the stub replays the recorded prod error.
    childEnv.MCP_STUB_FAIL_KINDS = expect.attemptedFailOk.join(",");
    // Keep the wizard_ask bridge alive in a `ci` session — without it the
    // agent-in-the-loop layer this whole tier exists to test is switched off.
    childEnv.E2E_ASK = "true";
    childEnv.E2E_SOURCE_PREFIX = `e2e_${opts.triggerId || Date.now()}_`;
    if (expect.notice) childEnv.E2E_NOTICE = expect.notice;
    for (const [key, value] of Object.entries(INJECTED_CREDENTIALS)) {
      childEnv[key] = value;
      if (SECRET_VAR.test(key)) injectedSecrets.push(value);
    }
    if (expect.seeded) {
      childEnv.WIZARD_CI_FLAG_OVERRIDES = mergeFlagOverrides(
        childEnv.WIZARD_CI_FLAG_OVERRIDES,
        SEEDED_FLAG_OVERRIDES,
      );
    }
    console.log(`    stub mcp: ${stub.url}  journal: ${journalPath}`);
    if (expect.attemptedFailOk.length) {
      console.log(`    forced create failures: ${expect.attemptedFailOk.join(", ")}`);
    }
    console.log("");
  }

  let run: ReturnType<typeof spawnSync>;
  try {
    run = spawnSync("npx", ["tsx", harness], {
      cwd: repo,
      stdio: "inherit",
      env: childEnv,
    });
  } finally {
    await stub?.stop();
  }

  // Structured assertions — the control plane's payoff over stdout-grepping.
  const resultText = readOrEmpty(resultJson);
  let result:
    | (E2eResult & {
        hasPosthogDep?: boolean;
        envFile?: string | null;
        skillsComplete?: boolean;
        newDeps?: string[];
      })
    | null = null;
  try {
    result = JSON.parse(resultText);
  } catch {
    /* harness crashed before writing */
  }

  const checks: Array<[string, boolean]> = result
    ? genericChecks(result, opts, expect)
    : [["harness produced a structured result", false]];

  console.log("\n--- assertions ---");
  for (const [label, ok] of checks) console.log(`  ${ok ? "✔" : "✖"} ${label}`);

  // ── Warehouse assertions ─────────────────────────────────────────────
  let warehouse: Check[] = [];
  if (expect) {
    warehouse = warehouseChecks({
      expect,
      result,
      resultText,
      journal: readJournal(journalPath),
      journalText: readOrEmpty(journalPath),
      createdKinds: (stub?.state.created ?? []).map((s) => s.source_type),
      registryKinds: Object.keys(loadFixtures().sourcesWizard.sources),
      injectedSecrets,
      frameText: readFrames(snapsDir),
    });
  }

  const passed =
    (!!expect || run.status === 0) &&
    checks.every(([, ok]) => ok) &&
    checksPassed(warehouse);

  if (result) {
    writeFileSync(resultJson, JSON.stringify({ ...result, app, passed }, null, 2));
    console.log(`\nscreen path: ${result.screenPath?.join(" → ")}`);
    console.log(`new deps   : ${(result.newDeps || []).join(", ") || "(none)"}`);
    console.log(`result json: ${resultJson}`);
    console.log(`snapshots  : ${snapsDir}`);
  }

  if (expect) {
    // Contract §7: one machine-readable summary line, then one line per check.
    console.log("");
    console.log(
      formatResultLine({
        app,
        checks: warehouse,
        created: stub?.state.created.length ?? 0,
        asks: result?.asks?.length ?? 0,
        passed,
      }),
    );
    for (const c of warehouse) console.log(formatCheck(c));
    console.log(`journal    : ${journalPath}`);
  }

  console.log(`\n${passed ? "✓ E2E PASS" : "✗ E2E FAIL"} — ${app}\n`);
  return passed ? 0 : 1;
}

/**
 * The run-shape checks that apply to every program, before the warehouse block.
 *
 * A plain integration run ends at keep-skills with PostHog installed. A
 * warehouse run installs nothing — it creates PostHog resources and writes a
 * report — so the dependency check would fail it for doing its job correctly.
 * A run that is *meant* to abort has no end screen at all, and the warehouse
 * `abort` check grades it instead.
 */
function genericChecks(
  result: {
    runPhase?: string;
    hasPosthogDep?: boolean;
    envFile?: string | null;
    screenPath?: string[];
    skillsComplete?: boolean;
  },
  opts: E2eOptions,
  expect: WarehouseExpect | null,
): Array<[string, boolean]> {
  if (expect?.expectAbort) return [];

  const reachedOutro = !!result.screenPath?.includes("outro");
  const completed = result.runPhase === "completed";

  if (expect && !expect.seeded) {
    return [
      ["agent run completed", completed],
      ["reached the outro", reachedOutro],
    ];
  }

  // The integration flow ends at keep-skills/skillsComplete; other programs
  // (e.g. self-driving) end at their own outro, so assert against that instead.
  const isIntegration = !opts.program || opts.program === "posthog-integration";
  const programChecks: Array<[string, boolean]> = isIntegration
    ? [
        ["full interactive flow reached keep-skills", !!result.screenPath?.includes("keep-skills")],
        ["skillsComplete", result.skillsComplete === true],
      ]
    : [["reached the outro", reachedOutro]];

  return [
    ["agent run completed", completed],
    ["posthog dependency added or .env written", !!result.hasPosthogDep || !!result.envFile],
    ...programChecks,
  ];
}
