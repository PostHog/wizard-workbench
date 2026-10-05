# PostHog AI Observability setup

## Status

AI Observability is wired for the project's Groq calls and the TypeScript build passes. Live ingestion is **unverified** because no Groq request was made during setup.

## Integration

- Selected **Groq (Node)** (`ai-observability-groq-node`), rather than the plain OpenAI variant: the app uses the OpenAI SDK with the Groq gateway base URL.
- Added `@posthog/ai` and `posthog-node`; no OpenTelemetry packages were added.
- Replaced the vendor client in `src/index.ts` with PostHog's wrapped OpenAI client while preserving the Groq base URL.
- Constructed the PostHog client from `POSTHOG_API_KEY` and `POSTHOG_HOST`, configured in `.env` with the supplied project values.
- Added `posthogDistinctId`, `$ai_session_id`, and the Groq provider override to every model call.
- The `Thread.threadId` is the AI session ID, so both example turns remain in one session. `Thread.ask()` creates one UUID trace per turn; its summary and reply calls share that trace ID.
- This app has no registered model tools, so no `$ai_span` tool events were added.
- The CLI awaits `posthog.shutdown()` on both success and failure so queued AI events are flushed before process exit.

## Verification

`npm run build` completed successfully (`tsc --noEmit`).

To verify delivery, ensure the runtime has `GROQ_API_KEY`, `POSTHOG_API_KEY`, and `POSTHOG_HOST` available (load `.env` in the execution environment or export these variables), then run:

```bash
npm run start
```

Open **AI Observability → Traces** in PostHog and inspect the newest trace:

1. Both turns should have `$ai_session_id` set to `thread_abc`.
2. The first turn should contain one generation; the second should contain the summary and reply generations under one shared trace.
3. The distinct ID should be `user_123` and `$ai_provider` should be `groq`.
4. No tool spans are expected because the application does not register or execute tools.

## Compatibility note

The existing OpenAI SDK remains on the project's `^4.77.0` range (resolved to 4.104.0). The current `@posthog/ai` release declares an optional OpenAI `^6.48.0` peer dependency, so the PostHog packages were installed with npm's legacy-peer-dependency resolution to avoid changing the application's vendor SDK. The project type-checks, but run the verification above to confirm runtime delivery before deploying.

## Privacy mode

Privacy mode is explicitly **off** at `src/index.ts:7` (`privacyMode: false`), so the wrapper captures prompt input and completion output in AI Observability. Enable privacy mode before sending content that must not be stored in PostHog by changing that setting to `privacyMode: true`, or setting `posthogPrivacyMode: true` on an individual model call. Privacy mode excludes `$ai_input` and `$ai_output_choices` from SDK-captured events; it does not remove other custom properties or previously stored data.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).

## Dashboard

No dashboard was created or modified. This request was limited to AI Observability instrumentation, and existing dashboards were left untouched.
