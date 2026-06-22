/**
 * wizard-ci snapshots: TUI visual-regression for the CI-e2e test definitions.
 *
 * For each test definition (for now: the integration flow on express-todo) this
 * runs a REAL `--e2e` agent run, renders every key-moment frame of the run's
 * recording to a real-Ink ANSI snapshot, and diffs it against a committed
 * baseline. The point is NOT pixel-determinism — a real agent enqueues tasks
 * differently run to run — it's to surface those differences to a human in a
 * side-by-side: same screens every time, minor run-to-run changes flagged for
 * review. No mocks anywhere: real agent, real recording, real render.
 *
 *   pnpm wizard-ci-snapshots                 # run + compare, write HTML report
 *   pnpm wizard-ci-snapshots --update        # accept current output as baseline
 *   pnpm wizard-ci-snapshots --recording <f> # skip the run, render an existing
 *                                            #   real recording (still no mock)
 *
 * Requires (in .env, sourced by the `wizard-ci-snapshots` mprocs proc):
 *   POSTHOG_PERSONAL_API_KEY   the phx key (used as the gateway bearer)
 *   POSTHOG_WIZARD_PROJECT_ID  the project the key is scoped to (else bootstrap 403s)
 *   POSTHOG_REGION             us | eu
 *   WIZARD_PATH                a wizard checkout that has e2e-harness/ (i.e. on the
 *                              e2e-control-plane branch) — that's where the render runs
 *
 * Drift never fails the command — a real agent emits frames a little differently
 * each run, so the diffs are surfaced (terminal summary + report.html) for a
 * human to eyeball, not asserted away. Only a genuine failure (the run dying, no
 * recording) exits non-zero. report.html is the side-by-side visual comparison;
 * locally it's surfaced through mprocs.
 */
import "dotenv/config";
import { join, basename } from "path";
import {
  existsSync,
  mkdirSync,
  rmSync,
  readFileSync,
  writeFileSync,
  readdirSync,
  cpSync,
} from "fs";
import { spawnSync } from "child_process";
import { runE2e } from "./e2e.js";
import { ansiToHtml } from "./ansi-html.js";

const WORKBENCH = join(import.meta.dirname, "..", "..");
const BASELINE_ROOT = join(import.meta.dirname, "snapshots");
const OUT_ROOT = "/tmp/wizard-snapshots";

/** A CI-e2e test definition: which flow runs against which app. */
interface TestDef {
  /** Stable key for baseline + report dirs. */
  name: string;
  /** apps/<app> path the e2e harness copies and runs against. */
  app: string;
}

const TEST_DEFS: TestDef[] = [
  {
    name: "express-todo",
    app: "basic-integration/javascript-node/express-todo",
  },
];

function wizardRepo(): string {
  const p = process.env.WIZARD_PATH?.replace(/^~/, process.env.HOME || "");
  if (!p) throw new Error("WIZARD_PATH is not set (path to the wizard repo).");
  return p;
}

type FrameStatus = "same" | "changed" | "added" | "removed";
interface FrameDiff {
  file: string;
  status: FrameStatus;
  baseline: string | null;
  current: string | null;
}

/** Render a recording's frames to <outDir>/<seq>-<screen>.ans via the wizard. */
function renderSnapshots(recording: string, outDir: string): void {
  const script = join(wizardRepo(), "scripts", "render-snapshots.no-jest.ts");
  if (!existsSync(script))
    throw new Error(`wizard render-snapshots not found: ${script}`);
  const r = spawnSync("npx", ["tsx", script, recording, outDir], {
    cwd: wizardRepo(),
    stdio: "inherit",
    // Force truecolor so Ink/chalk emit ANSI even though this isn't a TTY —
    // the snapshots capture the real colored TUI, not stripped text.
    env: { ...process.env, FORCE_COLOR: "3" },
  });
  if (r.status !== 0) throw new Error("render-snapshots failed");
}

/** Union the two dirs by filename and classify each frame. */
function diffDirs(baselineDir: string, currentDir: string): FrameDiff[] {
  const ls = (d: string) =>
    existsSync(d) ? readdirSync(d).filter((f) => f.endsWith(".ans")) : [];
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

function reportHtml(name: string, diffs: FrameDiff[]): string {
  const cell = (s: string | null) =>
    s === null
      ? `<pre class="missing">— absent —</pre>`
      : `<pre>${ansiToHtml(s)}</pre>`;
  const rows = diffs
    .map(
      (d) => `
    <section class="row ${d.status}">
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
  body{background:#0d1117;color:#c9d1d9;font:14px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;margin:0;padding:24px}
  h1{font-size:18px} .summary{margin:8px 0 24px;color:#8b949e}
  .row{border:1px solid #21262d;border-radius:8px;margin:16px 0;padding:12px 16px}
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

function stripAnsi(s: string): string {
  // eslint-disable-next-line no-control-regex
  return s.replace(/\x1b\[[0-9;]*m/g, "");
}

function main(): number {
  const args = process.argv.slice(2);
  const update = args.includes("--update");
  const recordingArg = args[args.indexOf("--recording") + 1];
  const onlyRecording = args.includes("--recording") ? recordingArg : null;
  const projectId =
    process.env.POSTHOG_WIZARD_PROJECT_ID ||
    args[args.indexOf("--project-id") + 1] ||
    "";

  let totalChanged = 0;
  for (const def of TEST_DEFS) {
    console.log(`\n=== snapshots: ${def.name} (${def.app}) ===`);

    const recording = onlyRecording || `/tmp/wizard-e2e-${basename(def.app)}.recording.json`;
    if (!onlyRecording) {
      const code = runE2e({ app: def.app, projectId });
      if (code !== 0) {
        console.error(`✖ e2e run failed for ${def.name} (exit ${code})`);
        return code;
      }
    }
    if (!existsSync(recording)) {
      console.error(`✖ no recording at ${recording}`);
      return 1;
    }

    const currentDir = join(OUT_ROOT, def.name, "current");
    const baselineDir = join(BASELINE_ROOT, def.name);
    renderSnapshots(recording, currentDir);

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
      // mprocs: show the changed frame's current render inline for quick eyeball.
      if (d.status === "changed" && d.current) {
        console.log(stripAnsi(d.current).split("\n").map((l) => `      ${l}`).join("\n"));
      }
    }
    console.log(`\nvisual report: ${report}`);
    if (!existsSync(baselineDir))
      console.log(`(no baseline yet — run with --update to seed it)`);
    totalChanged += changed.length;
  }

  // Drift is expected — a real agent does the same steps but emits frames a
  // little differently run to run. We surface the diffs for a human to eyeball;
  // we never fail on them. (A genuine failure — the run dying or no recording —
  // returns non-zero earlier.) Accept a new baseline with --update.
  if (totalChanged)
    console.log(
      `\nℹ ${totalChanged} frame(s) changed — review the report above. ` +
        `Accept with --update if the new run looks right.`,
    );
  else console.log(`\n✓ snapshots match baseline.`);
  return 0;
}

process.exit(main());
