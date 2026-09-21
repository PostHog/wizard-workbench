# PostHog AI Observability setup

## Status

Wired, unverified against a live Anthropic request. The TypeScript build passes, but no request was sent because this workspace does not have `ANTHROPIC_API_KEY` configured.

## What changed

- Added `posthog-node` to the project dependencies.
- Configured `POSTHOG_API_KEY` and `POSTHOG_HOST` in `.env` using the provided PostHog project values.
- Added an environment-backed PostHog server client in `src/index.ts`, configured to flush immediately and shut down after the script completes.
- Instrumented each `Conversation.ask()` call as one AI trace with a new UUID trace ID.
- Used `threadId` as `$ai_session_id`, so both turns in the same conversation group into one AI session.
- Sent each Anthropic request as a `$ai_generation` event with model, provider, messages, response content, token counts, tool definitions, and latency.
- Captured each executed `get_weather` call as an `$ai_span` child of its originating generation; a follow-up generation becomes a child of that tool span.
- Added `.posthog-wizard-cache/.posthog-ai.json` for the integration handoff.

## Integration choice

The direct Anthropic Node workflow was initially selected because the app uses `@anthropic-ai/sdk`. Its wrapper package, `@posthog/ai`, requires an Anthropic SDK version in the range `>=0.112.3 <0.126.0`, while this project uses `^0.32.0`. To avoid upgrading the existing provider SDK, the integration uses the PostHog manual-capture workflow with `posthog-node`.

## Verification

- Passed: `npm run build` (`tsc --noEmit`).
- Not run: a live LLM request, because `ANTHROPIC_API_KEY` is not configured here.

## How to verify live capture

1. Provide `ANTHROPIC_API_KEY` in the environment used to run the script.
2. Run `npm run start`.
3. In PostHog, open **AI Observability > Traces** and inspect the newest trace.
4. Confirm the two questions share the `thread_abc` AI session, each question has its own trace, and a weather-tool turn shows a `get_weather` span between the two generations.

No existing PostHog initialization, identifies, captures, or dashboards were changed.
