/**
 * Benchmark data types and formatting for wizard CI runs.
 * Reads per-phase token usage data written by the wizard's --benchmark mode.
 */
import { readFileSync, unlinkSync, existsSync } from "fs";

export const BENCHMARK_FILE_PATH = "/tmp/posthog-wizard-benchmark.json";

export interface StepUsage {
  name: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
    cache_creation_input_tokens: number;
    cache_read_input_tokens: number;
  };
  modelUsage: Record<string, unknown>;
  totalCostUsd: number;
  durationMs: number;
  durationApiMs: number;
  numTurns: number;
  contextTokensIn?: number;
  contextTokensOut?: number;
  compactions?: number;
  compactionPreTokens?: number[];
}

export interface BenchmarkData {
  timestamp: string;
  steps: StepUsage[];
  totals: {
    totalCostUsd: number;
    durationMs: number;
    inputTokens: number;
    outputTokens: number;
    numTurns: number;
  };
}

/**
 * Read and parse the benchmark file written by the wizard.
 * Returns null if file doesn't exist or can't be parsed.
 * Optionally cleans up the temp file after reading.
 */
export function readBenchmarkFile(cleanup = true): BenchmarkData | null {
  try {
    if (!existsSync(BENCHMARK_FILE_PATH)) {
      return null;
    }
    const raw = readFileSync(BENCHMARK_FILE_PATH, "utf-8");
    const data = JSON.parse(raw) as BenchmarkData;

    if (cleanup) {
      try {
        unlinkSync(BENCHMARK_FILE_PATH);
      } catch {
        // Ignore cleanup errors
      }
    }

    return data;
  } catch {
    return null;
  }
}

// ============================================================================
// Formatting helpers
// ============================================================================

function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

function formatCost(usd: number): string {
  return `$${usd.toFixed(4)}`;
}

function formatDuration(ms: number): string {
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatContext(tokens: number | undefined): string {
  if (tokens == null) return "-";
  if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(1)}M`;
  if (tokens >= 10_000) return `${Math.round(tokens / 1000)}K`;
  return formatNumber(tokens);
}

function padRight(str: string, len: number): string {
  return str.length >= len ? str : str + " ".repeat(len - str.length);
}

function padLeft(str: string, len: number): string {
  return str.length >= len ? str : " ".repeat(len - str.length) + str;
}

/**
 * Format benchmark data as a console table.
 */
export function formatBenchmarkConsole(data: BenchmarkData): string {
  const hasContext = data.steps.some((s) => s.contextTokensOut != null);
  const COL = { phase: 13, input: 10, output: 10, cost: 11, turns: 7, time: 9, ctxIn: 9, ctxOut: 9 };

  const cols = [COL.phase, COL.input, COL.output, COL.cost, COL.turns, COL.time];
  const headers = [" Phase", " Input", " Output", " Cost", " Turns", " Time"];
  if (hasContext) {
    cols.push(COL.ctxIn, COL.ctxOut);
    headers.push(" Ctx In", " Ctx Out");
  }

  const line = (left: string, mid: string, right: string, fill: string) =>
    left + cols.map((w) => fill.repeat(w)).join(mid) + right;

  const header =
    line("\u250c", "\u252c", "\u2510", "\u2500") +
    "\n" +
    "\u2502" + headers.map((h, i) => padRight(h, cols[i])).join("\u2502") + "\u2502" +
    "\n" +
    line("\u251c", "\u253c", "\u2524", "\u2500");

  const rows = data.steps.map((step) => {
    const totalInput = step.usage.input_tokens + step.usage.cache_read_input_tokens + step.usage.cache_creation_input_tokens;
    const cells = [
      padRight(` ${step.name}`, COL.phase),
      padLeft(formatNumber(totalInput), COL.input - 1) + " ",
      padLeft(formatNumber(step.usage.output_tokens), COL.output - 1) + " ",
      padLeft(formatCost(step.totalCostUsd), COL.cost - 1) + " ",
      padLeft(String(step.numTurns), COL.turns - 1) + " ",
      padLeft(formatDuration(step.durationMs), COL.time - 1) + " ",
    ];
    if (hasContext) {
      cells.push(
        padLeft(formatContext(step.contextTokensIn), COL.ctxIn - 1) + " ",
        padLeft(formatContext(step.contextTokensOut), COL.ctxOut - 1) + " ",
      );
    }
    return "\u2502" + cells.join("\u2502") + "\u2502";
  });

  const separator = line("\u251c", "\u253c", "\u2524", "\u2500");

  const totalCells = [
    padRight(" TOTAL", COL.phase),
    padLeft(formatNumber(data.totals.inputTokens), COL.input - 1) + " ",
    padLeft(formatNumber(data.totals.outputTokens), COL.output - 1) + " ",
    padLeft(formatCost(data.totals.totalCostUsd), COL.cost - 1) + " ",
    padLeft(String(data.totals.numTurns), COL.turns - 1) + " ",
    padLeft(formatDuration(data.totals.durationMs), COL.time - 1) + " ",
  ];
  if (hasContext) {
    const lastStep = data.steps[data.steps.length - 1];
    totalCells.push(
      padLeft("", COL.ctxIn - 1) + " ",
      padLeft(formatContext(lastStep?.contextTokensOut), COL.ctxOut - 1) + " ",
    );
  }
  const totalRow = "\u2502" + totalCells.join("\u2502") + "\u2502";

  const footer = line("\u2514", "\u2534", "\u2518", "\u2500");

  const parts = [header, ...rows, separator, totalRow, footer];

  // Add compaction notes below the table if any occurred
  const compactedSteps = data.steps.filter((s) => s.compactions && s.compactions > 0);
  if (compactedSteps.length > 0) {
    parts.push("");
    const totalCompactions = compactedSteps.reduce((sum, s) => sum + (s.compactions ?? 0), 0);
    parts.push(`\u26a0 ${totalCompactions} compaction(s) detected:`);
    for (const step of compactedSteps) {
      const preTokensStr = step.compactionPreTokens
        ? step.compactionPreTokens.map((t) => formatContext(t)).join(", ")
        : "";
      parts.push(`  ${step.name}: ${step.compactions}x (pre-tokens: ${preTokensStr})`);
    }
  }

  return parts.join("\n");
}

/**
 * Format benchmark data as a markdown table for PR bodies.
 */
export function formatBenchmarkMarkdown(data: BenchmarkData): string {
  const hasContext = data.steps.some((s) => s.contextTokensOut != null);
  const ctxHeaders = hasContext ? " Ctx In | Ctx Out |" : "";
  const ctxAlign = hasContext ? "------:|-------:|" : "";

  const lines = [
    "## Benchmark",
    "",
    `| Phase | Input | Output | Cost | Turns | Time |${ctxHeaders}`,
    `|-------|------:|-------:|-----:|------:|-----:|${ctxAlign}`,
  ];

  for (const step of data.steps) {
    const totalInput = step.usage.input_tokens + step.usage.cache_read_input_tokens + step.usage.cache_creation_input_tokens;
    const ctxCols = hasContext
      ? ` ${formatContext(step.contextTokensIn)} | ${formatContext(step.contextTokensOut)} |`
      : "";
    lines.push(
      `| ${step.name} | ${formatNumber(totalInput)} | ${formatNumber(step.usage.output_tokens)} | ${formatCost(step.totalCostUsd)} | ${step.numTurns} | ${formatDuration(step.durationMs)} |${ctxCols}`,
    );
  }

  const lastStep = data.steps[data.steps.length - 1];
  const ctxTotalCols = hasContext
    ? ` | **${formatContext(lastStep?.contextTokensOut)}** |`
    : "";
  lines.push(
    `| **TOTAL** | **${formatNumber(data.totals.inputTokens)}** | **${formatNumber(data.totals.outputTokens)}** | **${formatCost(data.totals.totalCostUsd)}** | **${data.totals.numTurns}** | **${formatDuration(data.totals.durationMs)}** |${ctxTotalCols}`,
  );

  // Add compaction notes if any occurred
  const compactedSteps = data.steps.filter((s) => s.compactions && s.compactions > 0);
  if (compactedSteps.length > 0) {
    const totalCompactions = compactedSteps.reduce((sum, s) => sum + (s.compactions ?? 0), 0);
    lines.push("");
    lines.push(`> **${totalCompactions} compaction(s)** detected during run:`);
    for (const step of compactedSteps) {
      const preTokensStr = step.compactionPreTokens
        ? step.compactionPreTokens.map((t) => formatContext(t)).join(", ")
        : "";
      lines.push(`> - **${step.name}**: ${step.compactions}x (pre-tokens: ${preTokensStr})`);
    }
  }

  return lines.join("\n");
}
