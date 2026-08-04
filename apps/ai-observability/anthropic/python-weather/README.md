# wb-aio-anthropic-python-weather

Weather assistant, Anthropic Python SDK, single question. PostHog-less fixture
for `wizard ai-observability`.

```
the run                                 ← $ai_session_id (no field — infer it)
└─ ask("weather in San Francisco?")     ← trace
   ├─ messages.create (→ tool_use)      ← generation
   ├─ get_weather                       ← span
   └─ messages.create (→ answer)        ← generation
```

## Expected outcome

- one session, one trace: `generation → span(get_weather) → generation`, all on
  `user_123`
- `posthog.ai.anthropic` wrapper: per-call `posthog_distinct_id`, shared
  `posthog_trace_id`, `posthog_properties={"$ai_session_id": ...}`
- `$ai_session_id` spelled exactly; flushed before exit (CLI)
- `weather.py` and the tool loop untouched

Fail: a hand-authored span around `get_weather`; a session id per call; no
flush.
