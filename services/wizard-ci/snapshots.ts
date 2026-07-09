/**
 * wizard-ci snapshots: capture the real-TUI key-moment frames for the CI-e2e
 * test definitions and render them to an HTML report.
 *
 * Runs a real `--e2e` agent run, which drives the REAL wizard TUI and captures
 * every key-moment screen as text, then renders the current frames for review.
 * Baseline comparison is out of scope for now — this surfaces the current run.
 *
 *   pnpm wizard-ci-snapshots [app]
 *
 * With no app in an interactive shell it shows an app picker (like the other
 * run screens); non-interactively it falls back to the default test set.
 *
 * Requires (in .env, sourced by the `wizard-ci-snapshots` mprocs proc):
 *   POSTHOG_PERSONAL_API_KEY   the phx key (gateway bearer)
 *   POSTHOG_WIZARD_PROJECT_ID  the project the key is scoped to
 *   POSTHOG_REGION             us | eu
 *   WIZARD_PATH                a wizard checkout that has e2e-harness/ (where the run happens)
 *
 * Only a genuine failure (run died, no snapshots) exits non-zero.
 */
import "dotenv/config";
import { join, basename } from "path";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  readdirSync,
} from "fs";
import {
  runE2e,
  snapsDirFor,
  reportDirFor,
  frameTimings,
  fmtElapsed,
  APPS_DIR,
} from "./e2e.js";
import { findApps } from "./utils.js";
import { commandToProgram, findCommandByAppPath } from "../wizard-commands.js";
import { selectApp } from "../wizard-run/picker.js";

/** A CI-e2e test definition: which flow runs against which app. */
interface TestDef {
  name: string;
  app: string;
}

const TEST_DEFS: TestDef[] = [
  {
    name: "express-todo",
    app: "basic-integration/javascript-node/express-todo",
  },
];

interface Frame {
  file: string;
  text: string;
}

/**
 * The captured key-moment frames from a run's snapshot dir, in order. Prefers
 * the colored `.ans` capture (the wizard's frameAnsi output) over a `.txt` frame
 * of the same name; falls back to `.txt` for older runs.
 */
function readFrames(dir: string): Frame[] {
  if (!existsSync(dir)) return [];
  const files = readdirSync(dir).filter(
    (f) => f.endsWith(".ans") || f.endsWith(".txt"),
  );
  const hasAns = new Set(
    files.filter((f) => f.endsWith(".ans")).map((f) => f.slice(0, -4)),
  );
  return files
    .filter((f) => f.endsWith(".ans") || !hasAns.has(f.slice(0, -4)))
    .sort()
    .map((file) => ({ file, text: readFileSync(join(dir, file), "utf8") }));
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// The 16 base terminal colors, then the 6×6×6 cube and grayscale ramp — the
// xterm 256-color palette that frameAnsi's `38;5;N` / `48;5;N` codes index into.
const ANSI16 = [
  "#000000", "#800000", "#008000", "#808000", "#000080", "#800080", "#008080", "#c0c0c0",
  "#808080", "#ff0000", "#00ff00", "#ffff00", "#0000ff", "#ff00ff", "#00ffff", "#ffffff",
];
function xterm256(n: number): string {
  if (n < 16) return ANSI16[n] ?? "#c9d1d9";
  const hex = (v: number) => (v & 255).toString(16).padStart(2, "0");
  if (n < 232) {
    const c = n - 16;
    const ramp = [0, 95, 135, 175, 215, 255];
    return `#${hex(ramp[Math.floor(c / 36) % 6])}${hex(ramp[Math.floor(c / 6) % 6])}${hex(ramp[c % 6])}`;
  }
  const v = 8 + (n - 232) * 10;
  return `#${hex(v)}${hex(v)}${hex(v)}`;
}

interface Sgr {
  fg?: string;
  bg?: string;
  bold?: boolean;
  dim?: boolean;
  italic?: boolean;
  underline?: boolean;
  inverse?: boolean;
  strike?: boolean;
}

// Fold one run of SGR parameters into the active style. Handles the codes
// frameAnsi emits: reset, attributes, named colors, and 256/truecolor.
function applyCodes(s: Sgr, params: number[]): void {
  for (let i = 0; i < params.length; i++) {
    const c = params[i];
    if (c === 0) { for (const k of Object.keys(s)) delete (s as Record<string, unknown>)[k]; }
    else if (c === 1) s.bold = true;
    else if (c === 2) s.dim = true;
    else if (c === 3) s.italic = true;
    else if (c === 4) s.underline = true;
    else if (c === 7) s.inverse = true;
    else if (c === 9) s.strike = true;
    else if (c === 22) { s.bold = s.dim = undefined; }
    else if (c === 23) s.italic = undefined;
    else if (c === 24) s.underline = undefined;
    else if (c === 27) s.inverse = undefined;
    else if (c === 29) s.strike = undefined;
    else if (c >= 30 && c <= 37) s.fg = ANSI16[c - 30];
    else if (c >= 90 && c <= 97) s.fg = ANSI16[c - 90 + 8];
    else if (c >= 40 && c <= 47) s.bg = ANSI16[c - 40];
    else if (c >= 100 && c <= 107) s.bg = ANSI16[c - 100 + 8];
    else if (c === 39) s.fg = undefined;
    else if (c === 49) s.bg = undefined;
    else if (c === 38 || c === 48) {
      const color =
        params[i + 1] === 5
          ? ((i += 2), xterm256(params[i]))
          : params[i + 1] === 2
            ? ((i += 4), `#${[params[i - 2], params[i - 1], params[i]].map((v) => (v & 255).toString(16).padStart(2, "0")).join("")}`)
            : undefined;
      if (color) c === 38 ? (s.fg = color) : (s.bg = color);
    }
  }
}

function styleFor(s: Sgr): string {
  let fg = s.fg;
  let bg = s.bg;
  if (s.inverse) { const f = fg ?? "#c9d1d9"; const b = bg ?? "#010409"; fg = b; bg = f; }
  const parts: string[] = [];
  if (fg) parts.push(`color:${fg}`);
  if (bg) parts.push(`background:${bg}`);
  if (s.bold) parts.push("font-weight:bold");
  if (s.dim) parts.push("opacity:.6");
  if (s.italic) parts.push("font-style:italic");
  const deco = [s.underline && "underline", s.strike && "line-through"].filter(Boolean);
  if (deco.length) parts.push(`text-decoration:${deco.join(" ")}`);
  return parts.join(";");
}

// Serialize a captured frame to HTML: wrap each styled run in a <span>, so the
// rasterized report shows the colored CLI. Plain (.txt) frames have no escapes,
// so this degrades to escapeHtml. Stray non-SGR control sequences are dropped.
function ansiToHtml(raw: string): string {
  const state: Sgr = {};
  const re = /\x1b\[([0-9;]*)m/g;
  let out = "";
  let last = 0;
  let m: RegExpExecArray | null;
  const flush = (text: string) => {
    if (!text) return;
    const clean = text.replace(/\x1b\[[0-9;?]*[@-~]/g, "");
    if (!clean) return;
    const style = styleFor(state);
    out += style ? `<span style="${style}">${escapeHtml(clean)}</span>` : escapeHtml(clean);
  };
  while ((m = re.exec(raw))) {
    flush(raw.slice(last, m.index));
    const params = m[1] === "" ? [0] : m[1].split(";").map((n) => parseInt(n, 10) || 0);
    applyCodes(state, params);
    last = re.lastIndex;
  }
  flush(raw.slice(last));
  return out;
}

function reportHtml(
  name: string,
  frames: Frame[],
  timings: Record<string, number>,
): string {
  const rows = frames
    .map(
      (f) => `
    <section class="row" data-frame="${f.file}">
      <h2>${f.file} <span class="t">(${fmtElapsed(timings[f.file] ?? 0)})</span></h2>
      <pre>${ansiToHtml(f.text)}</pre>
    </section>`,
    )
    .join("");
  return `<!doctype html><html><head><meta charset="utf-8"><title>wizard-ci snapshots — ${name}</title>
<style>
  body{background:#0d1117;color:#c9d1d9;font:14px/1.2 ui-monospace,SFMono-Regular,Menlo,"DejaVu Sans Mono","Liberation Mono",Consolas,monospace;margin:0;padding:24px}
  h1{font-size:18px} .summary{margin:8px 0 24px;color:#8b949e}
  .row{background:#0d1117;border:1px solid #21262d;border-radius:8px;margin:16px 0;padding:12px 16px}
  h2{font-size:14px;margin:0 0 10px;font-weight:600}
  .t{color:#8b949e;font-weight:400}
  pre{background:#010409;border:1px solid #21262d;border-radius:6px;padding:10px;margin:0;overflow:auto;white-space:pre}
</style></head><body>
<h1>wizard-ci TUI snapshots — ${name}</h1>
<div class="summary">${frames.length} key-moment frames from the current run</div>
${rows}
</body></html>`;
}

async function main(): Promise<number> {
  const args = process.argv.slice(2);
  const projectId =
    process.env.POSTHOG_WIZARD_PROJECT_ID ||
    args[args.indexOf("--project-id") + 1] ||
    "";

  // Which wizard program to drive. An explicit --program wins; otherwise it's
  // derived from the app's category (see programForApp), so `/wizard-ci
  // self-driving/<app>` drives self-driving without passing the flag.
  const programIdx = args.indexOf("--program");
  const explicitProgram = programIdx !== -1 ? args[programIdx + 1] : undefined;

  // Resolve which app(s) to snapshot:
  //  - explicit positional <app>           → that app
  //  - no app, interactive shell (local)    → app picker, like the run screens
  //  - no app, non-interactive (CI/mprocs)  → the default test set
  // Ignore values that belong to a flag (e.g. the --program / --project-id arg).
  const appArg = args.find(
    (a, i) =>
      !a.startsWith("--") &&
      args[i - 1] !== "--program" &&
      args[i - 1] !== "--project-id",
  );
  let defs: TestDef[];
  if (appArg) {
    defs = [{ name: basename(appArg), app: appArg }];
  } else if (process.stdin.isTTY) {
    const app = await selectApp(findApps(APPS_DIR));
    defs = [{ name: basename(app.name), app: app.name }];
  } else {
    defs = TEST_DEFS;
  }

  let failed = false;
  for (const def of defs) {
    console.log(`\n=== snapshots: ${def.name} (${def.app}) ===`);

    // The program an app drives comes from its category — reuse the same
    // app-path → command → program mapping the rest of wizard-ci uses, so
    // `self-driving/<app>` drives self-driving without an explicit --program.
    const cmd = findCommandByAppPath(def.app);
    const program = explicitProgram ?? (cmd ? commandToProgram(cmd.id) : undefined);

    // A non-zero run (e.g. self-driving aborting at GitHub-connect) is still
    // worth a report — render whatever frames were captured, and reflect the
    // failure in the exit code rather than bailing before the report.
    const code = runE2e({ app: def.app, projectId, program });
    if (code !== 0) {
      console.error(`✖ e2e run failed for ${def.name} (exit ${code}) — rendering captured frames anyway`);
      failed = true;
    }
    const frames = readFrames(snapsDirFor(def.app));
    if (frames.length === 0) {
      console.error(`✖ no snapshots at ${snapsDirFor(def.app)}`);
      failed = true;
      continue;
    }

    const timings = frameTimings(snapsDirFor(def.app));
    const reportDir = reportDirFor(def.app);
    mkdirSync(reportDir, { recursive: true });
    const report = join(reportDir, "report.html");
    writeFileSync(report, reportHtml(def.name, frames, timings));

    console.log(`\n--- ${def.name}: ${frames.length} frames ---`);
    for (const f of frames) console.log(`  · ${f.file}`);
    console.log(`\nvisual report — open it:  open ${report}`);
  }

  return failed ? 1 : 0;
}

main().then((code) => process.exit(code));
