# PostHog AI Observability setup

## Status

**Wired, unverified.** The project type-checks successfully with `npm run build`. I did not call Groq or send an LLM request because that requires the application's Groq credential.

## Integration

- Selected the `ai-observability-groq-node` workflow because the application uses the OpenAI Node SDK with Groq's `https://api.groq.com/openai/v1` base URL.
- Installed `@posthog/ai` and `posthog-node`; the existing `openai` SDK and Groq base URL remain unchanged.
- Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env` using the supplied project configuration. No token or host is embedded in source.
- `src/index.ts` constructs the PostHog OpenAI wrapper when the project token is configured. If PostHog is absent, the existing OpenAI client remains available and development logs a clear configuration error.
- Each `Thread` maps `threadId` to `$ai_session_id`; each `ask()` call creates one UUID `posthogTraceId`. The second turn's `condense()` and `reply()` calls share that trace ID, so they form one trace with two generations.
- Existing `userId` is passed as `posthogDistinctId`. The gateway override sends `$ai_provider: 'groq'`, so generations are attributed to Groq rather than OpenAI.
- This application registers no tools. `moderate()` remains a local guard and correctly emits no AI span.
- The CLI awaits `posthog.shutdown()` before exit, flushing queued generations.

## Verify in PostHog

1. Ensure `GROQ_API_KEY` is present in the process environment, alongside the configured PostHog environment variables.
2. Run `npm run start`.
3. In PostHog, open **AI Observability → Traces** and inspect the newest session.

Expected result: one `thread_abc` AI session with two traces, attributed to `user_123`. The first trace has one generation. The second trace has the `condense` and `reply` generations grouped under the same trace. The provider should be `groq`; no tool span should be present.

## Privacy mode

Privacy mode is disabled in `src/index.ts` on the `PostHog` constructor (`privacyMode: false`). This preserves SDK-captured prompt and completion content in `$ai_input` and `$ai_output_choices`, which is the default for this integration. Enable it before sending prompts or responses whose sensitive content must not be stored in PostHog by changing that setting to `privacyMode: true`, or by passing `posthogPrivacyMode: true` on an individual completion request. Privacy mode excludes those two SDK-captured fields; it does not remove arbitrary custom properties or previously stored events.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).
