# PostHog AI Observability setup

## Status

AI Observability is wired for the application's Groq calls and passed the TypeScript build. It is **wired, unverified**: a Groq-backed run is still required to confirm ingestion in PostHog.

## Integration

- Selected `ai-observability-groq-node` because the project uses the OpenAI SDK with Groq's `baseURL` override.
- Added `@posthog/ai` and `posthog-node`; no OpenTelemetry packages were added.
- Replaced the Groq client with PostHog's OpenAI-compatible wrapper in `src/index.ts` while preserving the existing Groq URL and model configuration.
- Configured the wrapper from `POSTHOG_API_KEY` and `POSTHOG_HOST` environment variables. These values were written to the local `.env` file, not source code.
- Production without a PostHog token continues with the existing provider client and sends no observability data. Development fails loudly when `POSTHOG_API_KEY` is absent, avoiding silent telemetry loss.

## Trace design

- **AI session:** `Thread.threadId`, shared across the conversation.
- **Trace:** one `randomUUID()` per `Thread.ask()` call.
- **Generations:** every model request receives the current trace ID; the second turn's summary and reply calls therefore remain in one trace.
- **User attribution:** `Thread.userId` is sent as the PostHog distinct ID.
- **Provider attribution:** `$ai_provider` is set to `groq`, so the OpenAI-compatible wrapper does not misattribute the calls as OpenAI.
- **Tool spans:** none were added because this application registers and runs no model tools; `moderate()` remains an application guard, not a tool span.
- The CLI awaits `posthog.shutdown()` before exiting, so queued generation events are flushed.

## Verification

1. Ensure the existing `GROQ_API_KEY` is configured.
2. Run `npm run start`.
3. Open AI Observability > Traces in PostHog and inspect the newest traces.
4. Expect one AI session containing two traces: the first with one generation and the second with two generations. All should be attributed to Groq and to the application's user ID.

`npm run build` completed successfully.

## Privacy mode

`privacyMode: false` is set on the `PostHog` constructor in `src/index.ts`. Prompt and completion content are therefore captured by default. Before sending prompts or responses that should not be stored in PostHog, change that option to `privacyMode: true` or add `posthogPrivacyMode: true` to the applicable model request. Privacy mode excludes SDK-captured `$ai_input` and `$ai_output_choices`; it does not remove arbitrary custom properties or already-stored data.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).
