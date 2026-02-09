import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import type { PRData } from "../github/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load prompt templates from .md files in explicit order
const TASK_PROMPT = readFileSync(join(__dirname, "prompts/task.md"), "utf-8").trim();
const EVALUATION_CRITERIA = readFileSync(join(__dirname, "prompts/evaluation.md"), "utf-8").trim();
const OUTPUT_FORMAT = readFileSync(join(__dirname, "prompts/output-format.md"), "utf-8").trim();

export function buildSystemPrompt(): string {
  return [TASK_PROMPT, EVALUATION_CRITERIA, OUTPUT_FORMAT].join("\n\n");
}

export function buildUserPrompt(prData: PRData): string {
  return `## PR to evaluate and review

Evaluate this pull request.

### PR Information
- **Title:** ${prData.title}
- **Author:** ${prData.author}
- **Base Branch:** ${prData.baseBranch}
- **Head Branch:** ${prData.headBranch}

### PR Description
${prData.description || "(No description provided)"}

### Changed Files (committed in this PR)
${prData.files.map((f) => `- ${f.filename} (${f.status}: +${f.additions}/-${f.deletions})`).join("\n")}

**Note:** Files you read that are not listed above exist locally but are not committed.

### Diff
\`\`\`diff
${prData.diff}
\`\`\``;
}
