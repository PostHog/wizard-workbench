# PostHog AI Observability setup

## Status

**Wired, unverified.** The application was not run because a real agent invocation requires provider credentials and would make an external model call. Static configuration and the local PostHog environment keys were verified.

## Integration selected

- **Workflow:** `ai-observability-openai-agents`
- **Reason:** `pyproject.toml` declares `openai-agents`, which is the framework responsible for the model calls. Framework instrumentation takes precedence over provider-level instrumentation.

## Changes made

- Added the `posthog` dependency to `pyproject.toml` alongside the existing OpenAI Agents SDK.
- Added `POSTHOG_API_KEY` and `POSTHOG_HOST` to the local `.env` file. The actual credentials are not included in this report.
- Added `.env.example` with empty entries for those two required keys.
- Initialized a `Posthog` client in `main.py` from environment variables and registered `shutdown()` with `atexit` so this short-lived CLI process flushes queued telemetry on exit.
- Registered `posthog.ai.openai_agents.instrument()`. This is the framework-native tracing hook; no OpenTelemetry instrumentor or manual AI events were added.
- Added a `RunConfig` with a new `group_id` for each invocation. Each execution is this application's conversation, so the generated ID becomes one `$ai_session_id` per process run.
- Wrote the required run record to `.posthog-wizard-cache/.posthog-ai.json`.

## Expected trace tree

Running one invocation of `main.py` should create one AI Observability session containing one agent-run trace. The OpenAI Agents SDK integration automatically captures the following hierarchy without changing the existing agents or tool:

- Triage agent span and LLM generation
- Handoff span to the booking agent
- Booking agent span and LLM generation
- `get_flight_price` tool span

The app has no authenticated user identifier at the call site, so the trace is intentionally anonymous; no distinct ID was invented.

## Verify with a real invocation

1. Ensure the runtime receives the PostHog variables configured in `.env` and the provider credentials required by the OpenAI Agents SDK.
2. Run the existing entry point: `python3 main.py`.
3. In PostHog, open **AI Observability → Traces** and inspect the newest trace.
4. Confirm that it has one session ID for the run and includes the two agents, their handoff, LLM generations, and the flight-price tool span.

Run the script a second time to confirm that the new process run appears in a separate session. The first run remains unverified until this trace is observed in PostHog.

## Privacy mode

Privacy mode is **off** in `main.py` at the `Posthog(..., privacy_mode=False)` configuration and the `instrument(..., privacy_mode=False)` registration. With this setting, the integration captures prompt and completion content in `$ai_input` and `$ai_output_choices`, in addition to model metadata, token use, cost, and latency.

Enable privacy mode before sending prompts or responses whose content should not be stored in PostHog. For this integration, change both `privacy_mode=False` values in `main.py` to `privacy_mode=True`. Privacy mode excludes SDK-captured AI inputs and output choices; it does not remove arbitrary custom properties or data previously captured.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for details.

## Static verification performed

- Confirmed `posthog` is declared in the Python project manifest.
- Confirmed the source imports `Posthog` and `instrument`, constructs the tracing client from environment variables, registers shutdown, and supplies a session group ID through `RunConfig`.
- Confirmed `POSTHOG_API_KEY` and `POSTHOG_HOST` are present in `.env` without reading or exposing their values.
- No project build, test, or package-manager script is defined. Per the workflow, dependencies were declared in the manifest rather than installing packages directly.
