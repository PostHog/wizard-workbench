# wb-aio-google-adk-node-weather

Weather assistant, Google Agent Development Kit (`@google/adk`), two-turn
conversation with a registered tool. PostHog-less fixture for
`wizard ai-observability`.

The expected mechanism is `PostHogADKPlugin` from `@posthog/ai/adk`, added to
the `Runner`'s `plugins`. The plugin captures one `$ai_generation` per model
call and takes identity from ADK itself: the run's `userId` becomes the
distinct ID, the ADK `sessionId` becomes `$ai_session_id`, and each invocation
becomes a trace. No per-call PostHog parameters exist to add.

```
thread_abc                                    ← $ai_session_id (ADK sessionId)
├─ ask("weather in San Francisco?")           ← trace (invocation)
│  ├─ model call (→ get_weather call)         ← generation
│  └─ model call (→ answer)                   ← generation
└─ ask("How about Boston?")                   ← trace (same shape)
```

ADK runs the tool loop itself, and the plugin does not emit `$ai_span` events
for tool runs; the tool call is visible in the first generation's output. Do
not grade a missing tool span as a failure here.

## Expected outcome

- one session (`thread_abc`), two traces of `generation → generation`, all on
  `user_123`
- `PostHogADKPlugin` in the `Runner`'s `plugins`; no wrapper client swapped in
- identity left to the plugin's ADK fallbacks, or wired explicitly to the same
  `userId` / `sessionId` values; either way one session across both turns
- flushed before exit (`posthog.shutdown()`)
- `weather.ts`, the tool registration, and the agent untouched

Fail: swapping the model for a wrapped Gemini client (loses the agent
structure); a session or trace id minted per model call; hand-authored spans
around the tool; no flush.
