/**
 * wizard-ci snapshots: capture the real-TUI key-moment frames for the CI-e2e
 * test definitions and render them to an HTML report.
 *
 * Runs a real `--e2e` agent run, which drives the REAL wizard TUI and captures
 * every key-moment screen as text, then renders the current frames for review.
 * Baseline comparison is out of scope for now — this surfaces the current run.
 *
 *   pnpm wizard-ci-snapshots
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
import { runE2e, snapsDirFor } from "./e2e.js";

const OUT_ROOT = "/tmp/wizard-snapshots";

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
    .filter((f) => f.endsWith(".txt"))
    .sort()
    .map((file) => ({ file, text: readFileSync(join(dir, file), "utf8") }));
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function reportHtml(name: string, frames: Frame[]): string {
  const rows = frames
    .map(
      (f) => `
    <section class="row" data-frame="${f.file}">
      <h2>${f.file}</h2>
      <pre>${escapeHtml(f.text)}</pre>
    </section>`,
    )
    .join("");
  return `<!doctype html><html><head><meta charset="utf-8"><title>wizard-ci snapshots — ${name}</title>
<style>
  body{background:#0d1117;color:#c9d1d9;font:14px/1.2 ui-monospace,SFMono-Regular,Menlo,"DejaVu Sans Mono","Liberation Mono",Consolas,monospace;margin:0;padding:24px}
  h1{font-size:18px} .summary{margin:8px 0 24px;color:#8b949e}
  .row{background:#0d1117;border:1px solid #21262d;border-radius:8px;margin:16px 0;padding:12px 16px}
  h2{font-size:14px;margin:0 0 10px;font-weight:600}
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

  // Run a specific app when one is passed, otherwise the default test set.
  const appArg = args.find((a) => !a.startsWith("--"));
  const defs: TestDef[] = appArg
    ? [{ name: basename(appArg), app: appArg }]
    : TEST_DEFS;

  for (const def of defs) {
    console.log(`\n=== snapshots: ${def.name} (${def.app}) ===`);

    const code = runE2e({ app: def.app, projectId });
    if (code !== 0) {
      console.error(`✖ e2e run failed for ${def.name} (exit ${code})`);
      return code;
    }
    const frames = readFrames(snapsDirFor(def.app));
    if (frames.length === 0) {
      console.error(`✖ no snapshots at ${snapsDirFor(def.app)}`);
      return 1;
    }

    const reportDir = join(OUT_ROOT, def.name);
    mkdirSync(reportDir, { recursive: true });
    const report = join(reportDir, "report.html");
    writeFileSync(report, reportHtml(def.name, frames));

    console.log(`\n--- ${def.name}: ${frames.length} frames ---`);
    for (const f of frames) console.log(`  · ${f.file}`);
    console.log(`\nvisual report — open it:  open ${report}`);
  }

  return 0;
}

main().then((code) => process.exit(code));
