# PostHog AI Observability setup

## Status

Wired and build-verified. Live ingestion is unverified because no OpenAI request was made during setup.

## What changed

- Added the PostHog Go OpenTelemetry bridge (`github.com/posthog/posthog-go/otel`) and OpenTelemetry SDK modules to `go.mod`. The bridge is pinned to a Go 1.25-compatible version; the project remains declared as Go 1.25.
- Added `POSTHOG_API_KEY` and `POSTHOG_HOST` to the local `.env` file. The application reads both values from its environment; neither value is embedded in source.
- Configured a `TracerProvider` with `posthogotel.NewSpanProcessor` in `main.go`. The provider flushes with `Shutdown` on normal completion and before the existing error exit.
- Instrumented each `Conversation.Ask` turn as one `gen_ai.turn` trace. Every span carries:
  - `$ai_session_id` from `Conversation.ThreadID`, grouping both turns in the same conversation.
  - `posthog.distinct_id` from `Conversation.UserID`, attributing the trace to the existing stable user ID.
- Added `gen_ai.chat_completion` spans around both OpenAI calls, including provider, model, serialized input/output messages, token usage, and error status.
- Added a `gen_ai.tool.get_weather` child span for the existing tool execution.
- Wrote the integration run record to `.posthog-wizard-cache/.posthog-ai.json`.

## Expected trace tree

Running the sample's first question should produce one trace containing the initial OpenAI generation, the `get_weather` tool span when OpenAI requests it, and the follow-up OpenAI generation. The second question produces a second trace under the same AI session. Both are attributed to the conversation's stable user ID.

## Verification performed

- `go build ./...` completed successfully with the project declared as Go 1.25.
- The application was not run because that would make a real external LLM call.

## How to verify ingestion

1. Ensure `OPENAI_API_KEY` is available in the process environment.
2. Load the local PostHog environment values into the process, then run `go run .`.
3. In PostHog, open **AI Observability → Traces** and inspect the newest trace.
4. Confirm that the first turn contains two generations with a `get_weather` span between them, that the second turn is grouped in the same `$ai_session_id`, and that both traces use the conversation's user ID.

## Privacy mode

The OpenTelemetry path has no `privacy_mode` SDK setting. The effective behavior in `main.go` is to capture prompt and completion content through the `gen_ai.input.messages` and `gen_ai.output.messages` span attributes.

Before sending prompts or completions that must not be stored in PostHog, change the span-attribute construction in `main.go` to omit or redact those two attributes. This does not remove custom span attributes or events that were already ingested. See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for the platform-wide behavior and retention details.
