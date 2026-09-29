# PostHog AI Observability setup

## Integration

Configured the **OpenAI Agents SDK (Python)** integration because the project declares `openai-agents` in `pyproject.toml`. This framework-level integration is preferred over direct provider instrumentation because it preserves agent, handoff, tool, and generation structure.

Changes made:

- Declared the `posthog` Python SDK alongside the existing `openai-agents` dependency in `pyproject.toml`.
- Added `POSTHOG_API_KEY` and `POSTHOG_HOST` to the local `.env` using the supplied project configuration, and created `.env.example` with only blank key names for safe documentation.
- Initialized `Posthog` at module scope in `main.py` using environment variables, enabled exception autocapture, and registered `shutdown()` at process exit.
- Registered `posthog.ai.openai_agents.instrument()` so the Agents SDK automatically emits agent, handoff, tool, and LLM-generation traces.
- Passed a new UUID as `RunConfig.group_id` for each script invocation. This is the AI session identifier for the script run.
- Added `.posthog-wizard-cache/.posthog-ai.json` identifying `main.py` as the AI observability initialization file.

No existing product analytics initialization, identify calls, event captures, or dashboards were modified.

## Expected trace structure

Run `python3 main.py` in an environment that has both the configured PostHog variables and the OpenAI credentials required by the Agents SDK.

The travel triage execution should produce:

- One AI session for the script invocation, from `RunConfig.group_id`.
- One trace for the agent run.
- Agent spans for `TriageAgent` and `BookingAgent`.
- A handoff span from triage to booking.
- A tool span for `get_flight_price`.
- Generation events for the agent's LLM calls.

The sample application has no authenticated user identifier, so traces intentionally remain anonymous. No user identity was invented or attached.

Open **AI Observability → Traces** in PostHog after a run and inspect the newest trace. Run the script a second time to confirm it creates a separate script-run session.

## Verification

- `python3 -m compileall main.py` completed successfully.
- Confirmed `POSTHOG_API_KEY` and `POSTHOG_HOST` are configured in the local environment file without exposing their values in source.
- A direct runtime import check for `posthog.ai.openai_agents` could not be run in this environment because the command harness disallows `python3 -c` checks. The dependency is declared but was not installed here, following the integration workflow's instruction not to run a package manager. The integration is therefore **wired but not live-verified**; run the command above after installing project dependencies and inspect the resulting trace in PostHog.

## Privacy mode

Privacy mode is explicitly **off** at `main.py:18` through `instrument(client=posthog_client, privacy_mode=False)`. As a result, the SDK captures prompt and completion content in SDK-captured AI events, including `$ai_input` and `$ai_output_choices`.

Before sending prompts or responses that must not be stored in PostHog, change that call to `privacy_mode=True` (or use a supported per-request privacy setting where applicable). Privacy mode excludes `$ai_input` and `$ai_output_choices` from SDK-captured events; it does not retroactively alter stored events or automatically filter arbitrary custom properties.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for details.
