# PostHog AI Observability setup

## Status

**Wired, awaiting a live run for delivery verification.** The project uses the OpenAI Agents SDK, so it is instrumented with PostHog's `posthog.ai.openai_agents.instrument()` tracing hook rather than OpenTelemetry or manual captures.

## Changes made

- Added the `posthog` Python SDK dependency in `pyproject.toml`; the existing `openai-agents` dependency was left unchanged.
- Configured a `Posthog` client in `main.py` using `POSTHOG_API_KEY` and `POSTHOG_HOST` environment variables, then registered the OpenAI Agents tracing processor.
- Registered the client shutdown handler with `atexit` so the CLI can flush buffered events on exit.
- Added `RunConfig(group_id=...)` to the single `Runner.run_sync()` call. Each process run receives one generated `travel-triage-...` group ID, which becomes the AI Observability session ID.
- Left user attribution anonymous because this CLI flow has no authenticated or otherwise stable user ID in scope. No identifier was invented.
- Left the existing triage agent, handoff, and `get_flight_price` tool unchanged. The OpenAI Agents hook automatically captures agent, handoff, tool, and generation spans.
- Configured `POSTHOG_API_KEY` and `POSTHOG_HOST` in the local `.env` file without placing them in source code.
- Recorded the integration at `.posthog-wizard-cache/.posthog-ai.json`.

## Expected trace shape

Running one request creates one AI session containing one trace. The trace should include the `TriageAgent`, the handoff to `BookingAgent`, the booking agent's generation(s), and the `get_flight_price` tool span. A second run creates a separate session because this CLI has no durable cross-run conversation identifier.

## Verify in PostHog

1. Install the declared project dependencies with the project's normal Python environment tooling and configure the required OpenAI credential.
2. Run `python3 main.py` from the project root.
3. Open **AI Observability → Traces** in PostHog and inspect the newest trace.
4. Confirm that the trace has one `travel-triage-...` session ID and contains the triage, handoff, booking, tool, and generation hierarchy.

No model call was run during setup, so event delivery and the resulting trace hierarchy remain to be confirmed with a real credentialed execution.

## Privacy mode

- **Effective setting:** `privacy_mode=False` in `main.py` on the `instrument(...)` call. Prompt and completion content are captured by the SDK in this mode.
- **When to change it:** Enable privacy mode before sending prompts or responses whose sensitive content must not be stored in PostHog.
- **How to change it:** Change that call to `instrument(client=posthog_client, privacy_mode=True)`.
- **Effect:** Privacy mode excludes the SDK-captured `$ai_input` and `$ai_output_choices` properties. It does not retroactively modify stored data or guarantee removal of arbitrary custom properties.
- **Reference:** [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).

## Dashboard scope

No dashboards were created or modified, as requested.
