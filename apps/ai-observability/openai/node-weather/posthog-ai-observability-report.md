# PostHog AI Observability setup

## Status

AI Observability is wired for the project’s direct OpenAI Node SDK calls. The TypeScript build passes; no live model request was made, so delivery to PostHog remains to be verified with a configured OpenAI key.

## Changes made

- Added `@posthog/ai` and `posthog-node` alongside the existing OpenAI SDK, without changing the OpenAI version.
- Configured `POSTHOG_API_KEY` and `POSTHOG_HOST` in the local `.env` file using the supplied PostHog project configuration.
- Replaced the runtime OpenAI client with PostHog’s OpenAI wrapper whenever PostHog configuration is present. Production without configuration safely falls back to the original OpenAI client; development fails clearly to prevent silently missed observability events.
- Added a single AI session ID for the process run and a new trace ID for each `ask` turn. Both OpenAI completions in the tool-use turn share that trace ID.
- Attached the existing stable user ID as the PostHog distinct ID.
- Captured the `get_weather` execution as a linked `$ai_span`, including its input, output, name, and latency.
- Shuts down the PostHog client when the CLI run finishes so queued telemetry is flushed.

## Verification

`npm run build` completed successfully (`tsc --noEmit`).

To validate delivery, run the app with `OPENAI_API_KEY`, `POSTHOG_API_KEY`, and `POSTHOG_HOST` available in the process environment:

```bash
npm run start
```

Then open **AI Observability → Traces** in PostHog and inspect the newest trace. A successful weather request should show:

1. One AI session for the CLI process run.
2. One trace for the `ask` turn, containing both OpenAI completions.
3. One `get_weather` span linked to the same trace.
4. Attribution to the existing `user_123` distinct ID.

A second invocation will produce a separate process-level AI session, which matches this CLI application’s conversation scope.
