/**
 * report.html → PNG screenshots, via headless Chromium (Playwright).
 *
 * snapshots.ts renders each key moment to HTML. This rasterizes that report into
 * one PNG per frame (one row), for attaching to a review PR.
 *
 *   tsx services/wizard-ci/screenshot.ts <report.html> <outDir>
 *
 * Writes <outDir>/<frame>.png per row (named by the row's data-frame) and a
 * shots.json manifest (frame, file).
 */
import { chromium } from "playwright";
import { mkdirSync, rmSync, writeFileSync } from "fs";
import { join } from "path";
import { type Shot } from "./e2e.js";

async function main(): Promise<number> {
  const [report, outDir] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  if (!report || !outDir) {
    process.stderr.write("usage: screenshot <report.html> <outDir>\n");
    return 2;
  }

  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  // 2× scale for crisp terminal text.
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
    const file = `${frame.replace(/\.[^.]+$/, "")}.png`; // 10-run.txt → 10-run.png
    await row.scrollIntoViewIfNeeded();
    await row.screenshot({ path: join(outDir, file) });
    shots.push({ frame, file });
  }

  await browser.close();
  writeFileSync(join(outDir, "shots.json"), JSON.stringify(shots, null, 2));

  process.stdout.write(
    `shot ${shots.length} frame(s) → ${outDir}\n` +
      `manifest: ${join(outDir, "shots.json")}\n`,
  );
  return 0;
}

main().then((code) => process.exit(code));
