# PostHog AI Observability setup

## Integration

- Selected `ai-observability-anthropic-python` because `requirements.txt` uses the Anthropic Python SDK directly, without a higher-level agent framework.
- Added the `posthog` Python dependency in `requirements.txt`.
- Replaced the vendor client in `main.py` with `posthog.ai.anthropic.Anthropic`, backed by an instance-based `Posthog` client.
- Configured `POSTHOG_API_KEY` and `POSTHOG_HOST` in the local `.env` file using the supplied project configuration. No credentials are committed to source.

## Trace structure

`main.py` now creates one `$ai_session_id` for the process run and one `posthog_trace_id` per `ask()` invocation. Both Anthropic calls in a tool-using turn receive the same user ID, session ID, and trace ID.

When Claude calls `get_weather`, the existing dispatch is preserved and emits an `$ai_span` with the shared trace and session IDs, tool name, input/output state, and latency. The CLI explicitly shuts down the PostHog client before exit and also registers an `atexit` flush.

## Verification

The integration is wired and structurally reviewed, but it has not been exercised against Anthropic or verified in PostHog because this setup does not hold an Anthropic API key and the model call must not be triggered by the integration workflow.

To verify it:

1. Install the declared dependencies in your project environment.
2. Set `ANTHROPIC_API_KEY` in your local environment.
3. Run `python3 main.py`.
4. Open **AI Observability → Traces** for project 483112 and inspect the newest trace.

For a tool-using response, expect one process-run session containing one trace with two Anthropic generations and one `get_weather` span. All three items should be attributed to `user_123`. If Claude answers without invoking the tool, the trace correctly contains one generation and no tool span. Run a second `ask()` turn in the same process to confirm that it creates a new trace in the same session.

## Privacy mode

Privacy mode is currently **off** at `main.py:19` (`privacy_mode=False`), so SDK-captured prompt and completion content is included in AI Observability events. Before sending prompts or responses whose contents should not be stored in PostHog, change this setting to `privacy_mode=True` or pass `posthog_privacy_mode=True` to an individual Anthropic call. Privacy mode excludes `$ai_input` and `$ai_output_choices` from SDK-captured events; it does not remove arbitrary custom properties, manually captured payloads, or data already stored.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for details.
