# PostHog AI Observability setup

## Implementation

- Selected the `ai-observability-openai-agents` workflow because `pyproject.toml` declares the `openai-agents` framework.
- Added the `posthog` Python dependency without changing the existing OpenAI Agents SDK version.
- Initialized a `Posthog` client in `main.py` from `POSTHOG_API_KEY` and `POSTHOG_HOST`, enabled exception autocapture, and registered shutdown on process exit.
- Registered `posthog.ai.openai_agents.instrument()` so OpenAI Agents SDK runs emit the full agent trace hierarchy automatically: agent spans, handoffs, tool spans, and LLM generations.
- Added a fresh `RunConfig.group_id` for each process invocation. This maps one invocation of the travel triage script to one AI Observability session.
- The sample has no authenticated user identifier, so traces remain anonymous; no user identity was invented.
- Created `.env` with the supplied PostHog configuration and `.env.example` with empty variable names only. The local `.env` is already ignored by Git.
- Wrote `.posthog-wizard-cache/.posthog-ai.json` with `main.py` as the tracing entry point.

## Expected trace tree

Running the travel triage script produces one AI session for that process invocation. The triage agent should hand off to the booking agent, which invokes `get_flight_price`; PostHog should show the agent, handoff, tool, and generation spans in the same trace hierarchy.

## Verification

- Verified by source review: the PostHog dependency is declared, both environment keys are present locally, tracing is initialized before the agent run, and the run carries a session group ID.
- No project build, test, or package-management script is defined, so no runtime import or model call was run. Runtime delivery is therefore **wired, unverified**.

To validate with configured provider credentials, run:

```bash
python3 main.py
```

Then open **AI Observability → Traces** in PostHog Project 483112 and inspect the newest trace. Confirm the agent handoff and `get_flight_price` tool span are present. A second run will create a separate session because this demo has no persistent conversation identifier.

## Scope

No existing PostHog initialization, identify calls, event capture, or dashboards were modified.
