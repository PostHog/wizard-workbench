# PostHog AI Observability setup

## Integration

This Next.js support-chat app uses Vercel AI SDK v5 (`ai` and `@ai-sdk/openai`). It is instrumented with PostHog's Vercel AI v5-compatible model wrapper.

- `instrumentation.ts` creates a server-side `posthog-node` client using `POSTHOG_API_KEY` and `POSTHOG_HOST`. The values are configured in the local `.env`, while `.env.example` documents their names without values.
- In development, a missing PostHog token or host fails loudly. In production, the wrapper is omitted and the existing model call continues without PostHog capture.
- `app/api/chat/route.ts` wraps the existing OpenAI model with `@posthog/ai/vercel`. It uses `threadId` as `$ai_session_id`, `userId` as the stable distinct ID, and one new UUID trace ID for the complete request turn. Any repeated model calls within that tool loop share the same trace ID.
- The existing `lookupOrder` tool remains unchanged. Vercel AI SDK emits tool spans for executions in the generated trace.
- The wrapper sends immediately and the route awaits `posthog.flush()` before returning, protecting captures in the request-scoped runtime.
- `package.json` now includes `@posthog/ai` and `posthog-node`; dependencies were installed and recorded in `package-lock.json`. Existing AI SDK and OpenAI-provider versions were preserved.
- `.posthog-wizard-cache/.posthog-ai.json` records the integration for future setup handoffs.

## Verification

- `npm run typecheck` passes.
- `npm run build` passes and compiles the `/api/chat` route successfully.
- The model call was not run during setup because provider credentials are not available to the setup process, so capture is wired but awaits runtime confirmation.

To verify capture:

1. Start the app with `npm run dev`.
2. Send a request to `POST /api/chat`, for example:

   ```json
   {
     "question": "Where is my order?",
     "userId": "user_123",
     "threadId": "support-thread-1"
   }
   ```

3. Open **AI Observability → Traces** in PostHog and inspect the newest trace. It should include the model generation and, when invoked, the `lookupOrder` tool span.
4. Send a second request with the same `threadId`. Both request traces should appear under the same AI session.

## Privacy mode

Privacy mode is currently off in `instrumentation.ts` (`privacyMode: false`) and in `app/api/chat/route.ts` (`posthogPrivacyMode: false`). Prompt and completion content will therefore be captured.

Before sending prompts or outputs whose content must not be stored in PostHog, set `posthogPrivacyMode: true` in the `withTracing` options in `app/api/chat/route.ts` (or set `privacyMode: true` in `instrumentation.ts` for the client-wide default). Privacy mode excludes `$ai_input` and `$ai_output_choices` from SDK-captured events; it does not remove arbitrary custom properties or previously stored events.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for details.
