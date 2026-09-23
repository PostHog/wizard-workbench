# PostHog AI Observability setup

## Status

AI Observability is wired for the Go OpenAI weather assistant and compiles successfully. Live delivery is **unverified** because no OpenAI request was made during setup.

## Integration

- Selected `ai-observability-opentelemetry-go`: model calls are made directly from Go with the official OpenAI Go SDK, and Go has no provider wrapper or automatic OpenAI instrumentation.
- Added `github.com/posthog/posthog-go/otel` plus the OpenTelemetry SDK modules to `go.mod` and `go.sum`.
- Configured `POSTHOG_API_KEY` and `POSTHOG_HOST` in the local `.env` file; their values are read at runtime by `main.go` and are not embedded in source.
- Registered the PostHog OpenTelemetry span processor in `main.go` and shuts the tracer provider down before the process exits, flushing queued spans.

## Trace model

`Conversation.ThreadID` is the AI session identifier and `Conversation.UserID` is the PostHog distinct ID. Each `Conversation.Ask` invocation creates one `gen_ai.turn` trace. All spans within that turn receive the same session and user attribution.

Each model request emits a child `gen_ai.chat_completion` generation span with the provider, model, input messages, tool definitions, output messages, and token usage. If OpenAI requests the existing weather tool, the existing dispatch path also emits a child `gen_ai.tool.get_weather` span. This produces the intended tree for a tool turn:

1. turn trace
2. first generation
3. `get_weather` tool span
4. follow-up generation

The two sample questions use the same thread ID, so they should appear in a single AI Observability session as two traces.

## Verification

- `go build ./...` passed after module tidy.
- PostHog configuration keys are present in `.env`.
- A provider request was not run because setup does not use or request an OpenAI credential.

To verify delivery, run the assistant with `OPENAI_API_KEY`, `POSTHOG_API_KEY`, and `POSTHOG_HOST` exported into the process environment. Then open **AI Observability → Traces** and inspect the newest trace. Confirm that each turn has a `gen_ai.turn` root, the expected generation spans, and—when a tool is called—the weather-tool span. Run both sample questions to confirm they share one AI session.

## Privacy mode

Privacy mode is effectively off: `main.go` manually places request content in `gen_ai.input.messages` and response content in `gen_ai.output.messages`, so prompts and completions are sent to PostHog. The OpenTelemetry Go bridge used here has no SDK-wide `privacyMode` setting.

Before handling prompts or responses that must not be stored in PostHog, update the manual span attributes in `main.go` to omit or redact the sensitive input and output content before spans end. This only changes future exports; it does not remove previously stored events. See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).

## Files changed

- `main.go`
- `go.mod`
- `go.sum`
- `.env`
- `.posthog-wizard-cache/.posthog-ai.json`
- `posthog-ai-observability-report.md`
