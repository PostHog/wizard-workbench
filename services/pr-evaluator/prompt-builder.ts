import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { homedir } from "os";
import sanitizeHtml from "sanitize-html";
import type { PRData } from "../github/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load prompt templates from .md files in explicit order
const TASK_PROMPT = readFileSync(join(__dirname, "prompts/task.md"), "utf-8").trim();
const EVALUATION_CRITERIA = readFileSync(join(__dirname, "prompts/evaluation.md"), "utf-8").trim();
const EVALUATION_CRITERIA_REVENUE = readFileSync(
  join(__dirname, "prompts/evaluation-revenue.md"),
  "utf-8",
).trim();
const EVALUATION_CRITERIA_AI_OBSERVABILITY = readFileSync(
  join(__dirname, "prompts/evaluation-ai-observability.md"),
  "utf-8",
).trim();
const OUTPUT_FORMAT = readFileSync(join(__dirname, "prompts/output-format.md"), "utf-8").trim();
const OUTPUT_FORMAT_REVENUE = readFileSync(
  join(__dirname, "prompts/output-format-revenue.md"),
  "utf-8",
).trim();

/** Per-command prompt overrides. Extend when a new command gets its own rubric. */
const PROMPTS_BY_COMMAND: Record<string, { rubric: string; outputFormat: string }> = {
  revenue: { rubric: EVALUATION_CRITERIA_REVENUE, outputFormat: OUTPUT_FORMAT_REVENUE },
  // Reuses the default output format — the AIO rubric keeps the same four
  // dimensions, only the items differ.
  "ai-observability": {
    rubric: EVALUATION_CRITERIA_AI_OBSERVABILITY,
    outputFormat: OUTPUT_FORMAT,
  },
};

// Commandments loading: fetch from GitHub > COMMANDMENTS_PATH env var > vendored fallback
const VENDORED_COMMANDMENTS = join(__dirname, "prompts/commandments.yaml");
// Try the post-rename `context/` path first, fall back to `transformation-config/`
// so this works whether or not the context-mill rename has landed on main.
const GITHUB_COMMANDMENTS_URLS = [
  "https://raw.githubusercontent.com/PostHog/context-mill/main/context/commandments.yaml",
  "https://raw.githubusercontent.com/PostHog/context-mill/main/transformation-config/commandments.yaml",
];

// Docs loading: fetch integration config from context-mill to get tag -> doc URL mapping
const GITHUB_INTEGRATION_CONFIG_URLS = [
  "https://raw.githubusercontent.com/PostHog/context-mill/main/context/skills/integration/config.yaml",
  "https://raw.githubusercontent.com/PostHog/context-mill/main/transformation-config/skills/integration/config.yaml",
];

/**
 * Fetch the first URL that returns OK. Treats network errors and non-2xx as
 * "try next URL". Returns null only when every URL failed.
 */
async function fetchFirstOk(urls: string[]): Promise<{ url: string; body: string } | null> {
  for (const url of urls) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (response.ok) {
        return { url, body: await response.text() };
      }
    } catch {
      // fall through to next URL
    }
  }
  return null;
}

let _commandmentsCache: string | null = null;

async function fetchCommandments(): Promise<string> {
  if (_commandmentsCache) return _commandmentsCache;

  // 1. Try fetching latest from GitHub (tries both context/ and transformation-config/)
  const fetched = await fetchFirstOk(GITHUB_COMMANDMENTS_URLS);
  if (fetched) {
    _commandmentsCache = fetched.body;
    console.log(`Loaded commandments from GitHub (latest): ${fetched.url}`);
    return _commandmentsCache;
  }
  console.warn("Warning: Could not fetch commandments from GitHub, trying local fallbacks");

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

// ── Docs loading ──────────────────────────────────────────────────────────

let _docsConfigCache: string | null = null;

async function fetchIntegrationConfig(): Promise<string> {
  if (_docsConfigCache) return _docsConfigCache;

  const fetched = await fetchFirstOk(GITHUB_INTEGRATION_CONFIG_URLS);
  if (fetched) {
    _docsConfigCache = fetched.body;
    console.log(`Loaded integration config from GitHub (latest): ${fetched.url}`);
    return _docsConfigCache;
  }
  console.warn("Warning: Could not fetch integration config from GitHub");

  return "";
}

/**
 * Parse integration/config.yaml to extract tag -> doc URLs mapping.
 * Each variant has tags and docs_urls; we map each tag to its variant's URLs.
 */
export function parseDocsConfig(raw: string): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  if (!raw) return result;

  // Collect shared_docs URLs
  const sharedDocs: string[] = [];
  const sharedMatch = raw.match(/shared_docs:\n((?:\s+-\s+.+\n)*)/);
  if (sharedMatch) {
    for (const line of sharedMatch[1].split("\n")) {
      const urlMatch = line.match(/^\s+-\s+(.+)/);
      if (urlMatch) sharedDocs.push(urlMatch[1].trim());
    }
  }

  // Split into variant blocks — each starts with "  - id:"
  const variantBlocks = raw.split(/\n  - id:\s*/).slice(1);

  for (const block of variantBlocks) {
    // Extract tags
    const tagsMatch = block.match(/tags:\s*\[([^\]]*)\]/);
    if (!tagsMatch) continue;
    const tags = tagsMatch[1].split(",").map((t) => t.trim().replace(/['"]/g, "")).filter(Boolean);

    // Extract docs_urls
    const docsSection = block.match(/docs_urls:\n((?:\s+-\s+.+\n?)*)/);
    const urls: string[] = [];
    if (docsSection) {
      for (const line of docsSection[1].split("\n")) {
        const urlMatch = line.match(/^\s+-\s+(.+)/);
        if (urlMatch) urls.push(urlMatch[1].trim());
      }
    }

    // Map each tag to the combined URLs (shared + variant-specific)
    const allUrls = [...sharedDocs, ...urls];
    for (const tag of tags) {
      if (!result[tag]) result[tag] = [];
      for (const url of allUrls) {
        if (!result[tag].includes(url)) result[tag].push(url);
      }
    }
  }

  return result;
}

let _docsMap: Record<string, string[]> | null = null;

async function getDocsMap(): Promise<Record<string, string[]>> {
  if (_docsMap) return _docsMap;
  const raw = await fetchIntegrationConfig();
  _docsMap = parseDocsConfig(raw);
  return _docsMap;
}

/** Strip HTML tags and collapse whitespace to extract text content */
function stripHtml(html: string): string {
  const sanitized = sanitizeHtml(html, {
    allowedTags: [],
    allowedAttributes: {},
  });
  return sanitized
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Fetch doc content from a URL, stripping HTML if needed and capping size */
async function fetchDocContent(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) return null;

    let content = await response.text();

    // Strip HTML if the response looks like an HTML page
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("text/html") || content.trimStart().startsWith("<!") || content.trimStart().startsWith("<html")) {
      content = stripHtml(content);
    }

    return content;
  } catch {
    // silently skip failed doc fetches
  }
  return null;
}

/** Fetch all relevant doc content for the detected tags, deduplicating URLs and capping total size */
async function fetchDocsForTags(tags: string[]): Promise<{ url: string; content: string }[]> {
  const docsMap = await getDocsMap();
  const urlSet = new Set<string>();

  for (const tag of tags) {
    if (docsMap[tag]) {
      for (const url of docsMap[tag]) {
        urlSet.add(url);
      }
    }
  }

  if (urlSet.size === 0) return [];

  const urls = Array.from(urlSet);
  console.log(`Fetching ${urls.length} doc(s) for tags [${tags.join(", ")}]`);

  const results = await Promise.all(
    urls.map(async (url) => {
      const content = await fetchDocContent(url);
      return content ? { url, content } : null;
    })
  );

  return results.filter((r): r is { url: string; content: string } => r !== null);
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

export async function buildSystemPrompt(
  prData?: PRData,
  options: { command?: string } = {},
): Promise<string> {
  const commandId = options.command;
  const override = commandId ? PROMPTS_BY_COMMAND[commandId] : undefined;
  const rubric = override?.rubric ?? EVALUATION_CRITERIA;
  const outputFormat = override?.outputFormat ?? OUTPUT_FORMAT;

  const base: string[] = [TASK_PROMPT];
  if (commandId && commandId !== "default") {
    base.push(
      `You are evaluating a PR produced by the **${commandId}** wizard command, not the default PostHog integration. Score against the ${commandId}-specific rubric below.`,
    );
  }
  base.push(rubric, outputFormat);

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

    // Fetch and inject relevant PostHog docs for cross-referencing
    const docs = await fetchDocsForTags(tags);
    if (docs.length > 0) {
      const docSections = docs.map((d) => {
        const filename = d.url.split("/").pop() || d.url;
        return `### ${filename}\nSource: ${d.url}\n\n${d.content}`;
      });
      const section = `## PostHog documentation reference

Use these docs as the authoritative reference for how PostHog should be implemented in this framework. Cross-reference the PR's implementation against these patterns.

${docSections.join("\n\n---\n\n")}`;
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
