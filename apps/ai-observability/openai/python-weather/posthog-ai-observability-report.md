# PostHog AI Observability setup

## Integration

- Selected `ai-observability-openai-python` because `requirements.txt` declares the modern OpenAI Python SDK (`openai>=1.60.0`) and the application calls `chat.completions.create` directly.
- Added `posthog>=7.0.0` to `requirements.txt`.
- Configured `POSTHOG_API_KEY` and `POSTHOG_HOST` in the local `.env` using the supplied project configuration. No credentials were written to source files.
- Replaced the OpenAI client in `main.py` with PostHog's `posthog.ai.openai.OpenAI` wrapper, backed by an instance-based `Posthog` client.
- Added `atexit` and CLI-finally shutdown handling so buffered observability events are flushed before the script exits.

## Trace structure

`Conversation.thread_id` is sent as `$ai_session_id`, so both example turns belong to one AI Observability session. Each `Conversation.ask()` creates one UUID trace ID and passes it to both model calls in a tool-using turn. The existing `user_id` is sent as the stable `posthog_distinct_id`.

The existing `get_weather` invocation now emits one `$ai_span` with the same trace and session IDs, timing, input state, and output state. Consequently, a tool-using turn should appear as:

1. Initial OpenAI generation
2. `get_weather` span
3. Follow-up OpenAI generation

No dashboard changes were made; dashboards are outside this AI Observability setup scope.

## Verification status

Static verification completed:

- The wrapper client and PostHog client are initialized in `main.py`.
- Both OpenAI calls carry a shared `posthog_trace_id`, `posthog_distinct_id`, and `$ai_session_id`.
- The tool span uses that same trace and session.
- The PostHog environment variables are present in `.env`.

Runtime delivery remains **wired, unverified**. This project has no build, test, or typecheck script, and `OPENAI_API_KEY` is not configured locally, so no model request was made.

To verify delivery after configuring `OPENAI_API_KEY`, run:

```bash
python3 main.py
```

Then open **AI Observability → Traces** in PostHog Project 483112. Confirm that the two questions share the `thread_abc` session and that each tool-using turn contains two generations around one `get_weather` span.

## Privacy mode

Privacy mode is explicitly **off** in `main.py` via `privacy_mode=False`, so the SDK captures prompt and completion content for wrapped OpenAI calls. Enable `privacy_mode=True` on the `Posthog` constructor before sending content that must not be stored in PostHog. This excludes SDK-captured `$ai_input` and `$ai_output_choices`; it does not remove arbitrary custom properties, manually captured payloads, or events already stored.

For a single sensitive OpenAI request, the wrapper also supports `posthog_privacy_mode=True` at the call site. See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).
