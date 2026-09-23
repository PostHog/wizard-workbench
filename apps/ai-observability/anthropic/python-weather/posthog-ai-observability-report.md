# PostHog AI Observability setup

## Status

**Wired, awaiting a live verification run.** This project uses the direct Anthropic Python SDK, so it was instrumented with the `ai-observability-anthropic-python` wrapper workflow. No existing analytics initialization, identity logic, capture calls, or dashboards were changed.

## Changes made

- Added the `posthog` dependency in `requirements.txt` alongside the existing Anthropic SDK.
- Added `POSTHOG_API_KEY` and `POSTHOG_HOST` to the local `.env` using the configured project values, and documented empty counterparts in `.env.example`.
- Replaced the direct `anthropic.Anthropic` client in `main.py` with PostHog's `Anthropic` wrapper backed by an instance-based `Posthog` client.
- Configured the wrapper client from environment variables and registered `posthog_client.shutdown` with `atexit`; the CLI also explicitly shuts it down before exit so buffered events are sent.
- Added one process-run AI session ID and one UUID trace ID per `ask()` turn. Both Anthropic calls in a tool-enabled turn receive the same trace ID, the session ID, and the existing stable user ID.
- Added a `$ai_span` capture immediately around the existing `get_weather` dispatch. It shares the turn trace and session IDs, includes the tool input/output and latency, and does not alter `weather.py` or the tool loop structure.
- Recorded the integration metadata in `.posthog-wizard-cache/.posthog-ai.json`.

## Expected data shape

Running one weather question that invokes the tool should produce:

```text
process run ($ai_session_id)
└─ ask() turn (posthog_trace_id)
   ├─ Anthropic generation
   ├─ get_weather $ai_span
   └─ Anthropic generation
```

Both generations and the tool span are attributed to the application’s existing `user_123` distinct ID. A second `ask()` call in the same process produces a new trace under the same AI session.

## Verify

The workflow intentionally declares dependencies rather than installing them. After dependencies are installed and a valid `ANTHROPIC_API_KEY` is available, load the local PostHog environment and run the script:

```bash
set -a
source .env
set +a
python3 main.py
```

Then open **AI Observability → Traces** for this PostHog project and inspect the newest trace. Confirm it has two generations with `get_weather` between them, that all three entries share one trace ID and one session ID, and that the person is `user_123`. Run a second turn in the same process to confirm it groups under the same session.

The source wiring and environment-variable presence were reviewed. A live model call was not made because it requires the project’s Anthropic credential; therefore delivery to PostHog remains to be confirmed by the verification run above.

## Privacy mode

`privacy_mode=False` is set on the `Posthog` client in `main.py` (line 19). This is the default behavior for the new integration and means SDK-captured prompt and completion content is included in AI Observability events. No per-request privacy overrides are set.

Before sending prompts or responses whose sensitive content must not be stored in PostHog, change that setting to `privacy_mode=True`, or add `posthog_privacy_mode=True` to the relevant `client.messages.create()` request. Privacy mode excludes `$ai_input` and `$ai_output_choices` from SDK-captured events; it does not remove arbitrary custom properties, manually captured payloads, or events stored previously.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for details.
