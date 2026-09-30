# PostHog AI Observability setup

## Status

Groq AI Observability is wired and the TypeScript build passes. A live generation has not been sent during setup because model calls require your Groq credentials and should be user-triggered.

## Integration

- Selected the **Groq Node** workflow because the project uses the OpenAI SDK with Groq's `baseURL` override.
- Added `@posthog/ai` and `posthog-node`; the existing OpenAI-compatible SDK was not upgraded.
- The PostHog client reads `POSTHOG_API_KEY` and `POSTHOG_HOST` from the local environment configuration.
- Replaced the instrumented path with PostHog's OpenAI wrapper while preserving Groq's base URL.
- Added PostHog project configuration to `.env` using the supplied project token and host.
- Added graceful shutdown so the short-lived CLI flushes pending observability events before exit.

## Trace model

- `Thread.threadId` is `$ai_session_id`, so both chat turns belong to one AI Observability session.
- `Thread.ask()` creates one UUID trace per user turn.
- Every model call in a turn receives the same `posthogTraceId`. The second turn's condense and reply generations therefore appear in one trace.
- `Thread.userId` is sent as the PostHog distinct ID.
- `$ai_provider` is explicitly `groq`, preventing OpenAI attribution for the OpenAI-compatible client.
- The application does not register or dispatch model tools, so no `$ai_span` tool events were added.
- In production, if PostHog configuration is absent, requests continue through the existing OpenAI client without observability. In non-production environments, missing PostHog configuration fails loudly to prevent silently missed events.

## Verification

`npm run build` completed successfully.

To verify delivery, make the existing Groq key available, load the local environment values into your shell, then run the CLI:

```sh
set -a; . ./.env; set +a
npm run start
```

Open **AI Observability → Traces** in PostHog project 483112. Confirm one session for `thread_abc`, two traces inside it, one generation on the first trace, two generations on the second trace, attribution to `user_123`, and provider `groq`.

## Privacy mode

Privacy mode is disabled at `src/index.ts:20` (`privacyMode: false`), so wrapper-captured prompt and completion content is sent as `$ai_input` and `$ai_output_choices`. Enable it before sending prompts or responses whose sensitive content must not be stored in PostHog by changing that option to `privacyMode: true`; per-call control is also available through `posthogPrivacyMode: true`.

Privacy mode excludes those SDK-captured input and output properties only. It does not retroactively remove stored events or automatically remove arbitrary custom properties. See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).
