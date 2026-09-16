# PostHog AI Observability Setup — OpenAI (Python)

## Variant

`ai-observability-openai-python` — the project's only LLM SDK is `openai` (`pyproject.toml`), called directly with no agent framework, no gateway base URL override, and no existing OTel instrumentation. That maps to a plain provider variant under rule 4 of the variant-picking rules.

## The four facts

| Fact | Value |
|---|---|
| Conversation | No conversation/thread id in the app. The process run is the conversation — one `SESSION_ID` (`uuid.uuid4()`) is minted at module load and reused for every call. |
| User | `USER_ID = "user_123"` — already a constant in `main.py`. |
| Turn | `answer(question, index)` — one question in, one answer out. It makes two model calls per turn: an embedding call and a `responses.create` call. |
| Tools | None registered — no `tools=` argument or tool-dispatch loop. No `$ai_span` captures were added. |

## Changes

- **`pyproject.toml`** — added `posthog` next to the existing `openai` dependency. Package manager was not invoked; install happens in your normal build step (`pip install posthog` or equivalent).
- **`main.py`**
  - Replaced `import openai` / `openai.OpenAI(...)` with `from posthog import Posthog`, `from posthog.ai.openai import OpenAI`, and a module-level `Posthog(...)` client with `enable_exception_autocapture=True`, registered with `atexit.register(posthog.shutdown)` so buffered events flush on exit.
  - `embed()` now takes an optional `trace_id` and passes `posthog_distinct_id`, `posthog_trace_id`, and `posthog_properties={"$ai_session_id": SESSION_ID}` to `client.embeddings.create`.
  - `answer()` mints one `trace_id` per call and passes it to both the question-embedding call and `client.responses.create`, so both calls in a turn land in the same trace.
  - `build_index()`'s startup embeddings (one per corpus doc) intentionally get no `trace_id` — they aren't part of a user turn, so each lands as its own single-call trace. This is expected, not a gap.
- **`.env` / `.env.example`** — added `POSTHOG_API_KEY` and `POSTHOG_HOST` (`.env` got the real project token and `https://us.i.posthog.com`; `.env.example` documents both keys with empty values, alongside the pre-existing `OPENAI_API_KEY`).
- **`.gitignore`** — already ignored `.env` only; no change needed.

Nothing else was touched — no `posthog.capture()` product events, no exception handlers, no dashboards.

## Verification status: wired, unverified

`posthog` is not installed in this sandbox (no venv, and the skill's install step explicitly says not to run the package manager — that happens in your normal build). I confirmed `main.py` compiles cleanly (`python3 -m py_compile main.py`), but I could not run `python3 -c "from posthog.ai.openai import OpenAI"` to confirm the import path resolves at runtime.

**To verify:**
1. `pip install -e .` (or `pip install posthog openai`) to pick up the new dependency.
2. Run `python3 -c "from posthog.ai.openai import OpenAI"` — should exit cleanly.
3. Run `python3 main.py`. This makes two turns (`answer()` calls) in one process, each with an embedding + a `responses.create` call.
4. Open **LLM Analytics → Traces** in PostHog and check the newest trace(s):
   - Both turns should share one `$ai_session_id`.
   - Each turn's embedding + generation calls should share one trace id (two generations per trace).
   - The person should be `user_123`, not anonymous.
