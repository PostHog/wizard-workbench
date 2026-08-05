# wb-aio-openai-docs-rag

Docs Q&A: OpenAI embeddings for retrieval, responses API for the answer.
PostHog-less fixture for `wizard ai-observability`.

```
the Q&A run                                     ← $ai_session_id (no field — infer it)
├─ answer("How are feature flags evaluated?")   ← trace
│  ├─ embeddings.create                         ← embedding
│  └─ responses.create                          ← generation
└─ answer("Does session replay record video?")  ← trace (same shape)
```

## Expected outcome

- one session, two traces of `embedding → generation`, all on `user_123` — one
  session id established for the run and shared by both traces
- `posthog.ai.openai` wrapper; embedding calls captured as `$ai_embedding`
- `$ai_session_id` spelled exactly; flushed before exit (CLI)
- the retrieval maths untouched — it is not a tool

Fail: a span around `retrieve()`; a session id per `answer()`; no session
because no field exists; no flush.
