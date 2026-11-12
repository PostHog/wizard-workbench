# PostHog AI Observability setup

## Status

Wired, unverified. The OpenAI Agents SDK workflow is instrumented using PostHog's native `posthog.ai.openai_agents.instrument()` hook. It will capture the agent trace tree, including agent, handoff, tool, and generation spans without manual capture calls or OpenTelemetry instrumentation.

## Changes made

- Added `posthog<8` to `pyproject.toml` alongside the existing `openai-agents` dependency.
- Configured `POSTHOG_API_KEY` and `POSTHOG_HOST` in the local `.env` file using the supplied project configuration.
- Initialized an instance-based `Posthog` client in `main.py` with `enable_exception_autocapture=True`, and registered `shutdown()` with `atexit` so this CLI flushes queued data on exit.
- Registered the OpenAI Agents SDK integration through `instrument(...)` before any agents are constructed or run.
- Added a UUID-backed `RunConfig(group_id=...)` to `Runner.run_sync`. This sample has no persistent conversation ID, so each process invocation is treated as one AI Observability session. The app has no user ID at the run site, so traces remain anonymous rather than inventing a distinct ID.
- Wrote the wizard run record to `.posthog-wizard-cache/.posthog-ai.json`.

## Expected trace tree

Running the script produces one AI session containing one trace. That trace should include the `TriageAgent`, the handoff to `BookingAgent`, the LLM generations, and the `get_flight_price` tool span automatically emitted by the OpenAI Agents integration.

## Verify in PostHog

1. Install the dependencies from the project manifest in the runtime that will run the script.
2. Ensure `POSTHOG_API_KEY` and `POSTHOG_HOST` are available in that process environment. The script reads these environment variables directly; it does not load `.env` itself.
3. Provide the application's OpenAI credentials and run `python3 main.py`.
4. In PostHog, open **AI Observability → Traces** and inspect the newest trace. Confirm the expected session, a single trace for the run, the agent/handoff/tool hierarchy, and its generations.

No LLM request was made during setup, so delivery has not been confirmed. Also, the runner could not install the package into its temporary virtual environment; the dependency is declared in `pyproject.toml` for the project's normal installation workflow.

## Privacy mode

Privacy mode is explicitly off at `main.py` in the `instrument(..., privacy_mode=False)` call. Prompt and completion content will therefore be captured for SDK-emitted AI events. Before processing prompts or responses that should not be stored in PostHog, change that setting to `privacy_mode=True` before running the agents. Privacy mode removes `$ai_input` and `$ai_output_choices` from SDK-captured events; it does not retroactively remove previously captured data or arbitrary custom properties.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for the available controls.
