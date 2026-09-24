import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, dirname, extname, join } from "node:path";
import type { Check } from "./warehouse-checks.js";

export const FEATURE_FLAGS_REPORT_FILE = "posthog-feature-flags-report.md";

const EXAMPLE_FLAG_KEY_PATTERN = /wizard-example-[a-z0-9]+(?:-[a-z0-9]+)*/g;

const UNTRACKED_DIRECTORIES = new Set([
  ".git",
  ".next",
  ".venv",
  "__pycache__",
  "node_modules",
  "venv",
]);

export interface FeatureFlagsExpect {
  flagKeys: string[];
}

export interface RemoteFlag {
  key: string;
  active: boolean;
  deleted?: boolean;
  filters?: { groups?: Array<{ rollout_percentage?: number | null }> };
}

export interface FeatureFlagEvidence {
  expectedFlagKeys: string[];
  changedFileContentsByPath: Map<string, string>;
  remoteFlagsByKey: Map<string, RemoteFlag>;
  flagsApiError: string | null;
  isReportWritten: boolean;
}

export function loadFeatureFlagsExpect(appsDir: string, app: string): FeatureFlagsExpect | null {
  const expectFile = join(appsDir, app, ".wizard-ci", "feature-flags.json");
  let raw: string;
  try {
    raw = readFileSync(expectFile, "utf8");
  } catch {
    return null;
  }
  const parsed = JSON.parse(raw) as Partial<FeatureFlagsExpect>;
  const flagKeys = parsed.flagKeys;
  const isKeyList =
    Array.isArray(flagKeys) &&
    flagKeys.length > 0 &&
    flagKeys.every((key) => typeof key === "string" && key !== "");
  if (!isKeyList) {
    throw new Error(`apps/${app}/.wizard-ci/feature-flags.json needs a non-empty "flagKeys" list`);
  }
  return { flagKeys };
}

export function posthogAppHost(region: string): string {
  return region === "eu" ? "https://eu.posthog.com" : "https://us.posthog.com";
}

export async function fetchFlagsByKey(args: {
  host: string;
  projectId: string;
  apiKey: string;
  flagKeys: string[];
  fetchFlags?: typeof fetch;
}): Promise<Map<string, RemoteFlag>> {
  const fetchFlags = args.fetchFlags ?? fetch;
  const flagsByKey = new Map<string, RemoteFlag>();
  for (const flagKey of args.flagKeys) {
    const url =
      `${args.host}/api/projects/${encodeURIComponent(args.projectId)}/feature_flags/` +
      `?search=${encodeURIComponent(flagKey)}`;
    const response = await fetchFlags(url, {
      headers: { Authorization: `Bearer ${args.apiKey}` },
    });
    if (!response.ok) {
      throw new Error(`Flags API returned HTTP ${response.status} for ${flagKey}`);
    }
    const page = (await response.json()) as { results?: RemoteFlag[] };
    const match = (page.results ?? []).find((flag) => flag.key === flagKey && !flag.deleted);
    if (match) flagsByKey.set(flagKey, match);
  }
  return flagsByKey;
}

export function changedFiles(sourceDir: string, copyDir: string): Map<string, string> {
  const contentsByPath = new Map<string, string>();
  const walk = (relativeDir: string): void => {
    for (const entry of readdirSync(join(copyDir, relativeDir), { withFileTypes: true })) {
      const relativePath = relativeDir ? join(relativeDir, entry.name) : entry.name;
      if (entry.isDirectory()) {
        if (!UNTRACKED_DIRECTORIES.has(entry.name)) walk(relativePath);
        continue;
      }
      if (!entry.isFile()) continue;
      const copied = readFileSync(join(copyDir, relativePath));
      const sourcePath = join(sourceDir, relativePath);
      if (existsSync(sourcePath) && readFileSync(sourcePath).equals(copied)) continue;
      contentsByPath.set(relativePath, copied.toString("utf8"));
    }
  };
  walk("");
  return contentsByPath;
}

function moduleName(modulePath: string): string {
  const stem = basename(modulePath, extname(modulePath));
  if (stem === "index" || stem === "__init__") return basename(dirname(modulePath));
  return stem;
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function moduleImportPattern(module: string): RegExp {
  const escapedModule = escapeRegExp(module);
  const jsSpecifier = `['"](?:[^'"\\n]*/)?${escapedModule}(?:\\.[cm]?[jt]sx?)?['"]`;
  const jsImport = `(?:\\bfrom|\\brequire\\(|\\bimport\\()\\s*${jsSpecifier}`;
  const pythonDottedPath = `(?:[\\w.]*\\.)?${escapedModule}`;
  const pythonWhitespaceOrComments = `(?:\\s|#[^\\n]*\\n)*`;
  const pythonPrecedingImportedNames = `(?:\\w+(?:\\s+as\\s+\\w+)?\\s*,${pythonWhitespaceOrComments})*`;
  const pythonSubmoduleImport = `from[ \\t]+[\\w.]+[ \\t]+import[ \\t]+\\(?${pythonWhitespaceOrComments}${pythonPrecedingImportedNames}${escapedModule}\\b`;
  const pythonPrecedingImportedModules = `(?:[\\w.]+(?:[ \\t]+as[ \\t]+\\w+)?[ \\t]*,[ \\t]*)*`;
  const pythonModuleImport = `import[ \\t]+${pythonPrecedingImportedModules}${pythonDottedPath}\\b`;
  const pythonImport = `^[ \\t]*(?:from[ \\t]+${pythonDottedPath}[ \\t]+import\\b|${pythonModuleImport}|${pythonSubmoduleImport})`;
  return new RegExp(`${jsImport}|${pythonImport}`, "m");
}

const RUBY_NAMESPACE_OPENING = /^[ \t]*(?:module|class)[ \t]+([A-Z]\w*(?:::[A-Z]\w*)*)/;
const RUBY_LINE_COMMENT = /#.*/;

interface RubyOpenNamespace {
  indent: number;
  segments: string[];
}

function indentWidth(line: string): number {
  return line.length - line.trimStart().length;
}

function rubyNamespacePathAroundFlagKey(constantsContents: string, flagKey: string): string[] {
  const openNamespaces: RubyOpenNamespace[] = [];
  for (const rawLine of constantsContents.split("\n")) {
    const hasFlagKey = rawLine.includes(flagKey);
    const line = rawLine.replace(RUBY_LINE_COMMENT, "");
    if (!hasFlagKey && line.trim() === "") continue;
    const indent = indentWidth(rawLine);
    while (openNamespaces.length > 0 && openNamespaces[openNamespaces.length - 1].indent >= indent) {
      openNamespaces.pop();
    }
    if (hasFlagKey) return openNamespaces.flatMap((openNamespace) => openNamespace.segments);
    const namespaceOpening = RUBY_NAMESPACE_OPENING.exec(line);
    if (namespaceOpening) openNamespaces.push({ indent, segments: namespaceOpening[1].split("::") });
  }
  return [];
}

function rubyReferencePattern(constantsContents: string, flagKey: string): RegExp | null {
  const namespacePath = rubyNamespacePathAroundFlagKey(constantsContents, flagKey);
  if (namespacePath.length === 0) return null;
  const innermostName = namespacePath[namespacePath.length - 1];
  const acceptedNames = [...new Set([namespacePath.join("::"), innermostName])].map(escapeRegExp);
  return new RegExp(`(?<![\\w:])(?:::)?(?:${acceptedNames.join("|")})(?:::|\\.)\\w`);
}

function constantsModuleUsagePatterns(
  constantsPath: string,
  constantsContents: string,
  flagKey: string,
): RegExp[] {
  const importPattern = moduleImportPattern(moduleName(constantsPath));
  if (extname(constantsPath) !== ".rb") return [importPattern];
  const referencePattern = rubyReferencePattern(constantsContents, flagKey);
  return referencePattern ? [importPattern, referencePattern] : [importPattern];
}

function check(name: string, ok: boolean, detail: string): Check {
  return { name, ok, detail, advisory: false };
}

function remoteFlagChecks(flagKey: string, evidence: FeatureFlagEvidence): Check[] {
  if (evidence.flagsApiError) {
    return [check(`flag ${flagKey} exists`, false, evidence.flagsApiError)];
  }
  const flag = evidence.remoteFlagsByKey.get(flagKey);
  if (!flag) {
    return [check(`flag ${flagKey} exists`, false, "no such flag in the project")];
  }
  const groups = flag.filters?.groups ?? [];
  const rollouts = groups.map((group) => group.rollout_percentage ?? null);
  const isAtZeroPercent = groups.length > 0 && rollouts.every((rollout) => rollout === 0);
  return [
    check(`flag ${flagKey} exists`, true, "found"),
    check(`flag ${flagKey} inactive`, flag.active === false, `active=${flag.active}`),
    check(`flag ${flagKey} at 0%`, isAtZeroPercent, `rollouts=${JSON.stringify(rollouts)}`),
  ];
}

function codeChecks(flagKey: string, sourceFiles: Map<string, string>): Check[] {
  const filesWithKey = [...sourceFiles].filter(([, contents]) => contents.includes(flagKey));
  const filePaths = filesWithKey.map(([path]) => path);
  const inOneModule = check(
    `key ${flagKey} in one constants module`,
    filesWithKey.length === 1,
    filePaths.length ? filePaths.join(", ") : "in no changed file",
  );
  if (filesWithKey.length !== 1) return [inOneModule];

  const [[constantsPath, constantsContents]] = filesWithKey;
  const usagePatterns = constantsModuleUsagePatterns(constantsPath, constantsContents, flagKey);
  const users = [...sourceFiles]
    .filter(
      ([path, contents]) =>
        path !== constantsPath && usagePatterns.some((usagePattern) => usagePattern.test(contents)),
    )
    .map(([path]) => path);
  return [
    inOneModule,
    check(
      `constants module for ${flagKey} used by another changed file`,
      users.length > 0,
      users.length ? `${constantsPath} used by ${users.join(", ")}` : `nothing uses ${constantsPath}`,
    ),
  ];
}

export function featureFlagChecks(evidence: FeatureFlagEvidence): Check[] {
  const sourceFiles = new Map(
    [...evidence.changedFileContentsByPath].filter(([path]) => path !== FEATURE_FLAGS_REPORT_FILE),
  );
  const expectedKeys = new Set(evidence.expectedFlagKeys);
  const unexpectedKeys = new Set<string>();
  for (const contents of evidence.changedFileContentsByPath.values()) {
    for (const [foundKey] of contents.matchAll(EXAMPLE_FLAG_KEY_PATTERN)) {
      if (!expectedKeys.has(foundKey)) unexpectedKeys.add(foundKey);
    }
  }

  return [
    ...evidence.expectedFlagKeys.flatMap((flagKey) => [
      ...remoteFlagChecks(flagKey, evidence),
      ...codeChecks(flagKey, sourceFiles),
    ]),
    check(
      "no unexpected flag key",
      unexpectedKeys.size === 0,
      unexpectedKeys.size ? [...unexpectedKeys].join(", ") : "none",
    ),
    check(
      "report file written",
      evidence.isReportWritten,
      evidence.isReportWritten ? FEATURE_FLAGS_REPORT_FILE : `missing ${FEATURE_FLAGS_REPORT_FILE}`,
    ),
  ];
}
