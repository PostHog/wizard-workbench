# PostHog AI Observability setup

## Status

AI Observability is wired for the Go OpenTelemetry path and the project builds successfully. It is **not yet runtime-verified** because running the weather assistant would make live OpenAI requests and no OpenAI credential was used during setup.

## Integration

- Selected `ai-observability-opentelemetry-go`: the application makes its model calls in Go through `github.com/openai/openai-go/v3`.
- Added PostHog's OpenTelemetry bridge and OpenTelemetry SDK modules to `go.mod`/`go.sum`.
- `main.go` creates a `TracerProvider` with `posthogotel.NewSpanProcessor`, reading `POSTHOG_API_KEY` and `POSTHOG_HOST` from the environment, and shuts it down on exit to flush buffered spans.
- Each `Conversation.Ask` call starts one `gen_ai.turn` root span, so all work for one question shares a trace.
- Each OpenAI completion has a child `gen_ai.chat.completion` span with model, provider, request/response messages, token usage, and error status.
- The `get_weather` tool run is represented by a child `gen_ai.tool.get_weather` span.
- The context span processor attaches `$ai_session_id` from `Conversation.ThreadID` and `posthog.distinct_id` from `Conversation.UserID` to every span. This yields one session per thread and one trace per question.

## Configuration

The local `.env` file now contains `POSTHOG_API_KEY` and `POSTHOG_HOST`. Application code does not embed either value.

To run the assistant, provide `OPENAI_API_KEY` as well, load the environment, and execute:

```bash
set -a
source .env
set +a
go run .
```

Then open **AI Observability → Traces** in PostHog. The fixture's two questions should appear under one conversation session, with one trace per question. A turn that invokes the tool should show `generation → get_weather span → generation`.

## Verification

- Passed: `go build ./...`
- Pending: run the application with a valid OpenAI credential and inspect the resulting trace tree in PostHog.
- Note: dependency resolution updated the module's Go directive from 1.25.0 to 1.26.0 because the resolved OpenTelemetry SDK release requires Go 1.26 or newer.

## Privacy mode

This OpenTelemetry integration has no SDK `privacy_mode` option configured. The explicit `gen_ai.input.messages` and `gen_ai.output.messages` attributes in `main.go` intentionally send prompt and completion content to AI Observability. Before handling sensitive content, remove or redact those attributes in the span setup; do not add an unsupported privacy-mode option to the OpenTelemetry bridge. See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).
