# PostHog AI Observability setup

## Status

AI Observability is wired for the Go OpenAI weather assistant using the PostHog OpenTelemetry bridge. The integration builds successfully; it has not made a live OpenAI request, so delivery to PostHog remains **wired, unverified**.

## What changed

- Added `github.com/posthog/posthog-go/otel` and the required OpenTelemetry SDK modules to `go.mod` and `go.sum`.
- Registered `posthogotel.NewSpanProcessor` on an OpenTelemetry `TracerProvider` in `main.go:44`. It reads `POSTHOG_API_KEY` and `POSTHOG_HOST` from the environment; no PostHog credentials are embedded in source.
- Added session propagation from `Conversation.ThreadID` (`thread_abc`) and applied it to every span as `$ai_session_id`.
- Added one `gen_ai.turn` root span per `Conversation.Ask` call. All work for a turn is therefore grouped into one trace.
- Added `gen_ai.chat.completions` spans around both existing OpenAI calls. They include model, provider, message input/output, available tools, endpoint, token usage, and error status.
- Added a `gen_ai.tool.get_weather` child span around the existing weather lookup, including the tool name, arguments, and result.
- Set `posthog.distinct_id` from the existing `Conversation.UserID` on every AI span.
- Added graceful provider shutdown and an error-path `ForceFlush` so short CLI runs export buffered spans before exiting.
- Wrote `POSTHOG_API_KEY` and `POSTHOG_HOST` to the local `.env` file.

## Expected AI Observability tree

The supplied example conversation should result in one AI session for `thread_abc` containing two turn traces. A turn that invokes the weather tool appears as:

```text
session: thread_abc
└── trace: gen_ai.turn
    ├── generation: gen_ai.chat.completions
    ├── span: gen_ai.tool.get_weather
    └── generation: gen_ai.chat.completions
```

Both traces are attributed to the existing stable user ID (`user_123`). A turn where the model does not request a tool contains its single generation under the same turn trace.

## Verify delivery

1. Ensure the environment contains `OPENAI_API_KEY`, `POSTHOG_API_KEY`, and `POSTHOG_HOST`. This Go CLI does not automatically load `.env`, so export those values through your shell or deployment environment before running it.
2. Run `go run .` and let both example questions complete.
3. In PostHog, open **AI Observability → Traces** and inspect the latest trace(s).
4. Confirm that both turns share the `thread_abc` AI session, each turn has one trace, generations contain OpenAI token usage, and weather-enabled turns contain the `get_weather` child span.

`go build ./...` completed successfully. A live run was intentionally not performed because it would require using the OpenAI credential.

## Privacy mode

Privacy mode is **off by default** for this OpenTelemetry integration. Prompt and completion content are intentionally captured through `gen_ai.input.messages` and `gen_ai.output.messages` in `main.go:121` and `main.go:130`.

The Go OpenTelemetry bridge does not use the Python/Node `privacy_mode` SDK option. Before sending prompts or responses whose content must not be stored in PostHog, change the instrumentation to omit or redact those two `gen_ai.*.messages` attributes before spans are exported. This affects new captured content only; it does not remove previously stored events or arbitrary custom attributes. See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).
