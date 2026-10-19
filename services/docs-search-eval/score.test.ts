import assert from "node:assert/strict";
import { test } from "node:test";
import { Results, renderReport, score, type ArmResult, type ScoringResults } from "./score.js";

test("rescoring a saved fixture run reproduces the hand-computed metrics", () => {
  const goldQueries: ScoringResults["goldSet"]["queries"] = [
    {
      id: "000000000001", harness: "fictional", status: "labeled", scrubbedQuery: "Find the lantern guide",
      relevantUrls: ["https://posthog.com/docs/old-lantern", "https://posthog.com/docs/lantern-colors"],
      targetsComponentPage: false, expectedCodeSnippet: null,
      notes: "", isAwaitingReview: false, isDocsGap: false, labeledAt: "2026-01-01T00:00:00Z",
    },
    {
      id: "000000000002", harness: "fictional", status: "labeled", scrubbedQuery: "Render the lantern component",
      relevantUrls: ["https://posthog.com/docs/lantern-component"],
      targetsComponentPage: true, expectedCodeSnippet: "<Lantern />",
      notes: "", isAwaitingReview: false, isDocsGap: false, labeledAt: "2026-01-01T00:00:00Z",
    },
    {
      id: "000000000003", harness: "fictional", status: "labeled", scrubbedQuery: "Find the retired lantern",
      relevantUrls: ["https://posthog.com/docs/retired-lantern"],
      targetsComponentPage: false, expectedCodeSnippet: null,
      notes: "", isAwaitingReview: false, isDocsGap: false, labeledAt: "2026-01-01T00:00:00Z",
    },
    {
      id: "000000000004", harness: "fictional", status: "labeled", scrubbedQuery: "Configure the lantern switch",
      relevantUrls: ["https://posthog.com/docs/lantern-switch"],
      targetsComponentPage: false, expectedCodeSnippet: null,
      notes: "", isAwaitingReview: false, isDocsGap: false, labeledAt: "2026-01-01T00:00:00Z",
    },
    {
      id: "000000000005", harness: "fictional", status: "skipped", scrubbedQuery: "Skipped lantern query",
      relevantUrls: [], targetsComponentPage: false, expectedCodeSnippet: null,
      notes: "", isAwaitingReview: false, isDocsGap: false, labeledAt: "2026-01-01T00:00:00Z",
    },
    {
      id: "000000000006", harness: "fictional", status: "labeled", scrubbedQuery: "Price the lantern refill",
      relevantUrls: ["https://posthog.com/docs/lantern-switch"],
      targetsComponentPage: false, expectedCodeSnippet: null,
      notes: "", isAwaitingReview: false, isDocsGap: true, labeledAt: "2026-01-01T00:00:00Z",
    },
  ];
  const successfulSearch = (urls: string[], latencyMs: number): Extract<ArmResult, { status: "ok" }> => ({
    status: "ok", latencyMs,
    chunks: urls.map((url) => ({ url, content: "Fictional guide without a code snippet", headingPath: "Lantern" })),
  });
  const replay: ScoringResults = {
    version: 1, startedAt: "2026-01-01T00:00:00Z", finishedAt: "2026-01-01T00:01:00Z",
    projectId: 123, goldSetSha256: "a".repeat(64),
    goldSet: { version: 1, queries: goldQueries },
    resolvedUrls: {
      "https://posthog.com/docs/old-lantern": { finalUrl: "https://posthog.com/docs/lantern", status: 200 },
      "https://posthog.com/docs/retired-lantern": { finalUrl: "https://posthog.com/docs/retired-lantern", status: 404 },
    },
    queries: [
      {
        id: "000000000001",
        search: successfulSearch([
          "https://posthog.com/questions/fictional-lantern",
          "https://posthog.com/docs/unrelated-a/",
          "https://posthog.com/docs/unrelated-a#duplicate",
          "https://posthog.com/docs/unrelated-b",
          "https://www.posthog.com/docs/lantern/?source=fixture#heading",
        ], 100.04),
      },
      {
        id: "000000000002",
        search: {
          status: "ok", latencyMs: 200.06,
          chunks: [
            ...successfulSearch(["https://posthog.com/docs/unrelated-a", "https://posthog.com/docs/unrelated-b", "https://posthog.com/docs/unrelated-c"], 0).chunks,
            { url: "https://posthog.com/docs/lantern-component#intro", content: "No snippet here", headingPath: "" },
            { url: "https://posthog.com/docs/lantern-component#example", content: "<Lantern />", headingPath: "" },
          ],
        },
      },
      {
        id: "000000000003",
        search: successfulSearch(["https://posthog.com/questions/only-community"], 300.08),
      },
      {
        id: "000000000004",
        search: { status: "error", latencyMs: 9999, error: "Fictional search failure" },
      },
      {
        id: "000000000005",
        search: successfulSearch([], 9000),
      },
      {
        id: "000000000006",
        search: successfulSearch(["https://posthog.com/docs/unrelated-a"], 150),
      },
    ],
  };
  const firstSummary = score(replay);
  assert.equal(firstSummary.search.hitAt3, 0.5);
  assert.equal(firstSummary.search.recallAt10, 0.75);
  assert.equal(firstSummary.search.emptyRate, 0.25);
  assert.equal(firstSummary.search.errorRate, 0.2);
  assert.deepEqual(firstSummary.staleLabels, [{ queryId: "000000000003", url: "https://posthog.com/docs/retired-lantern" }]);
  assert.deepEqual(firstSummary.componentFlags, [{ queryId: "000000000002", reason: "snippet missing" }]);
  assert.deepEqual(firstSummary.search.counts, { labeled: 5, ok: 4, errored: 1, scorable: 2 });
  assert.equal(firstSummary.queriesWithoutLiveLabels, 1);
  assert.equal(firstSummary.componentQueriesChecked, 1);
  assert.deepEqual(firstSummary.docsGaps, ["000000000006"]);
  assert.equal(firstSummary.search.latencyP50Ms, 150);
  assert.equal(firstSummary.search.latencyP95Ms, 300.1);
  const savedRun = { ...replay, metrics: firstSummary };
  const reloadedRun = Results.parse(JSON.parse(JSON.stringify(savedRun)));
  const rescoredSummary = score(reloadedRun);
  assert.deepEqual(rescoredSummary, firstSummary);
  assert.equal(renderReport(reloadedRun, rescoredSummary), renderReport(savedRun, firstSummary));
});
