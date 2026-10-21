# PostHog AI Observability setup

## Status

**Wired, awaiting runtime verification.** The project now uses the OpenAI Python wrapper from the PostHog SDK. No model call was made during setup.

## Selected integration

- **Variant:** `ai-observability-openai-python`
- **Reason:** `requirements.txt` declares the modern OpenAI Python SDK (`openai>=1.60.0`) and the application makes direct `chat.completions.create` calls.
- **Added dependency:** `posthog` in `requirements.txt`. The selected workflow declares dependencies only; install the requirements in the project environment before running the script.

## What changed

- `main.py` now constructs `Posthog` using `POSTHOG_API_KEY` and `POSTHOG_HOST`, then supplies it to `posthog.ai.openai.OpenAI`.
- Each `Conversation` uses its `thread_id` as `$ai_session_id`.
- Each `ask()` invocation creates one trace ID and passes it to every model call within that turn.
- The existing user identifier is passed as `posthog_distinct_id`.
- The existing weather-tool dispatch emits an `$ai_span` using the same trace and session IDs.
- `atexit` registers `posthog_client.shutdown`, allowing this CLI to flush queued events on exit.
- `.env` contains the configured PostHog values locally; `.env.example` documents the two required keys and `.gitignore` excludes `.env`.
- `.posthog-wizard-cache/.posthog-ai.json` records the chosen provider and wrapper construction file.

## Expected trace tree

A two-turn CLI run should create one AI session containing two traces. A turn that uses the weather tool should contain:

1. An OpenAI generation
2. A `get_weather` span
3. A follow-up OpenAI generation

The two generations and the tool span share the turn trace ID. Both turns share the conversation session ID.

## Verify

1. Install the declared requirements in the project environment.
2. Ensure `OPENAI_API_KEY`, `POSTHOG_API_KEY`, and `POSTHOG_HOST` are exported into the process environment. The script reads them directly; a `.env` file must be loaded by your shell or process runner.
3. Run `python3 main.py`.
4. In [AI Observability Traces](https://app.posthog.com/ai-observability/traces), open the newest trace and confirm the expected generation → tool span → generation tree. Run the second question in the same process to confirm both traces belong to one session.

This repository contains no build, test, or type-check script, so verification was static only. The integration is not marked runtime-verified until a configured environment runs the script and the trace arrives.

## Privacy mode

`privacy_mode=False` is set in `main.py` on the `Posthog` constructor. This is the effective default for this setup: prompt inputs and model completion content captured by the wrapper are sent to PostHog.

Enable privacy mode before sending prompts or responses whose sensitive content must not be stored in PostHog. Change the constructor to `privacy_mode=True`, or use the supported per-request `posthog_privacy_mode=True` override. Privacy mode excludes `$ai_input` and `$ai_output_choices` from SDK-captured events; it does not promise to remove arbitrary custom properties, manually captured payloads, or data already stored.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for details.
