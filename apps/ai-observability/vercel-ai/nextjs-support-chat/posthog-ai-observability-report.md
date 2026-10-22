# PostHog AI Observability setup

## Status

AI Observability is wired for the Vercel AI SDK v5 chat route. The instrumentation compiles and the production build succeeds, but delivery has not been verified against a live model request.

## What changed

- Added `@posthog/ai`, `@opentelemetry/sdk-node`, and `@opentelemetry/resources` dependencies.
- Added `instrumentation.ts`, which initializes the OpenTelemetry Node SDK once per server process with PostHog's `PostHogSpanProcessor`.
- Added `experimental_telemetry` to `POST /api/chat` in `app/api/chat/route.ts` and flushes queued spans before the request finishes.
- Added `.env` configuration for `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`, plus empty-name documentation in `.env.example`. Credentials are not committed.

## Trace structure and attribution

- **Session:** The request `threadId` is sent as `$ai_session_id`, grouping turns in the same support conversation.
- **Trace:** Vercel AI SDK telemetry creates one OpenTelemetry trace for each `generateText` call, including its tool-use steps.
- **Person:** The request `userId` is sent as `posthog.distinct_id` for stable attribution.
- **Tools:** The existing `lookupOrder` AI SDK tool is emitted automatically as a tool span. No manual span was added.

## Verify delivery

1. Start the app with its normal development command.
2. Send `POST /api/chat` with `question`, `userId`, and `threadId` fields. Use the same `threadId` for a second request to confirm the session groups both turns.
3. Open **AI Observability → Traces** in PostHog and inspect the newest trace. It should contain the model generations and, when invoked, an `lookupOrder` tool span. The trace should have the supplied session and distinct-id attributes.

Validation completed locally:

- `npm run typecheck` passed.
- `npm run build` passed. The build reports non-blocking Next.js workspace-root and optional Jaeger-exporter resolution warnings from dependencies; it still compiled and emitted the chat route.

## Privacy mode

Prompt and completion recording is currently **enabled** through the Vercel AI SDK default behavior. The effective control is `experimental_telemetry` in `app/api/chat/route.ts`; because it does not set `recordInputs` or `recordOutputs` to `false`, both are recorded.

Before sending sensitive prompt or completion content to PostHog, update that telemetry object with `recordInputs: false` and/or `recordOutputs: false`. These controls prevent SDK-captured input and output text from being included in telemetry; they do not remove previously stored events or arbitrary custom attributes.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for the broader data-handling guidance.
