# PostHog AI Observability setup

## Status

**Wired, unverified.** The project now uses the PostHog OpenAI Python wrapper, but no live model call was made because the local OpenAI credential is not configured.

## Integration selected

- **Variant:** `ai-observability-openai-python`
- **Reason:** `requirements.txt` declares the modern OpenAI Python SDK (`openai>=1.60.0`) and the application calls `client.chat.completions.create` directly. It does not use a framework or an OpenAI-compatible gateway.

## Changes made

- Added `posthog>=7.0.0` to `requirements.txt` without changing the existing OpenAI dependency.
- Replaced the direct OpenAI client in `main.py` with `posthog.ai.openai.OpenAI`, backed by an instance-based `Posthog` client.
- Configured the client from `POSTHOG_API_KEY` and `POSTHOG_HOST`; neither value is embedded in source code.
- Added the supplied PostHog project configuration to the local `.env` file.
- Registered `posthog.shutdown` with `atexit` so this command-line program flushes its buffered AI events before it exits.
- Added one UUID trace ID per `Conversation.ask()` call. Both generation calls in a tool-using turn share that trace ID.
- Attached `Conversation.thread_id` as `$ai_session_id`, grouping the two questions in the script into one AI session.
- Attached the conversation's stable user ID as `posthog_distinct_id`.
- Captured the existing `get_weather` tool execution as an `$ai_span` on the same trace. The existing message handling and tool implementation were preserved.
- Wrote the AI setup cache record to `.posthog-wizard-cache/.posthog-ai.json`.

## Expected trace structure

Running the provided script produces one AI session for the conversation. Each question produces one trace. A question that invokes the tool should contain:

1. An initial OpenAI generation
2. A `get_weather` span
3. A follow-up OpenAI generation

Both traces should be attributed to the conversation's user ID and grouped under the same session ID.

## Verification

This fixture has no build, type-check, lint, or test script, so verification was limited to reviewing the final dependency declaration and the wrapper setup in `main.py`. Dependencies were declared but not installed, following the integration workflow.

To verify delivery:

1. Install the declared dependencies in the project's normal Python environment.
2. Set `OPENAI_API_KEY` in that environment and ensure the values in `.env` are exported or otherwise loaded.
3. Run `python3 main.py`.
4. In PostHog, open **AI Observability → Traces** and inspect the newest trace. Run the second question in the same process to confirm both traces share one session.

Check that the trace has the generation → tool span → generation shape described above. If each generation appears as its own trace, check that both calls retain the same `posthog_trace_id` for one `ask()` invocation.

## Privacy mode

Privacy mode is **off** through `privacy_mode=False` in `main.py:18`. This captures prompt and completion content in SDK-captured AI events, as well as the normal model, token, latency, and cost metadata.

Enable privacy mode before sending prompts or responses whose sensitive content must not be stored in PostHog. Change that client option to `privacy_mode=True`; for an individual request, pass `posthog_privacy_mode=True` to the OpenAI wrapper call. Privacy mode excludes `$ai_input` and `$ai_output_choices` from SDK-captured events, but does not remove previously stored events or arbitrary custom properties.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).
