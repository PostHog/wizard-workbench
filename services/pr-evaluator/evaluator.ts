import { query } from "@anthropic-ai/claude-agent-sdk";
import { postPRComment, type PRData } from "../github/index.js";
import { buildSystemPrompt, buildUserPrompt } from "./prompt-builder.js";

export interface EvaluateOptions {
  prData: PRData;
  testRun?: boolean;
  testRunDir?: string;
}

export interface EvaluateResult {
  reviewComment: string;
  commentUrl?: string;
}

export async function evaluatePR(options: EvaluateOptions): Promise<EvaluateResult> {
  const { prData, testRun = false, testRunDir } = options;

  const systemPrompt = buildSystemPrompt();
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
      model: "claude-opus-4-5-20251101",
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

  if (!resultText) {
    throw new Error("No result received from agent");
  }

  // The agent outputs markdown directly - use it as the review comment
  const reviewComment = resultText.trim();

  // Save output and usage if test run
  if (testRunDir) {
    const fs = await import("fs/promises");
    const { join } = await import("path");
    await fs.writeFile(join(testRunDir, "output.md"), reviewComment, "utf-8");

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

  return { reviewComment, commentUrl };
}
