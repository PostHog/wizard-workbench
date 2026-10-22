# PostHog AI Observability setup

## Status

**Wired; build verified.** The Groq AI Observability wrapper is configured and `npm run build` completes successfully. Live ingestion remains unverified because no model call was made during setup.

## Integration

- Selected `ai-observability-groq-node` because the application uses the OpenAI SDK with Groq's OpenAI-compatible base URL.
- Declared `@posthog/ai` and `posthog-node` alongside the existing OpenAI SDK in `package.json`. No OpenTelemetry packages were added.
- Created a PostHog client in `src/index.ts` from `POSTHOG_API_KEY` and `POSTHOG_HOST`, with `privacyMode: false`.
- Replaced Groq-bound calls with PostHog's OpenAI-compatible wrapper whenever PostHog configuration is available. Production without PostHog configuration continues with the original Groq client and does not send wrapper-only request parameters.
- Added a shutdown call so the command-line process flushes queued telemetry before exit.
- Recorded the setup in `.posthog-wizard-cache/.posthog-ai.json`.

## Trace model

- **AI session:** `Thread.threadId`; both sample questions belong to the same conversation session.
- **Trace:** one `randomUUID()` per `Thread.ask()` call.
- **Generations:** the trace ID is shared by every Groq call in that turn. On the second sample question, the conversation-condensing call and reply call therefore appear together in one trace.
- **Person:** `Thread.userId` is passed as the distinct ID.
- **Provider:** every wrapped call explicitly reports `$ai_provider: 'groq'` for correct provider attribution and pricing.
- **Tools:** this application does not register or execute model tools, so no `$ai_span` events were added.

## Configuration

The following non-secret environment variable names are documented in `.env.example` and configured in `.env`:

- `POSTHOG_API_KEY`
- `POSTHOG_HOST`

The application still needs `GROQ_API_KEY` supplied by the runtime. Ensure the process or deployment loads its environment file before running the script.

## Verification

1. Run `npm run build` — this completed successfully during setup.
2. Run the existing script with its Groq credential configured: `npm start`.
3. In PostHog, open **AI Observability → Traces** and inspect the newest traces.
4. Confirm both sample turns share one AI session; confirm the second turn contains both the summarization and reply generations under one trace; confirm the provider is `groq` and attribution uses the application user ID.

No model call was executed during setup, so live ingestion still needs this user-triggered check.

## Privacy mode

- **Effective setting:** disabled (`privacyMode: false`) in `src/index.ts` on the `PostHog` constructor. Prompts and completion content are captured by the wrapper.
- **When to change it:** enable privacy mode before sending prompts or responses whose sensitive content must not be stored in PostHog.
- **How to change it:** set `privacyMode: true` on that constructor for an SDK-wide setting, or pass `posthogPrivacyMode: true` to an individual wrapped completion request.
- **Effect:** privacy mode excludes `$ai_input` and `$ai_output_choices` from SDK-captured events. It does not retroactively remove stored events or automatically scrub arbitrary custom properties.
- [AI Observability privacy mode documentation](https://posthog.com/docs/ai-observability/privacy-mode)
