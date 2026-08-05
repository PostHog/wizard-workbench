# wb-aio-openai-node-weather

Weather assistant, OpenAI Node SDK (`chat.completions`), single question.
PostHog-less fixture for `wizard ai-observability`.

```
the run                                       ← $ai_session_id (no field — infer it)
└─ ask("weather in San Francisco?")           ← trace
   ├─ chat.completions.create (→ tool_calls)  ← generation
   ├─ getWeather                              ← span
   └─ chat.completions.create (→ answer)      ← generation
```

## Expected outcome

- one session, one trace: `generation → span(getWeather) → generation`, all on
  `user_123`
- `@posthog/ai` OpenAI wrapper: per-call `posthogDistinctId` /
  `posthogProperties`, shared `posthogTraceId` across the turn's two calls
- `$ai_session_id` spelled exactly; flushed before exit (CLI)
- `weather.ts` and the tool loop untouched

Fail: a hand-authored span around `getWeather`; a trace per model call; no
flush.
