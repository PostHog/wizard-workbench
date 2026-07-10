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

/** The captured key-moment frames from a run's snapshot dir, in order. */
function readFrames(dir: string): Frame[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".txt") || f.endsWith(".ans"))
    .sort()
    .map((file) => ({ file, text: readFileSync(join(dir, file), "utf8") }));
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function hex2(n: number): string {
  return Math.max(0, Math.min(255, n)).toString(16).padStart(2, "0");
}

/** xterm 256-color index → #rrggbb (16 base + 6×6×6 cube + 24 greys). */
function xterm256(n: number): string {
  const base = [
    "000000", "800000", "008000", "808000", "000080", "800080", "008080", "c0c0c0",
    "808080", "ff0000", "00ff00", "ffff00", "0000ff", "ff00ff", "00ffff", "ffffff",
  ];
  if (n < 16) return `#${base[n]}`;
  if (n < 232) {
    const i = n - 16;
    const l = [0, 95, 135, 175, 215, 255];
    return `#${hex2(l[Math.floor(i / 36) % 6])}${hex2(l[Math.floor(i / 6) % 6])}${hex2(l[i % 6])}`;
  }
  const v = 8 + (n - 232) * 10;
  return `#${hex2(v)}${hex2(v)}${hex2(v)}`;
}

/**
 * Render a terminal frame (with SGR escape sequences) to styled HTML.
 *
 * Frames captured as `.ans` carry real ANSI colour codes; escaping them as
 * plain text prints the raw escapes. This walks the SGR subset the wizard TUI
 * emits — reset, bold, dim, reverse, and 256-colour fg/bg — into `<span>`s, and
 * drops any other escape sequence. Plain `.txt` frames pass through unstyled.
 */
function ansiToHtml(s: string): string {
  const DEFAULT_FG = "#c9d1d9";
  const DEFAULT_BG = "#010409";
  let fg: string | null = null;
  let bg: string | null = null;
  let bold = false;
  let dim = false;
  let italic = false;
  let underline = false;
  let reverse = false;

  const openSpan = (): string => {
    let efg = fg ?? DEFAULT_FG;
    let ebg = bg ?? DEFAULT_BG;
    if (reverse) [efg, ebg] = [ebg, efg];
    const styles = [`color:${efg}`];
    if (bg !== null || reverse) styles.push(`background:${ebg}`);
    if (bold) styles.push("font-weight:600");
    if (dim) styles.push("opacity:.6");
    if (italic) styles.push("font-style:italic");
    if (underline) styles.push("text-decoration:underline");
    return `<span style="${styles.join(";")}">`;
  };

  const apply = (params: number[]): void => {
    for (let i = 0; i < params.length; i++) {
      const p = params[i];
      if (p === 0) { fg = bg = null; bold = dim = italic = underline = reverse = false; }
      else if (p === 1) bold = true;
      else if (p === 2) dim = true;
      else if (p === 3) italic = true;
      else if (p === 4) underline = true;
      else if (p === 7) reverse = true;
      else if (p === 22) bold = dim = false;
      else if (p === 23) italic = false;
      else if (p === 24) underline = false;
      else if (p === 27) reverse = false;
      else if (p === 39) fg = null;
      else if (p === 49) bg = null;
      else if (p === 38 || p === 48) {
        const mode = params[i + 1];
        let color: string | null = null;
        if (mode === 5) { color = xterm256(params[i + 2]); i += 2; }
        else if (mode === 2) { color = `#${hex2(params[i + 2])}${hex2(params[i + 3])}${hex2(params[i + 4])}`; i += 4; }
        if (p === 38) fg = color; else bg = color;
      }
      else if (p >= 30 && p <= 37) fg = xterm256(p - 30);
      else if (p >= 90 && p <= 97) fg = xterm256(p - 90 + 8);
      else if (p >= 40 && p <= 47) bg = xterm256(p - 40);
      else if (p >= 100 && p <= 107) bg = xterm256(p - 100 + 8);
    }
  };

  // Match SGR (…m), OSC (…BEL), and any other escape sequence; only SGR restyles.
  const re = /\x1b\[([0-9;?]*)([@-~])|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)?|\x1b[@-Z\\-_]/g;
  let out = openSpan();
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s)) !== null) {
    out += escapeHtml(s.slice(last, m.index));
    last = re.lastIndex;
    if (m[2] === "m") {
      apply(m[1] === "" ? [0] : m[1].split(";").map((n) => parseInt(n, 10) || 0));
      out += `</span>${openSpan()}`;
    }
  }
  return `${out}${escapeHtml(s.slice(last))}</span>`;
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
      <h2>${escapeHtml(f.file)} <span class="t">(${fmtElapsed(timings[f.file] ?? 0)})</span></h2>
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
