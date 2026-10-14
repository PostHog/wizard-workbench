# PostHog AI Observability setup

## Status

AI Observability is wired and the TypeScript build passes. It has not been exercised against the model provider, so delivery to PostHog remains **unverified** until you run the agent and inspect the resulting trace.

## What changed

- Added `@posthog/ai` and `posthog-node` to the Node dependencies.
- Added a `PostHog` client in `src/index.ts`, configured only from `POSTHOG_API_KEY` and `POSTHOG_HOST` environment variables.
- Registered `PostHogADKPlugin` on the existing ADK `Runner`. The plugin captures the complete ADK hierarchy without changing the agent, model calls, or weather tool implementation.
- Ensured `posthog.shutdown()` runs when the script exits, including after an agent error, so queued events are flushed.
- Confirmed both required environment variables are configured in `.env` without exposing their values.

## Trace design

The existing ADK data supplies attribution directly to the plugin:

- **AI session:** `thread_abc` from ADK `sessionId`; both scripted questions share this session.
- **Trace:** one ADK invocation per `ask()` call; the plugin creates one trace for each turn.
- **Person:** `user_123` from ADK `userId` becomes the PostHog distinct ID.
- **Tool spans:** the registered `get_weather` execution is captured by the plugin as a child span. No duplicate manual span capture was added.
- **Generations:** model calls within each agent invocation are captured as `$ai_generation` events. A tool-using turn should show an agent span, model generation(s), and a `get_weather` span in its trace.

## Verification

Validation completed:

```text
npm run build
```

This completed successfully with `tsc --noEmit`.

To verify live delivery, run:

```text
npm run start
```

Then open **AI Observability → Traces** in PostHog and inspect the newest trace. Confirm that:

1. `thread_abc` groups both turns into one AI session.
2. Each question produces one trace associated with `user_123`.
3. The trace contains the `weather_assistant` agent span, model generation events, and the `get_weather` tool span.
4. The generation provider is Gemini and costs/tokens are populated when the provider response includes usage.

## Privacy mode

Privacy mode is explicitly **off** at `src/index.ts:20` (`privacyMode: false`), so SDK-captured prompt and completion content is sent to PostHog. This preserves the full context required to debug this weather agent.

Before sending prompts or responses that must not be stored in PostHog, change that option to `privacyMode: true` (or use the plugin's supported per-invocation control where appropriate). Privacy mode excludes `$ai_input` and `$ai_output_choices` from SDK-captured events; it does not remove arbitrary custom properties or previously stored events.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for details.

## Configuration behavior

`POSTHOG_API_KEY` and `POSTHOG_HOST` are read from the environment. If the API key is absent, development runs fail with a clear configuration error; production runs retain the agent behavior but omit PostHog instrumentation. No token or host is embedded in source.
