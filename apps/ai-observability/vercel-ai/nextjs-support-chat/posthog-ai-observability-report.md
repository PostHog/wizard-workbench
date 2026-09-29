# PostHog AI Observability setup

## Status

AI Observability is wired for the Vercel AI SDK chat route. It is configured but not runtime-verified because project dependencies are not installed in this checkout.

## Integration

- Selected **Vercel AI SDK** because the application uses the `ai` package for its LLM generations.
- Declared `@posthog/ai`, `@ai-sdk/otel`, `@opentelemetry/sdk-node`, and `@opentelemetry/resources` in `package.json`. Existing Vercel AI and OpenAI provider package versions were left unchanged.
- Added `instrumentation.ts`, which creates the PostHog OTel span processor once per process, registers Vercel AI telemetry enrichment, and exports the processor for request-end flushing.
- Added request-scoped `experimental_telemetry` to `POST /api/chat` in `app/api/chat/route.ts`.
  - The request `threadId` is the AI session ID, grouping turns from the same conversation.
  - The authenticated/stable request `userId` is sent as the PostHog distinct ID.
  - The Vercel AI SDK emits the two model generations and the existing `lookupOrder` tool execution as a span. No manual tool instrumentation was added.
  - The route awaits `forceFlush()` before it returns so completed spans are not lost in a short-lived request runtime.
- Stored the configured PostHog token and host in `.env` as `POSTHOG_API_KEY` and `POSTHOG_HOST`; neither value is embedded in source.

## How to verify

1. Start the app with its dependencies installed and valid model-provider credentials configured.
2. Send `POST /api/chat` with a JSON body containing `question`, a stable `userId`, and a stable `threadId`.
3. Open **AI Observability → Traces** in PostHog Project 483112 and inspect the newest trace.
4. Expect one trace for the request, containing the first model generation, the automatic `lookupOrder` tool span when it is used, and the final model generation. Repeat with the same `threadId` to confirm both traces appear in one AI session.

## Verification result

`npm run typecheck` was executed. It could not resolve any installed project dependencies—including pre-existing `ai`, `@ai-sdk/openai`, React, and the newly declared observability packages—because this checkout has no dependency installation or lockfile. The integration could not be type-checked until dependencies are installed. No model call was made during setup.

## Privacy mode

Prompt and completion recording remains enabled by the Vercel AI SDK telemetry defaults; no privacy-restricting option was added. This permits PostHog AI Observability to capture model inputs and outputs for the instrumented route.

Before sending sensitive prompt or completion content, change the telemetry configuration in `app/api/chat/route.ts` to disable input and/or output recording using the Vercel AI SDK's supported `recordInputs: false` and `recordOutputs: false` controls for the installed SDK version. This excludes SDK-captured prompt and completion content, but does not retroactively remove data already ingested or scrub arbitrary custom attributes.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for the privacy implications and current SDK controls.

## Files changed

- `package.json`
- `instrumentation.ts`
- `app/api/chat/route.ts`
- `.env`
- `.posthog-wizard-cache/.posthog-ai.json`
- `posthog-ai-observability-report.md`
