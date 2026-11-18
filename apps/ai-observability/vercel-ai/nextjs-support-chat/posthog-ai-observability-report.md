# PostHog AI Observability setup

## Status

Wired and build-verified. A live model request was not made, so delivery to PostHog remains unverified until you send a chat request with an OpenAI API key configured.

## Integration

- Selected the **Vercel AI SDK** integration because this project uses the `ai` package for its chat generation and tool loop.
- Added `@posthog/ai`, `@opentelemetry/api`, `@opentelemetry/resources`, and `@opentelemetry/sdk-node`.
- Added `instrumentation.ts`, which starts PostHog's `PostHogSpanProcessor` once per Node.js process and reads its project token and host from `POSTHOG_API_KEY` and `POSTHOG_HOST`.
- Added documented empty variables to `.env.example` and configured the local `.env` without placing credentials in source code.
- Enabled Vercel AI SDK OpenTelemetry on `POST /api/chat` and sends request-scoped attribution:
  - `threadId` → `$ai_session_id`, grouping multiple chat turns in a conversation.
  - `userId` → `posthog.distinct_id`, attributing the trace to the authenticated caller.
  - Each request produces one trace containing the SDK-captured model generations and the existing `lookupOrder` tool span. No manual tool span was added because the Vercel AI SDK captures it.
- The request route makes a best-effort span flush with a two-second bound before responding, so serverless invocations do not drop queued spans or delay a successful chat response.

## Verification

- `pnpm typecheck` passed.
- `pnpm build` passed after adding the peer-compatible `@opentelemetry/api` dependency. The build emits a non-blocking OpenTelemetry static-analysis warning from `require-in-the-middle`.

## How to verify delivery

1. Configure `OPENAI_API_KEY` locally if it is not already available to the application.
2. Run `pnpm dev`.
3. Send a request such as:

   ```sh
   curl -X POST http://localhost:3000/api/chat \
     -H 'Content-Type: application/json' \
     -d '{"question":"Where is my order?","userId":"user_123","threadId":"support-thread-1"}'
   ```

4. In PostHog, open **AI Observability → Traces** and inspect the newest trace. It should contain the model generation(s) and `lookupOrder` tool span, be attributed to `user_123`, and carry `support-thread-1` as its AI session. Send a second message using the same `threadId` to confirm both request traces are grouped in one session.

## Privacy mode

Prompt and completion content are captured by default through the Vercel AI SDK's telemetry configuration in `app/api/chat/route.ts`. To avoid storing sensitive prompt or response content, set `recordInputs: false` and/or `recordOutputs: false` inside that route's `experimental_telemetry` object before sending those requests. This prevents those fields from being recorded; it does not remove previously captured events or arbitrary custom attributes.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for the implications and related controls.
