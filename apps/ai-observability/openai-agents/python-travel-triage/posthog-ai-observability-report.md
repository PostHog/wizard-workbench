# PostHog AI Observability setup

## Integration

- Selected `ai-observability-openai-agents`: this Python app uses the OpenAI Agents SDK (`openai-agents`), which owns the model calls, handoff, and tool execution tree.
- Added the `posthog` Python SDK to `pyproject.toml` and installed it in the local `.venv` alongside the manifest-declared agent runtime.
- Configured `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in `.env`; no token or host is embedded in source.
- `main.py` constructs `Posthog` from those runtime variables and registers `posthog.ai.openai_agents.instrument(...)`. This is the Agents SDK tracing hook, not OpenTelemetry instrumentation.
- The CLI shuts down the PostHog client in a `finally` block so buffered AI events flush before exit.

## Trace structure and attribution

`main()` creates one UUID-backed `travel-triage-*` session ID for its process run and supplies it through both `instrument(properties=...)` and `RunConfig(group_id=...)`. The agent SDK maps that group ID to `$ai_session_id`.

Each `Runner.run_sync(...)` call creates the agent SDK trace. PostHog automatically records the existing triage-agent and booking-agent spans, their handoff, model generations, and the `get_flight_price` tool span beneath that trace. The app has no authenticated user ID at the call site, so no distinct ID was invented; traces remain anonymous/personless.

## Verification

- Confirmed `posthog` is declared in `pyproject.toml` and installed in `.venv`.
- Confirmed the installed OpenAI Agents SDK exports `RunConfig`, used to pass the session group ID.
- Confirmed the configured environment variable keys are present in `.env`.
- This repository provides no build, test, lint, or typecheck command. No model call was made because it requires runtime provider credentials, so delivery is **wired but unverified in PostHog**.

To verify, make the PostHog variables available to the Python process (this script reads process environment and does not load `.env` itself), ensure the normal OpenAI provider credentials are configured, then run the CLI through its environment, for example `.venv/bin/python main.py`. In PostHog, open **AI Observability → Traces** and inspect the newest trace. It should contain one `$ai_session_id`, one root trace, agent and handoff spans, model generation spans, and a `get_flight_price` tool span.

## Privacy mode

Privacy mode is explicitly **off** at `main.py:42` (`privacy_mode=False`), so SDK-captured prompt and completion content is sent to PostHog. This follows the default for this new integration; no existing privacy setting was present to preserve.

Before handling prompts or completions that must not be stored in PostHog, change that argument to `privacy_mode=True` (or use the supported per-request `posthog_privacy_mode=True` control where applicable). Privacy mode excludes `$ai_input` and `$ai_output_choices` from SDK-captured events; it does not retroactively alter events already stored or guarantee removal of arbitrary custom properties. See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).
