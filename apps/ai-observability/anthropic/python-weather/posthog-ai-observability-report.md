# PostHog AI Observability setup

## What changed

- Selected the `ai-observability-anthropic-python` workflow because `requirements.txt` uses the direct Anthropic Python SDK.
- Added the `posthog` Python dependency without changing the existing Anthropic dependency.
- Replaced the direct Anthropic client with `posthog.ai.anthropic.Anthropic`, backed by an instance-based `Posthog` client configured from `POSTHOG_API_KEY` and `POSTHOG_HOST`.
- Configured the supplied PostHog project values in `.env`; source code reads both values from environment variables.
- Registered `posthog_client.shutdown` with `atexit` so this CLI flushes captured events before it exits.
- Added one process-run AI session ID and one UUID trace ID per `ask()` turn. Both Claude calls in a tool-using turn share the same trace, distinct ID, and session ID.
- Added an `$ai_span` for the existing `get_weather` tool execution, including its trace/session IDs, inputs, output, and latency.
- Added `.posthog-wizard-cache/.posthog-ai.json` to record the Anthropic wrapper integration.

## Expected AI Observability tree

For a tool-using question, PostHog should show one session containing one trace with:

1. The first Claude generation (which requests `get_weather`)
2. The `get_weather` span
3. The follow-up Claude generation

All three entries are associated with the app's existing stable `USER_ID` and use the same turn trace ID. A second `ask()` call in the same process creates a new trace in the same session.

## Verification status

The wiring was verified by reviewing `main.py`, `requirements.txt`, and the configured environment-key names. No model request was sent and no dependency installation was run, as required by the selected workflow. Runtime delivery is therefore **wired, unverified**.

`ANTHROPIC_API_KEY` is not configured in `.env`, so it must be provided before running the script.

## How to verify delivery

1. Install the declared dependencies with `pip3 install -r requirements.txt` in this project's managed Python environment.
2. Set `ANTHROPIC_API_KEY` in your runtime environment (do not commit it).
3. Run `python3 main.py`.
4. Open PostHog AI Observability → Traces and inspect the newest trace. Confirm both Claude generations and the `get_weather` span are grouped in one trace and one session.

## Scope

No existing PostHog initialization, identify calls, product event capture, or dashboards were changed. No dashboard was created because this workflow is limited to AI Observability instrumentation.
