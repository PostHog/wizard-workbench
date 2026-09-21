# PostHog AI Observability setup

## Status

Wired and build-verified. The project dependencies were installed and the integration passed both TypeScript checking and a production Next.js build. No model request was made during setup, so delivery to PostHog remains to be confirmed by triggering the route.

## Integration

- **Variant:** Vercel AI SDK (`ai` package), selected because the existing route uses `generateText` from Vercel AI SDK.
- **Telemetry bootstrap:** `instrumentation.ts` initializes a `NodeSDK` once per process with PostHog's `PostHogSpanProcessor`. Vercel AI SDK v5 emits its native experimental OpenTelemetry spans, and the bootstrap reads the PostHog project token and host from environment variables.
- **Conversation session:** Each `POST /api/chat` uses the request `threadId` as `$ai_session_id`.
- **Person attribution:** Each request uses the stable `userId` as `posthog.distinct_id`.
- **Trace shape:** The Vercel AI SDK emits the two `generateText` generations and the existing `lookupOrder` tool execution as a single trace. No manual tool span was added.
- **Delivery:** The route awaits `posthogSpanProcessor.forceFlush()` before returning so a serverless invocation does not discard completed spans.

## Configuration

The local `.env` now contains these configured keys:

- `POSTHOG_PROJECT_TOKEN`
- `POSTHOG_HOST`

The token and host are not embedded in application source. In development, missing configuration throws a clear error; production keeps the application running without telemetry.

## Files changed

- `package.json` and `package-lock.json` — declared and locked `@posthog/ai`, `@opentelemetry/sdk-node`, and `@opentelemetry/resources`.
- `instrumentation.ts` — added the process-level PostHog OpenTelemetry bootstrap.
- `app/api/chat/route.ts` — enabled Vercel AI telemetry, attached per-request session and distinct-id metadata, and flushes spans before returning.
- `.posthog-wizard-cache/.posthog-ai.json` — recorded the AI observability setup.

## Verification

The following checks passed:

```bash
npm run typecheck
npm run build
```

The production build completed successfully. It emitted one existing OpenTelemetry dynamic-import warning from `@opentelemetry/instrumentation`, but compilation, type validation, static generation, and route collection succeeded.

To confirm that a trace reaches PostHog, send a request such as:

```http
POST /api/chat
Content-Type: application/json

{"question":"Where is my order?","userId":"user_123","threadId":"support-thread-1"}
```

In PostHog **AI Observability → Traces**, confirm one trace containing both generations and the `lookupOrder` tool span. Send a second request with the same `threadId` to confirm both traces appear in the same AI session.

## Dashboard

No dashboard was created or modified, per the requested additive AI-observability-only scope.
