# PostHog AI Observability setup

## Status

Wired and build-verified. The application has not made a live model request during setup, so delivery of an AI trace still needs runtime confirmation.

## Integration

- Selected the **Vercel AI SDK** workflow because the project uses `ai` with `@ai-sdk/openai` in its Node/Next.js application.
- Added `@posthog/ai`, `@opentelemetry/sdk-node`, and `@opentelemetry/resources`.
- Added `instrumentation.ts`, which starts a single Node OpenTelemetry SDK with PostHog's `PostHogSpanProcessor` during Next.js instrumentation registration.
- Configured the exporter from `POSTHOG_API_KEY` and `POSTHOG_HOST` environment variables. The supplied values were written to `.env.local`; no token or host is embedded in source.
- Kept the project on Vercel AI SDK v5. Its built-in `experimental_telemetry` path is compatible with the application, so no v7-only telemetry adapter was retained.

## Captured AI tree

`POST /api/chat` now enables telemetry on its existing `generateText` call:

- **Session:** request `threadId` is emitted as `$ai_session_id`, grouping conversation turns.
- **Trace:** one `generateText` invocation (including its model/tool steps) forms one request trace.
- **Person:** request `userId` is emitted as `posthog.distinct_id`.
- **Tool span:** the Vercel AI SDK records the existing `lookupOrder` execution automatically; the tool and `lib/orders.ts` were left unchanged.
- **Flush:** `app/api/chat/route.ts` awaits `posthogSpanProcessor.forceFlush()` in `finally`, so completed spans are exported before a short-lived route invocation returns.

## Verify in PostHog

1. Start the app with `npm run dev` after configuring the existing `OPENAI_API_KEY` for the model provider.
2. Send a request such as:

   ```bash
   curl -X POST http://localhost:3000/api/chat \
     -H 'content-type: application/json' \
     -d '{"question":"When will my order arrive?","userId":"user_123","threadId":"support-thread-1"}'
   ```

3. Open **AI Observability → Traces** and inspect the newest trace. It should contain the model generation(s) and `lookupOrder` tool span, be attributed to `user_123`, and have `$ai_session_id` of `support-thread-1`.
4. Send another request with the same `threadId` to confirm both traces appear in one AI Observability session.

## Verification completed

- `npm run typecheck` passed.
- `npm run build` passed.

## Privacy mode

Prompt and completion recording remains enabled by default through `experimental_telemetry` in `app/api/chat/route.ts` (around line 28). This Vercel AI SDK v5 OpenTelemetry path does not use the PostHog SDK `privacyMode` option.

Before sending prompts or responses whose content must not be stored in PostHog, change the route's `experimental_telemetry` options to set `recordInputs: false` and/or `recordOutputs: false`. Those controls prevent the corresponding AI SDK telemetry content from being recorded; they do not retroactively remove existing events or arbitrary custom attributes.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for retention and privacy guidance.
