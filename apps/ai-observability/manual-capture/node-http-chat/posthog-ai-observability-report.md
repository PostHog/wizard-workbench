# PostHog AI Observability — Setup Report

**Variant:** `ai-observability-manual-capture` (Node)

**Reason:** No vendor LLM SDK in `package.json` — the app talks to an OpenAI-compatible endpoint (Ollama, by default) via plain `fetch`. No `openai` package or other provider SDK is present, so this doesn't match the provider/gateway rules; `manual-capture` is the correct path.

## What changed

- `src/index.ts`
  - `complete()` now takes a `GenerationContext` (`sessionId`, `traceId`, `distinctId`) and captures a `$ai_generation` event after every model call, with `$ai_input`, `$ai_output_choices`, token counts, and latency.
  - `Thread.ask()` mints one `posthog_trace_id`-equivalent (`context.traceId`, a `randomUUID()`) per turn and reuses it across both model calls in a turn (the initial call and the follow-up after a tool run), so a turn with a tool call produces one trace, not two.
  - The `lookup_order` tool dispatch now captures an `$ai_span` event carrying the turn's trace id, span name, and I/O.
- `.env` — set `POSTHOG_PROJECT_API_KEY` and `POSTHOG_HOST` (reusing the names the existing `src/posthog.ts` client already read).
- `.env.example` — added `POSTHOG_PROJECT_API_KEY=` and `POSTHOG_HOST=` as documented, empty placeholders.
- No packages added — `posthog-node` was already a dependency (used for product analytics) and is reused for the AI events; no OpenTelemetry packages were introduced.
- Nothing else touched: `src/posthog.ts` (existing product-analytics client) and `src/orders.ts` are unchanged, and no new `capture()` calls were added for product events.

## The four facts

| Fact | Value |
|---|---|
| Conversation | `Thread.threadId` (`"thread_abc"`) → `$ai_session_id` |
| User | `Thread.userId` (`"user_123"`) → `distinctId` |
| Turn | `Thread.ask()` — one question/answer, up to two model calls when a tool runs → one `$ai_trace_id` per call to `ask()` |
| Tools | Yes — `lookup_order`, dispatched inline in `ask()` → captured as `$ai_span` |

`$ai_provider` is hardcoded to `"ollama"`, matching the default `LLM_URL` (`http://localhost:11434/v1/chat/completions`). If `LLM_URL` is pointed at a different host in some environments, update `PROVIDER` in `src/index.ts` accordingly so cost attribution stays correct.

## Verified

- `npm run build` (tsc --noEmit) passes.
- `posthog-node` resolves (`node -e "require('posthog-node')"`).
- Not verified: an actual run against a live LLM endpoint, since this environment has no Ollama/model server reachable and no credentials to trigger one.

## How to verify end-to-end

1. Point `LLM_URL` at a running OpenAI-compatible endpoint (defaults to `http://localhost:11434/v1/chat/completions`, i.e. local Ollama with `llama3.2` pulled).
2. Run `npm start` — it fires two turns (`Where is my order?`, `Can I get a refund instead?`) on the same thread, and the first turn triggers the `lookup_order` tool.
3. In PostHog, open **LLM Analytics → Traces**. Expect:
   - One session (`thread_abc`) holding two traces (one per turn).
   - The first trace containing two generations (tool-call turn + follow-up) plus one `lookup_order` span, all sharing the same trace id.
   - The second trace containing one generation.
   - Both traces attributed to person `user_123`.
