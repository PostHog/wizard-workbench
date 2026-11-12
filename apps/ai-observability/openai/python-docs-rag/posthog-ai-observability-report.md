# PostHog AI Observability setup

## Status

**Wired, awaiting a live verification run.** The project now uses PostHog's OpenAI Python wrapper for its existing OpenAI embeddings and Responses API calls. The integration was verified by source review; no model request was made because this environment has no OpenAI credential to use for a live test.

## Integration details

- **Selected workflow:** `ai-observability-openai-python`, because `pyproject.toml` declares the direct `openai>=1.60.0` Python SDK and the application constructs an `openai.OpenAI` client. There is no framework or OpenAI-compatible gateway override.
- **Dependency:** Added `posthog<8` alongside the existing OpenAI dependency in `pyproject.toml`.
- **Configuration:** Added `POSTHOG_API_KEY` and `POSTHOG_HOST` to the local `.env`; `.env.example` documents the same names with empty values. No PostHog credential is embedded in source.
- **Wrapped client:** `main.py` constructs `Posthog` from environment variables and passes it to `posthog.ai.openai.OpenAI`, preserving the existing OpenAI API call shapes.
- **Embeddings:** Every `client.embeddings.create` call now carries the distinct ID, turn trace ID, and AI session ID. The wrapper records these as `$ai_embedding` events.
- **Generations:** Every `client.responses.create` call carries the same identity and trace context, so it is recorded as an AI generation in the same trace as its question embedding.
- **Grouping:** One `RUN_SESSION_ID` is created for the CLI process and shared by both questions. The first question uses the trace created before corpus indexing; the second receives a newly generated trace ID. This yields one AI session containing two traces, while every call in a trace shares the turn ID.
- **Attribution:** The existing stable `USER_ID` is supplied as `posthog_distinct_id`; no new person properties or product-analytics events were added.
- **Tools:** The application does not register or execute tools, so no `$ai_span` events were added.
- **Delivery:** The CLI registers `posthog_client.shutdown` with `atexit` and also attempts shutdown in `main()`'s `finally` block so buffered AI events are flushed before exit without disrupting application output.

## Verify in PostHog

1. Install the declared project dependencies using the project's normal Python environment workflow.
2. Ensure `POSTHOG_API_KEY`, `POSTHOG_HOST`, and `OPENAI_API_KEY` are available to the process. The first two values are configured in the local `.env` file.
3. Run `python3 main.py`.
4. Open **AI Observability → Traces** in PostHog and inspect the newest session.

Expected result:

- One session for the CLI run.
- Two traces: one for each `answer()` call.
- Each answer trace contains its question embedding followed by the response generation; the first trace also contains the startup corpus-index embeddings.
- Events are attributed to the application's existing user ID.
- No tool spans, because the application has no tool-dispatch loop.

## Privacy mode

`privacy_mode=False` is set on the `Posthog` client in `main.py`. This is the default content-capture mode: prompts, response output, and embedding inputs are sent on SDK-captured AI observability events.

Enable privacy mode before sending prompts or responses whose sensitive content must not be stored in PostHog. Change that constructor option to `privacy_mode=True` for an SDK-wide setting, or pass `posthog_privacy_mode=True` on an individual OpenAI call. Privacy mode removes SDK-captured `$ai_input` and `$ai_output_choices`; it does not retroactively remove existing events or arbitrary custom properties.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for the full behavior.

## Files changed

- `pyproject.toml`
- `main.py`
- `.env` (local configuration)
- `.env.example`
- `.posthog-wizard-cache/.posthog-ai.json`
- `posthog-ai-observability-report.md`
