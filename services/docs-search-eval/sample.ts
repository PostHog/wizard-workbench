import "dotenv/config";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { eventsProjectId, runHogQL } from "./api.js";
import { isCommunityQuestionUrl, uniqueNormalized } from "./urls.js";

const HARNESSES = ["slack", "codex", "claude-code", "claude-ai", "cursor", "other"] as const;
type Harness = typeof HARNESSES[number];

interface SampleOptions {
  days: number;
  seed: number;
  perHarness: number;
}

interface CandidateSpan {
  spanUuid: string;
  traceId: string;
  harness: Harness;
  clientName: string;
  timestamp: string;
}

interface SampleRow extends CandidateSpan {
  rawQuery: string;
  inkeepUrls: string[];
}

const HARNESS_EXPRESSION = `multiIf(
  properties.$mcp_consumer = 'slack', 'slack',
  properties.$mcp_client_name ILIKE '%codex%' OR properties.$mcp_client_name ILIKE 'openai-mcp%', 'codex',
  properties.$mcp_client_name ILIKE 'claude-code%', 'claude-code',
  properties.$mcp_client_name ILIKE '%ClaudeAI%', 'claude-ai',
  properties.$mcp_client_name ILIKE '%cursor%', 'cursor',
  'other')`;

function parseOptions(argumentsList: string[]): SampleOptions {
  const options: SampleOptions = { days: 14, seed: 1, perHarness: 30 };
  const optionNames = new Map<string, keyof SampleOptions>([
    ["--days", "days"], ["--seed", "seed"], ["--per-harness", "perHarness"],
  ]);
  for (let index = 0; index < argumentsList.length; index++) {
    const argument = argumentsList[index];
    const optionName = optionNames.get(argument);
    if (!optionName) throw new Error(`Unknown argument: ${argument}`);
    const valueText = argumentsList[++index];
    const value = Number(valueText);
    const minimum = optionName === "seed" ? 0 : 1;
    if (!valueText || !/^\d+$/.test(valueText) || !Number.isSafeInteger(value) || value < minimum) {
      throw new Error(`${argument} requires a safe integer >= ${minimum}`);
    }
    options[optionName] = value;
  }
  if (!Number.isSafeInteger(options.perHarness * 3)) throw new Error("--per-harness is too large");
  return options;
}

function quoteHogQL(value: string): string {
  return `'${value.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
}

async function fetchCandidates(options: SampleOptions): Promise<CandidateSpan[]> {
  const candidates: CandidateSpan[] = [];
  const candidatesPerHarness = options.perHarness * 3;
  for (const harness of HARNESSES) {
    const spans = await runHogQL(eventsProjectId(), `
      SELECT uuid, ${HARNESS_EXPRESSION} AS harness,
        properties.$mcp_client_name AS clientName,
        properties.$ai_trace_id AS traceId, timestamp
      FROM events
      WHERE event = '$ai_span' AND properties.$ai_span_name = 'docs-search'
        AND timestamp >= now() - INTERVAL ${options.days} DAY
        AND timestamp <= now() AND ${HARNESS_EXPRESSION} = ${quoteHogQL(harness)}
      ORDER BY cityHash64(concat(toString(uuid), '${options.seed}')), uuid
      LIMIT ${candidatesPerHarness}
    `);
    for (const span of spans) {
      if (typeof span.uuid !== "string" || typeof span.timestamp !== "string") {
        throw new Error("PostHog candidate response is missing a span UUID or timestamp");
      }
      if (typeof span.traceId !== "string" || !span.traceId.trim()) continue;
      candidates.push({
        spanUuid: span.uuid,
        traceId: span.traceId,
        harness,
        clientName: typeof span.clientName === "string" ? span.clientName : "",
        timestamp: span.timestamp,
      });
    }
  }
  return candidates;
}

async function fetchSpanStates(spans: CandidateSpan[], column: "input_state" | "output_state"): Promise<Map<string, unknown>> {
  const statesBySpanUuid = new Map<string, unknown>();
  for (let offset = 0; offset < spans.length; offset += 100) {
    const batch = spans.slice(offset, offset + 100);
    const traceIds = [...new Set(batch.map((span) => span.traceId))];
    const spanUuids = [...new Set(batch.map((span) => span.spanUuid))];
    const states = await runHogQL(eventsProjectId(), `
      SELECT uuid, ${column} FROM posthog.ai_events
      WHERE trace_id IN (${traceIds.map(quoteHogQL).join(", ")})
        AND span_name = 'docs-search'
        AND uuid IN (${spanUuids.map(quoteHogQL).join(", ")})
      LIMIT 500
    `);
    for (const state of states) {
      if (typeof state.uuid !== "string") throw new Error("PostHog content response is missing a span UUID");
      statesBySpanUuid.set(state.uuid, state[column]);
    }
  }
  return statesBySpanUuid;
}

function extractQuery(inputState: unknown): string {
  if (typeof inputState === "string") {
    try {
      return extractQuery(JSON.parse(inputState));
    } catch {
      return "";
    }
  }
  if (!inputState || typeof inputState !== "object" || !("query" in inputState)) return "";
  return typeof inputState.query === "string" ? inputState.query.trim() : "";
}

function extractUrls(outputState: unknown): string[] {
  const outputText = typeof outputState === "string" ? outputState : JSON.stringify(outputState) ?? "";
  const urls = Array.from(outputText.matchAll(/URL:\s*(https?:\/\/[^\s\\"'<>]+)/g), (match) => match[1]);
  return uniqueNormalized(urls).filter((url) => !isCommunityQuestionUrl(url));
}

async function sample(options: SampleOptions): Promise<number> {
  const candidates = await fetchCandidates(options);
  const inputsBySpanUuid = await fetchSpanStates(candidates, "input_state");
  const countsByHarness = Object.fromEntries(HARNESSES.map((harness) => [harness, 0])) as Record<Harness, number>;
  const seenQueries = new Set<string>();
  const rows: SampleRow[] = [];
  for (const candidate of candidates) {
    if (countsByHarness[candidate.harness] >= options.perHarness) continue;
    const rawQuery = extractQuery(inputsBySpanUuid.get(candidate.spanUuid));
    const queryKey = rawQuery.replace(/\s+/g, " ").toLowerCase();
    if (!queryKey || seenQueries.has(queryKey)) continue;
    seenQueries.add(queryKey);
    countsByHarness[candidate.harness]++;
    rows.push({ ...candidate, rawQuery, inkeepUrls: [] });
  }
  const outputsBySpanUuid = await fetchSpanStates(rows, "output_state");
  for (const row of rows) row.inkeepUrls = extractUrls(outputsBySpanUuid.get(row.spanUuid));
  const outputPath = fileURLToPath(new URL("./data/raw-sample.json", import.meta.url));
  await mkdir(fileURLToPath(new URL("./data/", import.meta.url)), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify({
    generatedAt: new Date().toISOString(),
    ...options,
    countsByHarness,
    rows,
  }, null, 2)}\n`, { mode: 0o600 });
  for (const harness of HARNESSES) console.log(`${harness}: ${countsByHarness[harness]}`);
  console.log(`Distinct queries: ${rows.length}`);
  console.log(`Output: ${outputPath}`);
  if (rows.length >= 100) return 0;
  console.error(`Only ${rows.length} distinct queries kept; at least 100 required. Raise --per-harness or --days.`);
  return 1;
}

async function main(): Promise<void> {
  const argumentsList = process.argv.slice(2);
  if (argumentsList.includes("--help")) {
    console.log("Usage: pnpm docs-eval:sample [--days 14] [--seed 1] [--per-harness 30] [--help]\nSamples MCP docs-search calls from the events project into data/raw-sample.json.\nRequires POSTHOG_DOCS_EVAL_API_KEY and POSTHOG_DOCS_EVAL_EVENTS_PROJECT_ID; POSTHOG_REGION defaults to us.\nExit codes: 0 at least 100 distinct queries, 1 insufficient queries, 2 configuration/API error.");
    return;
  }
  try {
    process.exitCode = await sample(parseOptions(argumentsList));
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Docs-search sampling failed");
    process.exitCode = 2;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
