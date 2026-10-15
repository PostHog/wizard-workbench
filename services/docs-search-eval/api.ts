import { posthogAppHost } from "../wizard-ci/feature-flag-checks.js";

function requiredProjectIdFromEnv(variableName: string): number {
  const rawValue = process.env[variableName]?.trim() ?? "";
  const projectId = Number(rawValue);
  if (!/^[1-9][0-9]*$/.test(rawValue) || !Number.isSafeInteger(projectId)) throw new Error(`${variableName} must be set to a positive integer project ID`);
  return projectId;
}

export interface DocsScope {
  projectId: number;
  libraryId: string;
}

export function docsScope(): DocsScope {
  const projectId = requiredProjectIdFromEnv("POSTHOG_DOCS_EVAL_PROJECT_ID");
  const libraryId = process.env.POSTHOG_DOCS_EVAL_LIBRARY_ID?.trim() ?? "";
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(libraryId)) throw new Error("POSTHOG_DOCS_EVAL_LIBRARY_ID must be set to the docs library UUID");
  return { projectId, libraryId };
}

export function eventsProjectId(): number {
  return requiredProjectIdFromEnv("POSTHOG_DOCS_EVAL_EVENTS_PROJECT_ID");
}

export interface KnowledgeSource {
  id: string | number;
  name: string;
  source_type: string;
  status: string;
  document_count: number;
  source_url: string | null;
  crawl_config: { include_globs?: string[]; [key: string]: unknown } | null;
  embedding_status: string | null;
  last_refresh_status: string | null;
}

export interface KnowledgeDocument {
  id: string | number;
  url: string;
  title: string;
  safety_verdict: string;
}

export interface KnowledgeChunk {
  chunk_id: string | number;
  document_id: string | number;
  ordinal: number;
  source_id: string | number;
  source_name: string;
  source_type: string;
  document_title: string;
  heading_path: string;
  content: string;
  is_generated: boolean;
  url: string;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

type QueryParams = Record<string, string | number | boolean>;

async function posthogRequest<T>(path: string, method: string, params?: QueryParams, body?: unknown): Promise<T> {
  const apiKey = process.env.POSTHOG_DOCS_EVAL_API_KEY;
  if (!apiKey?.trim()) throw new Error("POSTHOG_DOCS_EVAL_API_KEY must be set");
  const url = new URL(path, posthogAppHost(process.env.POSTHOG_REGION ?? "us"));
  for (const [name, value] of Object.entries(params ?? {})) url.searchParams.set(name, String(value));
  for (let attempt = 0; attempt < 2; attempt++) {
    let response: Response;
    try {
      response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: AbortSignal.timeout(60_000),
      });
    } catch {
      if (attempt === 0) continue;
      throw new Error(`PostHog API network error (no HTTP status) for ${method} ${path}`);
    }
    if (attempt === 0 && (response.status === 429 || response.status >= 500)) {
      await response.body?.cancel();
      continue;
    }
    if (!response.ok) throw new Error(`PostHog API HTTP ${response.status} for ${method} ${path}`);
    return await response.json() as T;
  }
  throw new Error(`PostHog API request failed for ${method} ${path}`);
}

export function posthogGet<T>(path: string, params?: QueryParams): Promise<T> {
  return posthogRequest<T>(path, "GET", params);
}

export function posthogPost<T>(path: string, body: unknown): Promise<T> {
  return posthogRequest<T>(path, "POST", undefined, body);
}

async function listAll<T>(path: string, params?: QueryParams): Promise<T[]> {
  const records: T[] = [];
  let offset = 0;
  while (true) {
    const page = await posthogGet<PaginatedResponse<T>>(path, { ...params, limit: 100, offset });
    records.push(...page.results);
    if (page.next === null) return records;
    if (page.results.length === 0) throw new Error(`PostHog API pagination made no progress for ${path}`);
    offset += page.results.length;
  }
}

export function listSources(scope: DocsScope): Promise<KnowledgeSource[]> {
  return listAll(`/api/projects/${scope.projectId}/business_knowledge/sources/`, { library_id: scope.libraryId });
}

export function listSourceDocuments(projectId: number, sourceId: string | number): Promise<KnowledgeDocument[]> {
  return listAll(`/api/projects/${projectId}/business_knowledge/sources/${encodeURIComponent(sourceId)}/documents/`);
}

export async function searchKnowledge(scope: DocsScope, query: string, options: { limit: number; rerank: boolean }): Promise<{ results: KnowledgeChunk[]; latencyMs: number }> {
  const startedAt = performance.now();
  const results = await posthogGet<KnowledgeChunk[]>(`/api/projects/${scope.projectId}/business_knowledge/documents/search/`, {
    query, limit: Math.min(options.limit, 20), rerank: options.rerank, library_id: scope.libraryId,
  });
  return { results, latencyMs: performance.now() - startedAt };
}

export async function runHogQL(projectId: number, query: string): Promise<Record<string, unknown>[]> {
  const response = await posthogPost<{ columns: string[]; results: unknown[][] }>(`/api/projects/${projectId}/query/`, {
    query: { kind: "HogQLQuery", query },
  });
  return response.results.map((row) => Object.fromEntries(response.columns.map((column, index) => [column, row[index]])));
}
