# PostHog AI Observability setup

## Status: wired and build-verified; live capture awaits a user-triggered model call

The project uses the Vercel AI SDK (`ai`), so I applied the **Vercel AI SDK** AI Observability integration. Its OpenAI model provider remains unchanged.

## Changes made

- Declared the AI Observability/OpenTelemetry dependencies in `package.json`:
  - `@posthog/ai`
  - `@opentelemetry/sdk-node`
  - `@opentelemetry/resources`
  - `@ai-sdk/otel`
- Created `instrumentation.ts`, which starts a process-level OpenTelemetry `NodeSDK` with PostHog's `PostHogSpanProcessor` before the route makes AI SDK calls.
- Configured the processor from `POSTHOG_API_KEY` and `POSTHOG_HOST`. The supplied project credentials are stored only in `.env.local`, which is ignored by Git.
- Enabled Vercel AI SDK telemetry for `POST /api/chat` in `app/api/chat/route.ts`.
  - `threadId` is used as `$ai_session_id` when it uses the supported character set, grouping multiple turns of a conversation.
  - `userId` is passed as `posthog.distinct_id` for attribution.
  - `generateText` automatically emits a single OpenTelemetry trace for the request, including the two generation steps and the existing `lookupOrder` tool execution. No manual tool span was added.
  - The route awaits `posthogSpanProcessor.forceFlush()` before it completes so short-lived request execution does not drop spans.
- Created `.posthog-wizard-cache/.posthog-ai.json` to record this integration.

## Trigger and validate

1. Run `npm run typecheck`.
2. Start the app and send a request such as:

   ```sh
   curl -X POST http://localhost:3000/api/chat \
     -H 'content-type: application/json' \
     -d '{"question":"Where is my order?","userId":"user_123","threadId":"conversation-123"}'
   ```

3. In PostHog, open **AI Observability → Traces** and inspect the newest trace. Expect:
   - one trace for the request;
   - generation → `lookupOrder` tool span → generation;
   - `$ai_session_id` of `conversation-123`;
   - attribution to the supplied stable `userId`.
4. Send another request using the same `threadId` to confirm both traces appear under one AI Observability session.

## Verification result

`npm install` completed and created `package-lock.json`. `npm run typecheck` then completed successfully, and `npm run build` completed successfully. The build reported a non-blocking OpenTelemetry dynamic-dependency warning and a Next.js workspace-root warning caused by multiple lockfiles; neither prevented compilation. No model call was made because no LLM credentials are available to the setup process, so confirm the live trace tree using the trigger above. NPM's audit also reported 30 dependency vulnerabilities; no audit fixes were applied.
