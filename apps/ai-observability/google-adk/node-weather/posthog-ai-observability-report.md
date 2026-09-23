# PostHog AI Observability setup

## Status

Wired and build-verified. Live delivery is unverified because no model invocation was run during setup.

## Integration

- Selected the **Google ADK (Node)** workflow because `@google/adk` is the application framework that executes the model calls.
- Installed `@posthog/ai` and `posthog-node`.
- Added a `PostHog` client in `src/index.ts`, reading `POSTHOG_API_KEY` and `POSTHOG_HOST` from the environment. No PostHog token or host is embedded in source.
- Registered `PostHogADKPlugin` on the existing ADK `Runner`.
- Preserved the existing application hierarchy:
  - `thread_abc` (`sessionId`) becomes the shared `$ai_session_id`.
  - Each `ask()` invocation becomes one trace.
  - `user_123` (`userId`) is used as the distinct ID by the plugin.
  - The ADK callbacks record agent and `get_weather` tool spans, plus the underlying model generations; no duplicate manual spans were added.
- Added `await posthog.shutdown()` in a `finally` block so this short-lived script flushes queued observability events on success or failure.
- Stored the supplied PostHog public token and host in `.env` as `POSTHOG_API_KEY` and `POSTHOG_HOST`.

## Verification

- Passed: `npm run build` (`tsc --noEmit`).
- Not run: a live model call. The setup does not hold or use provider credentials.

## Validate in PostHog

1. Ensure the Google model-provider credentials required by the existing ADK application are configured.
2. Run `npm run start`.
3. Open **AI Observability → Traces** in PostHog and inspect the latest traces.
4. Confirm two traces appear in the same `thread_abc` session. Each should show an agent span, model generations, and a `get_weather` tool span, attributed to `user_123`.

## Run record

The machine-readable integration record is at `.posthog-wizard-cache/.posthog-ai.json`.
