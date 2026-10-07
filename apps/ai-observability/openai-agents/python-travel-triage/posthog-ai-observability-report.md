# PostHog AI Observability setup

## Status

**Wired, awaiting a user-triggered verification run.** The OpenAI Agents SDK is now connected to PostHog AI Observability. No model request was made during setup.

## Integration selected

- **Variant:** `ai-observability-openai-agents`
- **Why:** `pyproject.toml` declares `openai-agents`, and `main.py` uses `Agent`, `Runner`, a handoff, and a `@function_tool`. The framework integration preserves the full agent trace hierarchy, unlike direct-provider instrumentation.
- **Dependency:** added `posthog` to `pyproject.toml`. The existing `openai-agents` dependency was preserved.

## What changed

- `main.py` creates a `Posthog` client from `POSTHOG_API_KEY` and `POSTHOG_HOST`, then registers `posthog.ai.openai_agents.instrument()`.
- The integration uses the real configured PostHog host and project key from `.env`; neither value is embedded in source.
- Every script invocation creates one unique process-run conversation ID through `RunConfig(group_id=...)`. It becomes the `$ai_session_id` for the run.
- The existing OpenAI Agents SDK trace supplies the trace and spans: agent execution, the triage-to-booking handoff, the `get_flight_price` tool, and model generations are captured automatically. No manual tool spans were added.
- The example has no authenticated user identifier. Events remain anonymous; no artificial distinct ID was introduced.
- The CLI registers an exit hook and also shuts PostHog down in `finally`, so buffered tracing data is flushed before the process exits.
- `.env.example` documents the required environment variable names without exposing credentials.

## Verify

1. Ensure the project dependencies and the existing LLM provider credentials are available in your environment.
2. Run the example with `python3 main.py`.
3. In PostHog, open **AI Observability → Traces** and inspect the newest trace.

For one invocation, expect:

- one `$ai_session_id` beginning with `travel-triage-`;
- one trace containing the triage agent, handoff, booking agent, model generation(s), and the `get_flight_price` tool span;
- anonymous attribution, because the example does not have a user ID.

Run a second turn within a real multi-turn application using the same conversation `group_id` to confirm that its traces are grouped into one AI session. This fixture creates a new session per process run by design.

## Privacy mode

Privacy mode is explicitly **off** at `main.py:22` via `privacy_mode=False`. Prompt inputs and completion outputs are therefore captured by the agent instrumentation, which is the default behavior for this new integration.

Before sending prompts or responses that must not be stored in PostHog, change that argument to `privacy_mode=True` before running agents. This excludes SDK-captured `$ai_input` and `$ai_output_choices`; it does not remove arbitrary custom properties or previously stored events. See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).

## Verification note

The project has no configured build or test command, and the workflow intentionally only declared the new dependency in the manifest. Static review confirms the SDK import, tracing registration, environment configuration, session grouping, and CLI shutdown path. A live trace remains to be verified after you run the script with valid LLM credentials.
