# wb-aio-google-adk-node-weather

Weather assistant, Google Agent Development Kit (`@google/adk`), two-turn
conversation with a registered tool. PostHog-less fixture for
`wizard ai-observability`.

The expected mechanism is `PostHogADKPlugin` from `@posthog/ai/adk`, added to
the `Runner`'s `plugins`. The plugin hooks the run, agent, tool, and model
callbacks and captures the whole tree itself: an `$ai_trace` per invocation,
`$ai_span` events for agent runs and tool calls, and one `$ai_generation` per
model call. Identity comes from ADK too: the run's `userId` becomes the
distinct ID, the ADK `sessionId` becomes `$ai_session_id`. No per-call
PostHog parameters exist to add.

```
thread_abc                                    ← $ai_session_id (ADK sessionId)
├─ ask("weather in San Francisco?")           ← trace (invocation)
│  └─ weather_assistant                       ← span (agent run)
│     ├─ model call (→ get_weather call)      ← generation
│     ├─ get_weather                          ← span (tool)
│     └─ model call (→ answer)                ← generation
└─ ask("How about Boston?")                   ← trace (same shape)
```

## Expected outcome

- one session (`thread_abc`), two traces of
  `agent span → generation → span(get_weather) → generation`, all on `user_123`
- `PostHogADKPlugin` in the `Runner`'s `plugins`; no wrapper client swapped in
- the agent and tool spans come from the plugin's callbacks, not hand-authored
  `$ai_span` capture around `getWeather`
- identity left to the plugin's ADK fallbacks, or wired explicitly to the same
  `userId` / `sessionId` values; either way one session across both turns
- flushed before exit (`posthog.shutdown()`)
- `weather.ts`, the tool registration, and the agent untouched

Fail: swapping the model for a wrapped Gemini client (loses the agent
structure); hand-authored spans duplicating what the plugin emits; a session
or trace id minted per model call; no flush.
