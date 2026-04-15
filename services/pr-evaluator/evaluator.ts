import { query } from "@anthropic-ai/claude-agent-sdk";
import { PostHog } from "posthog-node";
import { z } from "zod";
import { postPRComment, type PRData } from "../github/index.js";
import { buildSystemPrompt, buildUserPrompt } from "./prompt-builder.js";

export interface EvaluateOptions {
  prData: PRData;
  testRun?: boolean;
  testRunDir?: string;
  /**
   * Wizard command id the PR was produced by (e.g., "revenue"). Selects
   * the rubric in `buildSystemPrompt`. Omit for the default integration.
   */
  command?: string;
}

export interface EvaluateScores {
  file_analysis: number;
  app_sanity: number;
  posthog_implementation: number;
  event_quality: number;
  confidence: number;
  framework: string;
  arch_type: string;
}

export interface EvaluateResult {
  reviewComment: string;
  commentUrl?: string;
  scores?: EvaluateScores;
  rubric?: RubricData;
}

// ── Rubric types & scoring ───────────────────────────────────────────────────

export type RubricValue = "yes" | "no" | "n/a";

export interface RubricDimension {
  [itemId: string]: RubricValue;
}

export interface RubricData {
  file_analysis: RubricDimension;
  app_sanity: RubricDimension;
  posthog_implementation: RubricDimension;
  event_quality: RubricDimension;
}

const RubricValueSchema = z.enum(["yes", "no", "n/a"]);

export const RubricSchema = z.object({
  file_analysis: z.record(RubricValueSchema),
  app_sanity: z.record(RubricValueSchema),
  posthog_implementation: z.record(RubricValueSchema),
  event_quality: z.record(RubricValueSchema),
});

/** Compute a 1-5 score from a rubric dimension's pass rate */
export function computeScoreFromRubric(dimension: RubricDimension): number {
  const applicable = Object.values(dimension).filter((v) => v !== "n/a");
  if (applicable.length === 0) return 3; // default if everything is N/A
  const passed = applicable.filter((v) => v === "yes").length;
  const rate = passed / applicable.length;
  return Math.max(1, Math.round(rate * 5));
}

/** Compute all scores deterministically from rubric data */
export function computeScoresFromRubric(
  rubric: RubricData,
  framework: string,
  archType: string
): EvaluateScores {
  const file_analysis = computeScoreFromRubric(rubric.file_analysis);
  const app_sanity = computeScoreFromRubric(rubric.app_sanity);
  const posthog_implementation = computeScoreFromRubric(rubric.posthog_implementation);
  const event_quality = computeScoreFromRubric(rubric.event_quality);
  const avg = (file_analysis + app_sanity + posthog_implementation + event_quality) / 4;
  const confidence = Math.min(app_sanity, Math.round(avg));

  return {
    file_analysis,
    app_sanity,
    posthog_implementation,
    event_quality,
    confidence,
    framework,
    arch_type: archType,
  };
}

// ── Score extraction & validation helpers ────────────────────────────────────

const ScoresSchema = z.object({
  file_analysis: z.number().min(1).max(5),
  app_sanity: z.number().min(1).max(5),
  posthog_implementation: z.number().min(1).max(5),
  event_quality: z.number().min(1).max(5),
  confidence: z.number().min(1).max(5),
  framework: z.string(),
  arch_type: z.enum(["server-only", "client-only", "full-stack"]),
});

/** Attempt to fix common JSON issues before parsing */
export function repairAndParseJSON(raw: string): unknown {
  let cleaned = raw;
  // Remove trailing commas before } or ]
  cleaned = cleaned.replace(/,\s*([\]}])/g, "$1");
  // Remove JS-style // comments (only outside quoted strings)
  cleaned = cleaned.replace(/"(?:[^"\\]|\\.)*"|\/\/.*$/gm, (match) =>
    match.startsWith('"') ? match : ""
  );
  return JSON.parse(cleaned);
}

/** Validate scores and auto-correct confidence per formula */
export function validateAndCorrectScores(raw: EvaluateScores): EvaluateScores {
  const parsed = ScoresSchema.safeParse(raw);
  if (!parsed.success) {
    console.warn(
      "Score validation issues:",
      parsed.error.issues.map((i) => `${i.path}: ${i.message}`).join(", ")
    );
  }

  const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
  const scores = { ...raw };
  scores.file_analysis = clamp(scores.file_analysis);
  scores.app_sanity = clamp(scores.app_sanity);
  scores.posthog_implementation = clamp(scores.posthog_implementation);
  scores.event_quality = clamp(scores.event_quality);

  // Auto-correct confidence per formula: min(app_sanity, round(avg(...)))
  const avg =
    (scores.file_analysis + scores.app_sanity + scores.posthog_implementation + scores.event_quality) / 4;
  const expectedConfidence = Math.min(scores.app_sanity, Math.round(avg));
  if (scores.confidence !== expectedConfidence) {
    console.warn(`Confidence auto-corrected: ${scores.confidence} -> ${expectedConfidence}`);
    scores.confidence = expectedConfidence;
  }

  // Normalize arch_type
  const validArchTypes = ["server-only", "client-only", "full-stack"];
  if (!validArchTypes.includes(scores.arch_type)) {
    console.warn(`Invalid arch_type "${scores.arch_type}", defaulting to "full-stack"`);
    scores.arch_type = "full-stack";
  }

  return scores;
}

// ── Score injection ──────────────────────────────────────────────────────────

/** Inject computed scores into the review comment, replacing placeholder 0s and updating the confidence header */
export function injectScoresIntoComment(comment: string, scores: EvaluateScores): string {
  let result = comment;

  // Replace the SCORES block with real computed values
  result = result.replace(
    /<!-- SCORES\s*\{[\s\S]*?\}\s*SCORES -->/,
    `<!-- SCORES\n${JSON.stringify(scores, null, 2)}\nSCORES -->`
  );

  // Update the confidence header to match computed score
  const emojis: Record<number, string> = { 5: "\u{1F9D9}", 4: "\u{1F44D}", 3: "\u{1F914}", 2: "\u274C", 1: "\u274C" };
  const emoji = emojis[scores.confidence] ?? "";
  result = result.replace(
    /### Confidence score: \d\/5\s*(?:\u{1F9D9}|\u{1F44D}|\u{1F914}|\u274C)?/u,
    `### Confidence score: ${scores.confidence}/5 ${emoji}`
  );

  return result;
}

// ── Gateway configuration ────────────────────────────────────────────────────

/**
 * Get LLM gateway URL based on PostHog region
 */
function getLlmGatewayUrl(region: string): string {
  if (region === "eu") {
    return "https://gateway.eu.posthog.com/wizard";
  }
  return "https://gateway.us.posthog.com/wizard";
}

/**
 * Configure the Claude Agent SDK to use PostHog's LLM gateway
 */
export function configureGateway(apiKey: string, region: string): void {
  const gatewayUrl = getLlmGatewayUrl(region);
  process.env.ANTHROPIC_BASE_URL = gatewayUrl;
  process.env.ANTHROPIC_AUTH_TOKEN = apiKey;
  // Disable experimental betas that the LLM gateway doesn't support
  process.env.CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS = "true";
  console.log(`Configured LLM gateway: ${gatewayUrl}`);
}

// ── PostHog analytics ─────────────────────────────────────────────────────

async function captureEvalEvent(
  scores: EvaluateScores,
  prData: PRData,
  usageData: { totalCostUsd?: number; usage?: Record<string, number> }
): Promise<void> {
  const apiKey = process.env.POSTHOG_PROJECT_TOKEN;
  if (!apiKey) {
    return;
  }

  const client = new PostHog(apiKey, { host: "https://us.i.posthog.com" });

  try {
    client.capture({
      distinctId: `wizard-eval-${prData.headBranch}`,
      event: "wizard_eval",
      properties: {
        file_analysis: scores.file_analysis,
        app_sanity: scores.app_sanity,
        posthog_implementation: scores.posthog_implementation,
        event_quality: scores.event_quality,
        confidence: scores.confidence,
        framework: scores.framework,
        arch_type: scores.arch_type,
        pr_number: prData.number,
        pr_author: prData.author,
        files_changed: prData.files.length,
        cost_usd: usageData.totalCostUsd,
        input_tokens: usageData.usage?.input_tokens,
        output_tokens: usageData.usage?.output_tokens,
      },
    });
    await client.shutdown();
    console.log("PostHog event captured: wizard_eval");
  } catch (e) {
    console.warn(`Warning: Failed to capture PostHog event: ${e instanceof Error ? e.message : e}`);
  }
}

export async function evaluatePR(options: EvaluateOptions): Promise<EvaluateResult> {
  const { prData, testRun = false, testRunDir, command } = options;

  const systemPrompt = await buildSystemPrompt(prData, { command });
  const userPrompt = buildUserPrompt(prData);

  // Save prompt if test run
  if (testRunDir) {
    const fs = await import("fs/promises");
    const { join } = await import("path");
    const fullPrompt = `===== SYSTEM PROMPT =====\n${systemPrompt}\n\n===== USER PROMPT =====\n${userPrompt}`;
    await fs.writeFile(join(testRunDir, "prompt.md"), fullPrompt, "utf-8");
  }

  // Debug mode: set EVALUATOR_DEBUG=1 to enable extra stderr logging
  const debug = process.env.EVALUATOR_DEBUG === "1";

  console.log("\nRunning evaluation agent...");

  let resultText = "";
  let usageData: {
    usage?: Record<string, number>;
    modelUsage?: Record<string, unknown>;
    totalCostUsd?: number;
  } = {};

  // Collect stderr output for error reporting
  const stderrOutput: string[] = [];

  try {
  for await (const message of query({
    prompt: userPrompt,
    options: {
      model: process.env.EVALUATOR_MODEL || "claude-opus-4-6",
      // Cap turns to prevent the agent from exhausting its budget on file reads
      // without producing the evaluation report (~8.5% failure rate without this)
      maxTurns: 25,
      allowedTools: ["Read", "Grep", "Glob", "Bash"],
      cwd: process.cwd(),
      // Use acceptEdits instead of bypassPermissions - the latter doesn't work as root in Docker
      permissionMode: "acceptEdits",
      systemPrompt,
      // Capture stderr from the Claude Code subprocess for error diagnostics
      stderr: (data: string) => {
        stderrOutput.push(data);
        if (debug) {
          console.error("[SDK stderr]:", data);
        }
      },
    },
  })) {
    if (message.type === "assistant") {
      const textContent = message.message.content.find(
        (c: { type: string }): c is { type: "text"; text: string } => c.type === "text"
      );
      if (textContent) {
        // Log full text if it looks like an error, otherwise preview
        if (textContent.text.includes("API Error")) {
          console.log("AGENT:", textContent.text);
        } else {
          const preview = textContent.text.substring(0, 250);
          console.log("AGENT:", preview + (textContent.text.length > 250 ? "..." : ""));
        }
      }
    }

    if (message.type === "result") {
      if (message.subtype === "success") {
        resultText = message.result;
        usageData = {
          usage: message.usage,
          modelUsage: message.modelUsage,
          totalCostUsd: message.total_cost_usd,
        };
        console.log("\nAgent completed evaluation");
        console.log(`\n--- Usage ---`);
        console.log(`Total cost: $${usageData.totalCostUsd?.toFixed(4) ?? "N/A"}`);
        console.log(`Input tokens: ${usageData.usage?.input_tokens ?? "N/A"}`);
        console.log(`Output tokens: ${usageData.usage?.output_tokens ?? "N/A"}`);
      } else {
        throw new Error(`Evaluation failed: ${message.subtype}`);
      }
    }
  }
  } catch (error) {
    console.error("Agent query error:", error);
    if (stderrOutput.length > 0) {
      console.error("\n--- Collected stderr output ---");
      console.error(stderrOutput.join(""));
      console.error("--- End stderr ---\n");
    }
    throw error;
  }

  if (!resultText || !resultText.includes("## PR Evaluation Report")) {
    console.warn("Agent did not produce a complete evaluation report. Retrying with reduced tools...");

    // Retry with no tools — force the agent to produce the report from the diff alone
    resultText = "";
    for await (const message of query({
      prompt: userPrompt + "\n\nIMPORTANT: Produce the full evaluation report NOW based on the diff above. Do NOT use any tools.",
      options: {
        model: process.env.EVALUATOR_MODEL || "claude-opus-4-6",
        maxTurns: 1,
        allowedTools: [],
        cwd: process.cwd(),
        permissionMode: "acceptEdits",
        systemPrompt,
      },
    })) {
      if (message.type === "result" && message.subtype === "success") {
        resultText = message.result;
        usageData = {
          usage: message.usage,
          modelUsage: message.modelUsage,
          totalCostUsd: (usageData.totalCostUsd ?? 0) + (message.total_cost_usd ?? 0),
        };
        console.log("Retry completed evaluation");
      }
    }

    if (!resultText) {
      throw new Error("No result received from agent (including retry)");
    }
  }

  // The agent outputs markdown directly - use it as the review comment
  let reviewComment = resultText.trim();

  // Check evaluation completeness — warn if less than half of changed files are mentioned
  const changedFiles = options.prData.files.map((f) => f.filename);
  const mentionedFiles = changedFiles.filter((f) => reviewComment.includes(f));
  if (changedFiles.length > 0 && mentionedFiles.length < changedFiles.length / 2) {
    console.warn(
      `Warning: Evaluation only mentions ${mentionedFiles.length}/${changedFiles.length} changed files. May be incomplete.`
    );
  }

  // Primary: extract rubric and compute scores deterministically
  let scores: EvaluateScores | undefined;
  let rubric: RubricData | undefined;

  const rubricMatch = reviewComment.match(/<!-- RUBRIC\s*(\{[\s\S]*?\})\s*RUBRIC -->/);
  if (rubricMatch) {
    try {
      const rawRubric = repairAndParseJSON(rubricMatch[1]);
      const parsed = RubricSchema.safeParse(rawRubric);
      if (parsed.success) {
        rubric = parsed.data;
      } else {
        console.warn("Rubric validation issues:", parsed.error.issues.map((i: { path: unknown; message: string }) => `${i.path}: ${i.message}`).join(", "));
      }
    } catch (e) {
      console.warn(`Warning: Failed to parse RUBRIC block: ${e instanceof Error ? e.message : e}`);
    }
  }

  // Extract framework/arch_type from SCORES block
  let framework = "unknown";
  let archType = "full-stack";
  const scoresMatch = reviewComment.match(/<!-- SCORES\s*(\{[\s\S]*?\})\s*SCORES -->/);
  if (scoresMatch) {
    try {
      const rawScores = repairAndParseJSON(scoresMatch[1]) as Record<string, unknown>;
      framework = String(rawScores.framework || "unknown");
      archType = String(rawScores.arch_type || "full-stack");
    } catch (e) {
      console.warn(`Warning: Failed to parse SCORES block for framework/arch_type: ${e instanceof Error ? e.message : e}`);
    }
  }

  // Compute scores from rubric (preferred) or fall back to SCORES block
  if (rubric) {
    scores = computeScoresFromRubric(rubric, framework, archType);
    console.log(`\nScores (from rubric): ${JSON.stringify(scores)}`);
  } else if (scoresMatch) {
    // Legacy fallback: use Claude's scores directly
    try {
      const rawScores = repairAndParseJSON(scoresMatch[1]) as EvaluateScores;
      scores = validateAndCorrectScores(rawScores);
      console.log(`\nScores (from legacy SCORES block): ${JSON.stringify(scores)}`);
    } catch (e) {
      console.warn(`Warning: Failed to parse SCORES JSON block: ${e instanceof Error ? e.message : e}`);
      console.warn(`Raw SCORES content: ${scoresMatch[1].substring(0, 200)}`);
    }
  }

  // Inject computed scores back into the review comment
  if (scores) {
    reviewComment = injectScoresIntoComment(reviewComment, scores);
  }

  // Print confidence score to stdout so CI can extract it from wizard-output.log
  if (scores) {
    console.log(`Confidence score: ${scores.confidence}/5`);
  } else {
    // Fallback: extract confidence from header text
    const confidenceMatch = reviewComment.match(/Confidence score: (\d\/\d)/);
    if (confidenceMatch) {
      console.log(`Confidence score: ${confidenceMatch[1]}`);
    }
  }

  // Save output and usage if test run
  if (testRunDir) {
    const fs = await import("fs/promises");
    const { join } = await import("path");
    await fs.writeFile(join(testRunDir, "output.md"), reviewComment, "utf-8");

    // Save structured scores and rubric
    if (scores) {
      await fs.writeFile(join(testRunDir, "scores.json"), JSON.stringify(scores, null, 2), "utf-8");
    }
    if (rubric) {
      await fs.writeFile(join(testRunDir, "rubric.json"), JSON.stringify(rubric, null, 2), "utf-8");
    }

    // Save usage data
    const usageContent = `# Usage Statistics

## Total Cost
$${usageData.totalCostUsd?.toFixed(4) ?? "N/A"}

## Token Usage
| Metric | Count |
|--------|-------|
| Input Tokens | ${usageData.usage?.input_tokens ?? "N/A"} |
| Output Tokens | ${usageData.usage?.output_tokens ?? "N/A"} |
| Cache Creation Input Tokens | ${usageData.usage?.cache_creation_input_tokens ?? "N/A"} |
| Cache Read Input Tokens | ${usageData.usage?.cache_read_input_tokens ?? "N/A"} |

## Model Usage
\`\`\`json
${JSON.stringify(usageData.modelUsage, null, 2)}
\`\`\`
`;
    await fs.writeFile(join(testRunDir, "usage.md"), usageContent, "utf-8");
  }

  let commentUrl: string | undefined;
  if (!testRun && prData.number > 0) {
    console.log("\nPosting review comment to GitHub...");
    try {
      commentUrl = postPRComment(prData.number, reviewComment, process.cwd());
      console.log(`Comment posted: ${commentUrl}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`Warning: Failed to post comment to GitHub: ${message}`);
      console.log("\n--- Review Comment (not posted) ---");
      console.log(reviewComment);
      console.log("--- END ---\n");
    }
  } else {
    console.log("\n--- TEST RUN: Review Comment Preview ---");
    console.log(reviewComment);
    console.log("--- END PREVIEW ---\n");
  }

  // Send wizard_eval event to PostHog for tracking over time
  if (scores) {
    await captureEvalEvent(scores, prData, usageData);
  }

  return { reviewComment, commentUrl, scores, rubric };
}
