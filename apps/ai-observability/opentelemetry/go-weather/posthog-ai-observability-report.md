# PostHog AI Observability setup

## Status

AI Observability is **wired but not yet verified with a live model request**. The project now compiles successfully with the PostHog OpenTelemetry bridge. A live request still needs an `OPENAI_API_KEY`, which was intentionally not accessed or added by this setup.

## Integration implemented

- Selected the **OpenTelemetry Go** workflow because the LLM calls are made by the official `openai-go` SDK in `main.go`.
- Added `github.com/posthog/posthog-go/otel` and the OpenTelemetry Go SDK modules to `go.mod` and `go.sum`.
  - The current supported bridge dependency set requires Go **1.26**, so `go.mod` now declares `go 1.26.0`.
- Registered `posthogotel.NewSpanProcessor` in `setupTracing` in `main.go` using `POSTHOG_API_KEY` and `POSTHOG_HOST` from the environment.
- Added a bounded provider shutdown (five seconds) so spans are flushed when this short-lived script exits.
- Wrapped each `Conversation.Ask` call in a `gen_ai.turn` root span. This gives one trace per user question.
- Added request context for every turn:
  - `posthog.distinct_id`: the existing `Conversation.UserID`
  - `$ai_session_id`: the existing `Conversation.ThreadID`
- Added `gen_ai.*` spans around both OpenAI chat-completion calls, including provider, model, messages, output, token usage, and error status.
- Added a `gen_ai.tool.get_weather` span for the existing weather-tool execution. The tool span shares the turn trace and records its model arguments and tool result.
- Added `.posthog-wizard-cache/.posthog-ai.json` to record the OpenTelemetry initialization location.

The existing weather logic, tool loop, OpenAI client setup, and message handling remain intact.

## Configuration

The local `.env` file now defines:

- `POSTHOG_API_KEY`
- `POSTHOG_HOST`

The application reads both values at runtime; neither is embedded in source code. If either is absent, a non-production run warns on stderr and continues without exporting telemetry.

## Expected trace shape

With the sample conversation, the AI Observability view should show:

- one session for `thread_abc`
- two traces, one for each `Ask` turn
- a generation span for each model call
- for a tool-using turn: a generation, the `get_weather` span, and the follow-up generation
- attribution to `user_123`

## Verification completed

- Ran `go mod tidy`
- Ran `go build ./...` successfully
- Confirmed the PostHog environment keys are present in `.env`

No live model call was made, so delivery to PostHog is not yet confirmed.

## Verify delivery

1. Ensure `OPENAI_API_KEY` is available in your shell.
2. Load the local PostHog environment values and run the example:

   ```sh
   set -a
   . ./.env
   set +a
   go run .
   ```

3. In PostHog, open **AI Observability → Traces** and inspect the newest trace. Run the second sample question too, then confirm both traces share the same AI session and that a tool-using turn includes the weather-tool span.

## Privacy mode

Privacy mode is currently **off**: `main.go` deliberately records `gen_ai.input.messages` and `gen_ai.output.messages`, so prompts, completions, tool arguments, and tool results are available in AI Observability.

Enable a documented PostHog OpenTelemetry privacy control, or remove/redact the content-bearing span attributes before spans are exported, before processing prompts or responses that must not be stored in PostHog. This does not remove content from events already ingested. For background, see [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).
