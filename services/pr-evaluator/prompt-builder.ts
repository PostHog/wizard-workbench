import { existsSync, readFileSync, realpathSync, statSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, isAbsolute, join, posix, resolve, sep } from "path";
import { homedir } from "os";
import sanitizeHtml from "sanitize-html";
import { parsePerFilePatches, type PRData } from "../github/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load prompt templates from .md files in explicit order
const TASK_PROMPT = readFileSync(join(__dirname, "prompts/task.md"), "utf-8").trim();
const EVALUATION_CRITERIA = readFileSync(join(__dirname, "prompts/evaluation.md"), "utf-8").trim();
const EVALUATION_CRITERIA_REVENUE = readFileSync(
  join(__dirname, "prompts/evaluation-revenue.md"),
  "utf-8",
).trim();
const EVALUATION_CRITERIA_REPLAY_VISION = readFileSync(
  join(__dirname, "prompts/evaluation-replay-vision.md"),
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
  // Reuses the default output format - the replay-vision rubric keeps the same
  // four dimensions, only the items differ.
  "replay-vision": {
    rubric: EVALUATION_CRITERIA_REPLAY_VISION,
    outputFormat: OUTPUT_FORMAT,
  },
};

// Commandments loading: CONTEXT_MILL_PATH env var > COMMANDMENTS_PATH env var > GitHub main > vendored fallback
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
let _commandmentsMap: Record<string, string[]> | null = null;
let _docsConfigCache: string | null = null;
let _docsMap: Record<string, string[]> | null = null;
let _sdkVariants: Map<string, SdkVariant[]> | null = null;

/** Clear module-level caches (used by tests when overriding env vars). */
export function resetPromptBuilderCaches(): void {
  _commandmentsCache = null;
  _commandmentsMap = null;
  _docsConfigCache = null;
  _docsMap = null;
  _sdkVariants = null;
}

function resolveEnvPath(rawPath: string): string {
  if (rawPath === "~") return homedir();
  if (rawPath.startsWith("~/")) return join(homedir(), rawPath.slice(2));
  return rawPath;
}

function readFirstExistingLocalFile(
  candidates: { path: string; source: string }[],
  kind: string,
): string | null {
  for (const candidate of candidates) {
    try {
      if (existsSync(candidate.path)) {
        const content = readFileSync(candidate.path, "utf-8");
        console.log(`Loaded ${kind} from ${candidate.source}: ${candidate.path}`);
        return content;
      }
    } catch {
      console.warn(`Warning: local ${kind} "${candidate.path}" could not be read`);
    }
  }
  return null;
}

async function fetchCommandments(): Promise<string> {
  if (_commandmentsCache) return _commandmentsCache;

  // 1. Prefer CONTEXT_MILL_PATH so commandments and integration config stay aligned,
  // then fall back to standalone COMMANDMENTS_PATH before remote GitHub main.
  const localPaths: { path: string; source: string }[] = [];
  if (process.env.CONTEXT_MILL_PATH) {
    const cmRoot = resolveEnvPath(process.env.CONTEXT_MILL_PATH);
    localPaths.push(
      { path: join(cmRoot, "context/commandments.yaml"), source: "CONTEXT_MILL_PATH" },
      { path: join(cmRoot, "transformation-config/commandments.yaml"), source: "CONTEXT_MILL_PATH" },
    );
  }
  if (process.env.COMMANDMENTS_PATH) {
    localPaths.push({
      path: resolveEnvPath(process.env.COMMANDMENTS_PATH),
      source: "COMMANDMENTS_PATH",
    });
  }
  const localContent = readFirstExistingLocalFile(localPaths, "commandments");
  if (localContent !== null) {
    _commandmentsCache = localContent;
    return _commandmentsCache;
  }

  // 2. Try fetching latest from GitHub (tries both context/ and transformation-config/)
  const fetched = await fetchFirstOk(GITHUB_COMMANDMENTS_URLS);
  if (fetched) {
    _commandmentsCache = fetched.body;
    console.log(`Loaded commandments from GitHub (latest): ${fetched.url}`);
    return _commandmentsCache;
  }
  console.warn("Warning: Could not fetch commandments from GitHub, falling back to vendored copy");

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

async function getCommandments(): Promise<Record<string, string[]>> {
  if (_commandmentsMap) return _commandmentsMap;
  const raw = await fetchCommandments();
  _commandmentsMap = parseCommandments(raw);
  return _commandmentsMap;
}

// ── Docs loading ──────────────────────────────────────────────────────────

async function fetchIntegrationConfig(): Promise<string> {
  if (_docsConfigCache) return _docsConfigCache;

  if (process.env.CONTEXT_MILL_PATH) {
    const cmRoot = resolveEnvPath(process.env.CONTEXT_MILL_PATH);
    const localContent = readFirstExistingLocalFile(
      [
        { path: join(cmRoot, "context/skills/integration/config.yaml"), source: "CONTEXT_MILL_PATH" },
        { path: join(cmRoot, "transformation-config/skills/integration/config.yaml"), source: "CONTEXT_MILL_PATH" },
      ],
      "integration config",
    );
    if (localContent !== null) {
      _docsConfigCache = localContent;
      return _docsConfigCache;
    }
  }

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

/** Rewrite https://posthog.com URLs when POSTHOG_DOCS_BASE_URL is set. */
export function resolveDocsUrl(url: string): string {
  const base = process.env.POSTHOG_DOCS_BASE_URL?.replace(/\/$/, "");
  if (!base) return url;
  return url.replace(/^https?:\/\/posthog\.com(?=\/|$)/i, base);
}

const MAX_DOC_CHARS = 12000;
const MAX_MANIFEST_LINE_LENGTH = 1024;
export const MANIFEST_FILENAMES = [
  "requirements.txt",
  "pyproject.toml",
  "package.json",
  "go.mod",
  "Cargo.toml",
  "Gemfile",
  "composer.json",
  "build.gradle",
  "build.gradle.kts",
  "Podfile",
] as const;

function normalizeRepoPath(filename: string): string {
  return filename.replace(/\\/g, "/").replace(/^\.\//, "");
}

function isDependencyManifest(filename: string): boolean {
  const base = filename.split("/").pop() || filename;
  return (MANIFEST_FILENAMES as readonly string[]).includes(base) || /^requirements.*\.txt$/i.test(base);
}

/** Fetch doc content from a URL, stripping HTML if needed and capping size */
async function fetchDocContent(url: string): Promise<string | null> {
  const targetUrl = resolveDocsUrl(url);
  try {
    const response = await fetch(targetUrl, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) return null;

    let content = await response.text();

    // Strip HTML if the response looks like an HTML page
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("text/html") || content.trimStart().startsWith("<!") || content.trimStart().startsWith("<html")) {
      content = stripHtml(content);
    }

    return content.slice(0, MAX_DOC_CHARS);
  } catch {
    // silently skip failed doc fetches
  }
  return null;
}

// ── SDK variant mapping (context-mill skills/sdk/posthog-<pkg>/config.yaml) ──

export interface SdkVariant {
  id: string;
  tags: string[];
  /** Majors this variant serves, as written in `match` (list or single string). */
  majors: string[];
  docsUrls: string[];
}

const SDK_PKG_DIRS: Record<"python" | "node" | "go" | "rust", string> = {
  python: "posthog-python",
  node: "posthog-node",
  go: "posthog-go",
  rust: "posthog-rust",
};

function parseYamlScalarList(raw: string): string[] {
  const inner = raw.trim().replace(/^\[/, "").replace(/\]$/, "");
  return inner
    .split(",")
    .map((t) => t.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
}

/**
 * Parse an sdk config.yaml into variants. `match` may be a list
 * (`{ sdkPython: ["3", "4"] }`) or the older single string (`{ sdkPython: "7" }`).
 */
export function parseSdkConfig(raw: string): SdkVariant[] {
  const variants: SdkVariant[] = [];
  if (!raw) return variants;
  for (const block of raw.split(/\n  - id:\s*/).slice(1)) {
    const id = block.split("\n")[0].trim().replace(/^["']|["']$/g, "");
    const tagsMatch = block.match(/tags:\s*\[([^\]]*)\]/);
    const matchLine = block.match(/match:\s*\{\s*\w+\s*:\s*(\[[^\]]*\]|[^,}\s][^,}]*?)\s*[,}]/);
    if (!tagsMatch || !matchLine) continue;
    const docsSection = block.match(/docs_urls:\n((?:\s+-\s+.+\n?)*)/);
    const docsUrls: string[] = [];
    if (docsSection) {
      for (const line of docsSection[1].split("\n")) {
        const urlMatch = line.match(/^\s+-\s+(.+)/);
        if (urlMatch) docsUrls.push(urlMatch[1].trim());
      }
    }
    variants.push({
      id,
      tags: parseYamlScalarList(tagsMatch[1]),
      majors: parseYamlScalarList(matchLine[1]),
      docsUrls,
    });
  }
  return variants;
}

async function fetchSdkConfig(lang: keyof typeof SDK_PKG_DIRS): Promise<string> {
  const rel = `skills/sdk/${SDK_PKG_DIRS[lang]}/config.yaml`;
  if (process.env.CONTEXT_MILL_PATH) {
    const cmRoot = resolveEnvPath(process.env.CONTEXT_MILL_PATH);
    const local = readFirstExistingLocalFile(
      [
        { path: join(cmRoot, "context", rel), source: "CONTEXT_MILL_PATH" },
        { path: join(cmRoot, "transformation-config", rel), source: "CONTEXT_MILL_PATH" },
      ],
      `${lang} sdk config`,
    );
    if (local !== null) return local;
  }
  const fetched = await fetchFirstOk([
    `https://raw.githubusercontent.com/PostHog/context-mill/main/context/${rel}`,
    `https://raw.githubusercontent.com/PostHog/context-mill/main/transformation-config/${rel}`,
  ]);
  if (fetched) {
    console.log(`Loaded ${lang} sdk config from GitHub (latest): ${fetched.url}`);
    return fetched.body;
  }
  console.warn(`Warning: Could not load ${lang} sdk config; no version-specific SDK rules for ${lang}`);
  return "";
}

async function getSdkVariants(lang: keyof typeof SDK_PKG_DIRS): Promise<SdkVariant[]> {
  if (!_sdkVariants) _sdkVariants = new Map();
  const cached = _sdkVariants.get(lang);
  if (cached) return cached;
  const variants = parseSdkConfig(await fetchSdkConfig(lang));
  _sdkVariants.set(lang, variants);
  return variants;
}

/** The context-mill variant that lists this major, or null when none does. */
async function resolveSdkVariant(sdk: DetectedSdkMajor): Promise<SdkVariant | null> {
  const variants = await getSdkVariants(sdk.lang);
  return variants.find((v) => v.majors.includes(String(sdk.major))) ?? null;
}

/** Major the variant's rules and reference are written for, taken from its `sdk-<lang>-<N>` tag. */
function variantRuleMajor(sdk: DetectedSdkMajor, variant: SdkVariant): number {
  for (const tag of variant.tags) {
    const m = tag.match(new RegExp(`^sdk-${sdk.lang}-(\\d+)$`));
    if (m) return Number(m[1]);
  }
  return sdk.major;
}

/** Fetch all relevant doc content for detected tags and extra URLs, deduplicating and fetching concurrently. */
async function fetchDocsForTags(
  tags: string[],
  extraUrls: string[] = [],
): Promise<{ url: string; content: string }[]> {
  const docsMap = await getDocsMap();
  const urlSet = new Set<string>();

  for (const tag of tags) {
    if (docsMap[tag]) {
      for (const url of docsMap[tag]) {
        urlSet.add(url);
      }
    }
  }
  for (const url of extraUrls) {
    urlSet.add(url);
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

interface PRManifestContext {
  patchByFile: Map<string, string>;
  diskManifests: Map<string, string>;
}

/** Resolve per-file patches from PRData, falling back to prData.diff when file.patch is missing. */
function resolveFilePatches(prData: PRData): Map<string, string> {
  const diffByFile = prData.diff ? parsePerFilePatches(prData.diff) : new Map<string, string>();
  const patchByFile = new Map<string, string>();

  for (const file of prData.files) {
    const patch = file.patch ?? diffByFile.get(file.filename);
    if (patch) {
      patchByFile.set(file.filename, patch);
    }
  }

  return patchByFile;
}

/**
 * Locate manifest files on disk when prData.repoPath is available, walking upward
 * from changed files while staying inside the repo (and inside apps/<...> for app PRs).
 */
function findDiskManifests(prData: PRData): Map<string, string> {
  const diskManifests = new Map<string, string>();
  if (!prData.repoPath || !existsSync(prData.repoPath)) return diskManifests;

  let realRepoRoot: string;
  try {
    realRepoRoot = realpathSync(prData.repoPath);
  } catch {
    return diskManifests;
  }

  const seen = new Set<string>();
  const tryReadContained = (relPath: string): void => {
    if (seen.has(relPath)) return;
    seen.add(relPath);

    const candidate = resolve(realRepoRoot, relPath);
    if (!candidate.startsWith(realRepoRoot + sep)) return;

    try {
      if (!existsSync(candidate)) return;
      const realCandidate = realpathSync(candidate);
      if (!realCandidate.startsWith(realRepoRoot + sep)) return;
      if (!statSync(realCandidate).isFile()) return;
      diskManifests.set(relPath, readFileSync(realCandidate, "utf-8"));
    } catch {
      // Ignore unreadable manifest files
    }
  };

  for (const file of prData.files) {
    const normalized = normalizeRepoPath(file.filename);
    if (!normalized || isAbsolute(file.filename) || normalized.split("/").includes("..")) {
      continue;
    }

    if (isDependencyManifest(normalized)) {
      tryReadContained(normalized);
    }

    const isUnderApps = normalized.startsWith("apps/");
    let dir = posix.dirname(normalized);

    while (true) {
      if (isUnderApps && (dir === "apps" || dir === "." || !dir.startsWith("apps/"))) {
        break;
      }

      for (const manifest of MANIFEST_FILENAMES) {
        const relManifest = dir === "." ? manifest : `${dir}/${manifest}`;
        tryReadContained(relManifest);
      }

      if (dir === ".") break;
      const parent = posix.dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
  }

  return diskManifests;
}

function resolvePRManifestContext(prData: PRData): PRManifestContext {
  return {
    patchByFile: resolveFilePatches(prData),
    diskManifests: findDiskManifests(prData),
  };
}

function detectFrameworkFromContext(prData: PRData, ctx: PRManifestContext): string[] {
  const tags = new Set<string>();

  const filePaths = [
    ...prData.files.map((f) => f.filename),
    ...ctx.diskManifests.keys(),
  ].join("\n");

  // Extract content from dependency files only (not the full diff) for package name detection
  const depParts = prData.files
    .filter((f) => isDependencyManifest(f.filename))
    .map((f) => ctx.patchByFile.get(f.filename) || "");
  for (const [relPath, content] of ctx.diskManifests) {
    if (isDependencyManifest(relPath)) {
      depParts.push(content);
    }
  }
  const depContent = depParts.join("\n");

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

  // Go & Rust
  if (/go\.mod|\.go\b/.test(filePaths)) tags.add("go");
  if (/Cargo\.toml|\.rs\b/.test(filePaths)) tags.add("rust");

  return [...tags];
}

// Detect frameworks from PR file paths and dependency manifests (NOT full diff — avoids false positives)
export function detectFramework(prData: PRData): string[] {
  return detectFrameworkFromContext(prData, resolvePRManifestContext(prData));
}

export interface DetectedSdkMajor {
  tag: string;
  lang: "python" | "node" | "go" | "rust";
  pkg: string;
  major: number;
  defaultMajor: number;
  pinned: boolean;
  isNonDefault: boolean;
  rawSpec: string;
}

const DEFAULT_SDK_MAJORS: Record<DetectedSdkMajor["lang"], number> = {
  python: 8,
  node: 6,
  go: 2,
  rust: 1,
};

const DEFAULT_PKG_BY_LANG: Record<DetectedSdkMajor["lang"], string> = {
  python: "posthog",
  node: "posthog-node",
  go: "github.com/posthog/posthog-go",
  rust: "posthog-rs",
};

const SAFE_PKG_RE = /^[a-z0-9][a-z0-9._/-]{0,63}$/i;
const SAFE_SPEC_TOKEN_RE = /^(?:(?:===|==|~=|>=|<=|>|<|\^|~|=)?v?\d+(?:\.\d+|\.\*|\.x|\.(?:post|dev)\d{1,4}){0,4}(?:(?:a|b|rc)\d{1,4})?(?:-[a-z0-9.-]{1,32})?(?:\+[a-z0-9.-]{1,32})?|===|==|~=|>=|<=|>|<|\^|~|=|\|\||-)$/i;

function sanitizeSdkPkg(lang: DetectedSdkMajor["lang"], pkg: string): string {
  return SAFE_PKG_RE.test(pkg) ? pkg : DEFAULT_PKG_BY_LANG[lang];
}

function sanitizeSdkRawSpec(rawSpec: string, major: number): string {
  const fallback = `major ${major}`;
  const trimmed = rawSpec.trim();
  if (!trimmed || trimmed.length > 80 || /[\x00-\x1f\x7f]/.test(trimmed)) {
    return fallback;
  }

  let rest = trimmed;
  const pyPrefix = rest.match(/^posthog(?:\[[a-z0-9_, -]{1,48}\])?(?=[\s=<>~!]|$)/i);
  const goPrefix = rest.match(/^github\.com\/posthog\/posthog-go(?:\/v\d{1,3})?(?=\s|$)/i);
  if (pyPrefix) {
    rest = rest.slice(pyPrefix[0].length).trim();
  } else if (goPrefix) {
    rest = rest.slice(goPrefix[0].length).trim();
  }

  if (!rest) return pyPrefix || goPrefix ? trimmed : fallback;

  const tokens = rest.split(/[\s,]+/).filter(Boolean);
  if (tokens.length === 0 || tokens.length > 8) return fallback;
  return tokens.every((t) => SAFE_SPEC_TOKEN_RE.test(t)) ? trimmed : fallback;
}

function extractPatchLineSets(patch: string): { baseLines: string[]; currentLines: string[] } {
  const baseLines: string[] = [];
  const currentLines: string[] = [];

  for (const line of patch.split("\n")) {
    if (
      line.startsWith("diff --git ") ||
      line.startsWith("index ") ||
      line.startsWith("--- a/") ||
      line.startsWith('--- "a/') ||
      line === "--- /dev/null" ||
      line.startsWith("+++ b/") ||
      line.startsWith('+++ "b/') ||
      line === "+++ /dev/null" ||
      line.startsWith("@@") ||
      line === "\\ No newline at end of file"
    ) {
      continue;
    }

    if (line.startsWith("-")) {
      baseLines.push(line.slice(1));
    } else if (line.startsWith("+")) {
      currentLines.push(line.slice(1));
    } else if (line.startsWith(" ")) {
      const content = line.slice(1);
      baseLines.push(content);
      currentLines.push(content);
    } else {
      baseLines.push(line);
      currentLines.push(line);
    }
  }

  return { baseLines, currentLines };
}

function makeSdkMajor(
  lang: DetectedSdkMajor["lang"],
  pkg: string,
  major: number,
  pinned: boolean,
  rawSpec: string,
): DetectedSdkMajor {
  const defaultMajor = DEFAULT_SDK_MAJORS[lang];
  const safePkg = sanitizeSdkPkg(lang, pkg);
  const safeSpec = sanitizeSdkRawSpec(rawSpec, major);
  return {
    tag: `sdk-${lang}-${major}`,
    lang,
    pkg: safePkg,
    major,
    defaultMajor,
    pinned,
    isNonDefault: major < defaultMajor,
    rawSpec: safeSpec,
  };
}

type SpecStyle = "pep" | "toml-poetry" | "npm" | "cargo";

interface ParsedVersionClause {
  op: string;
  major: number;
  minor?: string;
  patch?: string;
  hasWildcard: boolean;
  isExactOp: boolean;
  strictFullMatch: boolean;
}

const CLAUSE_PREFIX_RE = /^(===|==|~=|>=|<=|>|<|\^|~|=|!=)?v?(\d+)(?:\.(\d+|\*|x))?(?:\.(\d+|\*|x))?/i;
const CLAUSE_FULL_RE = /^(===|==|~=|>=|<=|>|<|\^|~|=|!=)?v?\d+(?:\.(?:\d+|\*|x)(?:\.(?:\d+|\*|x))?)?(?:(?:a|b|rc)\d{1,4}|\.(?:post|dev)\d{1,4})?(?:[-+][^\s,;)]*)?$/i;

function parseVersionSpec(rawSpec: string, style: SpecStyle): { major: number; pinned: boolean } | null {
  const trimmed = rawSpec.trim();
  if (!trimmed || trimmed.length > 128) return null;

  // Collapse whitespace directly after operators so each clause is one contiguous token.
  const compact = trimmed.replace(/(===|==|~=|>=|<=|>|<|\^|~|=|!=)[ \t]+/g, "$1");
  const rawClauses = style === "npm" ? compact.split(/[\s,|]+/) : compact.split(",");

  const clauses: ParsedVersionClause[] = [];
  for (const part of rawClauses) {
    const clause = part.trim();
    if (!clause || clause === "-") continue;
    const m = clause.match(CLAUSE_PREFIX_RE);
    if (!m) continue;

    const op = m[1] ?? "";
    if (op === "!=") continue;

    const major = Number(m[2]);
    const minor = m[3];
    const patch = m[4];
    const hasWildcard =
      minor === "*" ||
      minor?.toLowerCase() === "x" ||
      patch === "*" ||
      patch?.toLowerCase() === "x" ||
      /\*/.test(clause);

    let isExactOp = false;
    if (style === "pep") {
      isExactOp = op === "==" || op === "===";
    } else if (style === "toml-poetry") {
      isExactOp = op === "==" || op === "===" || op === "=" || (op === "" && minor !== undefined);
    } else if (style === "npm") {
      isExactOp = (op === "=" || op === "") && minor !== undefined && patch !== undefined;
    } else if (style === "cargo") {
      isExactOp = op === "=";
    }

    clauses.push({
      op,
      major,
      minor,
      patch,
      hasWildcard,
      isExactOp,
      strictFullMatch: CLAUSE_FULL_RE.test(clause),
    });
  }

  if (clauses.length === 0) return null;

  const lowerOrExact = clauses.find((c) => c.op !== "<" && c.op !== "<=");
  let major: number;
  if (lowerOrExact) {
    major = lowerOrExact.major;
  } else {
    const inclusiveUpper = clauses.find((c) => c.op === "<=");
    if (inclusiveUpper) {
      major = inclusiveUpper.major;
    } else {
      const upper = clauses[0];
      const minorZero = upper.minor === undefined || upper.minor === "0";
      const patchZero = upper.patch === undefined || upper.patch === "0";
      major = minorZero && patchZero && upper.major > 0 ? upper.major - 1 : upper.major;
    }
  }

  const pinned =
    clauses.length === 1 &&
    clauses[0].isExactOp &&
    !clauses[0].hasWildcard &&
    clauses[0].strictFullMatch;

  return { major, pinned };
}

function stripPepTail(raw: string): string {
  const noMarker = raw.split(";", 1)[0].trimEnd();
  const noContinuation = noMarker.endsWith("\\") ? noMarker.slice(0, -1).trimEnd() : noMarker;
  const optIdx = noContinuation.search(/[ \t]+--/);
  return (optIdx === -1 ? noContinuation : noContinuation.slice(0, optIdx)).trim();
}

function parsePepRequirement(candidate: string): DetectedSdkMajor | null {
  const pepMatch = candidate.match(/^posthog(?:\[[^\]\r\n]{0,64}\])?([\s=<>~!].*)$/i);
  if (!pepMatch) return null;
  const specPart = stripPepTail(pepMatch[1]);
  const parsed = parseVersionSpec(specPart, "pep");
  if (!parsed) return null;
  return makeSdkMajor("python", "posthog", parsed.major, parsed.pinned, stripPepTail(candidate));
}

function parsePythonLine(raw: string, isToml: boolean): DetectedSdkMajor[] {
  const code = raw.split("#", 1)[0].trim();
  if (!code || code.length > MAX_MANIFEST_LINE_LENGTH) return [];

  if (!isToml) {
    const req = parsePepRequirement(code);
    return req ? [req] : [];
  }

  const entries: DetectedSdkMajor[] = [];
  const poetryMatch = code.match(/^(?:"posthog"|'posthog'|posthog)[ \t]*=[ \t]*(.+)$/i);
  if (poetryMatch) {
    const rhs = poetryMatch[1].trim();
    const specMatch = rhs.startsWith("{")
      ? rhs.match(/\bversion[ \t]*=[ \t]*(?:"([^"]{1,128})"|'([^']{1,128})')/i)
      : rhs.match(/^(?:"([^"]{1,128})"|'([^']{1,128})')/);
    const spec = specMatch ? (specMatch[1] ?? specMatch[2] ?? "") : "";
    const parsed = parseVersionSpec(spec, "toml-poetry");
    if (parsed) {
      entries.push(makeSdkMajor("python", "posthog", parsed.major, parsed.pinned, spec));
    }
  }

  for (const qm of code.matchAll(/"([^"\r\n]{1,128})"|'([^'\r\n]{1,128})'/g)) {
    const quoted = (qm[1] ?? qm[2] ?? "").trim();
    const pep = parsePepRequirement(quoted);
    if (pep) entries.push(pep);
  }

  return entries;
}

function parseManifestEntries(base: string, lines: string[]): DetectedSdkMajor[] {
  const entries: DetectedSdkMajor[] = [];

  if (/^requirements.*\.txt$/i.test(base) || base === "pyproject.toml") {
    const isToml = base === "pyproject.toml";
    for (const raw of lines) {
      entries.push(...parsePythonLine(raw, isToml));
    }
  } else if (base === "package.json") {
    for (const raw of lines) {
      if (raw.length > MAX_MANIFEST_LINE_LENGTH) continue;
      const m = raw.match(/"posthog-node"[ \t]*:[ \t]*"([^"]+)"/);
      if (!m) continue;
      const spec = m[1].trim();
      const parsed = parseVersionSpec(spec, "npm");
      if (parsed) {
        entries.push(makeSdkMajor("node", "posthog-node", parsed.major, parsed.pinned, spec));
      }
    }
  } else if (base === "go.mod") {
    for (const raw of lines) {
      const code = raw.split("//", 1)[0];
      if (code.length > MAX_MANIFEST_LINE_LENGTH) continue;
      const m = code.match(/github\.com\/posthog\/posthog-go(?:\/v(\d{1,3}))?[ \t]+(v\d+\.\d+\.\d+[^\s]*)/);
      if (!m) continue;
      const pathMajor = m[1] ? Number(m[1]) : 1;
      const verMajor = Number(m[2].match(/^v(\d+)/)?.[1] ?? pathMajor);
      const major = m[1] ? pathMajor : verMajor <= 1 ? 1 : verMajor;
      const pkg = m[1] ? `github.com/posthog/posthog-go/v${m[1]}` : "github.com/posthog/posthog-go";
      entries.push(makeSdkMajor("go", pkg, major, false, m[0].trim()));
    }
  } else if (base === "Cargo.toml") {
    for (const raw of lines) {
      const code = raw.split("#", 1)[0];
      if (code.length > MAX_MANIFEST_LINE_LENGTH) continue;
      const cargoMatch = code.match(/^[ \t]*(posthog-rs|posthog)[ \t]*=[ \t]*(.+)$/);
      if (!cargoMatch) continue;

      const rawKey = cargoMatch[1];
      const rhs = cargoMatch[2].trim();
      let pkgName = rawKey;
      let spec = "";
      if (rhs.startsWith("{")) {
        if (/\bworkspace[ \t]*=[ \t]*true\b/.test(rhs)) continue;
        pkgName = rhs.match(/\bpackage[ \t]*=[ \t]*"([^"]{1,64})"/)?.[1] ?? rawKey;
        spec = rhs.match(/\bversion[ \t]*=[ \t]*"([^"]{1,128})"/)?.[1] ?? "";
      } else {
        spec = rhs.match(/^"([^"]{1,128})"/)?.[1] ?? "";
      }

      const parsed = parseVersionSpec(spec, "cargo");
      if (parsed) {
        entries.push(makeSdkMajor("rust", pkgName, parsed.major, parsed.pinned, spec));
      }
    }
  }

  return entries;
}

function mergeSdkEntry(found: Map<string, DetectedSdkMajor>, entry: DetectedSdkMajor): void {
  const existing = found.get(entry.tag);
  if (!existing) {
    found.set(entry.tag, entry);
    return;
  }
  if (!existing.pinned && entry.pinned) {
    found.set(entry.tag, entry);
  }
}

function detectSdkMajorsFromContext(prData: PRData, ctx: PRManifestContext): DetectedSdkMajor[] {
  const found = new Map<string, DetectedSdkMajor>();
  const patchedSdkPaths = new Set<string>();

  for (const file of prData.files) {
    const patch = ctx.patchByFile.get(file.filename);
    if (!patch) continue;
    const base = file.filename.split("/").pop() || file.filename;
    const { baseLines, currentLines } = extractPatchLineSets(patch);

    // Parse base (removed + context) lines first so upgrades/unpins preserve the repo's prior constraint.
    const baseEntries = parseManifestEntries(base, baseLines);
    const baseLangs = new Set(baseEntries.map((e) => e.lang));
    for (const entry of baseEntries) {
      mergeSdkEntry(found, entry);
    }

    const currentEntries = parseManifestEntries(base, currentLines);
    for (const entry of currentEntries) {
      if (!baseLangs.has(entry.lang)) {
        mergeSdkEntry(found, entry);
      }
    }

    if (baseEntries.length > 0 || currentEntries.length > 0) {
      patchedSdkPaths.add(normalizeRepoPath(file.filename));
    }
  }

  for (const [relPath, content] of ctx.diskManifests) {
    if (patchedSdkPaths.has(relPath)) continue;
    const base = relPath.split("/").pop() || relPath;
    for (const entry of parseManifestEntries(base, content.split(/\r?\n/))) {
      mergeSdkEntry(found, entry);
    }
  }

  return [...found.values()];
}

/** Detect PostHog SDK major versions and pins from PR patches and manifests on disk. */
export function detectSdkMajors(prData: PRData): DetectedSdkMajor[] {
  return detectSdkMajorsFromContext(prData, resolvePRManifestContext(prData));
}

// Determine architecture type from detected tags
export function detectArchType(tags: string[]): "server-only" | "client-only" | "full-stack" {
  const serverTags = [
    "django",
    "flask",
    "fastapi",
    "javascript_node",
    "ruby-on-rails",
    "laravel",
    "php",
    "python",
    "ruby",
    "go",
    "rust",
  ];
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
    const manifestCtx = resolvePRManifestContext(prData);
    const tags = detectFrameworkFromContext(prData, manifestCtx);
    const sdkMajors = detectSdkMajorsFromContext(prData, manifestCtx);
    // Map each detected major to the context-mill variant that lists it (like the wizard
    // picks its skill) and use that variant's tags and docs_urls.
    const sdkResolved = await Promise.all(
      sdkMajors.map(async (sdk) => ({ sdk, variant: await resolveSdkVariant(sdk) })),
    );
    const extraDocUrls: string[] = [];
    for (const { sdk, variant } of sdkResolved) {
      if (!variant) continue;
      for (const tag of variant.tags) if (!tags.includes(tag)) tags.push(tag);
      // Default majors keep relying on the model's own knowledge; older majors get the variant's reference docs.
      if (sdk.isNonDefault) extraDocUrls.push(...variant.docsUrls);
    }
    const archType = detectArchType(tags);
    console.log(`Detected frameworks: [${tags.join(", ")}], arch_type: ${archType}`);

    // Collect matching commandments and docs concurrently
    const [commandments, docs] = await Promise.all([
      getCommandments(),
      fetchDocsForTags(tags, extraDocUrls),
    ]);
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

    if (sdkMajors.length > 0) {
      const sdkLines = sdkResolved.map(({ sdk, variant }) => {
        const pinLabel = sdk.pinned
          ? `HARD-PINNED (${sdk.rawSpec}) — pin MUST remain untouched`
          : `range (${sdk.rawSpec || `major ${sdk.major}`}) — must stay within major ${sdk.major}`;
        if (!variant) {
          return `- \`${sdk.pkg}\`: ${pinLabel}; installed ${sdk.major}.x — no version-specific rules exist for major ${sdk.major}, so no SDK-specific rules or reference are loaded; judge against the SDK's own docs and the framework rules`;
        }
        const ruleTag = variant.tags[0] ?? sdk.tag;
        const ruleMajor = variantRuleMajor(sdk, variant);
        const versionNote =
          ruleMajor !== sdk.major
            ? `app is on ${sdk.major}.x; the \`${ruleTag}\` rules and reference are written for ${ruleMajor}.x.x, and signatures on the installed major ${sdk.major} can differ — do NOT penalize code that is correct for the installed ${sdk.major}.x`
            : sdk.isNonDefault
              ? `NON-DEFAULT major ${sdk.major} (latest is ${sdk.defaultMajor}; judge against \`${ruleTag}\` rules & ${ruleMajor}.x.x docs, NOT ${sdk.defaultMajor}.x.x reference signatures)`
              : `default major ${sdk.major}`;
        return `- \`${sdk.pkg}\` (\`${ruleTag}\`): ${pinLabel}; ${versionNote}`;
      });
      base.push(`## Brownfield SDK Major & Pin Rules

Detected SDK versions in this PR:
${sdkLines.join("\n")}

Grading requirements for existing SDKs:
1. Existing major \`M\` must NEVER be upgraded across a breaking major boundary.
2. Hard-pinned specs (\`==X.Y.Z\`, \`=X.Y.Z\`, exact version) must NEVER be modified or loosened; if a feature floor is higher than the pin, expect compatible major-\`M\` fallbacks or a clear warning/skip instead of breaking the pin.
3. Any existing PostHog client initialization must be reused rather than instantiating a duplicate client.
4. For non-default majors, validate imports, init options, and error-tracking/capture signatures against the listed \`sdk-<lang>-<N>\` rules and reference docs rather than latest-major docs; when the rules are written for a newer major than the installed one, accept signatures that are correct for the installed major.`);
    }

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
