# wb-aio-openai-python-weather

Weather assistant, OpenAI Python SDK (`chat.completions`), two-turn
conversation. PostHog-less fixture for `wizard ai-observability`.

```
thread_abc                                    ← $ai_session_id (Conversation.thread_id)
├─ ask("weather in San Francisco?")           ← trace
│  ├─ chat.completions.create (→ tool_calls)  ← generation
│  ├─ get_weather                             ← span
│  └─ chat.completions.create (→ answer)      ← generation
└─ ask("How about Boston?")                   ← trace (same shape)
```

The tool loop appends the response message object back into `self.messages`,
per OpenAI's docs. A crash there signals a stale `posthog` resolve (< 7.x), not
an app bug.

## Expected outcome

- one session (`thread_abc`), two traces of
  `generation → span(get_weather) → generation`, all on `user_123`
- `posthog.ai.openai` wrapper: per-call `posthog_distinct_id` /
  `posthog_properties`, and a **shared `posthog_trace_id` per `ask()`**
- `$ai_session_id` spelled exactly; flushed before exit (CLI)
- `weather.py` and the tool loop untouched — including the message-object append

Fail: a hand-authored span around `get_weather`; a session id per turn; a trace
per model call; no flush; dict-ifying the message append to dodge a stale SDK.
