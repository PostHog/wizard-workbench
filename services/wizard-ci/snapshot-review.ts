/**
 * wizard-ci snapshot review: open a PR with the current run's TUI screenshots
 * for a human to eyeball, instead of running the agent evaluator.
 *
 *   1. wizard-ci-snapshots <app>  → a real run + report.html (current frames)
 *   2. screenshot.ts              → one PNG per frame
 *   3. commit the PNGs to a review branch and open a PR whose body embeds them
 *      (via raw.githubusercontent URLs), one frame per row.
 *
 *   tsx services/wizard-ci/snapshot-review.ts <app> [--dry-run] [--comment-pr <n>]
 *
 * --comment-pr <n> also posts a comment on PR n (the frame count + a link to the
 * full review) — used by the `/wizard-snapshots` PR-comment trigger.
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
  readdirSync,
  writeFileSync,
} from "fs";
import { spawnSync } from "child_process";
import {
  snapsDirFor,
  reportDirFor,
  frameTimings,
  fmtElapsed,
  type Shot,
} from "./e2e.js";
import { commitAndCreatePR, postPRComment } from "../github/index.js";
import { getRepoRoot, git } from "../github/index.js";

const REVIEW_DIR = ".wizard-snapshots"; // committed on the review branch only

function run(cmd: string, args: string[], extraEnv: Record<string, string> = {}) {
  const r = spawnSync(cmd, args, {
    stdio: "inherit",
    env: { ...process.env, ...extraEnv },
  });
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(" ")} failed`);
}

/**
 * Build the PR body. Mirrors the eval path's buildPRBody: plain metadata lines,
 * then one image per captured frame.
 */
function prBody(
  app: string,
  shots: Shot[],
  rawBase: string,
  runUrl: string | null,
  timings: Record<string, number>,
): string {
  const lines: string[] = [
    "Automated wizard CI snapshot run.",
    "",
    runUrl ? `Source: [github-actions](${runUrl})` : "Source: local",
    `App: \`${app}\``,
    `App directory: \`apps/${app}\``,
    `Frames: ${shots.length}`,
    "",
    "Real-TUI key moments from the current run. Eyeball the frames below.",
    "",
  ];
  for (const s of shots) {
    lines.push(`### ${s.frame} (${fmtElapsed(timings[s.frame] ?? 0)})`);
    lines.push("", `![${s.frame}](${rawBase}/${s.file})`, "");
  }
  return lines.join("\n");
}

async function main(): Promise<number> {
  const args = process.argv.slice(2);
  const app = args.find((a) => !a.startsWith("--"));
  const dryRun = args.includes("--dry-run");
  // --comment-pr <n>: also post a comment on that PR linking to the review.
  const commentIdx = args.indexOf("--comment-pr");
  const commentPr = commentIdx !== -1 ? Number(args[commentIdx + 1]) : null;
  if (!app) {
    console.error("usage: snapshot-review <app> [--dry-run] [--comment-pr <n>]");
    return 2;
  }
  const name = basename(app);
  const reportDir = reportDirFor(app);

  // 1. a real run → report.html (the current real-TUI frames).
  run("npx", ["tsx", "services/wizard-ci/snapshots.ts", app]);
  const report = join(reportDir, "report.html");
  if (!existsSync(report)) {
    console.error(`✖ no report at ${report}`);
    return 1;
  }

  // 2. report.html → one PNG per frame + shots.json.
  const shotsDir = join(reportDir, "shots");
  run("npx", ["tsx", "services/wizard-ci/screenshot.ts", report, shotsDir]);
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
  const timings = frameTimings(snapsDirFor(app));
  const body = prBody(app, shots, rawBase, runUrl, timings);
  const title = `[CI] (snapshots) ${app}`;

  if (dryRun) {
    const dest = join(reportDir, "review");
    rmSync(dest, { recursive: true, force: true });
    mkdirSync(dest, { recursive: true });
    cpSync(shotsDir, dest, { recursive: true });
    writeFileSync(join(dest, "PR_BODY.md"), body);
    console.log(`\n[dry-run] review bundle → ${dest}`);
    console.log(`  ${shots.length} frames, PR body in PR_BODY.md`);
    return 0;
  }

  // Live: copy PNGs into the repo, commit them to the review branch, open the PR.
  const token = process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN;
  if (!token) {
    console.error("✖ GH_TOKEN / GITHUB_TOKEN required to open the review PR.");
    return 2;
  }
  const repoRoot = getRepoRoot(process.cwd());
  const dest = join(repoRoot, REVIEW_DIR, name);
  rmSync(dest, { recursive: true, force: true });
  mkdirSync(dest, { recursive: true });
  cpSync(shotsDir, dest, { recursive: true });

  // Also commit the raw text frames so the PR has a readable record, and so blank
  // renders can be told apart from blank captures.
  const txtDir = snapsDirFor(app);
  if (existsSync(txtDir)) {
    const txtDest = join(dest, "frames");
    mkdirSync(txtDest, { recursive: true });
    for (const f of readdirSync(txtDir))
      if (f.endsWith(".txt") && f !== "latest.txt")
        cpSync(join(txtDir, f), join(txtDest, f));
  }

  const baseSha = git("rev-parse HEAD", repoRoot);
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

    // When triggered by a /wizard-ci PR comment, report back on that PR with a
    // link to the full review.
    if (commentPr) {
      const comment = [
        `### Wizard CI snapshot review — \`${app}\``,
        "",
        `**${shots.length}** key-moment frame(s) captured.` +
          (r.prUrl ? ` [Review →](${r.prUrl})` : ""),
      ].join("\n");
      postPRComment(commentPr, comment, repoRoot);
      console.log(`✓ commented on PR #${commentPr}`);
    }
    return 0;
  } catch (e) {
    console.error(`✖ ${e instanceof Error ? e.message : String(e)}`);
    return 1;
  }
}

main().then((code) => process.exit(code));
