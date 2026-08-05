# wb-aio-manual-http-chat

Two-turn chat over plain `fetch` — no vendor LLM SDK, so manual capture is the
only path. **PostHog product analytics is already wired** (`src/posthog.ts`).
Fixture for `wizard ai-observability`.

```
thread_abc                      ← $ai_session_id (Thread.threadId)
├─ ask("Where is my order?")    ← trace
│  ├─ complete (tool_calls)     ← $ai_generation
│  ├─ lookup_order              ← $ai_span
│  └─ complete (final)          ← $ai_generation
└─ ask("Can I get a refund?")   ← trace
   └─ complete                  ← $ai_generation
```

## Expected outcome

- one session (`thread_abc`), two traces — `generation → span(lookup_order) →
  generation`, then a single generation — all on `user_123`, children linked
  via `$ai_parent_id`
- **the existing client from `src/posthog.ts` reused** — never a second
  instance; existing `identify()` / `capture()` calls untouched
- each `complete()` captured as `$ai_generation` with provider, model, input,
  output, tokens (already parsed from the response body), latency
- the tool dispatch captured as `$ai_span`
- one `$ai_trace_id` per `ask()`; `$ai_session_id` spelled exactly, on every
  event; the existing shutdown preserved

Fail: a second PostHog client; a trace id per model call; missing
`$ai_parent_id`; edits to the product-analytics calls.
