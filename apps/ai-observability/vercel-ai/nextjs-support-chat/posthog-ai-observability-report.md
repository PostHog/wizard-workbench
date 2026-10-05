# PostHog AI Observability setup

## Integration

- **Variant:** Vercel AI SDK (`ai-observability-vercel-ai`), selected because the Node manifest uses `ai` alongside `@ai-sdk/openai`.
- **LLM route:** `POST /api/chat` in `app/api/chat/route.ts`.
- **Conversation/session:** the request's `threadId` is forwarded as `$ai_session_id`, so multiple turns in one thread group into one AI Observability session.
- **User attribution:** the request's stable `userId` is forwarded as `posthog.distinct_id`.
- **Turn/trace:** each `generateText` request has Vercel AI telemetry enabled. The SDK's trace context keeps its model generations and the `lookupOrder` tool execution in one trace.
- **Tools:** `lookupOrder` remains unchanged. Vercel AI emits its `ai.toolCall` span automatically, so no manual span was added.

`instrumentation.ts` starts a process-level Node OpenTelemetry SDK with PostHog's `PostHogSpanProcessor`. It reads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` only from the environment, starts no telemetry in production when they are absent, and raises a clear development error when configuration is missing. The route flushes the processor before its request completes so serverless executions do not drop completed spans.

## Dependencies and configuration

Declared the following dependencies in `package.json`:

- `@posthog/ai`
- `@ai-sdk/otel`
- `@opentelemetry/sdk-node`
- `@opentelemetry/resources`

Configured `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in `.env`. Values are not committed to source files.

## Verification

The implementation is **wired but unverified against PostHog**. `npm run typecheck` was run, but this checkout has no `node_modules`, so TypeScript could not resolve any existing dependencies (including `ai`, `@ai-sdk/openai`, React, and the newly declared OpenTelemetry packages). Install the manifest dependencies, then rerun:

```bash
npm run typecheck
```

To generate a trace, start the app and send a request such as:

```http
POST /api/chat
Content-Type: application/json

{ "question": "Where is my order?", "userId": "user_123", "threadId": "support-thread-1" }
```

Then open **AI Observability → Traces** in PostHog and inspect the newest trace. Expect one trace containing the model generation(s) and `lookupOrder` tool span, attributed to `user_123`. Send a second request using the same `threadId` to confirm both traces appear in the same AI session.

## Privacy mode

Prompt and completion content are captured by default through Vercel AI SDK telemetry. No privacy override is configured. Before sending sensitive prompts or responses, set `recordInputs: false` and/or `recordOutputs: false` on the route's `experimental_telemetry` configuration (use `telemetry` if migrating to the current Vercel AI SDK telemetry API). Those controls prevent the corresponding prompt or completion content from being recorded; they do not remove previously stored data or arbitrary custom attributes.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for the data-handling details.
