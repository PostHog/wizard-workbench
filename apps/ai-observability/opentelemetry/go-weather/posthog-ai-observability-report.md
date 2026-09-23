# PostHog AI Observability setup

## Integration

- **Workflow:** `ai-observability-opentelemetry-go`
- **Provider:** OpenAI via `github.com/openai/openai-go/v3`
- **Bridge:** `github.com/posthog/posthog-go/otel` with the OpenTelemetry Go SDK
- **Initialization:** `main.go` creates a PostHog span processor and registers it on the process tracer provider.
- **Configuration:** `POSTHOG_API_KEY` and `POSTHOG_HOST` are stored in the local `.env` file and are read only from environment variables at runtime. No PostHog credential or host is embedded in source.

## Captured AI hierarchy

The existing weather conversation now produces the following structure:

- One **AI session** per `Conversation.ThreadID` (`$ai_session_id`).
- One **trace** for each `Conversation.Ask` turn.
- One OpenAI **generation** span for each `Chat.Completions.New` call, including model, provider, input messages, tool definitions, output choices, and token usage.
- One child **tool span** for each executed `get_weather` call, including its arguments and result.
- `Conversation.UserID` is attached as `posthog.distinct_id` on every span in the turn.

The tracing provider shuts down on normal completion and immediately before the existing error exit so buffered spans are flushed.

## Files changed

- `main.go` — PostHog OpenTelemetry setup; session and identity context processor; AI turn, generation, and tool spans around the existing OpenAI calls.
- `go.mod`, `go.sum` — Added PostHog's nested OpenTelemetry bridge and OpenTelemetry dependencies.
- `.env` — Added the PostHog project token and host as environment variables.
- `.posthog-wizard-cache/.posthog-ai.json` — Recorded the completed AI observability integration.

## Verification

- `go build ./...` completed successfully.
- A live OpenAI request was not run because this setup process does not have an OpenAI API credential. The integration is therefore **wired but not runtime-verified**.

## Runtime verification

1. Ensure `OPENAI_API_KEY`, `POSTHOG_API_KEY`, and `POSTHOG_HOST` are exported in the process environment. The project’s `.env` file is not loaded automatically by Go, so use your deployment environment or a local environment loader.
2. Run the weather assistant through its normal entry point with two questions in the same `Conversation`.
3. In PostHog, open **AI Observability → Traces** and inspect the newest traces.
4. Confirm that both turns are grouped under one session, each turn contains its OpenAI generation(s), tool-using turns contain a `get_weather` child span, and spans are attributed to the conversation user ID.
