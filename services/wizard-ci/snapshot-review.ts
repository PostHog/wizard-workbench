/**
 * wizard-ci snapshot review: open a PR with side-by-side TUI screenshots for a
 * human to eyeball, instead of running the agent evaluator.
 *
 *   1. wizard-ci-snapshots <app>  → a real run, a diff vs the committed baseline,
 *                                   and report.html (baseline │ current per frame)
 *   2. screenshot.ts              → one PNG per changed frame + a _flow.png strip
 *   3. commit the PNGs to a review branch and open a PR whose body embeds them
 *      (via raw.githubusercontent URLs) — the changed frames first.
 *
 *   tsx services/wizard-ci/snapshot-review.ts <app> [--recording <f>] [--dry-run]
 *
 * --dry-run writes the PR body + PNGs under /tmp and skips the PR (for local use).
 * In CI the GitHub App token comes from GH_TOKEN / GITHUB_TOKEN and the repo from
 * GITHUB_REPOSITORY.
 */
import "dotenv/config";
import { join, basename } from "path";
import {
  existsSync,
  mkdirSync,
  rmSync,
  cpSync,
  readFileSync,
  writeFileSync,
} from "fs";
import { spawnSync } from "child_process";
import { commitAndCreatePR } from "../github/index.js";
import { getRepoRoot, git } from "../github/index.js";

const OUT_ROOT = "/tmp/wizard-snapshots";
const REVIEW_DIR = ".wizard-snapshots"; // committed on the review branch only

interface Shot {
  frame: string;
  status: string;
  file: string;
}

function run(cmd: string, args: string[], extraEnv: Record<string, string> = {}) {
  const r = spawnSync(cmd, args, {
    stdio: "inherit",
    env: { ...process.env, ...extraEnv },
  });
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(" ")} failed`);
}

const STATUS_EMOJI: Record<string, string> = {
  changed: "🟠",
  added: "🔵",
  removed: "🔴",
  same: "⚪️",
};

/** Build the PR body: a summary + each frame's side-by-side image. */
function prBody(
  app: string,
  shots: Shot[],
  rawBase: string,
  runUrl: string | null,
): string {
  const changed = shots.filter((s) => s.status !== "same");
  const lines: string[] = [];
  lines.push(`## TUI snapshot review — \`${app}\``);
  lines.push("");
  lines.push(
    `A real \`--e2e\` run, rendered to side-by-side screenshots (baseline │ current). ` +
      `**${changed.length}** of ${shots.length} key-moment frames differ. Eyeball them; ` +
      `merge this PR to accept the new baseline.`,
  );
  if (runUrl) lines.push("", `[CI run](${runUrl})`);
  lines.push("", `![flow](${rawBase}/_flow.png)`, "");
  for (const s of changed) {
    lines.push(`### ${STATUS_EMOJI[s.status] ?? ""} ${s.frame} — ${s.status}`);
    lines.push("", `![${s.frame}](${rawBase}/${s.file})`, "");
  }
  return lines.join("\n");
}

async function main(): Promise<number> {
  const args = process.argv.slice(2);
  const app = args.find((a) => !a.startsWith("--"));
  const dryRun = args.includes("--dry-run");
  const recIdx = args.indexOf("--recording");
  const recording = recIdx !== -1 ? args[recIdx + 1] : null;
  if (!app) {
    console.error("usage: snapshot-review <app> [--recording <f>] [--dry-run]");
    return 2;
  }
  const name = basename(app);

  // 1. snapshots → report.html (real run unless --recording reuses one).
  const snap = ["tsx", "services/wizard-ci/snapshots.ts"];
  if (recording) snap.push("--recording", recording);
  else snap.push(app);
  run("npx", snap);
  const report = join(OUT_ROOT, name, "report.html");
  if (!existsSync(report)) {
    console.error(`✖ no report at ${report}`);
    return 1;
  }

  // 2. report.html → PNGs (changed frames only) + shots.json.
  const shotsDir = join(OUT_ROOT, name, "shots");
  run("npx", [
    "tsx",
    "services/wizard-ci/screenshot.ts",
    report,
    shotsDir,
    "--only-changed",
  ]);
  const shots: Shot[] = JSON.parse(
    readFileSync(join(shotsDir, "shots.json"), "utf8"),
  );

  // 3. assemble the review bundle (PNGs + body) and open / dry-run the PR.
  const runId = process.env.GITHUB_RUN_ID ?? "local";
  const branch = `snapshots/${name}/${runId}`;
  const repoSlug = process.env.GITHUB_REPOSITORY ?? "PostHog/wizard-workbench";
  const [repoOwner, repoName] = repoSlug.split("/");
  const rawBase = `https://raw.githubusercontent.com/${repoSlug}/${branch}/${REVIEW_DIR}/${name}`;
  const runUrl = process.env.GITHUB_RUN_ID
    ? `https://github.com/${repoSlug}/actions/runs/${process.env.GITHUB_RUN_ID}`
    : null;
  const body = prBody(app, shots, rawBase, runUrl);
  const title = `📸 TUI snapshots — ${name}`;

  if (dryRun) {
    const dest = join(OUT_ROOT, name, "review");
    rmSync(dest, { recursive: true, force: true });
    mkdirSync(dest, { recursive: true });
    cpSync(shotsDir, dest, { recursive: true });
    writeFileSync(join(dest, "PR_BODY.md"), body);
    console.log(`\n[dry-run] review bundle → ${dest}`);
    console.log(`  ${shots.filter((s) => s.status !== "same").length} changed frames, PR body in PR_BODY.md`);
    return 0;
  }

  // Live: copy PNGs into the repo, commit them to the review branch, open the PR.
  const token = process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN;
  if (!token) {
    console.error("✖ GH_TOKEN / GITHUB_TOKEN required to open the review PR.");
    return 2;
  }
  const repoRoot = getRepoRoot();
  const dest = join(repoRoot, REVIEW_DIR, name);
  rmSync(dest, { recursive: true, force: true });
  mkdirSync(dest, { recursive: true });
  cpSync(shotsDir, dest, { recursive: true });

  const baseSha = git(["rev-parse", "HEAD"], repoRoot).trim();
  console.log(`Opening snapshot-review PR on branch ${branch}…`);
  try {
    const r = (await commitAndCreatePR({
      repoOwner,
      repoName,
      repoRoot,
      branch,
      baseBranch: process.env.SNAPSHOT_BASE ?? "main",
      baseSha,
      relativePath: join(REVIEW_DIR, name),
      commitMessage: `snapshots: ${name} @ ${runId}`,
      title,
      body,
      draft: false,
      token,
    })) as { prUrl?: string };
    console.log(`✓ review PR: ${r.prUrl ?? "(created)"}`);
    return 0;
  } catch (e) {
    console.error(`✖ ${e instanceof Error ? e.message : String(e)}`);
    return 1;
  }
}

main().then((code) => process.exit(code));
