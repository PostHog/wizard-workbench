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

function paletteCss(n: number): string {
  const BASIC = [
    "#000000", "#cd3131", "#0dbc79", "#e5e510", "#2472c8", "#bc3fbc",
    "#11a8cd", "#e5e5e5", "#666666", "#f14c4c", "#23d18b", "#f5f543",
    "#3b8eea", "#d670d6", "#29b8db", "#ffffff",
  ];
  if (n < 16) return BASIC[n];
  if (n < 232) {
    const i = n - 16;
    const step = (v: number) => (v === 0 ? 0 : 55 + v * 40);
    return `rgb(${step(Math.floor(i / 36))},${step(Math.floor(i / 6) % 6)},${step(i % 6)})`;
  }
  const g = 8 + (n - 232) * 10;
  return `rgb(${g},${g},${g})`;
}

function ansiToHtml(s: string): string {
  let out = "";
  let open = false;
  let last = 0;
  const SGR = /\x1b\[([0-9;]*)m/g;
  const close = () => {
    if (open) out += "</span>";
    open = false;
  };
  for (let m = SGR.exec(s); m; m = SGR.exec(s)) {
    out += escapeHtml(s.slice(last, m.index));
    last = m.index + m[0].length;
    close();
    const codes = m[1].split(";").filter(Boolean).map(Number);
    if (!codes.length) continue;
    const style: string[] = [];
    for (let i = 0; i < codes.length; i++) {
      const c = codes[i];
      if (c === 1) style.push("font-weight:bold");
      else if (c === 2) style.push("opacity:.6");
      else if (c === 3) style.push("font-style:italic");
      else if (c === 4) style.push("text-decoration:underline");
      else if (c === 8) style.push("visibility:hidden");
      else if (c === 9) style.push("text-decoration:line-through");
      else if (c === 38 || c === 48) {
        const prop = c === 38 ? "color" : "background";
        if (codes[i + 1] === 5) {
          style.push(`${prop}:${paletteCss(codes[i + 2])}`);
          i += 2;
        } else if (codes[i + 1] === 2) {
          style.push(`${prop}:rgb(${codes[i + 2]},${codes[i + 3]},${codes[i + 4]})`);
          i += 4;
        }
      }
    }
    if (style.length) {
      out += `<span style="${style.join(";")}">`;
      open = true;
    }
  }
  out += escapeHtml(s.slice(last));
  close();
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

  const renderOnly = args.includes("--render-only");

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
    const code = renderOnly ? 0 : runE2e({ app: def.app, projectId, program });
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
