# Framework rules

Follow these when integrating PostHog into this framework.

- A missing PostHog configuration must never break the app — read keys optionally (never a required setting), guard init and capture behind their presence, and keep build and boot working with no PostHog environment set — but never silently: in development or debug builds fail loudly, using the language's idiomatic error, with the message "<VAR> variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once <VAR> is configured" (substituting the actual variable name); production stays a no-op
- AI Observability carve-out: this skill instruments LLM calls and is not product-analytics coverage. Do NOT add posthog.capture() events for user actions, captureException() error handlers, or a reverse proxy unless the user explicitly asks for them
- AI Observability carve-out: only the wrapper-client and manual-capture install paths construct a PostHog client. The OTel and framework-hook paths have no client at all, so any rule in this file about the Posthog()/PostHog() constructor, exception autocapture, atexit/shutdown registration or flushing simply does not apply — never invent a client just to satisfy one
- AI Observability carve-out: the $ai_* payload properties ($ai_input, $ai_output_choices, and the rest) intentionally carry user-generated prompt and completion text, so this file's PII rules do NOT apply to them. Those rules still govern every other property you set
- AI Observability carve-out: the Go OpenTelemetry path uses the nested github.com/posthog/posthog-go/otel module, not the core github.com/posthog/posthog-go SDK. This file's Go install and import line does not apply, and neither do its posthog.NewWithConfig client rules: the bridge registers a span processor and builds no PostHog client
- AI Observability carve-out: read the PostHog key and host exactly as the variant's install doc reads them. A direct os.environ["POSTHOG_API_KEY"] / process.env lookup already fails loudly and idiomatically when unset, which satisfies this file's missing-configuration rule — do NOT add a separate presence check, guard branch, or custom raise around a bootstrap that is only a few lines long
- posthog-go is the Go SDK package; install it with `go get github.com/posthog/posthog-go` and import `github.com/posthog/posthog-go`
- Create one PostHog client per process with `posthog.NewWithConfig(...)`; do not create a new client per request or job
- Always close the client during graceful shutdown with `client.Close()` so queued events flush before the process exits
- Configure the project token, endpoint, and optional personal API key from environment variables; never hardcode PostHog secrets
- Server-side captures must set `DistinctId` to a stable user ID that matches frontend identify calls; avoid anonymous or literal IDs for business events
- Use `posthog.NewProperties().Set(...)` for event properties and keep PII in person properties via `$set`, not in event properties
- For new feature flag code, prefer `client.EvaluateFlags(...)` once per user/request, then use the returned snapshot's `IsEnabled` or `GetFlag` methods
- When capturing events related to feature-gated code, attach the evaluated flag snapshot with `Flags`, optionally filtered with `OnlyAccessed()` or `Only(...)`
- Avoid deprecated feature flag helpers such as `IsFeatureEnabled`, `GetFeatureFlag`, `GetFeatureFlagPayload`, and `Capture.SendFeatureFlags` in new code
- For error tracking, use `posthog.NewDefaultException(...)` for direct captures or wrap `log/slog` with `posthog.NewSlogCaptureHandler(...)` for automatic warning-and-above exception capture
