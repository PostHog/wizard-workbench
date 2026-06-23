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
import { existsSync, mkdirSync, rmSync, readFileSync, writeFileSync } from "fs";
import { spawnSync } from "child_process";

const WORKBENCH = join(import.meta.dirname, "..", "..");
const APPS_DIR = join(WORKBENCH, "apps");

// Host Claude-Code / Anthropic auth vars: when the wizard's agent subprocess is
// spawned from inside a Claude Code session it defers auth to the host
// (apiKeySource=none → 401). Strip them so it auths with the phx key, exactly
// like a plain CI shell (where these are simply unset, so the strip is a no-op).
const STRIP_ENV = [
  "ANTHROPIC_API_KEY", "ANTHROPIC_BASE_URL", "ANTHROPIC_AUTH_TOKEN",
  "CLAUDECODE", "CLAUDE_CODE_ENTRYPOINT", "CLAUDE_CODE_SESSION_ID",
  "CLAUDE_CODE_CHILD_SESSION", "CLAUDE_CODE_OAUTH_SCOPES", "CLAUDE_CODE_OAUTH_TOKEN",
  "CLAUDE_CODE_SDK_HAS_OAUTH_REFRESH", "CLAUDE_CODE_SDK_HAS_HOST_AUTH_REFRESH",
  "CLAUDE_CODE_EXECPATH", "CLAUDE_CODE_EMIT_TOOL_USE_SUMMARIES",
  "CLAUDE_AGENT_SDK_VERSION", "CLAUDE_CODE_ENABLE_ASK_USER_QUESTION_TOOL", "AI_AGENT",
];

export interface E2eOptions {
  app?: string;
  region?: string;
  projectId?: string;
  /** true → keep installed skills; default deletes them. */
  keepSkills?: boolean;
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

/** Run a single app through the real-TUI e2e and assert. Returns exit code. */
export function runE2e(opts: E2eOptions): number {
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

  const appSrc = join(APPS_DIR, app);
  if (!existsSync(appSrc)) {
    console.error(`✖ app not found: apps/${app}`);
    return 2;
  }

  const name = basename(app);
  const appDir = `/tmp/wizard-e2e-${name}`;
  const resultJson = `/tmp/wizard-e2e-${name}.json`;
  const snapsDir = snapsDirFor(app);

  // Always a /tmp copy — never the real fixture.
  rmSync(appDir, { recursive: true, force: true });
  mkdirSync(appDir, { recursive: true });
  spawnSync("rsync", ["-a", "--exclude", "node_modules", "--exclude", ".git", `${appSrc}/`, `${appDir}/`], {
    stdio: "inherit",
  });
  rmSync(snapsDir, { recursive: true, force: true });
  mkdirSync(snapsDir, { recursive: true });

  const harness = join(wizardRepo(), "scripts", "tui-snapshots.no-jest.ts");
  if (!existsSync(harness)) {
    console.error(`✖ wizard e2e harness not found: ${harness}\n  Set WIZARD_PATH to the wizard repo.`);
    return 2;
  }

  console.log(`\n=== wizard-ci --e2e: ${app}  (project ${projectId}, ${region}) ===`);
  console.log(`    policy: skip mcp · skip slack · ${opts.keepSkills ? "keep" : "delete"} skills · continue past health issues\n`);

  const childEnv: NodeJS.ProcessEnv = { ...process.env };
  for (const k of STRIP_ENV) delete childEnv[k];
  childEnv.POSTHOG_PERSONAL_API_KEY = apiKey;
  childEnv.APP_DIR = appDir;
  childEnv.PROJECT_ID = projectId;
  childEnv.POSTHOG_REGION = region;
  childEnv.SNAP_OUT = snapsDir;
  childEnv.E2E_RESULT_JSON = resultJson;
  childEnv.E2E_KEEP_SKILLS = opts.keepSkills ? "true" : "false";

  const run = spawnSync("npx", ["tsx", harness], {
    cwd: wizardRepo(),
    stdio: "inherit",
    env: childEnv,
  });

  // Structured assertions — the control plane's payoff over stdout-grepping.
  let result: { runPhase?: string; hasPosthogDep?: boolean; envFile?: string | null;
    screenPath?: string[]; skillsComplete?: boolean; newDeps?: string[] } | null = null;
  try {
    result = JSON.parse(readFileSync(resultJson, "utf8"));
  } catch {
    /* harness crashed before writing */
  }

  const checks: Array<[string, boolean]> = result
    ? [
        ["agent run completed", result.runPhase === "completed"],
        ["posthog dependency added or .env written", !!result.hasPosthogDep || !!result.envFile],
        ["full interactive flow reached keep-skills", !!result.screenPath?.includes("keep-skills")],
        ["skillsComplete", result.skillsComplete === true],
      ]
    : [["harness produced a structured result", false]];

  console.log("\n--- assertions ---");
  for (const [label, ok] of checks) console.log(`  ${ok ? "✔" : "✖"} ${label}`);
  const passed = run.status === 0 && checks.every(([, ok]) => ok);

  if (result) {
    writeFileSync(resultJson, JSON.stringify({ ...result, app, passed }, null, 2));
    console.log(`\nscreen path: ${result.screenPath?.join(" → ")}`);
    console.log(`new deps   : ${(result.newDeps || []).join(", ") || "(none)"}`);
    console.log(`result json: ${resultJson}`);
    console.log(`snapshots  : ${snapsDir}`);
  }

  console.log(`\n${passed ? "✓ E2E PASS" : "✗ E2E FAIL"} — ${app}\n`);
  return passed ? 0 : 1;
}
