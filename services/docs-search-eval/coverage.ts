import "dotenv/config";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { docsScope, listSourceDocuments, listSources, mapConcurrent, type KnowledgeSource } from "./api.js";
import { fetchHeadWithGetFallback, normalizeDocUrl, uniqueNormalized } from "./urls.js";

const PREFIXES = ["/docs", "/handbook", "/pricing"] as const;
type Prefix = typeof PREFIXES[number];
type ExclusionReason = "redirectedToIngested" | "redirectedOutOfScope" | "nonHtml" | "goneFromSite";

interface CoverageCounts {
  sitemap: number;
  ingested: number;
  excluded: number;
  excludedReasons: Record<ExclusionReason, number>;
  missing: number;
  coverage: number;
}

interface CoverageResult {
  passed: boolean;
  projectId: number;
  overall: CoverageCounts;
  prefixes: Record<Prefix, CoverageCounts>;
  requiredSources: Array<{
    name: string;
    prefix: Prefix;
    id: string | number | null;
    status: string;
    document_count: number | null;
    embedding_status: string | null;
  }>;
  missingUrls: string[];
  excludedUrls: Array<{ url: string; reason: ExclusionReason }>;
  goneFromSite: string[];
  probeErrors: Array<{ url: string; message: string }>;
}

function scopePrefix(url: string): Prefix | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "posthog.com") return null;
    return PREFIXES.find((prefix) => parsed.pathname === prefix || parsed.pathname.startsWith(`${prefix}/`)) ?? null;
  } catch {
    return null;
  }
}

export function decodeXml(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos);/gi, (entity: string, name: string) => {
    if (name.startsWith("#x")) return String.fromCodePoint(parseInt(name.slice(2), 16));
    if (name.startsWith("#")) return String.fromCodePoint(Number(name.slice(1)));
    return ({ amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" } as Record<string, string>)[name] ?? entity;
  });
}

export async function sitemapUrls(): Promise<string[]> {
  const response = await fetch("https://posthog.com/sitemap.xml", { redirect: "follow", signal: AbortSignal.timeout(60_000) });
  if (!response.ok) throw new Error(`Sitemap HTTP ${response.status} for https://posthog.com/sitemap.xml`);
  const xml = await response.text();
  const urls = uniqueNormalized(Array.from(xml.matchAll(/<loc\b[^>]*>([\s\S]*?)<\/loc>/g), (match) => {
    const content = match[1].trim();
    if (content.startsWith("<![CDATA[") && content.endsWith("]]>")) return content.slice(9, -3);
    return decodeXml(content);
  })).filter((url) => scopePrefix(url) !== null);
  if (urls.length === 0) throw new Error("Sitemap contains no in-scope docs, handbook, or pricing URLs");
  return urls;
}

function requiredSource(sources: KnowledgeSource[], prefix: Prefix): KnowledgeSource | undefined {
  const globMatch = sources.find((source) => source.crawl_config?.include_globs?.some((glob) => glob.startsWith(prefix)));
  if (globMatch) return globMatch;
  const name = prefix.slice(1).toLowerCase();
  return sources.find((source) => source.name.toLowerCase().includes(name));
}

async function probeMissingUrl(url: string, ingestedUrls: Set<string>): Promise<ExclusionReason | null> {
  const response = await fetchHeadWithGetFallback(url);
  await response.body?.cancel();
  if (response.status === 404 || response.status === 410) return "goneFromSite";
  if (!response.ok) throw new Error(`Probe HTTP ${response.status} for ${url}`);
  const finalUrl = normalizeDocUrl(response.url);
  if (finalUrl !== url && ingestedUrls.has(finalUrl)) return "redirectedToIngested";
  if (finalUrl !== url && scopePrefix(finalUrl) === null) return "redirectedOutOfScope";
  const contentType = response.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
  if (contentType && contentType !== "text/html" && contentType !== "application/xhtml+xml") return "nonHtml";
  return null;
}

function countCoverage(urls: string[], ingestedUrls: Set<string>, exclusions: Map<string, ExclusionReason>): CoverageCounts {
  const excludedReasons: Record<ExclusionReason, number> = {
    redirectedToIngested: 0,
    redirectedOutOfScope: 0,
    nonHtml: 0,
    goneFromSite: 0,
  };
  let ingested = 0;
  for (const url of urls) {
    if (ingestedUrls.has(url)) ingested++;
    const reason = exclusions.get(url);
    if (reason) excludedReasons[reason]++;
  }
  const excluded = Object.values(excludedReasons).reduce((total, count) => total + count, 0);
  const denominator = urls.length - excluded;
  return {
    sitemap: urls.length,
    ingested,
    excluded,
    excludedReasons,
    missing: denominator - ingested,
    coverage: denominator === 0 ? 1 : ingested / denominator,
  };
}

export async function checkCoverage(): Promise<CoverageResult> {
  const scope = docsScope();
  const sources = await listSources(scope);
  const urls = await sitemapUrls();
  const requiredSources = PREFIXES.map((prefix) => {
    const source = requiredSource(sources, prefix);
    return {
      name: source?.name ?? `${prefix[1].toUpperCase()}${prefix.slice(2)}`,
      prefix,
      id: source?.id ?? null,
      status: source?.status ?? "missing",
      document_count: source?.document_count ?? null,
      embedding_status: source?.embedding_status ?? null,
    };
  });
  const ingestedUrls = new Set<string>();
  for (const source of sources.filter((candidateSource) => candidateSource.status === "ready")) {
    const documents = await listSourceDocuments(scope.projectId, source.id);
    const searchableDocuments = documents.filter((document) => document.safety_verdict === "safe");
    for (const url of uniqueNormalized(searchableDocuments.map((document) => document.url))) ingestedUrls.add(url);
  }
  const candidates = urls.filter((url) => !ingestedUrls.has(url));
  const exclusions = new Map<string, ExclusionReason>();
  const probeErrors: CoverageResult["probeErrors"] = [];
  await mapConcurrent(candidates, async (url) => {
    try {
      const reason = await probeMissingUrl(url, ingestedUrls);
      if (reason) exclusions.set(url, reason);
    } catch (error) {
      probeErrors.push({ url, message: error instanceof Error ? error.message : String(error) });
    }
  });
  const overall = countCoverage(urls, ingestedUrls, exclusions);
  const prefixes = Object.fromEntries(PREFIXES.map((prefix) => [
    prefix, countCoverage(urls.filter((url) => scopePrefix(url) === prefix), ingestedUrls, exclusions),
  ])) as Record<Prefix, CoverageCounts>;
  const excludedUrls = candidates.flatMap((url) => {
    const reason = exclusions.get(url);
    return reason ? [{ url, reason }] : [];
  });
  return {
    passed: overall.coverage >= 0.99 && requiredSources.every((source) => source.status === "ready"),
    projectId: scope.projectId,
    overall,
    prefixes,
    requiredSources,
    missingUrls: candidates.filter((url) => !exclusions.has(url)),
    excludedUrls,
    goneFromSite: excludedUrls.filter((entry) => entry.reason === "goneFromSite").map((entry) => entry.url),
    probeErrors,
  };
}

function printReport(report: CoverageResult): void {
  console.log(`BK docs coverage: ${report.passed ? "PASS" : "FAIL"} (project ${report.projectId})`);
  for (const prefix of PREFIXES) {
    const counts = report.prefixes[prefix];
    console.log(`${prefix}: sitemap=${counts.sitemap}, ingested=${counts.ingested}, excluded=${counts.excluded}, missing=${counts.missing}, coverage=${(counts.coverage * 100).toFixed(2)}%`);
    console.log(`  Exclusions: redirected to ingested=${counts.excludedReasons.redirectedToIngested}, redirected out of scope=${counts.excludedReasons.redirectedOutOfScope}, non-HTML=${counts.excludedReasons.nonHtml}, gone from site=${counts.excludedReasons.goneFromSite}`);
  }
  console.log(`Overall: ${(report.overall.coverage * 100).toFixed(2)}% (required: 99%)`);
  for (const source of report.requiredSources) {
    console.log(`${source.name}: status=${source.status}, document_count=${source.document_count ?? "unknown"}, embedding_status=${source.embedding_status ?? "unknown"}`);
  }
  console.log(`Missing URLs (${report.missingUrls.length}):`);
  for (const url of report.missingUrls) console.log(url);
  console.log(`Gone from site (${report.goneFromSite.length}):`);
  for (const url of report.goneFromSite) console.log(url);
  for (const failure of report.probeErrors) console.log(`Probe failed; URL remains missing: ${failure.url}: ${failure.message}`);
}

async function main(): Promise<void> {
  const argumentsList = process.argv.slice(2);
  if (argumentsList.includes("--help")) {
    console.log("Usage: pnpm docs-eval:coverage [--json] [--help]\nChecks BK docs, handbook, and pricing coverage in the project named by POSTHOG_DOCS_EVAL_PROJECT_ID.\nRequires POSTHOG_DOCS_EVAL_API_KEY, POSTHOG_DOCS_EVAL_PROJECT_ID, and POSTHOG_DOCS_EVAL_LIBRARY_ID; POSTHOG_REGION defaults to us.\nExit codes: 0 pass, 1 coverage failure, 2 configuration/API error.");
    return;
  }
  const isJson = argumentsList.includes("--json");
  try {
    const unknownArgument = argumentsList.find((argument) => argument !== "--json");
    if (unknownArgument) throw new Error(`Unknown argument: ${unknownArgument}`);
    const report = await checkCoverage();
    if (isJson) console.log(JSON.stringify(report, null, 2));
    if (!isJson) printReport(report);
    process.exitCode = report.passed ? 0 : 1;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (isJson) console.log(JSON.stringify({ error: message }));
    if (!isJson) console.error(message);
    process.exitCode = 2;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
