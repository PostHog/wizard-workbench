# PostHog AI Observability setup

## Status

**Wired, unverified in PostHog.** The project compiles successfully, but no OpenAI request was sent during setup because no OpenAI credential was available.

## Integration

- Detected a Node project using the direct `openai` SDK and the `chat.completions.create` API.
- The current `@posthog/ai` wrapper requires OpenAI `^6.48.0`, while this project intentionally uses OpenAI `^4.77.0`. The wrapper install was therefore rejected without upgrading the existing OpenAI dependency.
- Switched to the compatible manual-capture integration using `posthog-node` `^5.54.1`.
- Added `posthog-node` and its lockfile entries.
- Saved `POSTHOG_API_KEY` and `POSTHOG_HOST` to the project `.env` using the supplied project configuration, and added empty names only to `.env.example`.
- Wrote the integration run record to `.posthog-wizard-cache/.posthog-ai.json`.

## Instrumented flow

`src/index.ts` now records the existing weather-assistant turn as an AI Observability tree:

- A generated `$ai_session_id` is created once per process run because the app has no persistent conversation identifier.
- `ask()` creates one `posthog_trace_id` per user question.
- The first OpenAI completion and any follow-up completion emit `$ai_generation` events sharing that trace ID and session ID.
- The existing `get_weather` execution emits a `$ai_span` with the same trace and session IDs.
- All events use the existing stable `USER_ID` (`user_123`) as their distinct ID.
- The CLI awaits `posthog.shutdown()` so queued AI events flush before the process exits.

For a tool-using request, PostHog should display one tree:

```text
session (one process run)
└─ trace (one ask() turn)
   ├─ generation: initial OpenAI completion
   ├─ span: get_weather
   └─ generation: follow-up OpenAI completion
```

## Verification

1. Provide `OPENAI_API_KEY` and make sure the runtime exposes `POSTHOG_API_KEY` and `POSTHOG_HOST` from the configured environment. The checked-in `.env` file is not automatically loaded by every Node runner, so inject these values through your normal shell, deployment, or environment-loading mechanism.
2. Run `npm run start`.
3. Open **AI Observability → Traces** in PostHog project **483112**, then inspect the newest trace.
4. Confirm it contains the two OpenAI generations and the `get_weather` span on one trace. Run a second turn in the same process to confirm both traces share the process-run AI session ID.

Build verification completed successfully with:

```text
npm run build
```

## Privacy mode

- `privacyMode: false` is set on the PostHog client in `src/index.ts`. Prompt and completion content are intentionally included in the manually captured `$ai_input` and `$ai_output_choices` fields.
- Before sending sensitive prompt or response content to PostHog, change this behavior at the `captureGeneration` helper in `src/index.ts` by omitting or redacting those manually supplied fields. For manual capture, do not rely on a client privacy setting alone to remove properties that application code explicitly adds.
- See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for the SDK-wide and request-level controls available to wrapper-based integrations.
