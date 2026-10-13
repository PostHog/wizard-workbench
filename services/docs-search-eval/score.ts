import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { GoldSet, type GoldQuery } from "./gold-set.js";
import { isCommunityQuestionUrl, normalizeDocUrl } from "./urls.js";

const armNames = ["rerankOff", "rerankOn"] as const;
const ArmName = z.enum(armNames);
const rate = z.number().finite().min(0).max(1).nullable();
const latency = z.number().finite().nonnegative().nullable();
const count = z.number().int().nonnegative();

export const ArmResult = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("ok"),
    latencyMs: z.number().finite().nonnegative(),
    chunks: z.array(z.object({ url: z.string(), content: z.string(), headingPath: z.array(z.string()) }).strict()),
  }).strict(),
  z.object({ status: z.literal("error"), latencyMs: z.number().finite().nonnegative(), error: z.string() }).strict(),
]);
export type ArmResult = z.infer<typeof ArmResult>;

const RetrievalMetrics = z.object({
  emptyRate: rate,
  hitAt3: rate,
  recallAt10: rate,
  counts: z.object({ labeled: count, ok: count, errored: count, scorable: count }).strict(),
}).strict();
const ArmMetrics = RetrievalMetrics.extend({ errorRate: rate, latencyP50Ms: latency, latencyP95Ms: latency }).strict();

export const ScoreSummary = z.object({
  gatingArm: ArmName,
  arms: z.object({ rerankOff: ArmMetrics, rerankOn: ArmMetrics, inkeep: RetrievalMetrics }).strict(),
  passBars: z.array(z.object({
    name: z.enum(["emptyRate", "hitAt3", "recallAt10", "latencyP95Ms"]),
    threshold: z.number().finite(),
    value: z.number().finite().nullable(),
    passed: z.boolean(),
  }).strict()),
  passed: z.boolean(),
  staleLabels: z.array(z.object({ queryId: z.string(), url: z.string() }).strict()),
  queriesWithoutLiveLabels: count,
  componentFlags: z.array(z.object({ queryId: z.string(), reason: z.enum(["no relevant chunk", "snippet missing"]) }).strict()),
  componentQueriesChecked: count,
}).strict();
export type ScoreSummary = z.infer<typeof ScoreSummary>;

export const Results = z.object({
  version: z.literal(1),
  startedAt: z.string(),
  finishedAt: z.string(),
  projectId: z.number().int(),
  gatingArm: ArmName,
  goldSetSha256: z.string(),
  goldSet: GoldSet,
  resolvedUrls: z.record(z.object({ finalUrl: z.string(), status: z.number().int() }).strict()),
  queries: z.array(z.object({
    id: z.string(),
    arms: z.object({ rerankOff: ArmResult, rerankOn: ArmResult }).strict(),
  }).strict()),
  metrics: ScoreSummary,
}).strict().superRefine((run, context) => {
  const goldIds = new Set(run.goldSet.queries.map((query) => query.id));
  const replayIds = new Set<string>();
  for (const [index, query] of run.queries.entries()) {
    if (replayIds.has(query.id) || !goldIds.has(query.id)) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["queries", index, "id"], message: "Duplicate or unknown replay query id" });
    }
    replayIds.add(query.id);
  }
  for (const query of run.goldSet.queries) {
    if (query.status !== "labeled" || replayIds.has(query.id)) continue;
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["queries"], message: `Missing labeled query ${query.id}` });
  }
});
export type Results = z.infer<typeof Results>;
export type ScoringResults = Omit<Results, "metrics">;

function compareText(first: string, second: string): number {
  if (first < second) return -1;
  if (first > second) return 1;
  return 0;
}

function roundMetric(value: number | null, digits = 4): number | null {
  if (value === null) return null;
  return Number(value.toFixed(digits));
}

function ratio(numerator: number, denominator: number): number | null {
  if (denominator === 0) return null;
  return numerator / denominator;
}

function rankedUrls(urls: string[]): string[] {
  return [...new Set(urls.map(normalizeDocUrl).filter((url) => !isCommunityQuestionUrl(url)))];
}

function percentile(latencies: number[], fraction: number): number | null {
  if (latencies.length === 0) return null;
  return [...latencies].sort((first, second) => first - second)[Math.ceil(fraction * latencies.length) - 1];
}

interface QueryLabels {
  query: GoldQuery;
  relevantUrls: Set<string>;
}

function retrievalMetrics(searches: Array<{ urls: string[]; relevantUrls: Set<string> }>, labeled: number, errored: number): z.infer<typeof RetrievalMetrics> {
  const scorableSearches = searches.filter((search) => search.relevantUrls.size > 0);
  const hits = scorableSearches.filter((search) => search.urls.slice(0, 3).some((url) => search.relevantUrls.has(url))).length;
  const totalRecall = scorableSearches.reduce((total, search) =>
    total + search.urls.slice(0, 10).filter((url) => search.relevantUrls.has(url)).length / search.relevantUrls.size, 0);
  return {
    emptyRate: ratio(searches.filter((search) => search.urls.length === 0).length, searches.length),
    hitAt3: ratio(hits, scorableSearches.length),
    recallAt10: ratio(totalRecall, scorableSearches.length),
    counts: { labeled, ok: searches.length, errored, scorable: scorableSearches.length },
  };
}

function roundedRetrieval(metrics: z.infer<typeof RetrievalMetrics>): z.infer<typeof RetrievalMetrics> {
  return { ...metrics, emptyRate: roundMetric(metrics.emptyRate), hitAt3: roundMetric(metrics.hitAt3), recallAt10: roundMetric(metrics.recallAt10) };
}

export function score(results: ScoringResults): ScoreSummary {
  const replayById = new Map(results.queries.map((query) => [query.id, query.arms]));
  const staleLabels: ScoreSummary["staleLabels"] = [];
  const labeledQueries: QueryLabels[] = results.goldSet.queries
    .filter((query) => query.status === "labeled")
    .sort((first, second) => compareText(first.id, second.id))
    .map((query) => {
      const relevantUrls = new Set<string>();
      for (const url of new Set(query.relevantUrls.map(normalizeDocUrl))) {
        const resolution = results.resolvedUrls[url];
        if (resolution?.status === 404 || resolution?.status === 410) {
          staleLabels.push({ queryId: query.id, url });
          continue;
        }
        relevantUrls.add(normalizeDocUrl(resolution?.finalUrl ?? url));
      }
      return { query, relevantUrls };
    });
  const rawArms = Object.fromEntries(armNames.map((armName) => {
    const searches: Array<{ urls: string[]; relevantUrls: Set<string> }> = [];
    const latencies: number[] = [];
    let errored = 0;
    for (const { query, relevantUrls } of labeledQueries) {
      const arm = replayById.get(query.id)?.[armName];
      if (!arm) throw new Error(`Missing ${armName} search for labeled query ${query.id}`);
      if (arm.status === "error") {
        errored++;
        continue;
      }
      latencies.push(arm.latencyMs);
      searches.push({ urls: rankedUrls(arm.chunks.map((chunk) => chunk.url)), relevantUrls });
    }
    return [armName, {
      ...retrievalMetrics(searches, labeledQueries.length, errored),
      errorRate: ratio(errored, labeledQueries.length),
      latencyP50Ms: percentile(latencies, 0.5),
      latencyP95Ms: percentile(latencies, 0.95),
    }];
  })) as Record<typeof armNames[number], z.infer<typeof ArmMetrics>>;
  const gatingMetrics = rawArms[results.gatingArm];
  const passBars: ScoreSummary["passBars"] = [
    { name: "emptyRate", threshold: 0.02, value: gatingMetrics.emptyRate, passed: gatingMetrics.emptyRate !== null && gatingMetrics.emptyRate < 0.02 },
    { name: "hitAt3", threshold: 0.8, value: gatingMetrics.hitAt3, passed: gatingMetrics.hitAt3 !== null && gatingMetrics.hitAt3 >= 0.8 },
    { name: "recallAt10", threshold: 0.7, value: gatingMetrics.recallAt10, passed: gatingMetrics.recallAt10 !== null && gatingMetrics.recallAt10 >= 0.7 },
    { name: "latencyP95Ms", threshold: 3000, value: gatingMetrics.latencyP95Ms, passed: gatingMetrics.latencyP95Ms !== null && gatingMetrics.latencyP95Ms < 3000 },
  ];
  const componentQueries = labeledQueries.filter(({ query }) => query.targetsComponentPage);
  const componentFlags: ScoreSummary["componentFlags"] = [];
  for (const { query, relevantUrls } of componentQueries) {
    const arm = replayById.get(query.id)?.[results.gatingArm];
    if (arm?.status === "error") continue;
    const chunk = arm?.chunks.find((candidate) => relevantUrls.has(normalizeDocUrl(candidate.url)));
    if (!chunk) {
      componentFlags.push({ queryId: query.id, reason: "no relevant chunk" });
      continue;
    }
    if (!query.expectedCodeSnippet || !chunk.content.includes(query.expectedCodeSnippet)) {
      componentFlags.push({ queryId: query.id, reason: "snippet missing" });
    }
  }
  function roundedArm(arm: z.infer<typeof ArmMetrics>): z.infer<typeof ArmMetrics> {
    return {
      ...roundedRetrieval(arm),
      errorRate: roundMetric(arm.errorRate),
      latencyP50Ms: roundMetric(arm.latencyP50Ms, 1),
      latencyP95Ms: roundMetric(arm.latencyP95Ms, 1),
    };
  }
  return {
    gatingArm: results.gatingArm,
    arms: {
      rerankOff: roundedArm(rawArms.rerankOff),
      rerankOn: roundedArm(rawArms.rerankOn),
      inkeep: roundedRetrieval(retrievalMetrics(labeledQueries.map(({ query, relevantUrls }) => ({ urls: rankedUrls(query.inkeepUrls), relevantUrls })), labeledQueries.length, 0)),
    },
    passBars: passBars.sort((first, second) => compareText(first.name, second.name))
      .map((bar) => ({ ...bar, value: roundMetric(bar.value, bar.name === "latencyP95Ms" ? 1 : 4) })),
    passed: passBars.every((bar) => bar.passed),
    staleLabels: staleLabels.sort((first, second) => compareText(first.queryId, second.queryId) || compareText(first.url, second.url)),
    queriesWithoutLiveLabels: labeledQueries.filter(({ relevantUrls }) => relevantUrls.size === 0).length,
    componentFlags,
    componentQueriesChecked: componentQueries.filter(({ query }) => replayById.get(query.id)?.[results.gatingArm].status === "ok").length,
  };
}

export function exceedsErrorBudget(results: ScoringResults): boolean {
  const searches = results.queries.flatMap((query) => armNames.map((armName) => query.arms[armName]));
  return searches.filter((arm) => arm.status === "error").length > searches.length * 0.05;
}

function markdownCell(value: string | number | null): string {
  return String(value ?? "N/A").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\|/g, "&#124;").replace(/[\r\n]+/g, " ");
}

export function renderReport(results: ScoringResults, summary: ScoreSummary): string {
  const lines = [
    `# Docs-search eval: ${markdownCell(results.startedAt)} (project ${results.projectId})`,
    "",
    `Gating arm: ${summary.gatingArm}. Overall: **${summary.passed ? "PASS" : "FAIL"}**.`,
    "",
    "| Bar | Threshold | Value | Result |",
    "| --- | --- | --- | --- |",
    ...summary.passBars.map((bar) => `| ${bar.name} | ${bar.name === "emptyRate" || bar.name === "latencyP95Ms" ? "<" : "≥"} ${bar.threshold} | ${markdownCell(bar.value)} | ${bar.passed ? "PASS" : "FAIL"} |`),
    "",
    "| Arm | emptyRate | errorRate | hitAt3 | recallAt10 | p50 (ms) | p95 (ms) | Labeled | OK | Errored | Scorable |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  ];
  for (const armName of [...armNames, "inkeep"] as const) {
    const metrics = summary.arms[armName];
    const searchMetrics = armName === "inkeep" ? null : summary.arms[armName];
    lines.push(`| ${armName === "inkeep" ? "Inkeep (report only)" : armName} | ${markdownCell(metrics.emptyRate)} | ${markdownCell(searchMetrics?.errorRate ?? null)} | ${markdownCell(metrics.hitAt3)} | ${markdownCell(metrics.recallAt10)} | ${markdownCell(searchMetrics?.latencyP50Ms ?? null)} | ${markdownCell(searchMetrics?.latencyP95Ms ?? null)} | ${metrics.counts.labeled} | ${metrics.counts.ok} | ${metrics.counts.errored} | ${metrics.counts.scorable} |`);
  }
  lines.push("", "Inkeep is not a correctness reference.", "", `Queries without live labels: ${summary.queriesWithoutLiveLabels}.`, "", "## Component checks", "", `Component queries checked: ${summary.componentQueriesChecked}.`, "");
  const scrubbedById = new Map(results.goldSet.queries.map((query) => [query.id, query.scrubbedQuery]));
  if (summary.componentFlags.length === 0) lines.push("No component flags.");
  if (summary.componentFlags.length > 0) {
    lines.push("| Query ID | Scrubbed query | Reason |", "| --- | --- | --- |", ...summary.componentFlags.map((flag) =>
      `| ${markdownCell(flag.queryId)} | ${markdownCell(scrubbedById.get(flag.queryId) ?? "")} | ${flag.reason} |`));
  }
  lines.push("", "## Stale labels", "");
  if (summary.staleLabels.length === 0) lines.push("No stale labels.");
  if (summary.staleLabels.length > 0) {
    lines.push("| Query ID | Scrubbed query | URL |", "| --- | --- | --- |", ...summary.staleLabels.map((label) =>
      `| ${markdownCell(label.queryId)} | ${markdownCell(scrubbedById.get(label.queryId) ?? "")} | ${markdownCell(label.url)} |`));
  }
  return `${lines.join("\n")}\n`;
}

async function main(): Promise<void> {
  const argumentsList = process.argv.slice(2);
  if (argumentsList.includes("--help")) {
    console.log("Usage: pnpm docs-eval:score <path/to/results.json>\nRescores an offline replay and writes report.md beside results.json.\nExit codes: 0 pass, 1 failed bars, 2 file/schema error or error budget exceeded, 3 saved metrics differ.");
    return;
  }
  try {
    if (argumentsList.length !== 1) throw new Error("Expected one results.json path; use --help for usage.");
    const resultsPath = resolve(argumentsList[0]);
    const results = Results.parse(JSON.parse(await readFile(resultsPath, "utf8")));
    if (exceedsErrorBudget(results)) {
      const erroredSearches = results.queries.flatMap((query) => armNames.map((armName) => query.arms[armName])).filter((arm) => arm.status === "error").length;
      console.error(`Search errors: ${erroredSearches}; exceeds the 5% error budget`);
      process.exitCode = 2;
      return;
    }
    const summary = score(results);
    console.log(`Docs-search eval: ${summary.passed ? "PASS" : "FAIL"} (${summary.gatingArm})`);
    for (const bar of summary.passBars) console.log(`${bar.name}: ${bar.value ?? "N/A"} ${bar.passed ? "PASS" : "FAIL"}`);
    if (JSON.stringify(summary) !== JSON.stringify(results.metrics)) {
      const differingKeys = (Object.keys(summary) as Array<keyof ScoreSummary>)
        .filter((key) => JSON.stringify(summary[key]) !== JSON.stringify(results.metrics[key]));
      console.error(`Rescored metrics differ: ${differingKeys.join(", ")}`);
      process.exitCode = 3;
      return;
    }
    await writeFile(join(dirname(resultsPath), "report.md"), renderReport(results, summary), "utf8");
    process.exitCode = summary.passed ? 0 : 1;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 2;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
