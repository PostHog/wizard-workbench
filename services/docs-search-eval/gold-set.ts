import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { isCommunityQuestionUrl, normalizeDocUrl } from "./urls.js";

const defaultGoldPath = fileURLToPath(new URL("./gold-set.json", import.meta.url));

export function goldQueryIdFor(spanUuid: string): string {
  return createHash("sha256").update(spanUuid).digest("hex").slice(0, 12);
}

const bareDomainTopLevels = new Set(["com", "io", "net", "org", "co", "dev", "app", "ai", "xyz", "de", "uk", "fr", "nl", "eu", "us", "ca", "au", "in", "br", "es", "it", "se", "ch", "jp", "cn", "ru", "me", "tech", "cloud", "site"]);

const keyOrTokenPatterns = [
  /(?:phc|phx|phs|pha)_[\w-]{8,}/i,
  /(?<![a-z])sk-\w{8,}/i,
  /(?<![a-z])sk[-_][\w-]{16,}/i,
  /(?:gh[pousr]_|github_pat_)\w{8,}/i,
  /AKIA[0-9A-Z]{16}/,
  /xox[abp]-[\w-]+/i,
  /eyJ[\w-]+\.[\w-]+\./,
];

function decodePercentEscapes(text: string): string {
  return text.replace(/(?:%[0-9a-f]{2})+/gi, (escapedSequence) => {
    try {
      return decodeURIComponent(escapedSequence);
    } catch {
      return escapedSequence;
    }
  });
}

function isPostHogHost(host: string): boolean {
  return host === "posthog.com" || host.endsWith(".posthog.com");
}

function hasBareDomainOutsidePostHog(text: string): boolean {
  for (const match of text.matchAll(/(?<![\p{L}\p{N}_.@/-])(?:[\p{L}\p{N}-]+\.)+(\p{L}{2,})(?![\p{L}\p{N}_(-]|\.[\p{L}\p{N}])/giu)) {
    const host = match[0].toLowerCase();
    if (isPostHogHost(host)) continue;
    if (host.startsWith("www.") || bareDomainTopLevels.has(match[1].toLowerCase())) return true;
  }
  return false;
}

function findUnscrubbedPattern(text: string): string | null {
  if (/[\p{L}\p{N}_.!#$%&'*+/=?^`{|}~-]+@[\p{L}\p{N}_.-]+\.\p{L}{2,}/u.test(text)) return "email address";
  for (const match of text.matchAll(/https?:\/\/[^\s<>"']+/gi)) {
    try {
      if (!isPostHogHost(new URL(match[0]).hostname.toLowerCase())) return "URL outside posthog.com";
    } catch {
      return "invalid URL";
    }
  }
  if (hasBareDomainOutsidePostHog(text)) return "domain outside posthog.com";
  if (keyOrTokenPatterns.some((pattern) => pattern.test(text))) return "key or token";
  if (/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i.test(text)) return "UUID";
  if (/[0-9a-f]{24,}/i.test(text)) return "long hex string";
  if (/\d{6,}/.test(text)) return "number with six or more digits";
  if (/\d(?:[ .-]?\d){8,}/.test(text)) return "number with nine or more digits";
  if (/(?<![\w+])\+\d(?:[\s().-]*\d){6,}/.test(text)) return "phone number";
  return null;
}

export function findUnscrubbedText(text: string): string | null {
  for (const candidateText of new Set([text, decodePercentEscapes(text)])) {
    const reason = findUnscrubbedPattern(candidateText);
    if (reason) return reason;
  }
  return null;
}

const docUrls = z.array(z.string().transform(normalizeDocUrl)).transform((urls) =>
  [...new Set(urls.filter((url) => !isCommunityQuestionUrl(url)))])
  .superRefine((urls, context) => {
    for (const [index, url] of urls.entries()) {
      if (/^https:\/\/posthog\.com(?:\/|$)/.test(url)) continue;
      context.addIssue({ code: z.ZodIssueCode.custom, path: [index], message: "Must be an https://posthog.com URL" });
    }
  });

const inkeepDocUrls = z.array(z.string()).transform((urls) => [...new Set(urls
  .map((url) => normalizeDocUrl(url).replace(/^http:\/\/posthog\.com(?=\/|$)/, "https://posthog.com"))
  .filter((url) => /^https:\/\/posthog\.com(?:\/|$)/.test(url) && !isCommunityQuestionUrl(url)))]);

export const GoldQuery = z.object({
  id: z.string().regex(/^[0-9a-f]{12}$/),
  harness: z.string(),
  status: z.enum(["labeled", "skipped"]),
  scrubbedQuery: z.string().trim(),
  relevantUrls: docUrls,
  targetsComponentPage: z.boolean(),
  expectedCodeSnippet: z.string().nullable(),
  inkeepUrls: inkeepDocUrls,
  notes: z.string(),
  labeledAt: z.string().datetime({ offset: true }),
}).strict().superRefine((query, context) => {
  for (const field of ["scrubbedQuery", "notes", "expectedCodeSnippet"] as const) {
    const reason = findUnscrubbedText(query[field] ?? "");
    if (reason) context.addIssue({ code: z.ZodIssueCode.custom, path: [field], message: `${field} contains ${reason}` });
  }
  if (query.status !== "labeled") return;
  if (!query.scrubbedQuery) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["scrubbedQuery"], message: "scrubbedQuery must be non-empty for a labeled query" });
  }
  if (query.relevantUrls.length === 0) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["relevantUrls"], message: "A labeled query requires at least one relevant URL" });
  }
  if (query.targetsComponentPage && !query.expectedCodeSnippet?.trim()) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["expectedCodeSnippet"], message: "A labeled component query requires a non-empty expectedCodeSnippet" });
  }
});
export type GoldQuery = z.infer<typeof GoldQuery>;

export const GoldSet = z.object({ version: z.literal(1), queries: z.array(GoldQuery) }).strict()
  .superRefine((goldSet, context) => {
    const seenIds = new Set<string>();
    for (const [index, query] of goldSet.queries.entries()) {
      if (seenIds.has(query.id)) {
        context.addIssue({ code: z.ZodIssueCode.custom, path: ["queries", index, "id"], message: "Duplicate gold query id" });
      }
      seenIds.add(query.id);
    }
  });
export type GoldSet = z.infer<typeof GoldSet>;

export async function readGoldSet(path = defaultGoldPath): Promise<GoldSet> {
  try {
    return GoldSet.parse(JSON.parse(await readFile(path, "utf8")));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return { version: 1, queries: [] };
    throw error;
  }
}

export async function writeGoldSet(goldSet: GoldSet, path = defaultGoldPath): Promise<void> {
  const validatedGoldSet = GoldSet.parse(goldSet);
  validatedGoldSet.queries.sort((first, second) => first.id.localeCompare(second.id));
  await mkdir(dirname(path), { recursive: true });
  const temporaryPath = `${path}.${randomUUID()}.tmp`;
  try {
    await writeFile(temporaryPath, `${JSON.stringify(validatedGoldSet, null, 2)}\n`, { flag: "wx", mode: 0o600 });
    await rename(temporaryPath, path);
  } finally {
    await rm(temporaryPath, { force: true });
  }
}

export function assertGoldSetReadyForRun(goldSet: GoldSet): void {
  const validation = GoldSet.safeParse(goldSet);
  const problems = validation.success ? [] : validation.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
  const labeledQueries = goldSet.queries.filter((query) => query.status === "labeled");
  const componentCount = labeledQueries.filter((query) => query.targetsComponentPage).length;
  if (labeledQueries.length < 100) problems.push(`Requires at least 100 labeled queries (currently ${labeledQueries.length})`);
  if (componentCount < 10) problems.push(`Requires at least 10 labeled component queries (currently ${componentCount})`);
  if (problems.length > 0) throw new Error(problems.join("\n"));
}
