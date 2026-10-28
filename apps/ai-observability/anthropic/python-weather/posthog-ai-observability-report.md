# PostHog AI Observability setup

## Status

AI Observability is wired for the Anthropic Python SDK and is ready for a user-triggered verification. The project now uses the `posthog.ai.anthropic.Anthropic` wrapper; no dashboard or existing product-analytics instrumentation was changed.

## What changed

- Added `posthog>=7.70.0` to `requirements.txt` and installed the declared dependencies in `.venv`.
- Added a `Posthog` client in `main.py`, configured from `POSTHOG_API_KEY` and `POSTHOG_HOST` environment variables. The client is registered for shutdown at process exit so buffered events are flushed.
- Replaced the direct Anthropic client constructor with PostHog's Anthropic wrapper.
- Added one AI session ID per CLI process and one trace ID per `ask()` turn.
- Attached the existing stable user ID, shared trace ID, and AI session ID to both model calls in a tool-using turn.
- Captured the existing `get_weather` execution as an `$ai_span` in the same trace, including its latency and input/output state.
- Added `.posthog-wizard-cache/.posthog-ai.json` to record the Anthropic wrapper integration location.

## Trace structure

For a weather request that invokes the tool, the newest AI Observability trace should contain:

1. One `$ai_generation` for the first Anthropic request.
2. One `$ai_span` named `get_weather`.
3. One `$ai_generation` for the follow-up Anthropic request.

All three items share the same trace ID. The process-run session ID groups the trace in AI Observability Sessions, and the existing stable user ID attributes it to the existing user.

## Environment configuration

The local `.env` file now contains the PostHog project token and ingestion host under:

- `POSTHOG_API_KEY`
- `POSTHOG_HOST`

No token or host is embedded in source code. Provide the existing `ANTHROPIC_API_KEY` in the runtime environment before running the assistant.

## Verification

The updated Python modules compile successfully with the project virtual environment. A real model call was intentionally not made during setup.

To verify delivery, run the CLI with the Anthropic credential available and the local environment loaded, for example:

```bash
set -a
. .env
set +a
.venv/bin/python main.py
```

Then open **AI Observability → Traces** in PostHog and inspect the newest trace. Confirm the generation → `get_weather` span → generation tree, shared trace ID, session grouping, and user attribution described above. If the model does not choose the tool for a particular prompt, the trace correctly contains only its one generation.

## Privacy mode

Privacy mode is explicitly **off** in `main.py:19` (`privacy_mode=False`). As a result, PostHog captures prompts, model completions, and the tool span's input/output state for AI Observability.

Before sending prompts or responses whose sensitive content must not be stored in PostHog, change that client setting to `privacy_mode=True`, or set `posthog_privacy_mode=True` on an individual `client.messages.create()` call. Privacy mode excludes SDK-captured `$ai_input` and `$ai_output_choices`; it does not remove arbitrary custom properties, manually captured payloads, or data already stored. See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).
