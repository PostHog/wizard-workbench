# PostHog AI Observability setup

## Status

Anthropic calls are wired to PostHog AI Observability, but the integration is **unverified against a live model call**. A valid `ANTHROPIC_API_KEY` is still required to trigger the CLI flow.

## What changed

- Added the `posthog` Python dependency alongside the existing Anthropic SDK in `requirements.txt`.
- Added `POSTHOG_API_KEY` and `POSTHOG_HOST` to the local `.env` using the supplied project connection values, and documented all required variables in `.env.example` without credentials.
- Replaced the direct `anthropic.Anthropic` client in `main.py` with `posthog.ai.anthropic.Anthropic`, backed by an instance-based `Posthog` client.
- Configured the client exclusively from `POSTHOG_API_KEY` and `POSTHOG_HOST`; no token or host is embedded in source code.
- Created one AI session for each CLI process run and one UUID trace for each `ask()` turn. Both Anthropic calls in a tool-assisted turn receive the same trace ID, the session ID, and the existing stable user ID.
- Captured the `get_weather` execution as an `$ai_span` in the same trace, including its duration and tool input/output state.
- Registered a shutdown handler and explicitly shuts down the PostHog client on CLI exit so buffered events are flushed.

## Verify with a live turn

1. Install the declared dependencies with `pip3 install -r requirements.txt`.
2. Configure `ANTHROPIC_API_KEY` in the environment. Ensure the configured `POSTHOG_API_KEY` and `POSTHOG_HOST` values from `.env` are exported or otherwise made available to the process.
3. Run `python3 main.py`.
4. In PostHog, open **AI Observability → Traces** and inspect the newest trace.

For the weather query, expect one `weather-cli-*` session containing one trace with the following tree:

```text
generation (Claude tool request)
├─ span: get_weather
└─ generation (Claude final response)
```

A later call made in the same CLI process shares the same AI session while receiving a new trace ID. All events are attributed to the existing `user_123` distinct ID.

## Verification performed

Static verification confirmed that `main.py` imports the PostHog Anthropic wrapper, initializes it with environment-backed configuration, passes identical PostHog context to both generation calls, captures the tool span with the same trace/session IDs, and shuts down on exit. The model was not called because no Anthropic credential is configured, and dependencies were declared rather than installed by this setup flow.

## Privacy mode

Privacy mode is explicitly **off** at `main.py:18` (`privacy_mode=False`), so SDK-captured prompt content and completion content are sent as `$ai_input` and `$ai_output_choices`. This matches the default observability behavior.

Enable privacy mode before sending prompts or responses whose sensitive content should not be stored in PostHog. Change the PostHog client construction in `main.py` to `privacy_mode=True`, or use the supported per-request `posthog_privacy_mode=True` parameter. Privacy mode excludes SDK-captured `$ai_input` and `$ai_output_choices`; it does not remove arbitrary custom properties, manually captured payloads, or previously stored events.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for details.
