# PostHog AI Observability setup

> **Status: wired, awaiting a live trace.** The application builds successfully, but no provider call was made during setup.

## What changed

- Selected the `ai-observability-opentelemetry-go` workflow because the model calls run in Go through the OpenAI Go SDK.
- Added the PostHog Go OpenTelemetry bridge and OpenTelemetry SDK dependencies in `go.mod` and `go.sum`. Versions are pinned to Go 1.25-compatible OpenTelemetry releases; the project Go version remains 1.25.0.
- Added `setupTracing` in `main.go`, which registers PostHog's span processor with the environment-backed `POSTHOG_API_KEY` and `POSTHOG_HOST` settings and shuts down the provider at program exit so buffered spans flush.
- Instrumented each `Conversation.Ask` turn as a `gen_ai.chat.turn` root span. The conversation thread is the shared `$ai_session_id`, while each call to `Ask` creates one OpenTelemetry trace.
- Recorded each OpenAI completion as a child `gen_ai.chat.completion` generation with provider, model, inputs, outputs, tool definitions, token usage, and failure status.
- Recorded the existing `get_weather` tool dispatch as a child `gen_ai.tool.get_weather` span when the model calls it.
- Attached the existing conversation user identifier and thread identifier through the PostHog request context and on every AI span.
- Created local `.env` entries for `POSTHOG_API_KEY` and `POSTHOG_HOST`; `.env` is excluded from version control by the new `.gitignore` entry. No credentials were put in source code.

## Verification

`go build ./...` completed successfully.

To send a live trace, export an OpenAI API key, load the local PostHog configuration, and run the program:

```sh
set -a
. ./.env
set +a
export OPENAI_API_KEY="your-openai-api-key"
go run .
```

Then open **AI Observability → Traces** and inspect the newest trace:

1. The two questions in the script should be grouped in one AI session because they share the same conversation thread.
2. Each question should appear as one trace.
3. Each trace should contain one generation, or two generations with a nested `get_weather` tool span when the model chooses the registered tool.
4. The trace should be attributed to the application’s existing user identifier.

## Privacy mode

Privacy mode is effectively **off**: `setupTracing` in `main.go` configures the OpenTelemetry processor without a privacy option, so prompt and completion attributes are forwarded by default. This matches the default behavior and includes the model messages plus tool arguments/results in AI Observability.

For this Go OpenTelemetry path, the installed reference does not document a Go processor-level privacy option. Before handling content that must not be stored in PostHog, remove or redact the `gen_ai.input.messages`, `gen_ai.output.messages`, tool-argument, and tool-result attributes at their `main.go` call sites. See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for the current supported controls and semantics.

## Files changed

- `.gitignore`
- `.posthog-wizard-cache/.posthog-ai.json`
- `go.mod`
- `go.sum`
- `main.go`
- `posthog-ai-observability-report.md`
