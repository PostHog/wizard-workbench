/**
 * report.html → PNG screenshots, via headless Chromium (Playwright).
 *
 * snapshots.ts renders each key moment to HTML (baseline │ current). This
 * rasterizes that report — one PNG per frame (the side-by-side row) plus a
 * full-flow strip — for attaching to a review PR.
 *
 *   tsx services/wizard-ci/screenshot.ts <report.html> <outDir> [--only-changed]
 *
 * Writes <outDir>/<frame>.png per row (named by the row's data-frame), a
 * _flow.png of the whole page, and a shots.json manifest (frame, status, file).
 */
import { chromium } from "playwright";
import { mkdirSync, rmSync, writeFileSync } from "fs";
import { join, basename } from "path";

interface Shot {
  frame: string;
  status: string;
  file: string;
}

async function main(): Promise<number> {
  const [report, outDir] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const onlyChanged = process.argv.includes("--only-changed");
  if (!report || !outDir) {
    process.stderr.write(
      "usage: screenshot <report.html> <outDir> [--only-changed]\n",
    );
    return 2;
  }

  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  // Wide enough that the two 100-col terminal columns sit side by side without
  // wrapping; 2× scale for crisp text.
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2,
  });
  await page.goto(`file://${report}`);
  await page.waitForLoadState("networkidle");

  const rows = page.locator("section.row[data-frame]");
  const count = await rows.count();
  const shots: Shot[] = [];

  for (let i = 0; i < count; i++) {
    const row = rows.nth(i);
    const frame = (await row.getAttribute("data-frame")) ?? `frame-${i}`;
    const status = (await row.getAttribute("data-status")) ?? "unknown";
    if (onlyChanged && status === "same") continue;
    const file = `${frame.replace(/\.[^.]+$/, "")}.png`; // 10-run.ans → 10-run.png
    await row.scrollIntoViewIfNeeded();
    await row.screenshot({ path: join(outDir, file) });
    shots.push({ frame, status, file });
  }

  // Full-flow strip — the whole report top to bottom.
  await page.screenshot({ path: join(outDir, "_flow.png"), fullPage: true });

  await browser.close();
  writeFileSync(join(outDir, "shots.json"), JSON.stringify(shots, null, 2));

  process.stdout.write(
    `shot ${shots.length} frame(s) + _flow.png → ${outDir}\n` +
      `manifest: ${join(outDir, "shots.json")}\n`,
  );
  return 0;
}

main().then((code) => process.exit(code));
