# PostHog AI Observability setup

> ⚠️ **Needs your attention**
> - The integration builds and type-checks, but it has not been verified against a live model request. Send two chat requests with the same thread ID, then inspect the resulting session in PostHog.

## Integration

- **Selected integration:** Vercel AI SDK (`ai-observability-vercel-ai`), selected because this Node project uses `ai` with `@ai-sdk/openai`.
- **Compatibility path:** The project remains on Vercel AI SDK v5. It uses the supported legacy `withTracing` model wrapper rather than the v7-only OpenTelemetry integration; the vendor SDK was not upgraded.
- **Installed packages:** `@posthog/ai` and `posthog-node`.
- **Telemetry client:** `lib/posthog-ai.ts` constructs a server-side PostHog client from `POSTHOG_API_KEY` and `POSTHOG_HOST`. Missing configuration fails clearly during development and leaves production capture disabled rather than breaking the application.
- **Model wrapper:** `app/api/chat/route.ts` wraps the existing OpenAI Vercel AI model with `withTracing`.

## Trace structure

The chat route has one AI turn per `POST /api/chat` request.

- `$ai_session_id` is a URL-safe encoding of `threadId`, so multiple turns in the same conversation group into one AI session.
- `posthogTraceId` is minted once per request, so all model calls in that turn share a trace.
- The supplied `userId` is sent as the PostHog distinct ID.
- The existing `lookupOrder` Vercel AI SDK tool remains unchanged; its executions are represented in the traced AI workflow.
- `posthogCaptureImmediate: true` waits for capture delivery in the serverless route lifecycle.

## Environment

The following server-side values are set in `.env.local`:

- `POSTHOG_API_KEY`
- `POSTHOG_HOST`

Credentials and ingestion host values are read only from environment variables and are not embedded in source code.

## Verification

Completed locally:

- `npm run typecheck` passed.
- `npm run build` passed.

The model was not invoked during setup. To verify live ingestion, send two `POST /api/chat` requests using the same thread ID. Then open [AI Observability traces](https://app.posthog.com/ai-observability/traces) and confirm:

1. Each request creates one trace.
2. Both traces belong to the same AI session.
3. The trace is attributed to the route's user ID.
4. A tool span appears when the model invokes `lookupOrder`.

## Privacy mode

Privacy mode is explicitly disabled in `lib/posthog-ai.ts:17` and in the per-call wrapper option at `app/api/chat/route.ts:23`. This keeps prompt and completion content in SDK-captured AI events, which is the default observability behavior.

Before sending prompts or responses whose content should not be stored in PostHog, enable privacy mode by changing `privacyMode: false` and `posthogPrivacyMode: false` to `true` in those locations. Privacy mode excludes `$ai_input` and `$ai_output_choices` from SDK-captured events; it does not remove custom payloads or data that was already ingested. See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).
