# PostHog AI Observability setup

> ⚠️ **Needs your attention**
> - Provide `OPENAI_API_KEY` in the runtime environment before running the example; it is not configured locally.
> - Load `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env` into the process environment (or configure them in your deployment platform). The Go application does not load `.env` files itself.
> - The installed current OpenTelemetry dependencies moved the module's Go directive from 1.25 to 1.26. Ensure local development and CI use Go 1.26 or newer.
> - Trigger the example with valid runtime credentials and inspect the resulting trace in PostHog; no model request was made during setup.

## Integration selected

- **Variant:** `ai-observability-opentelemetry-go`
- **Why:** The application makes its model calls in Go through `github.com/openai/openai-go/v3`. Go has no provider auto-instrumentor for this SDK, so the PostHog OpenTelemetry bridge and explicit `gen_ai.*` spans are the supported integration path.

## Changes made

- Added `github.com/posthog/posthog-go/otel` and OpenTelemetry SDK dependencies through `go get`; `go.mod` and `go.sum` now declare the resolved modules.
- Registered `posthogotel.NewSpanProcessor` on an application `TracerProvider` in `main.go`. The processor receives the project token and ingestion host only from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- Added a graceful `TracerProvider.Shutdown` call so buffered spans are flushed before the program exits.
- Wrapped each `Conversation.Ask` invocation in one filtered root span (`gen_ai.chat.turn`). This makes every model call and tool run in one turn share a trace.
- Added OpenTelemetry request context for the existing stable conversation user ID and `Conversation.ThreadID` session value. Every root, generation, and tool span receives the same `$ai_session_id` and `posthog.distinct_id` for that turn.
- Added a generation span around each existing OpenAI completion call. The spans include the provider, model, serialized input and output messages, configured tools, token usage, and error status.
- Added an `execute_tool` child span around the existing `get_weather` dispatch without changing the tool flow or its message history handling.
- Created `.env` with the configured `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`; no token or host is embedded in source code.

## Expected data shape

The existing example uses one conversation thread across two questions. After running it with valid credentials, expect:

1. One AI Observability session for the conversation thread.
2. One trace per `Ask` turn.
3. One generation for a direct answer, or two generations with an `execute_tool` span between them when the model invokes `get_weather`.
4. The generations and tool span attributed to the existing conversation user ID.

## Verification

- `go build ./...` passed successfully.
- The integration is **wired but not end-to-end verified** because no OpenAI API key was available and no model request was executed.

To verify delivery, export/load `OPENAI_API_KEY`, `POSTHOG_PROJECT_TOKEN`, and `POSTHOG_HOST`, then run the example. Open the newest trace in AI Observability and confirm the session contains both turns, each turn has one trace, and a tool-using turn contains the tool span nested between its two generations.

## Privacy mode

Privacy mode is effectively **off** for this OpenTelemetry integration. `main.go` explicitly places serialized input messages and output messages on the `gen_ai.input.messages` and `gen_ai.output.messages` span attributes, so prompts and completions are sent to PostHog.

The wrapper SDK `privacyMode` / `privacy_mode` settings do not apply to this Go OpenTelemetry path. Before handling sensitive prompt or response content, redact or omit those two manually set span attributes in `main.go`; do not assume privacy mode removes other custom attributes or data already stored in PostHog. See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).
