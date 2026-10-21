# PostHog AI Observability setup

## Status

AI Observability is wired for the Anthropic Python SDK using the `posthog.ai.anthropic.Anthropic` wrapper. The integration is **wired, unverified**: no model request was made and the dependency installation is intentionally deferred to the project's normal build/install step.

## Changes made

- Added the `posthog` dependency in `requirements.txt` alongside the existing Anthropic SDK.
- Configured the real PostHog project token and ingestion host in the local `.env` file, without placing either value in source code.
- Added `.env.example` documenting the required empty `POSTHOG_API_KEY` and `POSTHOG_HOST` keys.
- Replaced the Anthropic client in `main.py` with the PostHog Anthropic wrapper and a `Posthog` client configured from `POSTHOG_API_KEY` and `POSTHOG_HOST`.
- Registered `posthog_client.shutdown` with `atexit` so buffered AI events flush when this CLI exits.
- Created one UUID session ID per program run, one UUID trace ID per `ask()` turn, and attached the existing stable user ID to both Anthropic calls.
- Captured the existing `get_weather` execution as an `$ai_span` in the same trace, without altering `weather.py` or the tool loop's behavior.
- Recorded the integration metadata in `.posthog-wizard-cache/.posthog-ai.json`.

## Expected trace tree

Running the existing CLI path creates one AI session for the process run. For a response that uses the weather tool, the trace should contain:

1. The initial Anthropic generation.
2. A `get_weather` span.
3. The follow-up Anthropic generation.

All three share the same trace ID and AI session ID. The existing `USER_ID` is used as the PostHog distinct ID. A response that does not invoke the tool produces a single-generation trace in that same session strategy.

## Verify

1. Install dependencies through the project workflow, for example: `pip3 install -r requirements.txt`.
2. Configure `ANTHROPIC_API_KEY` in your shell or local environment; it was not changed by this integration.
3. Run `python3 main.py`.
4. In PostHog, open **AI Observability → Traces** and inspect the newest trace. Confirm the expected trace tree above. Run the CLI again to confirm the new trace has its own process-run session.

The environment contains the required PostHog configuration keys. Source-level verification confirmed the wrapper client, per-turn trace ID, per-run session ID, user attribution, tool span, and exit flush are present. Runtime delivery has not been confirmed because this setup does not invoke the model or install packages itself.

## Privacy mode

`privacy_mode=False` is set on the `Posthog` client in `main.py`. This means SDK-captured prompt and completion content is included in AI Observability events by default.

Before sending prompts or responses that must not be stored in PostHog, change that constructor option to `privacy_mode=True`. You can also apply the supported Anthropic request-level `posthog_privacy_mode=True` control where only selected calls require it. Privacy mode excludes `$ai_input` and `$ai_output_choices` from SDK-captured events; it does not retroactively remove existing events or promise to remove unrelated custom properties.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).
