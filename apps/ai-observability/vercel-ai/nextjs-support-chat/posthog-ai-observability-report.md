# PostHog AI Observability setup

## Status

AI Observability is wired for the application's Vercel AI SDK calls and is **build-verified but delivery-unverified**. I did not invoke the model endpoint because that requires the application's provider credentials.

## What changed

- Selected the **Vercel AI SDK** workflow because the project uses `ai` and `@ai-sdk/openai`. The installed application version is AI SDK v5, so the compatible built-in `experimental_telemetry` interface is used rather than the v7-only `@ai-sdk/otel` adapter.
- Added `@posthog/ai`, `@opentelemetry/sdk-node`, and `@opentelemetry/resources`.
- Added `instrumentation.ts`, which initializes PostHog's `PostHogSpanProcessor` at the Next.js server instrumentation entry point. It reads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment and flushes spans safely from the request route.
- Instrumented `POST /api/chat` with Vercel AI SDK telemetry:
  - `threadId` becomes a stable, safe hashed `$ai_session_id`, grouping conversation turns without forwarding a raw thread identifier.
  - `userId` is sent as `posthog.distinct_id` for person attribution.
  - Each `generateText` invocation forms a turn trace automatically; model generations and the `lookupOrder` tool execution are emitted as a single trace tree.
- Configured the supplied PostHog public project token and host in `.env`, with empty-key documentation in `.env.example`.
- Wrote the run record to `.posthog-wizard-cache/.posthog-ai.json`.

## Privacy mode

Prompt and completion content are currently recorded by the Vercel AI SDK telemetry defaults. The controlling call is `generateText` in `app/api/chat/route.ts`, under `experimental_telemetry`.

Before sending sensitive prompts or outputs, set `recordInputs: false` and/or `recordOutputs: false` in that `experimental_telemetry` object. These controls prevent those respective fields from being sent on newly captured telemetry; they do not remove previously stored events or arbitrary custom attributes.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for the broader data-handling guidance.

## Verification performed

- `npm run typecheck` — passed.
- `npm run build` — passed.

The build reported Next.js's workspace-root/extra-lockfile warning but completed successfully. Its automatic `tsconfig.json` formatting/configuration change was reverted, so the project configuration remains otherwise unchanged.

## Verify delivery

1. Configure the application's existing `OPENAI_API_KEY` locally if it is not already present.
2. Start the application with `npm run dev`.
3. Send a request such as:

   ```json
   POST /api/chat
   {
     "question": "Where is my order?",
     "userId": "user_123",
     "threadId": "support-thread-001"
   }
   ```

4. In PostHog, open **AI Observability → Traces** and inspect the newest trace. It should show a generation and, when the model invokes it, a `lookupOrder` tool span. Send a second request using the same `threadId` to confirm both turn traces share one AI session.

If no trace arrives, confirm the PostHog environment variables are present in the running deployment and that the request is allowed to finish so the route can flush queued spans.
