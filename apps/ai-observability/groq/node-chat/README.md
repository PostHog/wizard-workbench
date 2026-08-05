# wb-aio-groq-node-chat

Two-turn chat served by Groq through the `openai` Node SDK — the provider is
named only by `baseURL`. PostHog-less fixture for `wizard ai-observability`.

```
thread_abc                        ← $ai_session_id (Thread.threadId)
├─ ask("What is a feature flag?") ← trace
│  └─ chat.completions.create     ← generation
└─ ask("How is that different?")  ← trace
   ├─ condense                    ← generation
   └─ reply                       ← generation
```

## Expected outcome

- one session (`thread_abc`), two traces — one generation, then two — all on
  `user_123`
- **provider recorded as Groq, not OpenAI**; `baseURL` intact
- `@posthog/ai` OpenAI wrapper (it reads `baseURL` for the provider): per-call
  identity, shared `posthogTraceId` within turn two
- `$ai_session_id` spelled exactly; flushed before exit (CLI)
- `moderate()` untouched — a plain guard, not a tool

Fail: provider attributed to OpenAI; a span around `moderate()`; turn two split
into two traces; no flush.
