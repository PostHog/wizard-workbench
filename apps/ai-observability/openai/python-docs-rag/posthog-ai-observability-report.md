# PostHog AI Observability setup

## Integration selected

- **Variant:** `ai-observability-openai-python`
- **Reason:** the Python manifest declares the modern `openai>=1.60.0` SDK and the application uses its direct `OpenAI` client. No higher-level agent framework, gateway base URL override, or tool loop is present.

## Changes made

- Added the `posthog` Python dependency alongside the existing OpenAI SDK in `pyproject.toml`.
- Replaced the direct OpenAI client in `main.py` with `posthog.ai.openai.OpenAI`, backed by an instance-based `Posthog` client.
- The PostHog client reads `POSTHOG_API_KEY` and `POSTHOG_HOST` from the process environment. The supplied project token and host were configured in the local `.env` file; no credential is embedded in source.
- Enabled exception autocapture and registered an `atexit` shutdown handler. The CLI entry point also calls `posthog_client.shutdown()` in `finally` so buffered AI events flush before exit.
- Added a run-level UUID `$ai_session_id`. The session is shared by the startup index build and both Q&A turns.
- Added a UUID `posthog_trace_id` to each logical operation. Each `answer()` call shares its trace across its query embedding and response generation; the one-time corpus-indexing embeddings share a separate startup trace.
- Added the existing stable `USER_ID` as `posthog_distinct_id` to each observed OpenAI call.
- No `$ai_span` events were added: `retrieve()` is local retrieval logic, not a registered or dispatched LLM tool.
- Added `.posthog-wizard-cache/.posthog-ai.json` to record the selected provider and wrapper-construction file.

## Privacy mode

Privacy mode is explicitly **off** at `main.py:16` via `privacy_mode=False`. This captures SDK-produced `$ai_input` and `$ai_output_choices`, including prompts and model completions, which is the default AI Observability behavior.

Enable privacy mode before sending prompt or response content that must not be stored in PostHog. For this integration, change `privacy_mode=False` to `privacy_mode=True` on the `Posthog` constructor, or add `posthog_privacy_mode=True` to an individual wrapped OpenAI request. Privacy mode excludes those SDK-captured input and output properties; it does not remove arbitrary custom properties or data already ingested.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).

## Verification

- Confirmed the `posthog` dependency is declared in `pyproject.toml`.
- Confirmed the PostHog token and host keys are present in `.env` without reading or exposing their values.
- Reviewed the final call sites: all OpenAI embeddings and responses use the wrapper and receive the session, trace, and distinct-id context.
- No project package-manager command or verification script is available. Per the integration workflow, dependencies were declared rather than installed, so the wrapper import and live ingestion are **wired but not runtime-verified**.

## How to verify live ingestion

1. Ensure the process receives `OPENAI_API_KEY`, `POSTHOG_API_KEY`, and `POSTHOG_HOST` (the script reads environment variables directly; make sure your launcher loads `.env` or exports them).
2. Run `python3 main.py`.
3. In PostHog, open **AI Observability → Traces** and inspect the newest traces. The two Q&A turns should each show an embedding and a response generation in a shared per-turn trace, and both should use the same run-level AI session ID. The startup corpus-indexing embeddings appear as a separate trace in that same session.
4. Run a second Q&A turn in the same process to confirm it remains in the same session while receiving a new trace ID.

No existing PostHog initialization, identity tracking, event capture, or dashboards were changed.
