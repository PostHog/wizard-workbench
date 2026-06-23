/**
 * wizard-ci snapshots: real-TUI visual-regression for the CI-e2e test definitions.
 *
 * For each test definition this runs a real `--e2e` agent run, which drives the
 * REAL wizard TUI and captures every key-moment screen as text, then diffs each
 * against a committed baseline. Differences are surfaced side-by-side for review.
 *
 *   pnpm wizard-ci-snapshots                 # run + compare, write HTML report
 *   pnpm wizard-ci-snapshots --update        # accept current output as baseline
 *
 * Requires (in .env, sourced by the `wizard-ci-snapshots` mprocs proc):
 *   POSTHOG_PERSONAL_API_KEY   the phx key (gateway bearer)
 *   POSTHOG_WIZARD_PROJECT_ID  the project the key is scoped to
 *   POSTHOG_REGION             us | eu
 *   WIZARD_PATH                a wizard checkout that has e2e-harness/ (where the run happens)
 *
 * Drift never fails the command: diffs are surfaced (terminal + report.html), and
 * only a genuine failure (run died, no snapshots) exits non-zero. report.html is
 * the side-by-side; locally it's surfaced through mprocs.
 */
import "dotenv/config";
import { join } from "path";
import {
  existsSync,
  mkdirSync,
  rmSync,
  readFileSync,
  writeFileSync,
  readdirSync,
  cpSync,
} from "fs";
import { runE2e, snapsDirFor } from "./e2e.js";

const BASELINE_ROOT = join(import.meta.dirname, "snapshots");
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

type FrameStatus = "same" | "changed" | "added" | "removed";
interface FrameDiff {
  file: string;
  status: FrameStatus;
  baseline: string | null;
  current: string | null;
}

/** Union the two dirs by filename and classify each real-TUI snapshot. */
function diffDirs(baselineDir: string, currentDir: string): FrameDiff[] {
  const ls = (d: string) =>
    existsSync(d) ? readdirSync(d).filter((f) => f.endsWith(".txt")) : [];
  const files = [...new Set([...ls(baselineDir), ...ls(currentDir)])].sort();
  return files.map((file) => {
    const b = existsSync(join(baselineDir, file))
      ? readFileSync(join(baselineDir, file), "utf8")
      : null;
    const c = existsSync(join(currentDir, file))
      ? readFileSync(join(currentDir, file), "utf8")
      : null;
    const status: FrameStatus =
      b === null ? "added" : c === null ? "removed" : b === c ? "same" : "changed";
    return { file, status, baseline: b, current: c };
  });
}

const BADGE: Record<FrameStatus, string> = {
  same: "#3fb950",
  changed: "#d29922",
  added: "#58a6ff",
  removed: "#f85149",
};

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function reportHtml(name: string, diffs: FrameDiff[]): string {
  const cell = (s: string | null) =>
    s === null
      ? `<pre class="missing">— absent —</pre>`
      : `<pre>${escapeHtml(s)}</pre>`;
  const rows = diffs
    .map(
      (d) => `
    <section class="row ${d.status}" data-frame="${d.file}" data-status="${d.status}">
      <h2><span class="badge" style="background:${BADGE[d.status]}">${d.status}</span> ${d.file}</h2>
      <div class="cols">
        <div><div class="lbl">baseline</div>${cell(d.baseline)}</div>
        <div><div class="lbl">current</div>${cell(d.current)}</div>
      </div>
    </section>`,
    )
    .join("");
  const changed = diffs.filter((d) => d.status !== "same").length;
  return `<!doctype html><html><head><meta charset="utf-8"><title>wizard-ci snapshots — ${name}</title>
<style>
  body{background:#0d1117;color:#c9d1d9;font:14px/1.2 ui-monospace,SFMono-Regular,Menlo,"DejaVu Sans Mono","Liberation Mono",Consolas,monospace;margin:0;padding:24px}
  h1{font-size:18px} .summary{margin:8px 0 24px;color:#8b949e}
  .row{background:#0d1117;border:1px solid #21262d;border-radius:8px;margin:16px 0;padding:12px 16px}
  .row.same{opacity:.5} .row.changed{border-color:#d29922}
  h2{font-size:14px;margin:0 0 10px;font-weight:600}
  .badge{color:#0d1117;padding:1px 8px;border-radius:10px;font-size:11px;text-transform:uppercase;margin-right:8px}
  .cols{display:grid;grid-template-columns:1fr 1fr;gap:16px}
  .lbl{color:#8b949e;font-size:11px;text-transform:uppercase;margin-bottom:4px}
  pre{background:#010409;border:1px solid #21262d;border-radius:6px;padding:10px;margin:0;overflow:auto;white-space:pre}
  pre.missing{color:#6e7681;font-style:italic}
</style></head><body>
<h1>wizard-ci TUI snapshots — ${name}</h1>
<div class="summary">${diffs.length} key-moment frames · ${changed} changed/added/removed · review the side-by-side below</div>
${rows}
</body></html>`;
}

async function main(): Promise<number> {
  const args = process.argv.slice(2);
  const update = args.includes("--update");
  const projectId =
    process.env.POSTHOG_WIZARD_PROJECT_ID ||
    args[args.indexOf("--project-id") + 1] ||
    "";

  let totalChanged = 0;
  for (const def of TEST_DEFS) {
    console.log(`\n=== snapshots: ${def.name} (${def.app}) ===`);

    const code = runE2e({ app: def.app, projectId });
    if (code !== 0) {
      console.error(`✖ e2e run failed for ${def.name} (exit ${code})`);
      return code;
    }
    const currentDir = snapsDirFor(def.app);
    if (!existsSync(currentDir) || readdirSync(currentDir).filter((f) => f.endsWith(".txt")).length === 0) {
      console.error(`✖ no snapshots at ${currentDir}`);
      return 1;
    }

    const baselineDir = join(BASELINE_ROOT, def.name);
    if (update) {
      rmSync(baselineDir, { recursive: true, force: true });
      mkdirSync(baselineDir, { recursive: true });
      cpSync(currentDir, baselineDir, { recursive: true });
      console.log(`✓ baseline updated → ${baselineDir}`);
      continue;
    }

    const diffs = diffDirs(baselineDir, currentDir);
    const changed = diffs.filter((d) => d.status !== "same");
    const reportDir = join(OUT_ROOT, def.name);
    mkdirSync(reportDir, { recursive: true });
    const report = join(reportDir, "report.html");
    writeFileSync(report, reportHtml(def.name, diffs));

    console.log(`\n--- ${def.name}: ${diffs.length} frames, ${changed.length} differ ---`);
    for (const d of diffs) {
      const mark = d.status === "same" ? "·" : d.status === "changed" ? "~" : d.status === "added" ? "+" : "-";
      console.log(`  ${mark} ${d.file}`);
      if (d.status === "changed" && d.current) {
        console.log(d.current.split("\n").map((l) => `      ${l}`).join("\n"));
      }
    }
    console.log(`\nvisual report — open it:  open ${report}`);
    if (!existsSync(baselineDir))
      console.log(`(no baseline yet — run with --update to seed it)`);
    totalChanged += changed.length;
  }

  // Drift never fails: report the diffs and exit 0 (real failures returned
  // non-zero earlier). Accept a new baseline with --update.
  if (totalChanged)
    console.log(
      `\nℹ ${totalChanged} frame(s) changed — review the report above. ` +
        `Accept with --update if the new run looks right.`,
    );
  else console.log(`\n✓ snapshots match baseline.`);

  return 0;
}

main().then((code) => process.exit(code));
