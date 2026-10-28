# PostHog AI Observability setup

## Status

Wired, awaiting a live run. The project uses the `ai-observability-openai-python` workflow because its Python manifest directly depends on the modern `openai` SDK (`>=1.60.0`) and its code uses the OpenAI Responses and Embeddings clients.

## Changes made

- Added the `posthog` Python dependency in `pyproject.toml`; the existing OpenAI dependency and application behavior are unchanged.
- Replaced the direct OpenAI client with `posthog.ai.openai.OpenAI` in `main.py`, backed by a `Posthog` client configured from `POSTHOG_API_KEY` and `POSTHOG_HOST`.
- Registered `posthog.shutdown()` with `atexit` so this CLI flushes buffered observability events before it exits.
- Configured the local `.env` file with `POSTHOG_API_KEY` and `POSTHOG_HOST`. Credentials are read only from environment variables at runtime.
- Added a single process-run AI session ID. Each `answer()` invocation creates one trace ID shared by its query embedding and response generation. Startup corpus embeddings use one indexing trace in that same session.
- Attached the existing stable user identifier to model calls. The app registers no model tools, so no `$ai_span` capture was added; retrieval remains unchanged.
- Added `.posthog-wizard-cache/.posthog-ai.json` for the setup-report integration.

## Verification

The source has been checked against the documented execution path in `README.md`: one run should create one session containing two answer traces, each with an embedding followed by a generation. The SDK import and a live trace have not been run here because they require configured OpenAI credentials and would invoke the model.

To verify with valid OpenAI credentials, run:

```bash
python3 main.py
```

Then open **AI Observability → Traces** in PostHog and inspect the newest traces. Confirm that:

1. One AI session contains the corpus-indexing trace and both answer traces.
2. Each answer trace contains the question embedding and its response generation under the same trace ID.
3. All calls are attributed to the app's existing stable user ID.
4. No tool span appears, as the application does not register or dispatch tools.

## Privacy mode

Privacy mode is explicitly disabled at `main.py:15` with `privacy_mode=False`. Prompts and completion content are therefore captured by the wrapper, alongside model, token, cost, and latency metadata.

Before handling prompts or responses that must not be stored in PostHog, change that constructor setting to `privacy_mode=True`. For an individual sensitive OpenAI call, pass `posthog_privacy_mode=True` to that call instead. Privacy mode excludes SDK-captured `$ai_input` and `$ai_output_choices`; it does not remove arbitrary custom properties, manually captured payloads, or data already ingested.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for the current behavior and options.
