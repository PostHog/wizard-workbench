import "dotenv/config";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { docsProjectId, searchKnowledge } from "./api.js";
import { checkCoverage } from "./coverage.js";
import { assertGoldSetReadyForRun, readGoldSet } from "./gold-set.js";
import { Results, exceedsErrorBudget, renderReport, score, type ArmResult, type ScoringResults } from "./score.js";
import { normalizeDocUrl } from "./urls.js";

function parseOptions(argumentsList: string[]): { gatingArm: ScoringResults["gatingArm"] } {
  let gatingArm: ScoringResults["gatingArm"] = "rerankOff";
  for (let index = 0; index < argumentsList.length; index++) {
    const argument = argumentsList[index];
    if (argument === "--gating-arm") {
      const value = argumentsList[++index];
      if (value !== "rerankOff" && value !== "rerankOn") throw new Error("--gating-arm must be rerankOff or rerankOn");
      gatingArm = value;
      continue;
    }
    throw new Error(`Unknown argument: ${argument}`);
  }
  return { gatingArm };
}

function createLimiter(): <Value>(operation: () => Promise<Value>) => Promise<Value> {
  let activeRequests = 0;
  const waitingRequests: Array<() => void> = [];
  async function acquireSlot(): Promise<void> {
    if (activeRequests < 4) {
      activeRequests++;
      return;
    }
    await new Promise<void>((resume) => waitingRequests.push(resume));
  }
  return async function limitRequest<Value>(operation: () => Promise<Value>): Promise<Value> {
    await acquireSlot();
    try {
      return await operation();
    } finally {
      const resume = waitingRequests.shift();
      if (resume) resume();
      if (!resume) activeRequests--;
    }
  };
}

async function resolveLabelUrl(url: string): Promise<ScoringResults["resolvedUrls"][string]> {
  try {
    let response = await fetch(url, { method: "HEAD", redirect: "follow", signal: AbortSignal.timeout(30_000) });
    if (response.status === 405) {
      await response.body?.cancel();
      response = await fetch(url, { method: "GET", redirect: "follow", signal: AbortSignal.timeout(30_000) });
    }
    const resolution = { finalUrl: normalizeDocUrl(response.url), status: response.status };
    await response.body?.cancel();
    return resolution;
  } catch {
    return { finalUrl: url, status: 0 };
  }
}

async function replaySearch(projectId: number, scrubbedQuery: string, rerank: boolean): Promise<ArmResult> {
  const startedAt = performance.now();
  try {
    const search = await searchKnowledge(projectId, scrubbedQuery, { limit: 10, rerank });
    return {
      status: "ok",
      latencyMs: search.latencyMs,
      chunks: search.results.map((chunk) => ({ url: chunk.url, content: chunk.content, headingPath: chunk.heading_path })),
    };
  } catch (error) {
    return { status: "error", latencyMs: performance.now() - startedAt, error: error instanceof Error ? error.message : String(error) };
  }
}

async function main(): Promise<void> {
  const argumentsList = process.argv.slice(2);
  if (argumentsList.includes("--help")) {
    console.log("Usage: pnpm docs-eval:run [--gating-arm rerankOff|rerankOn] [--help]\nReplays the committed gold set against the Business Knowledge docs project with both rerank arms.\nDefaults: --gating-arm rerankOff (the shipped docs-search path).\nRequires POSTHOG_PERSONAL_API_KEY and POSTHOG_DOCS_EVAL_PROJECT_ID; POSTHOG_REGION defaults to us.\nExit codes: 0 pass, 1 readiness/coverage/bar failure, 2 configuration/API/file error.");
    return;
  }
  try {
    const options = parseOptions(argumentsList);
    const goldSet = await readGoldSet();
    try {
      assertGoldSetReadyForRun(goldSet);
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exitCode = 1;
      return;
    }
    const coverage = await checkCoverage();
    if (!coverage.passed) {
      console.error(`Overall coverage: ${(coverage.overall.coverage * 100).toFixed(2)}% (required: 99%)`);
      for (const source of coverage.requiredSources) console.error(`${source.name}: status=${source.status}`);
      console.error(`Missing URLs: ${coverage.overall.missing}`);
      console.error("Refusing to score: coverage check failed; run pnpm docs-eval:coverage for the full list");
      process.exitCode = 1;
      return;
    }
    const startedAt = new Date().toISOString();
    const projectId = docsProjectId();
    const goldSetBytes = await readFile(fileURLToPath(new URL("./gold-set.json", import.meta.url)));
    const labeledQueries = goldSet.queries.filter((query) => query.status === "labeled");
    const resolvedUrls = new Map<string, ScoringResults["resolvedUrls"][string]>();
    const relevantUrls = [...new Set(labeledQueries.flatMap((query) => query.relevantUrls.map(normalizeDocUrl)))];
    const limitRequest = createLimiter();
    let resolvedCount = 0;
    let searchedCount = 0;
    const totalSearches = labeledQueries.length * 2;
    const resolutions = relevantUrls.map((url) => limitRequest(async () => {
      resolvedUrls.set(url, await resolveLabelUrl(url));
      resolvedCount++;
      console.log(`Resolved labels: ${resolvedCount}/${relevantUrls.length}`);
    }));
    await Promise.all(resolutions);
    const replays = labeledQueries.map(async (query) => {
      async function searchArm(rerank: boolean): Promise<ArmResult> {
        return limitRequest(async () => {
          const arm = await replaySearch(projectId, query.scrubbedQuery, rerank);
          searchedCount++;
          console.log(`Searches: ${searchedCount}/${totalSearches}`);
          return arm;
        });
      }
      const [rerankOff, rerankOn] = await Promise.all([searchArm(false), searchArm(true)]);
      return { id: query.id, arms: { rerankOff, rerankOn } };
    });
    const queries = await Promise.all(replays);
    const replay: ScoringResults = {
      version: 1,
      startedAt,
      finishedAt: new Date().toISOString(),
      projectId,
      gatingArm: options.gatingArm,
      goldSetSha256: createHash("sha256").update(goldSetBytes).digest("hex"),
      goldSet,
      resolvedUrls: Object.fromEntries(resolvedUrls),
      queries,
    };
    const metrics = score(replay);
    const results = Results.parse({ ...replay, metrics });
    const runDirectory = fileURLToPath(new URL(`./runs/${startedAt.replace(/[:.]/g, "-")}/`, import.meta.url));
    const resultsPath = join(runDirectory, "results.json");
    const reportPath = join(runDirectory, "report.md");
    await mkdir(runDirectory, { recursive: true });
    await writeFile(resultsPath, `${JSON.stringify(results, null, 2)}\n`, "utf8");
    if (exceedsErrorBudget(results)) {
      const errorCount = results.queries.flatMap((query) => [query.arms.rerankOff, query.arms.rerankOn]).filter((arm) => arm.status === "error").length;
      console.error(`Search errors: ${errorCount}/${totalSearches}; exceeds the 5% error budget`);
      console.log(resultsPath);
      process.exitCode = 2;
      return;
    }
    await writeFile(reportPath, renderReport(results, metrics), "utf8");
    for (const bar of metrics.passBars) {
      const comparison = bar.name === "emptyRate" || bar.name === "latencyP95Ms" ? "<" : ">=";
      console.log(`${bar.name}: ${bar.value ?? "N/A"} (required ${comparison} ${bar.threshold}) ${bar.passed ? "PASS" : "FAIL"}`);
    }
    console.log(`Docs-search eval: ${metrics.passed ? "PASS" : "FAIL"} (${options.gatingArm})`);
    console.log(resultsPath);
    console.log(reportPath);
    process.exitCode = metrics.passed ? 0 : 1;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 2;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
