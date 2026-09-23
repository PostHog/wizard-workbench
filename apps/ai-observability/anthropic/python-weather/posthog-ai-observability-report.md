# PostHog AI Observability setup

## Status

**Wired, unverified.** The project now uses PostHog's Anthropic Python wrapper to send AI Observability data. No live Claude request was made because that requires the project's Anthropic credential.

## Integration

- Selected `ai-observability-anthropic-python`: `requirements.txt` contains the direct `anthropic` Python SDK and no higher-level framework.
- Added the `posthog` Python dependency without changing the existing Anthropic dependency.
- Replaced the raw `anthropic.Anthropic` client in `main.py` with `posthog.ai.anthropic.Anthropic`, backed by an instance-based `Posthog` client.
- Configured the wrapper through `POSTHOG_API_KEY` and `POSTHOG_HOST`; no PostHog credential or host is hard-coded in application source.
- Registered `posthog_client.shutdown` with `atexit` so this short-lived CLI flushes buffered events before it exits.

## Trace structure

For each `ask()` invocation:

- One process-level UUID is used as `$ai_session_id`.
- One fresh UUID is used as `posthog_trace_id` for the complete question turn.
- Both Anthropic calls receive the same session, trace, and existing `user_123` distinct ID.
- The existing `get_weather` dispatch records an `$ai_span` with the same trace and session IDs, including its duration, input, and output.

A tool-using request should therefore appear as one trace containing:

1. Claude generation requesting `get_weather`
2. `get_weather` span
3. Claude follow-up generation

## Configuration

The supplied PostHog project values were saved in the local `.env` file as `POSTHOG_API_KEY` and `POSTHOG_HOST`. The application reads those variables from its process environment, so ensure the environment is loaded before running the script. Set `ANTHROPIC_API_KEY` separately with a valid Anthropic key.

## Verification

Static verification completed:

- The wrapper, PostHog client initialization, per-turn trace ID, session ID, tool span, and shutdown hook are all present in `main.py`.
- The required PostHog environment keys are configured in `.env`.
- This small Python project defines no build, typecheck, or test script, and the vendor call was intentionally not invoked.

To verify delivery after installing the dependencies in the project's virtual environment and loading the environment variables, run:

```bash
python3 main.py
```

Then open **AI Observability → Traces** in PostHog and inspect the newest trace. Confirm it has the two generations and one `get_weather` span described above, all assigned to one trace and one session. Run a second `ask()` call in the same process to confirm it joins the same AI session while receiving a different trace ID.

No existing PostHog analytics initialization, identify calls, product events, or dashboards were changed.
