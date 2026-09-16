# PostHog AI Observability — Anthropic (Node)

## Variant

`ai-observability-anthropic-node`, chosen because the manifest declares `@anthropic-ai/sdk` directly with no wrapping agent framework or OpenAI-compatible gateway.

## What changed

- **`package.json`** — added `@posthog/ai` (`^4.4.0`) and `posthog-node` (`^4.17.1`) alongside the existing `@anthropic-ai/sdk` (left untouched at `^0.32.0`). This is the newest `@posthog/ai` line whose `@anthropic-ai/sdk` requirement is a bundled dependency rather than a peer range that would conflict with the project's pinned SDK version.
- **`.env`** — set `POSTHOG_API_KEY` and `POSTHOG_HOST` (not committed).
- **`.env.example`** — added `POSTHOG_API_KEY=` and `POSTHOG_HOST=` as documentation.
- **`src/index.ts`**:
  - Swapped the vendor `Anthropic` client for `Anthropic` from `@posthog/ai/anthropic`, constructed with a `PostHog` client (`flushAt: 1`, `flushInterval: 0` since this is a one-shot script, not a long-running server).
  - Every `messages.create` call in `Conversation.ask()` now carries:
    - `posthogProperties: { $ai_session_id: this.threadId }` — one session id per `Conversation` (its `threadId`, e.g. `thread_abc`), shared by every turn.
    - `posthogTraceId` — a fresh UUID minted once per `ask()` call, reused by both the initial call and the tool-result follow-up call inside that turn.
    - `posthogDistinctId: this.userId` — the app's own `user_123`.
  - The `get_weather` tool run is captured as an `$ai_span` event (`posthog.capture(...)`) carrying the turn's `$ai_trace_id` and the conversation's `$ai_session_id`, so it joins the trace instead of floating unattached.
  - `main()` now calls `posthog.shutdown()` in a `.finally()` so the batched span/generation events flush before the process exits.

Nothing else was touched — no product-analytics `capture()` calls, no error handler, no reverse proxy, no changes to `weather.ts`.

## Cardinality

- One `$ai_session_id` per `Conversation` instance (`thread_abc` in `main()`).
- One `posthog_trace_id` per `ask()` call — both model calls within a tool-use turn share it.
- One `$ai_span` per tool run, tagged with that turn's trace id.
- Distinct id is `user_123`, the app's existing user id — not anonymous.

## Build verification

- `npm install` succeeds with the pinned versions above (no `--legacy-peer-deps` needed).
- `npm run build` (`tsc --noEmit`) passes with no errors.
- `node -e "import('@posthog/ai/anthropic')"` resolves the wrapper's entry point.

Note: the `@posthog/ai` wrapper's overloaded `messages.create` types don't include `MonitoringParams` in the non-streaming overload, so passing `posthogTraceId`/`posthogDistinctId`/`posthogProperties` makes TypeScript infer the broader `Message | Stream<...>` return type even though we never request streaming. Both call sites cast the result to `Anthropic.Message` to reflect that.

## How to verify data lands in PostHog

This run did not call the live model (no credentials available here). To confirm the tree arrives correctly:

1. Set a real `ANTHROPIC_API_KEY` in `.env` alongside the already-configured `POSTHOG_API_KEY`/`POSTHOG_HOST`.
2. Run `npm start` — it asks two questions on the same `Conversation` (`thread_abc`), the first of which triggers the `get_weather` tool.
3. Open **AI Observability → Traces** in PostHog. Expect:
   - Two traces (one per question) grouped under one session (`thread_abc`).
   - The first trace has two generations (initial call + tool-result follow-up) and one `$ai_span` for `get_weather`, all sharing that trace's id.
   - The second trace (no tool use) has a single generation.
   - Both traces attributed to distinct id `user_123`, not anonymous.

Status: **wired, unverified** — instrumentation is in place and typechecks, but no live call has been made to confirm the data reaches PostHog.
