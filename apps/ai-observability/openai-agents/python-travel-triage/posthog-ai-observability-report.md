# PostHog AI Observability setup

## Status

**Wired, pending a live run.** This Python project uses the OpenAI Agents SDK, so it is instrumented with PostHog's `posthog.ai.openai_agents.instrument()` framework hook. This preserves the SDK's native agent, handoff, tool, and generation hierarchy; no OpenTelemetry or manual AI events were added.

## Changes made

- Declared `posthog~=8.0` in `pyproject.toml` alongside the existing `openai-agents` dependency.
- Added a module-level `Posthog` client and registered the OpenAI Agents tracing processor in `main.py`.
- Configured `POSTHOG_API_KEY` and `POSTHOG_HOST` in the local `.env` file; the application reads both values from environment variables rather than source code.
- Added `.env.example` with empty, non-secret variable names.
- Added `atexit` shutdown handling so the short-lived CLI can deliver queued observability data before it exits.
- Added `.posthog-wizard-cache/.posthog-ai.json` to record this integration.

## Trace structure

- **Session:** The app has no conversation identifier, so each execution creates one `travel-triage-<uuid>` session through `RunConfig(group_id=...)`.
- **Trace:** A `Runner.run_sync(...)` invocation is one turn and receives one trace from the OpenAI Agents SDK.
- **Spans and generations:** The framework hook automatically emits spans for the triage agent, handoff, booking agent, and `get_flight_price` tool, plus LLM generations.
- **Identity:** The sample has no user identifier at the call site, so AI events remain anonymous. No identity was invented.

## Verify with a live run

1. Install the dependencies using the project's normal Python environment workflow.
2. Ensure that environment exports include `POSTHOG_API_KEY`, `POSTHOG_HOST`, and the existing provider credential required by the OpenAI Agents SDK.
3. Run `python3 main.py`.
4. In PostHog, open **AI Observability → Traces** and inspect the newest trace. It should contain one session, one agent-run trace, the triage-to-booking handoff, tool span, and one or more generations.

Static review confirmed the SDK dependency, imports, tracing registration, session grouping, shutdown registration, and configured environment-variable names. The project has no build or test command, and the model run was intentionally not executed because it would call the provider; live ingestion therefore remains unverified until the above run completes.

## Privacy mode

- The effective setting is `privacy_mode=False` at `main.py:18` on the OpenAI Agents instrumentation hook. Prompt and completion content will be captured by default.
- Enable privacy mode before sending prompts or outputs that must not be stored in PostHog: change that argument to `privacy_mode=True` in `main.py`. This excludes SDK-captured `$ai_input` and `$ai_output_choices`; it does not remove arbitrary custom properties or historical events.
- See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for the behavior and controls.
