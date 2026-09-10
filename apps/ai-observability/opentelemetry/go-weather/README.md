# wb-aio-opentelemetry-go-weather

Weather assistant, official OpenAI Go SDK (`openai-go`), two-turn
conversation. PostHog-less fixture for `wizard ai-observability`.

Go has no PostHog wrapper SDK. The expected mechanism is the
`github.com/posthog/posthog-go/otel` bridge: register its span processor on a
`TracerProvider`, then hand-author `gen_ai.*` spans around the model calls,
because no Go instrumentation library exists for `openai-go`.

```
thread_abc                                    ← $ai_session_id (Conversation.ThreadID)
├─ Ask("weather in San Francisco?")           ← trace
│  ├─ Chat.Completions.New (→ tool_calls)     ← generation
│  ├─ get_weather                             ← span
│  └─ Chat.Completions.New (→ answer)         ← generation
└─ Ask("How about Boston?")                   ← trace (same shape)
```

## Expected outcome

- one session (`thread_abc`), two traces of
  `generation → span(get_weather) → generation`, all on `user_123`
- `posthogotel.NewSpanProcessor` on a `TracerProvider`; each model call gets a
  span with `gen_ai.*` attributes (operation, provider, model, messages, token
  usage) so it lands as `$ai_generation`
- one OTel trace per `Ask`: a root span per turn that itself passes the AI
  span filter (name or attribute key in the `gen_ai.` / `ai.` namespaces),
  with the generations and the tool span as children
- the tool run captured as a child span with `gen_ai.*` tool attributes, not
  left as a plain span the processor drops
- `$ai_session_id` spelled exactly, on every span in the thread;
  `posthog.distinct_id` carries `user_123`
- flushed before exit (`ForceFlush` or `Shutdown` on the provider)
- `weather.go` and the tool loop untouched, including the `ToParam()` append

Fail: importing a PostHog wrapper that does not exist in Go; spans that miss
the bridge's AI filter and never reach PostHog; a session id minted per turn;
one trace per model call; no flush.
