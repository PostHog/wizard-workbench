# PostHog AI Observability setup

## Status

**Wired, runtime delivery unverified.** The project now instruments its Vercel AI SDK v5 chat generation flow with PostHog AI Observability. A real model request was not sent during setup, so confirm ingestion using the steps below.

## Integration selected

- **Variant:** `ai-observability-vercel-ai`
- **Provider:** OpenAI through the Vercel AI SDK
- **Compatibility path:** The project uses `ai@5`, so the integration uses PostHog's Vercel AI SDK v5-compatible `withTracing` model wrapper rather than the v7 OpenTelemetry integration.
- **Packages added:** `@posthog/ai` and `posthog-node`

## What changed

- `instrumentation.ts` creates the server-side PostHog client from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`. It is a production no-op when either is unavailable and fails clearly in development.
- `app/api/chat/route.ts` wraps the existing OpenAI model per chat turn with `withTracing`.
- Every chat request now sends:
  - the existing `threadId` as the AI conversation session (`$ai_session_id`), with unsupported characters normalized;
  - a newly generated trace ID for the turn, shared by all generation steps in that turn;
  - the existing stable `userId` as the PostHog distinct ID.
- The existing `lookupOrder` Vercel AI SDK tool remains unchanged. Vercel AI SDK observability captures its tool activity as part of the traced turn.
- The configured project token and ingestion host were stored in the local `.env` file only; neither is embedded in source.
- `.posthog-wizard-cache/.posthog-ai.json` records this integration for subsequent wizard handoffs.

## Verification completed

- `npm run typecheck` passed.
- `npm run build` passed.
- The build reported an existing workspace-root/lockfile warning from Next.js. It did not prevent a successful build.

## Verify delivery

1. Start the application with its normal development command.
2. Send `POST /api/chat` with a test `question`, stable `userId`, and stable `threadId`.
3. Send a second request with the same `threadId`.
4. In PostHog AI Observability, open the newest trace and confirm:
   - each request creates one trace containing the AI generation and any tool activity;
   - both traces share one AI session for the conversation;
   - attribution uses the supplied stable user ID.

## Privacy mode

Privacy mode is **off**, so prompt and completion content are captured for AI Observability.

- SDK-wide setting: `instrumentation.ts:19` sets `privacyMode: false`.
- Request-level setting: `app/api/chat/route.ts:22` sets `posthogPrivacyMode: false`.
- Before sending sensitive prompts or completions, change the SDK-wide setting to `privacyMode: true`, or set `posthogPrivacyMode: true` for individual model calls. Privacy mode excludes SDK-captured `$ai_input` and `$ai_output_choices`; it does not remove arbitrary custom properties, manually captured data, or previously stored events.

Read [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) before enabling capture for sensitive workloads.
