# wb-aio-anthropic-node-weather

Weather assistant, Anthropic Node SDK, two-turn conversation. PostHog-less
fixture for `wizard ai-observability`.

```
thread_abc                              ← $ai_session_id (Conversation.threadId)
├─ ask("weather in San Francisco?")     ← trace
│  ├─ messages.create (→ tool_use)      ← generation
│  ├─ get_weather                       ← span
│  └─ messages.create (→ answer)        ← generation
└─ ask("How about Boston?")             ← trace (same shape)
```

## Expected outcome

- one session (`thread_abc`), two traces of
  `generation → span(get_weather) → generation`, all on `user_123`
- `@posthog/ai` Anthropic wrapper: per-call `posthogDistinctId` /
  `posthogProperties`, and a **shared `posthogTraceId` per `ask()`** — omitted,
  each call mints its own and the turn splits
- `$ai_session_id` spelled exactly; flushed before exit (CLI)
- `weather.ts` and the tool loop untouched

Fail: a hand-authored span around `getWeather`; a session id per turn; a trace
per model call; no flush.
