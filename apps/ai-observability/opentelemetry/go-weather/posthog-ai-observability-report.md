# PostHog AI Observability setup

## Status

**Wired and build-verified; runtime delivery is unverified.** I did not run a model request because this environment does not have the application's OpenAI credential. The Go build succeeds with the new instrumentation.

## Integration selected

- **Variant:** `ai-observability-opentelemetry-go`
- **Reason:** The application makes its OpenAI calls from Go (`github.com/openai/openai-go/v3`). Go has no PostHog wrapper client, so it uses the PostHog OpenTelemetry bridge.
- **Dependencies:** `github.com/posthog/posthog-go/otel`, `go.opentelemetry.io/otel`, and `go.opentelemetry.io/otel/sdk`.

## What changed

- Added the PostHog OpenTelemetry span processor in `main.go`. It reads `POSTHOG_API_KEY` and `POSTHOG_HOST` from the environment and registers on a `TracerProvider`.
- Added a per-turn root span (`gen_ai.turn`) in `Conversation.Ask`, so each user question becomes exactly one trace.
- Added `gen_ai.chat.completions` spans around both existing OpenAI requests. These include the model, provider, input/output messages, token usage, endpoint, and error status.
- Added a `gen_ai.tool.get_weather` child span around the existing weather-tool invocation. No changes were made to the tool implementation or dispatch flow.
- Added a span processor that attaches `$ai_session_id` from `Conversation.ThreadID` and `posthog.distinct_id` from `Conversation.UserID` to every span in a turn.
- Added provider shutdown/flush handling so buffered spans are sent before normal exit and flushed on an application error.
- Created `.env` entries for `POSTHOG_API_KEY` and `POSTHOG_HOST` using the supplied project configuration.
- Wrote the integration run record to `.posthog-wizard-cache/.posthog-ai.json`.

## Expected trace tree

The provided two-question example should produce one AI session for `thread_abc`, attributed to `user_123`:

```text
session: thread_abc
├─ trace: first Ask call
│  ├─ generation: OpenAI chat completion
│  ├─ span: get_weather (when requested)
│  └─ generation: OpenAI follow-up completion
└─ trace: second Ask call
   └─ generation: OpenAI chat completion (and tool/follow-up spans if requested)
```

## Verification performed

- `go mod tidy` completed successfully.
- `go build ./...` completed successfully.
- Confirmed `POSTHOG_API_KEY` and `POSTHOG_HOST` are present in `.env`.

## Runtime verification

1. Ensure `OPENAI_API_KEY` is available in the environment.
2. Run the example using the project's normal Go command, such as `go run .`.
3. Open **PostHog → AI Observability → Traces** and inspect the newest trace.
4. Confirm that both questions share `$ai_session_id = thread_abc`; each `Ask` call is a separate trace; and any weather lookup appears as a child tool span between its two generations.

## Privacy mode

The OpenTelemetry path has no PostHog SDK `privacyMode` switch. This setup captures `gen_ai.input.messages` and `gen_ai.output.messages` in `main.go`, so prompts and completions are sent to PostHog by default.

If a future request contains sensitive prompt or completion content, change the span attributes in `main.go` before the spans are sent: omit or redact `gen_ai.input.messages` and `gen_ai.output.messages`. This does not remove already-ingested events or arbitrary custom attributes. See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for the platform behavior and retention details.
