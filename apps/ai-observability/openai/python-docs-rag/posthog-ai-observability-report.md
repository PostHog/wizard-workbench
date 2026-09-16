# PostHog AI Observability — OpenAI (Python)

## Status: wired, unverified

The `openai.OpenAI` client in `main.py` was swapped for PostHog's drop-in
wrapper (`posthog.ai.openai.OpenAI`), so both LLM calls the app makes
(`embeddings.create` and `responses.create`) now emit `$ai_embedding` /
`$ai_generation` events automatically. No traces have been checked in
PostHog yet — see **Verify** below.

## What changed

- `pyproject.toml` — added `posthog` next to the existing `openai` dependency.
- `main.py`
  - Replaced `openai.OpenAI(...)` with a `Posthog(...)` client plus the
    `posthog.ai.openai.OpenAI` wrapper (same constructor args, so all
    existing calls keep working unmodified in shape).
  - Added `enable_exception_autocapture=True` and registered
    `posthog.shutdown` with `atexit` so buffered events flush on exit.
  - Added a module-level `SESSION_ID` (one per process run — the app has no
    conversation/thread id, so the run is the conversation, per the skill's
    fallback rule).
  - `embed()` now takes an optional `trace_id` and passes
    `posthog_distinct_id`, `posthog_trace_id`, and
    `posthog_properties={"$ai_session_id": SESSION_ID}` on every call.
  - `answer()` — the turn function (one question in, one answer out, calling
    the model twice: an embedding then a response) — mints one `trace_id`
    per call and passes it to both the embedding and the `responses.create`
    call, so they group into a single trace.
- `.env.example` — documents `POSTHOG_API_KEY` and `POSTHOG_HOST` (empty).
- `.env` — set with the real project token and host (not committed;
  `.gitignore` already excludes `.env`).

## The four facts

| Fact | Finding |
|---|---|
| Conversation | No thread/conversation id in the app — the process run is the session (`SESSION_ID`, minted once at import time) |
| User | `USER_ID = "user_123"` (existing constant) — passed as `posthog_distinct_id` |
| Turn | `answer(question, index)` — one question, one answer, two model calls (embed + responses.create) sharing one `trace_id` |
| Tools | None registered — no `tools=` argument, no tool-dispatch loop — so no `$ai_span` captures were added |

## Not touched

No existing `posthog.init`/capture calls existed in this project, so nothing
outside AI Observability was added or changed — no product-analytics
`capture()` calls, no error-tracking handlers, no dashboards.

## Verify

1. Install the new dependencies (`pip install posthog "openai>=1.60.0"` —
   already confirmed importable and compiling in this run).
2. Run `python3 main.py`. This triggers two turns in one process — `build_index()`
   embeds the 4 docs, then `answer()` runs twice, each doing one query
   embedding + one `responses.create` call.
3. Open **AI Observability → Traces** in PostHog
   (https://us.i.posthog.com/project/483112/llm-observability/traces) and
   check the newest traces:
   - Two traces should appear (one per `answer()` call), each containing
     both its embedding and its generation.
   - Both traces should share the same `$ai_session_id` (proving the
     session groups the turns rather than splitting them).
   - The person should resolve to `user_123`, not anonymous.
   - The four indexing embeddings from `build_index()` will appear as
     separate single-call traces (expected — they aren't part of a user
     turn).

I did not run the script myself (no OpenAI/PostHog credentials available to
this run) — only the import chain and `py_compile` were verified locally.
