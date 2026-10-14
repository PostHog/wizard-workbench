# PostHog AI Observability setup

## Status

AI Observability is wired for the direct OpenAI Python SDK path and is **statically verified, but not live-verified**. I did not make an LLM request because that requires your OpenAI credential.

## What changed

- Added `posthog>=7.0.0` to `requirements.txt` alongside the existing modern `openai>=1.60.0` client.
- Added `POSTHOG_API_KEY` and `POSTHOG_HOST` to the local `.env` file using the supplied project configuration. Their names are documented without values in `.env.example`.
- Replaced the vendor client construction in `main.py` with `posthog.ai.openai.OpenAI`, backed by a `Posthog` client.
- Registered `posthog_client.shutdown` with `atexit` and explicitly shuts it down for this short-lived CLI, so queued observations flush before exit.

## Trace structure

The instrumentation preserves the app's existing boundaries:

- **Session:** `Conversation.thread_id` becomes `$ai_session_id`, so both questions in one conversation stay together.
- **Trace:** each `Conversation.ask()` call creates one UUID `posthog_trace_id`; every OpenAI generation in that turn receives the same value.
- **Person:** the existing stable `Conversation.user_id` is passed as `posthog_distinct_id`.
- **Generations:** the wrapper records each existing `chat.completions.create()` call.
- **Tool span:** the existing `get_weather` dispatch records a `$ai_span` with the same trace and session IDs, its name, input/output state, and elapsed time. The tool loop and message-object append were otherwise left intact.

## Verify delivery

The project has no defined build, test, or type-check script, so verification was limited to reviewing the final imports, dependency declaration, environment-key presence, per-turn trace reuse, tool-span correlation, and CLI shutdown handling.

To perform a live check, create (if needed) and use a project-local virtual environment, make `OPENAI_API_KEY` available, load the local `.env` values into your shell, then run:

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
set -a
. ./.env
set +a
export OPENAI_API_KEY="your-openai-api-key"
.venv/bin/python main.py
```

The included script sends two turns in the same `thread_abc` conversation. In **AI Observability → Traces**, inspect the newest traces. The expected result is one AI session containing two traces for `user_123`; a turn that calls the weather tool should show `generation → get_weather span → generation`, with both generations and the span sharing one trace ID.

## Privacy mode

`privacy_mode=False` is set on the `Posthog` client in `main.py` (line 18), with no request-level privacy override. This is the default behavior: SDK-captured prompts and completion choices are included in AI Observability.

Before sending prompts or responses whose sensitive content must not be stored in PostHog, change that initialization argument to `privacy_mode=True`, or use the supported per-call `posthog_privacy_mode=True` override. Privacy mode excludes SDK-captured `$ai_input` and `$ai_output_choices`; it does not remove arbitrary custom properties, manually captured payloads, or data already stored. Review [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) before changing the setting.

## Scope

No product-analytics initialization, identity calls, custom product events, or dashboards were changed or created.
