# PostHog AI Observability setup

## Status

**Wired, awaiting a real agent run for delivery verification.** The project uses the OpenAI Agents SDK, so it was integrated with the framework-native `posthog.ai.openai_agents.instrument()` processor rather than OpenTelemetry or manual generation captures.

## Changes made

- Added the `posthog` Python dependency to `pyproject.toml` without changing the existing `openai-agents` dependency.
- Initialized a `Posthog` client in `main.py` from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`, then registered the OpenAI Agents tracing processor.
- Enabled exception autocapture and registered `posthog.shutdown()` at process exit so the CLI can flush its buffered observability data.
- Added a `RunConfig.group_id` for the agent run. A new `travel-triage-<uuid>` value is created for each script-run conversation and becomes `$ai_session_id`.
- Created `.env` with the provided project configuration and `.env.example` with empty documented keys.
- Wrote the integration record to `.posthog-wizard-cache/.posthog-ai.json`.

## Trace behavior

The OpenAI Agents processor automatically captures the complete tree for one `Runner.run_sync()` turn:

- one AI session for the script-run conversation;
- one trace for the triage turn;
- agent spans for `TriageAgent` and `BookingAgent`;
- a handoff span;
- a tool span for `get_flight_price`; and
- generation events for the underlying model calls.

The fixture has no authenticated user identifier at the call site, so traces remain anonymous. No identifier was invented.

## Verify delivery

1. Ensure the project's Python dependencies are installed and configure the OpenAI credential required by the Agents SDK.
2. Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are available from `.env` in the environment that launches the script.
3. Run `python3 main.py` once.
4. Open **AI Observability → Traces** in PostHog and inspect the newest trace. It should contain the agent, handoff, generation, and flight-price tool hierarchy above.

Run the script again to create a separate script-run conversation. This fixture intentionally creates one AI session per invocation; it does not have a persistent multi-turn conversation identifier.

## Verification performed

Static verification confirmed that the manifest declares `posthog`, `main.py` imports and initializes the framework-native processor, the run provides `group_id`, and the client is registered for shutdown. The LLM call was not executed because that would require the project's external provider credentials; delivery to PostHog is therefore not yet runtime-verified.
