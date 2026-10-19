# Docs-search eval

Checks whether Business Knowledge (BK) search returns the right posthog.com pages for real docs-search queries, so we can tell when it's good enough to replace Inkeep. It grades retrieval only: which pages come back, not the answer an agent or the website writes from them.

## Run it

Set these in `.env`:

- `POSTHOG_DOCS_EVAL_API_KEY`: a personal API key that can read the project's business knowledge
- `POSTHOG_DOCS_EVAL_PROJECT_ID`: the project that holds the docs library
- `POSTHOG_DOCS_EVAL_LIBRARY_ID`: the docs library's UUID, so the eval never reads or searches other knowledge in that project
- `POSTHOG_REGION`: optional, defaults to `us`

Then:

```sh
pnpm docs-eval:coverage   # did BK ingest the sitemap?
pnpm docs-eval:run        # replay the gold set and score it
pnpm docs-eval:score services/docs-search-eval/runs/<run>/results.json   # rescore a saved run offline
```

Each run writes `results.json` and `report.md` under `runs/` (gitignored).

## Reading the scores

The run passes only when every bar passes. Search runs with rerank off, since that's what we'd ship.

| Bar | Pass | What it tells you |
| --- | --- | --- |
| `hitAt3` | ≥ 0.8 | Share of queries with a right page in the top 3. The closest proxy for an agent getting what it needs from the first result. |
| `recallAt10` | ≥ 0.7 | Average share of a query's right pages that show up in the top 10. Catches queries whose answer spans several pages. |
| `emptyRate` | < 2% | Share of searches that return nothing. |
| `latencyP95Ms` | < 3000 | 95th percentile search latency. |

The report also lists:

- **Component checks:** queries whose answer is a code snippet. They fail as "snippet missing" when the right page comes back but its chunk lost the code.
- **Docs gaps:** queries the docs don't answer (`isDocsGap` in the gold set). They're left out of `hitAt3` and `recallAt10`, because a related page would otherwise count as a hit. The list is a to-do for the docs, not for search.
- **Stale labels:** labeled pages that now 404, so the gold set needs updating.

Coverage passes at 99% of in-scope sitemap pages ingested. `docs-eval:run` checks it first and stops if it fails, since a source that's still crawling scores low for the wrong reason.

## How the gold set was made

`gold-set.json` holds 180 queries sampled from real docs-search tool calls, spread across agent harnesses.

- **Scrubbed:** each query is an LLM rewrite with customer names, URLs, keys, and IDs removed. The raw text was never committed, and the schema rejects text that looks like an email, a non-PostHog URL, a key, a UUID, or a long ID.
- **Labeled:** agents drafted each query's right pages with a confidence rating (in `notes`), then we reviewed every low-confidence label by hand and spot-checked the rest.
- **Excluded:** 9 queries are `skipped`: 2 aren't docs questions, and 7 ask about something no page mentions. 4 labeled queries are flagged as docs gaps, where a related page exists but doesn't answer the question.

To change a label, edit `gold-set.json` directly. The run refuses a gold set that fails the schema, has fewer than 100 labeled queries or 10 component queries, or still has a query with `isAwaitingReview` set.
