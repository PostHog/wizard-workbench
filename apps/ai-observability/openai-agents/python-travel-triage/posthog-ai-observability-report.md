# PostHog AI Observability setup

## Status

**Wired, awaiting a live run.** The implementation is configured for the OpenAI Agents SDK, but no model call was made during setup because provider credentials and a user-triggered test are required to validate the emitted trace.

## What changed

- Selected the `ai-observability-openai-agents` workflow because `pyproject.toml` declares `openai-agents`.
- Declared the `posthog` Python SDK in `pyproject.toml` alongside the existing agent dependency.
- Added `POSTHOG_API_KEY` and `POSTHOG_HOST` to the local `.env`; both are present there. The committed `.env.example` documents the same variable names with empty values.
- Initialized `Posthog` in `main.py` from those environment variables and registered the OpenAI Agents tracing processor with `instrument(..., privacy_mode=False)`.
- Configured each script invocation as one AI Observability session using a generated `RunConfig.group_id`. The app has no user identifier, so traces remain anonymous rather than inventing attribution.
- Kept the existing triage agent, booking handoff, and flight-price tool unchanged. The OpenAI Agents integration automatically captures the agent, handoff, tool, and generation span hierarchy.
- Added `posthog.shutdown()` in the CLI's `finally` block so queued observability events flush before the process exits.
- Wrote `.posthog-wizard-cache/.posthog-ai.json` for the setup-report workflow.

## Verify a trace

1. Install the declared dependencies using the project's normal Python environment workflow, and ensure the runtime has both PostHog variables plus the provider credentials required by the OpenAI Agents SDK.
2. Run `python3 main.py`.
3. In PostHog, open **AI Observability → Traces** and inspect the newest trace.
4. Confirm the trace includes the triage-agent span, a handoff to the booking agent, the flight-price tool span, and model-generation entries. A second turn within the same process would share the same generated AI session ID; each new script invocation creates a new session.

## Expected data shape

- **Session:** one generated AI session ID for a process run.
- **Trace:** the full `Runner.run_sync` turn, including all agent work.
- **Spans:** triage agent, handoff, booking agent, and the registered flight-price tool.
- **Attribution:** anonymous, because this application does not expose a user ID at the call site.

## Privacy mode

Privacy mode is explicitly **off** at `main.py` in the `instrument(client=posthog, privacy_mode=False)` call. Prompt and completion content will therefore be captured for AI Observability.

Before handling prompts or responses that should not be stored in PostHog, change that argument to `privacy_mode=True` before the agent run. This excludes SDK-captured `$ai_input` and `$ai_output_choices`; it does not remove other custom properties or alter events already ingested.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).

## Verification performed

- Confirmed the `posthog` dependency is declared in the manifest.
- Confirmed `main.py` initializes the PostHog client from environment variables, registers OpenAI Agents instrumentation, supplies a session group ID, and shuts down before CLI exit.
- Confirmed the local `.env` contains both required configuration keys without reading their values, and `.env` is excluded by `.gitignore`.
- No build script or configured virtual environment is present, so no package-install or runtime import command was run. No live model request was made.
