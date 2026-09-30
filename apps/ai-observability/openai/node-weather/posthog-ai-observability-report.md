# PostHog AI Observability setup

## Status

**Wired, unverified in PostHog.** The project type-checks successfully with `npm run build`. I did not run an OpenAI request because that requires the project's provider credential; confirm ingestion after triggering the CLI.

## Integration selected

- **Variant:** OpenAI (Node)
- **Reason:** `package.json` contains the direct `openai` Node SDK and no framework or OpenAI-compatible gateway base-URL override.

## Changes made

- Added `@posthog/ai` and `posthog-node` to `package.json` and installed them.
- Configured `POSTHOG_API_KEY` and `POSTHOG_HOST` in the local `.env`; the application reads both from its environment and does not embed them in source.
- Replaced the direct client with PostHog's OpenAI wrapper when PostHog configuration is available. In production without that configuration, the existing OpenAI client remains usable without emitting PostHog events; non-production runs fail loudly with a clear missing-variable message.
- Added graceful shutdown so queued observability events are flushed before the CLI exits.
- Added `.posthog-wizard-cache/.posthog-ai.json` to record the wrapper integration.

## Trace model

The instrumentation in `src/index.ts` uses the app's existing flow:

- A process run is an AI conversation. `main` creates one UUID `$ai_session_id` at lines 110–111.
- `ask` is one turn. It creates one UUID trace ID per invocation at line 74.
- Both model calls in a tool-assisted turn use the same trace ID and session ID through the wrapper request helper at lines 54–70.
- The existing stable `USER_ID` is used as the PostHog distinct ID.
- Each `get_weather` execution emits an `$ai_span` with the shared session and trace IDs at lines 90–102.

This yields one session for the CLI conversation, one trace for each `ask` turn, two generations when the model calls the weather tool, and one tool span.

## Verify ingestion

1. Ensure `OPENAI_API_KEY`, `POSTHOG_API_KEY`, and `POSTHOG_HOST` are available in the process environment.
2. Run `npm run start`. The included San Francisco weather prompt is the smallest path that can trigger both a tool call and a follow-up generation.
3. Open **AI Observability → Traces** in PostHog and inspect the newest trace. Verify:
   - both generations share one trace ID;
   - the `get_weather` span is present when the model selects the tool;
   - the session ID groups subsequent `ask` turns in the same conversation; and
   - the trace is attributed to the application's stable user ID.

`npm run build` passed after installation. Ingestion remains unverified until a request is run with real OpenAI credentials and the resulting trace is visible in PostHog.

## Privacy mode

- **Effective setting:** privacy mode is off at `src/index.ts:23` (`privacyMode: false`), so wrapper-captured prompt and completion content is sent to PostHog.
- **When to change it:** enable privacy mode before sending prompts or completions whose sensitive content must not be stored in PostHog.
- **How:** change that constructor option to `privacyMode: true`. For a single wrapped request, add `posthog_privacy_mode: true` in the wrapper request created at `src/index.ts:61–66`.
- **Effect:** privacy mode excludes the wrapper-captured `$ai_input` and `$ai_output_choices` properties. It does not remove arbitrary custom properties, manually captured payloads, or events already stored.
- See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).
