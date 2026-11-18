# PostHog AI Observability setup

> ⚠️ **Needs your attention**
> - The resolved dependency graph updated the module's Go directive from `1.25.0` to `1.26.0`; ensure the deployment environment uses Go 1.26 or select compatible dependency versions before shipping.
> - The integration is wired and compiles, but it has not sent a live trace because no OpenAI call was made during setup.

## Integration selected

Installed the `ai-observability-opentelemetry-go` workflow. This project makes model calls from Go through `github.com/openai/openai-go/v3`; Go has no PostHog wrapper for provider SDKs, so the integration uses PostHog's OpenTelemetry bridge and hand-authored `gen_ai.*` spans.

## Changes made

- Added `github.com/posthog/posthog-go/otel/v2` and the Go OpenTelemetry SDK dependencies through `go get`, then normalized the module with `go mod tidy`.
- Added `POSTHOG_API_KEY` and `POSTHOG_HOST` to the local `.env` file. Application code reads both values only from environment variables.
- Added `tracing.go`:
  - Registers `posthogotel.NewSpanProcessor` on the application's tracer provider.
  - Warns to stderr outside production when either required PostHog environment variable is absent, while allowing the server process to continue without analytics.
  - Associates each turn with the conversation `ThreadID` as `$ai_session_id` and the existing `UserID` as `posthog.distinct_id`.
  - Creates standard `gen_ai.*` spans for model inputs, outputs, provider, model, token usage, and errors.
  - Records `get_weather` as an AI tool span, including its arguments and result.
- Updated `main.go` to create one filtered AI root span per `Conversation.Ask` call, parent the model and tool spans under it, and shut down the tracer provider before normal process exit.
- Wrote `.posthog-wizard-cache/.posthog-ai.json` for downstream setup reporting.

## Expected trace tree

The fixture's two questions share one AI session from `Conversation.ThreadID`. Each `Ask` call creates a distinct trace:

```text
session: ThreadID
├─ trace: Ask(question 1)
│  ├─ generation: first chat completion
│  ├─ span: get_weather (when requested by the model)
│  └─ generation: follow-up completion
└─ trace: Ask(question 2)
   └─ generation: chat completion (and any tool/follow-up spans)
```

All spans are attributed to the existing stable `Conversation.UserID`. No additional product-analytics events, person updates, or dashboards were added.

## Verification

- `go build ./...` completed successfully.
- A live model run was intentionally not performed because it requires the application's OpenAI credential.

To verify delivery, make the environment values available to the process (including the existing `OPENAI_API_KEY`) and run:

```bash
set -a; source .env; set +a
go run .
```

Then open **AI Observability → Traces** for this project and inspect the newest trace. Confirm that:

1. both questions share one `$ai_session_id`;
2. each question has its own trace;
3. model calls appear as generations with model, provider, prompt/completion, and token metadata;
4. any weather lookup appears as a child tool span; and
5. traces are attributed to the application's existing user ID.

## Privacy mode

Privacy mode is effectively **off**: `tracing.go` creates the OpenTelemetry span processor without a privacy setting, so the hand-authored `gen_ai.input.messages`, `gen_ai.output.messages`, tool arguments, and tool result attributes are eligible for capture. This is the default observability behavior and is what enables prompt and completion inspection.

Before sending prompts, completions, tool arguments, or results that must not be stored in PostHog, redact or omit those attributes in `tracing.go`'s `startGeneration`, `finishGeneration`, and `runWeatherTool` helpers. The installed Go OpenTelemetry workflow did not document a Go-specific processor privacy option, so no unsupported SDK option was added. See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for the behavior and supported controls.
