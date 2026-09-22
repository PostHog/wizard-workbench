# PostHog AI Observability setup

## Implemented

- Selected the `ai-observability-groq-node` workflow. Although the application imports the OpenAI-compatible SDK, its `baseURL` targets `api.groq.com`, so Groq is the correct provider attribution.
- Added `@posthog/ai` and `posthog-node` alongside the existing OpenAI-compatible client; no OpenTelemetry packages were added.
- Configured `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in the local `.env` file. No credentials are embedded in source code.
- Replaced the client constructor in `src/index.ts` with PostHog’s OpenAI-compatible wrapper while retaining the existing Groq base URL and model calls.
- Added AI Observability context to every generation:
  - `$ai_session_id` is the existing `Thread.threadId`, so both questions belong to one conversation session.
  - `posthogTraceId` is generated once inside each `Thread.ask()` turn and is shared by that turn’s summarization and reply calls.
  - `posthogDistinctId` uses the existing stable `Thread.userId`.
  - `$ai_provider` is explicitly `groq`, preventing the OpenAI-compatible wrapper from misattributing Groq usage and pricing.
- Added `await posthog.shutdown()` in the terminal script’s `finally` block so queued events are sent before exit.
- Created `.posthog-wizard-cache/.posthog-ai.json` to record the Groq wrapper integration.

## Verification

- `npm run build` completed successfully (`tsc --noEmit`). This verifies the wrapper imports, PostHog client initialization, and the per-call AI Observability parameters compile.
- The app was not run because it would make real Groq API calls and requires a configured `GROQ_API_KEY`. Therefore, event delivery is **wired but not yet runtime-verified**.

## Runtime validation

1. Ensure `GROQ_API_KEY`, `POSTHOG_PROJECT_TOKEN`, and `POSTHOG_HOST` are available to the process.
2. Run `npm run start`.
3. In PostHog, open **AI Observability → Traces** and inspect the newest trace:
   - Both scripted questions should share one session (`thread_abc`).
   - The first question has one generation trace.
   - The second question has two generations (condensation and reply) in the same trace.
   - The trace is attributed to the existing `user_123` distinct ID and provider `groq`.

No dashboard, product-analytics event, identify-call, or existing PostHog instrumentation was changed; those are outside this AI Observability workflow.
