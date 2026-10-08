# PostHog AI Observability setup

> ⚠️ **Needs your attention**
> - Send a real request to `POST /api/chat` with a configured `OPENAI_API_KEY`, then confirm the resulting trace in PostHog.

## Integration

- **Selected variant:** Vercel AI SDK, because this Node project uses the `ai` package with `@ai-sdk/openai`.
- **OpenTelemetry exporter:** `instrumentation.ts` starts a process-level `NodeSDK` with PostHog's `PostHogSpanProcessor`. It reads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment. In development, missing configuration produces an explicit error; in production it remains a no-op if either variable is absent.
- **LLM instrumentation:** `app/api/chat/route.ts` enables Vercel AI SDK telemetry for every chat turn. The request's `threadId` is used as the AI session identifier, and its `userId` is used as the stable PostHog distinct ID. `support_chat` is the low-cardinality function identifier.
- **Tool tracing:** The existing `lookupOrder` tool remains unchanged. Vercel AI SDK telemetry emits its tool execution as a span in the same trace.
- **Flush:** The route awaits `posthogSpanProcessor.forceFlush()` after `generateText` so completed spans are exported before a short-lived request can end.

## Dependencies and configuration

The following dependencies were declared in `package.json`:

- `@posthog/ai`
- `@opentelemetry/sdk-node`
- `@opentelemetry/resources`
- `@ai-sdk/otel`

`POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are configured in the local `.env` file, and `.env.example` documents their names without values. The OpenAI credential was not changed.

## Verification status

**Wired and statically verified; not runtime-verified.** Dependencies were installed successfully. `npm run typecheck` passed, and `npm run build` completed successfully. The build emitted a non-blocking OpenTelemetry bundling warning about a dynamic dependency request.

With `OPENAI_API_KEY` configured, trigger one turn with a request such as:

```http
POST /api/chat
Content-Type: application/json

{"question":"Where is my order?","userId":"user_123","threadId":"support-thread-001"}
```

Then open [AI Observability > Traces](https://us.posthog.com/project/483112/ai-observability/traces) and inspect the newest trace. Expect one trace for the request, containing the model generation(s) and a `lookupOrder` tool span, attributed to `user_123`. A second request using `support-thread-001` should appear in the same AI session.

## Privacy mode

Prompt and completion content are recorded by default through the Vercel AI SDK telemetry enabled in `app/api/chat/route.ts`. Before sending prompts or outputs that must not be stored in PostHog, disable the relevant payload recording in that call's telemetry configuration (`recordInputs: false` and/or `recordOutputs: false`, using the SDK's supported telemetry option for the installed AI SDK version). This excludes SDK-captured input and output fields; it does not remove custom attributes or previously ingested events.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for details.
