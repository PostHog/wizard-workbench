# PostHog AI Observability Setup

**Variant:** `ai-observability-openai-python` — the project's only LLM dependency is the plain `openai` Python package (`pyproject.toml`), with no framework, gateway `base_url` override, or agent SDK in play.

## What changed

- **`pyproject.toml`** — added `posthog` next to the existing `openai>=1.60.0` dependency. No version was upgraded or removed.
- **`main.py`**
  - Replaced `openai.OpenAI(...)` with PostHog's wrapper client: `from posthog.ai.openai import OpenAI`, constructed with a `Posthog(...)` instance (`posthog` client, read from `POSTHOG_API_KEY` / `POSTHOG_HOST`).
  - Registered `atexit.register(posthog.shutdown)` so buffered events flush on exit.
  - Added a single `SESSION_ID = str(uuid.uuid4())` at module load — this app has no conversation/thread field, so the whole process run is treated as one session, per the skill's rule.
  - `answer()` (the turn: one question in, one answer out) mints a `trace_id` per call and passes it to both the embedding call and the `responses.create()` call, so a turn's embedding + generation share one trace.
  - `embed()` takes an optional `trace_id`; the startup corpus-indexing calls in `build_index()` don't pass one, since they happen outside any user turn.
  - Every LLM call carries `posthog_distinct_id=USER_ID` (`"user_123"`, the project's existing constant) and `posthog_properties={"$ai_session_id": SESSION_ID}`.
- **`.env`** — set `POSTHOG_API_KEY` and `POSTHOG_HOST` to this project's real values (not committed; `.gitignore` already excludes `.env`).
- **`.env.example`** — added `OPENAI_API_KEY`, `POSTHOG_API_KEY`, `POSTHOG_HOST` with empty values, committed as documentation.

## Not touched

- No tools are registered anywhere in the app (no `tools=` argument, no dispatch loop), so no `$ai_span` capture was added — an app with no tools correctly has none.
- No existing `posthog.init(...)`, `identify()`, `capture()`, error tracking, or dashboards existed in this project, and none were added — out of scope for AI Observability instrumentation.
- No OpenTelemetry packages were added; this variant uses PostHog's drop-in wrapper client.

## Verification

- `python3 -c "from posthog.ai.openai import OpenAI; from posthog import Posthog"` — imports resolve cleanly after `pip install posthog`.
- `python3 -m py_compile main.py` — compiles cleanly.
- **Not run**: an actual model call. This environment has no `OPENAI_API_KEY`, and the skill instructs not to call the model on the user's behalf. Status is **wired, unverified**.

### How to verify live

1. Set a real `OPENAI_API_KEY` in `.env`.
2. Run `python3 main.py` — it calls `answer()` twice (two turns), each embedding the question and generating a response.
3. Open **PostHog → LLM Analytics → Traces**. Expect:
   - Two traces, one per `answer()` call, each grouping its embedding + generation.
   - Both traces under the same `$ai_session_id` (proves the session groups the turns rather than splitting them).
   - The person `user_123` attributed to both.
   - No spans (this app registers no tools) — that's a complete result, not a gap.
