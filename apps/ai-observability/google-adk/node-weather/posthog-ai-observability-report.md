# PostHog AI Observability setup

## Status

Wired and build-verified. A live model request was not run during setup, so delivery to PostHog remains to be confirmed in the AI Observability UI.

## Integration

- Selected the `ai-observability-google-adk` workflow because the application uses `@google/adk` for its agent and generation flow.
- Installed `@posthog/ai` and `posthog-node`.
- Created a `PostHog` server client in `src/index.ts` from `POSTHOG_API_KEY` and `POSTHOG_HOST` environment variables.
- Registered `PostHogADKPlugin` on the existing ADK `Runner`.
- Preserved the existing ADK session (`thread_abc`) and user (`user_123`), which the plugin uses for AI session grouping and distinct-id attribution.
- The existing `get_weather` tool remains registered. The plugin automatically records the agent and tool execution spans, and records each model call as a generation.
- Added graceful client shutdown so queued observability events flush before this script exits.

## Configuration

The project `.env` contains the configured values for:

- `POSTHOG_API_KEY`
- `POSTHOG_HOST`

The app reports a clear configuration error in non-production environments if either variable is missing. In production, it continues without observability rather than blocking the agent.

## Verification

Ran successfully:

```bash
npm run build
```

## Verify in PostHog

1. Ensure the agent's model-provider credentials are configured.
2. Run:

   ```bash
   npm run start
   ```

3. Open **AI Observability → Traces** in PostHog and inspect the newest trace.
4. Confirm that each invocation creates a trace, both turns share the `thread_abc` AI session, generations appear for the model calls, and the `get_weather` tool is represented as a span.
