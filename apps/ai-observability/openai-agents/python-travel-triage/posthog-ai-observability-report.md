# PostHog AI Observability setup

## Status

**Wired, unverified.** The project is configured to emit OpenAI Agents SDK traces to PostHog AI Observability. A live run was not made because it requires the application's OpenAI credentials and would invoke the model.

## Integration

- Selected **`ai-observability-openai-agents`** because `pyproject.toml` declares the `openai-agents` Python framework.
- Added the `posthog` Python dependency alongside the existing `openai-agents` dependency.
- Configured `POSTHOG_API_KEY` and `POSTHOG_HOST` in the local `.env` file using the supplied project settings; credentials are not embedded in source.
- Initialized `Posthog` in `main.py` from those environment variables and registered its shutdown handler for this CLI script.
- Registered `posthog.ai.openai_agents.instrument()`. This framework hook automatically records agent, generation, handoff, and function-tool spans; no manual spans or product analytics events were added.

## Trace structure and attribution

- Each execution creates one `travel-triage-<uuid>` OpenAI Agents `group_id`, which becomes the AI Observability session ID for that process run.
- The SDK produces the trace tree for the triage agent, handoff to `BookingAgent`, its LLM generations, and `get_flight_price` tool invocation.
- The sample has no authenticated user identifier at the call site, so no distinct ID was invented. These AI events remain anonymous until the application has a stable user ID to pass through `RunConfig.trace_metadata["posthog_distinct_id"]`.

## Verify

1. Ensure the project dependencies are installed and the application's OpenAI credentials are available in the runtime environment.
2. Run `python3 main.py`.
3. In PostHog, open **AI Observability → Traces** and inspect the newest trace. It should contain the triage-agent span, the handoff, the booking-agent generation(s), and the flight-price tool span under one session.
4. Run the script again to confirm a new process-run session is created. When the application later supports multiple turns in a single conversation, reuse one `group_id` for all those turns.

Static verification confirmed the Python imports, module-level instrumentation, session grouping, declared dependency, and configured environment-variable keys. Runtime delivery remains for the user to confirm after a real model call.

## Privacy mode

`main.py` sets `privacy_mode=False` on `instrument()`. This is the default observability setting and captures AI prompt input and completion output for SDK-captured events.

Before sending prompts or responses that must not be stored in PostHog, change that argument to `privacy_mode=True` in `main.py`. Privacy mode excludes `$ai_input` and `$ai_output_choices`; it does not retroactively delete existing events or promise to filter arbitrary custom properties. See the [AI Observability privacy mode documentation](https://posthog.com/docs/ai-observability/privacy-mode).

## Scope

No existing PostHog initialization, identity logic, event capture, or dashboards were modified.
