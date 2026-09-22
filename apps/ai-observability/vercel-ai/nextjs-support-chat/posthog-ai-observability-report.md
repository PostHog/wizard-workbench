# PostHog AI Observability setup

## Status

AI Observability is wired for the app's Vercel AI SDK v5 OpenAI calls. The project compiles successfully, but delivery has not been confirmed with a real model request.

## What changed

- Added `@posthog/ai` and `posthog-node` as production dependencies.
- Added `instrumentation.ts`, which creates the server-side PostHog client from `POSTHOG_API_KEY` and `POSTHOG_HOST`. In development, missing configuration throws a clear error; production safely leaves observability disabled when configuration is absent.
- Wrapped the existing `openai('gpt-4o-mini')` model in `app/api/chat/route.ts` with PostHog's Vercel AI v5-compatible `withTracing` wrapper.
- Linked every chat turn to:
  - a stable person using the existing `userId` as the PostHog distinct ID;
  - a conversation session using a URL-safe encoding of the existing `threadId` as `$ai_session_id`;
  - a fresh `posthogTraceId` per `POST /api/chat` turn.
- Preserved the existing `lookupOrder` tool. Vercel AI tracing records its tool execution within the trace automatically.
- Flushed the server-side PostHog client before each route invocation completes to avoid losing events in a serverless lifecycle.
- Stored the supplied PostHog project configuration in `.env`; no token or host is embedded in source code.

## Verification

- `npm run typecheck` passed.
- `npm run build` passed.
- No model request was made because no provider credentials were supplied for verification.

## How to verify delivery

1. Configure `OPENAI_API_KEY` in your local environment.
2. Start the app with `npm run dev`.
3. Send a request such as:

   ```sh
   curl -X POST http://localhost:3000/api/chat \
     -H 'content-type: application/json' \
     -d '{"question":"Where is my order?","userId":"user_123","threadId":"support-thread-1"}'
   ```

4. In PostHog, open **AI Observability → Traces** and inspect the newest trace. It should contain one generation (and a `lookupOrder` tool span when invoked), have a distinct ID of `user_123`, and be grouped into the `support-thread-1` conversation session.
5. Send a second request with the same `threadId`. It should create a new trace in the same AI session.

## Notes

The project uses Vercel AI SDK v5, so the integration uses the supported legacy model wrapper rather than the newer v7 OpenTelemetry telemetry hook. The existing application behavior, response shape, and tool implementation remain unchanged.
