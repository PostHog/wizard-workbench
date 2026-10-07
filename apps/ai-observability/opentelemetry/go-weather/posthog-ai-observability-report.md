# PostHog AI Observability setup

## Status

**Wired and build-verified; live delivery is not yet verified.** `go build ./...` completed successfully. I did not invoke the OpenAI API because `OPENAI_API_KEY` is not configured locally.

## Integration

- Installed `github.com/posthog/posthog-go/otel` with the OpenTelemetry Go SDK in `go.mod`.
- `main.go` registers `posthogotel.NewSpanProcessor` on an OpenTelemetry tracer provider. The PostHog project token and host are read only from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- `.env` now provides those two PostHog configuration values. The token is not embedded in source code.
- `Conversation.ThreadID` is propagated as `$ai_session_id`, so both questions in the same conversation are grouped into one AI Observability session.
- `Conversation.UserID` is propagated as `posthog.distinct_id` on every span.
- Each `Conversation.Ask` call creates one `gen_ai.turn` trace root. Each OpenAI completion is a child generation span with provider, model, message, tool, response, token-usage, and error attributes.
- The existing `get_weather` execution is represented as a child `gen_ai.tool.get_weather` span when the model requests it.
- The provider is shut down on normal completion and force-flushed before an error exit, so buffered spans are delivered.
- Added `.posthog-wizard-cache/.posthog-ai.json` for the integration handoff.

## Expected trace shape

For the supplied two-question fixture, AI Observability should show one session for `thread_abc` containing two traces. A turn that triggers the weather function has this hierarchy:

```text
gen_ai.turn
├─ gen_ai.chat_completions
├─ gen_ai.tool.get_weather
└─ gen_ai.chat_completions
```

A turn that does not request the tool contains the trace root and one generation span. Both turns are attributed to the conversation's stable user ID.

## Verify live delivery

1. Configure a valid `OPENAI_API_KEY` in your secure runtime environment. It is intentionally not written to the repository.
2. Load the local configuration and run the fixture:

   ```bash
   set -a
   . ./.env
   set +a
   go run .
   ```

3. In PostHog, open **AI Observability → Traces** and inspect the newest trace. Confirm that its session is `thread_abc`, both model calls from a tool-using turn share one trace, and `get_weather` is a child span.
4. Run the second question in the same conversation to confirm it becomes a second trace in that same AI session.

## Privacy mode

The OpenTelemetry path does not have the wrapper SDK's `privacyMode` configuration. This integration deliberately sets `gen_ai.input.messages` and `gen_ai.output.messages` in `main.go`, so prompts and completions are captured when the spans are sent.

Before handling prompts or completions that must not be stored in PostHog, apply an application-level redaction policy or stop attaching those message attributes before the span is exported. This changes only newly captured data; it does not remove data already stored. See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for the product-wide behavior and retention details.

## Compatibility note

The current OpenTelemetry SDK resolution requires Go 1.26, so `go get` updated the module directive from Go 1.25.0 to Go 1.26.0 and downloaded that toolchain during verification. Ensure CI and deployment use Go 1.26 or later.
