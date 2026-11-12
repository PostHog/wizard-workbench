# PostHog AI Observability setup

## Status

**Wired and build-verified; live ingestion remains to be confirmed with a real chat request.**

This project uses Vercel AI SDK v5 (`ai`), so the supported PostHog Vercel wrapper was used instead of the v7 OpenTelemetry integration.

## What changed

- Added `@posthog/ai` and `posthog-node` to the server dependencies.
- Added `instrumentation.ts`, which creates the server-side PostHog client from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`. The client is configured for safe request-scoped flushing and does not prevent the chat route from completing if flushing fails.
- Added the configured environment variables to the local `.env` file. No token or host is hardcoded in application source.
- Wrapped the Vercel AI model in `app/api/chat/route.ts` with `withTracing()`:
  - `threadId` becomes the sanitized `$ai_session_id`, grouping all turns in a support conversation.
  - `userId` is sent as the PostHog distinct ID.
  - A fresh UUID is created once per request and used as that turn's `posthogTraceId`, so all model calls made while resolving a tool-enabled turn share one trace.
  - The existing `lookupOrder` Vercel AI tool remains unchanged; the Vercel integration captures its tool activity in the trace.
  - The route awaits a caught `posthog.flush()` before returning so serverless execution does not drop queued AI events.
- Wrote `.posthog-wizard-cache/.posthog-ai.json` for the setup workflow.

## Verification completed

- `pnpm typecheck` passed.
- `pnpm build` passed.

The build printed its existing workspace-root/multiple-lockfile warning, but compilation and type validation completed successfully.

## Verify a live trace

1. Ensure the provider credentials used by `@ai-sdk/openai` are configured in the runtime where the app runs.
2. Start the app with `pnpm dev`.
3. Send a request to `POST /api/chat` with a question plus stable `userId` and `threadId` values. For example:

   ```json
   {
     "question": "Where is my order?",
     "userId": "user_123",
     "threadId": "support-thread-1"
   }
   ```

4. Open **AI Observability → Traces** in PostHog and inspect the newest trace. It should show the support-chat generation, the `lookupOrder` tool when the model uses it, and the supplied distinct ID.
5. Send a second request using the same `threadId`. It should create a separate trace in the same AI Observability session.

## Privacy mode

Privacy mode is currently **off** in `instrumentation.ts` (`privacyMode: false`) and the wrapper call in `app/api/chat/route.ts` (`posthogPrivacyMode: false`). As a result, prompts, model outputs, tool arguments, and tool results are captured for AI Observability.

Enable privacy mode before sending sensitive prompt or completion content by changing `privacyMode` to `true` in `instrumentation.ts`. You may also enable it for a single wrapped model request with `posthogPrivacyMode: true`. Privacy mode excludes SDK-captured inputs and outputs; it does not remove already-ingested events or arbitrary custom properties.

Read more: [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).
