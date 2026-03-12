import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { homedir } from "os";
import type { PRData } from "../github/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load prompt templates from .md files in explicit order
const TASK_PROMPT = readFileSync(join(__dirname, "prompts/task.md"), "utf-8").trim();
const EVALUATION_CRITERIA = readFileSync(join(__dirname, "prompts/evaluation.md"), "utf-8").trim();
const OUTPUT_FORMAT = readFileSync(join(__dirname, "prompts/output-format.md"), "utf-8").trim();

// Commandments loading: fetch from GitHub > COMMANDMENTS_PATH env var > vendored fallback
const VENDORED_COMMANDMENTS = join(__dirname, "prompts/commandments.yaml");
const GITHUB_COMMANDMENTS_URL =
  "https://raw.githubusercontent.com/PostHog/context-mill/main/transformation-config/commandments.yaml";

let _commandmentsCache: string | null = null;

async function fetchCommandments(): Promise<string> {
  if (_commandmentsCache) return _commandmentsCache;

  // 1. Try fetching latest from GitHub
  try {
    const response = await fetch(GITHUB_COMMANDMENTS_URL, { signal: AbortSignal.timeout(5000) });
    if (response.ok) {
      _commandmentsCache = await response.text();
      console.log("Loaded commandments from GitHub (latest)");
      return _commandmentsCache;
    }
  } catch {
    console.warn("Warning: Could not fetch commandments from GitHub, trying local fallbacks");
  }

  // 2. Try COMMANDMENTS_PATH env var (local context-mill checkout)
  if (process.env.COMMANDMENTS_PATH) {
    const rawPath = process.env.COMMANDMENTS_PATH;
    const resolvedPath = rawPath.startsWith("~") ? rawPath.replace("~", homedir()) : rawPath;
    try {
      _commandmentsCache = readFileSync(resolvedPath, "utf-8");
      console.log(`Loaded commandments from COMMANDMENTS_PATH: ${resolvedPath}`);
      return _commandmentsCache;
    } catch {
      console.warn(`Warning: COMMANDMENTS_PATH "${resolvedPath}" not found`);
    }
  }

  // 3. Fall back to vendored copy
  _commandmentsCache = readFileSync(VENDORED_COMMANDMENTS, "utf-8");
  console.log("Loaded commandments from vendored fallback");
  return _commandmentsCache;
}

// Parse commandments.yaml into a map of tag -> rules[]
// Supports only a flat two-level YAML structure: `commandments:\n  tag:\n    - rule`
// Does not handle nested lists, multi-line strings, anchors, or aliases.
export function parseCommandments(raw: string): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  let currentTag = "";
  for (const line of raw.split("\n")) {
    const tagMatch = line.match(/^  (\w[\w-]*):\s*$/);
    if (tagMatch) {
      currentTag = tagMatch[1];
      result[currentTag] = [];
      continue;
    }
    if (currentTag && /^\s+-\s/.test(line)) {
      result[currentTag].push(line.replace(/^\s+-\s+/, "").replace(/^["']|["']$/g, ""));
    }
  }
  return result;
}

let _commandmentsMap: Record<string, string[]> | null = null;

async function getCommandments(): Promise<Record<string, string[]>> {
  if (_commandmentsMap) return _commandmentsMap;
  const raw = await fetchCommandments();
  _commandmentsMap = parseCommandments(raw);
  return _commandmentsMap;
}

// Detect frameworks from PR file paths and dependency file patches (NOT full diff — avoids false positives)
export function detectFramework(prData: PRData): string[] {
  const tags = new Set<string>();
  const filePaths = prData.files.map((f) => f.filename).join("\n");

  // Extract content from dependency files only (not the full diff) for package name detection
  const depPatterns = /package\.json|requirements\.txt|pyproject\.toml|Gemfile|composer\.json|build\.gradle|Podfile/;
  const depContent = prData.files
    .filter((f) => depPatterns.test(f.filename))
    .map((f) => f.patch || "")
    .join("\n");

  // Python frameworks
  if (/requirements\.txt|pyproject\.toml|\.py\b/.test(filePaths)) tags.add("python");
  if (/\bdjango\b/i.test(depContent) || /\/django\//.test(filePaths)) tags.add("django");
  if (/\bflask\b/i.test(depContent) || /\/flask\//.test(filePaths)) tags.add("flask");
  if (/\bfastapi\b/i.test(depContent) || /\/fastapi\//.test(filePaths)) tags.add("fastapi");

  // JavaScript/TypeScript
  if (/package\.json|\.tsx?$|\.jsx?$/m.test(filePaths)) tags.add("javascript_web");
  if (/\b(posthog-node|express|fastify|koa|hono)\b/.test(depContent)) tags.add("javascript_node");
  if (/next\.config/i.test(filePaths) || /"next"/.test(depContent)) { tags.add("nextjs"); tags.add("react"); }
  if (/\.tsx/.test(filePaths) || /"react"/.test(depContent)) tags.add("react");
  if (/svelte\.config|\.svelte\b/.test(filePaths)) tags.add("sveltekit");
  if (/angular\.json/.test(filePaths) || /@angular/.test(depContent)) tags.add("angular");
  if (/astro\.config|\.astro\b/.test(filePaths)) tags.add("astro");
  if (/@tanstack\/react-router/.test(depContent)) tags.add("tanstack-router");
  if (/@tanstack\/start/.test(depContent)) tags.add("tanstack-start");

  // PHP
  if (/composer\.json|\.php\b/.test(filePaths)) tags.add("php");
  if (/\blaravel\b/i.test(depContent) || /\blaravel\b/i.test(filePaths)) tags.add("laravel");

  // Ruby
  if (/Gemfile|\.rb\b/.test(filePaths)) tags.add("ruby");
  if (/\brails\b/i.test(depContent) || /\brails\b/i.test(filePaths)) tags.add("ruby-on-rails");

  // Mobile
  if (/\.swift\b|\.xcodeproj/.test(filePaths)) tags.add("swift");
  if (/build\.gradle|\.kt\b/.test(filePaths)) tags.add("android");
  if (/\breact-native\b/.test(depContent)) tags.add("react-native");
  if (/\bexpo\b/.test(depContent)) tags.add("expo");

  return [...tags];
}

// Determine architecture type from detected tags
export function detectArchType(tags: string[]): "server-only" | "client-only" | "full-stack" {
  const serverTags = ["django", "flask", "fastapi", "javascript_node", "ruby-on-rails", "laravel", "php", "python", "ruby"];
  const clientTags = ["javascript_web", "react", "angular", "astro", "swift", "android", "react-native", "expo"];
  const fullStackTags = ["nextjs", "tanstack-start", "sveltekit"];

  if (tags.some((t) => fullStackTags.includes(t))) return "full-stack";
  const hasServer = tags.some((t) => serverTags.includes(t));
  const hasClient = tags.some((t) => clientTags.includes(t));
  if (hasServer && !hasClient) return "server-only";
  if (hasClient && !hasServer) return "client-only";
  return "full-stack";
}

export async function buildSystemPrompt(prData?: PRData): Promise<string> {
  const base = [TASK_PROMPT, EVALUATION_CRITERIA, OUTPUT_FORMAT];

  if (prData) {
    const tags = detectFramework(prData);
    const archType = detectArchType(tags);
    console.log(`Detected frameworks: [${tags.join(", ")}], arch_type: ${archType}`);

    // Collect matching commandments
    const commandments = await getCommandments();
    const rules: string[] = [];
    for (const tag of tags) {
      if (commandments[tag]) {
        rules.push(...commandments[tag].map((r: string) => `- [${tag}] ${r}`));
      }
    }

    if (rules.length > 0) {
      const section = `## Framework-specific rules

Detected frameworks: ${tags.join(", ")}
Architecture type: ${archType}

These are authoritative SDK rules for the detected frameworks. Use them to validate the PR — do NOT flag code that follows these rules as incorrect.

${rules.join("\n")}`;
      base.push(section);
    }
  }

  return base.join("\n\n");
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
