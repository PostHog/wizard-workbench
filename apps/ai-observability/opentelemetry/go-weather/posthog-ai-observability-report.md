# PostHog AI Observability setup

## Status

**Wired and build-verified.** Live ingestion remains unverified because this setup does not run model calls without your OpenAI credential.

## Integration selected

- **Variant:** `ai-observability-opentelemetry-go`
- **Reason:** The application makes its OpenAI calls in Go. There is no provider auto-instrumentor for the OpenAI Go SDK, so the supported path is PostHog's OpenTelemetry bridge with explicit `gen_ai.*` spans.
- **Dependencies:** `github.com/posthog/posthog-go/otel` and the OpenTelemetry Go SDK, pinned to the Go 1.25-compatible bridge release line.

## Changes made

- Added a PostHog OpenTelemetry span processor and tracer provider in `main.go`.
  - Both the project token and ingestion host are read only from `POSTHOG_API_KEY` and `POSTHOG_HOST`.
  - The tracer provider is shut down before the process returns so buffered spans are flushed.
- Instrumented every OpenAI chat completion with standard `gen_ai.*` attributes:
  - provider, model, input messages, output messages, token usage, and OpenAI API address;
  - failures are recorded on the corresponding generation span.
- Added one AI-filtered root span per `Conversation.Ask` turn, grouping all work in that turn into a trace.
- Used the existing conversation thread ID as `$ai_session_id` and existing stable user ID as `posthog.distinct_id` on each span.
- Captured `get_weather` as an AI child span with its tool name, arguments, and result.
- Stored the PostHog environment values in `.env`; no PostHog token or host is embedded in source.
- Restored the module's Go baseline to `go 1.25.0` after resolving compatible bridge dependencies.

## Expected trace shape

One conversation creates one AI session. Each call to `Ask` creates a separate trace. A turn that calls the weather tool should appear as:

```text
gen_ai.turn
├─ gen_ai.chat
├─ gen_ai.tool.get_weather
└─ gen_ai.chat
```

The sample program asks two questions on the same thread, so both traces should share the same AI session and identified user.

## Verification completed

- Ran `go mod tidy -go=1.25.0` successfully.
- Ran `go build ./...` successfully.
- Did not make a live model request or use an OpenAI credential.

## Verify ingestion

1. Make the configured environment variables available to the Go process (a `.env` file is not loaded automatically by Go).
2. Set `OPENAI_API_KEY` in that process environment.
3. Run `go run .`.
4. In PostHog, open **AI Observability → Traces** and inspect the newest trace. Confirm the expected hierarchy, model and token attributes, session grouping across both turns, and user attribution.

## Privacy mode

This is an OpenTelemetry Go integration, so the Node/Python SDK `privacyMode` setting does not apply. `main.go` explicitly sends prompt content via `gen_ai.input.messages` and model output via `gen_ai.output.messages`; with the current setup, that content is captured.

Before sending prompts or completions that must not be stored in PostHog, change the application instrumentation to omit or redact those attributes before starting the spans. This does not remove content already ingested. See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) and the [OpenTelemetry installation guide](https://posthog.com/docs/ai-observability/installation/opentelemetry).
