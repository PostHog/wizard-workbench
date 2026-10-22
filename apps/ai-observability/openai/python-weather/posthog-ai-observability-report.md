# PostHog AI Observability setup

## Status

Wired for OpenAI Python and **runtime-unverified**. The project has no defined build or test command, and the model was intentionally not invoked because that would require an external provider credential and produce a real generation.

## What changed

- Added the `posthog` Python dependency to `requirements.txt`; the existing `openai>=1.60.0` SDK remains unchanged.
- Created local `POSTHOG_API_KEY` and `POSTHOG_HOST` environment settings in `.env`. The application reads both values from its environment; no PostHog credential or ingestion host is embedded in source.
- Replaced the direct OpenAI client in `main.py` with `posthog.ai.openai.OpenAI`, backed by an instance-based `Posthog` client.
- Added explicit shutdown handling for the CLI so queued AI events are flushed before process exit.
- Added `.posthog-wizard-cache/.posthog-ai.json` for the setup workflow.

## Trace structure

The instrumentation retains the application’s existing scopes:

- **AI session:** `Conversation.thread_id`, shared across the conversation.
- **Trace:** one fresh UUID per `Conversation.ask()` turn.
- **Generations:** every OpenAI completion call receives the same turn trace ID, the conversation session ID, and the existing stable user ID.
- **Tool span:** the existing weather-tool execution emits one `$ai_span`, carrying the same trace and session IDs plus its elapsed time.

A turn that calls the tool should appear as two generations and one tool span in one trace. The two turns in the script should appear under one AI session.

## How to verify

1. Ensure the runtime has the configured PostHog variables and a valid `OPENAI_API_KEY`.
2. Install the declared dependencies in your normal Python environment.
3. Run `python3 main.py`.
4. In PostHog, open **AI Observability → Traces** and inspect the newest entries.

Check that both turns share one session, each `ask()` call has its own trace, the tool-using turn contains two generations plus the `get_weather` span, and events are attributed to the application’s existing user ID.

## Privacy mode

`main.py:20` sets `privacy_mode=False` on the `Posthog` client, so SDK-captured prompt and completion content is sent to AI Observability. There are no request-level privacy overrides.

Before handling prompts or responses that must not be stored in PostHog, change that constructor option to `privacy_mode=True`, or add `posthog_privacy_mode=True` to the affected OpenAI request. Privacy mode excludes `$ai_input` and `$ai_output_choices` from SDK-captured events; it does not retroactively remove data already sent or automatically redact arbitrary custom properties.

Read more: [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).
