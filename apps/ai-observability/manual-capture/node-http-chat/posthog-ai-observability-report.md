# AI Observability setup report

**Variant:** `manual-capture` — the app calls its LLM endpoint with plain `fetch()` (no vendor SDK in `package.json`), so there's no wrapper client to swap in. Events are captured directly with `posthog.capture()`.

## What changed

Only `src/index.ts` was touched — no new dependencies (`posthog-node` was already in the manifest for product analytics, and the existing client in `src/posthog.ts` is reused as-is).

- **Generations** (`$ai_generation`): captured inside `complete()`, once per model call. Carries `$ai_model` (`llama3.2`), `$ai_provider` (`ollama` — the default `LLM_URL` points at Ollama's OpenAI-compatible endpoint on `:11434`), input/output messages, token counts, latency, and HTTP status.
- **Trace** (`$ai_trace_id`): one UUID minted per `Thread.ask()` call (a turn), shared by both `complete()` calls when a tool round-trip happens, so the tool-triggering call and the follow-up call land in the same trace.
- **Session** (`$ai_session_id`): the thread's `threadId` (e.g. `thread_abc`), so every turn in one conversation groups into one session.
- **Person**: `userId` as `distinctId` on every event.
- **Tool span** (`$ai_span`): captured around the `lookup_order` dispatch in the tool-call loop, sharing the turn's trace id and named after the tool (`lookup_order`).

## Four facts used

| Fact | Value |
|---|---|
| Conversation | `Thread.threadId` |
| User | `Thread.userId` |
| Turn | `Thread.ask()` — one question/answer pair, up to two model calls |
| Tools | Yes — `lookup_order`, dispatched in the loop after the first `complete()` call |

## Verify

Run the app end to end:

```bash
npm start
```

This drives one `Thread` through two turns (`"Where is my order?"` then `"Can I get a refund instead?"`), the first of which should trigger the `lookup_order` tool. Requires an OpenAI-compatible endpoint at `LLM_URL` (defaults to a local Ollama instance on `:11434` serving `llama3.2`).

Then open **AI Observability > Traces** in PostHog:

- Two traces should appear, both under the same session `thread_abc`.
- The first trace should show a `lookup_order` span alongside its generations.
- Every event should be attributed to `user_123`, not anonymous.

**Status: wired, unverified** — this run did not call the model or check what landed in PostHog. Confirm the tree above after triggering a run.
