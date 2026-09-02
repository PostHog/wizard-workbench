# PostHog AI Observability Setup Report

## Variant

`ai-observability-anthropic-node` — the project's only LLM SDK is `@anthropic-ai/sdk` (Node, `package.json`), matched by the plain-provider rule.

## What changed

`src/index.ts` (the only file that builds the vendor client and makes model calls):

- Replaced the raw `Anthropic` client with PostHog's drop-in wrapper: `import { Anthropic as PostHogAnthropic } from '@posthog/ai/anthropic'`, constructed with a `PostHog` (`posthog-node`) client attached (`posthog` option).
- Kept the original `@anthropic-ai/sdk` import for its types (`Anthropic.Tool`, `Anthropic.Message`, etc.) — nothing about the vendor SDK itself changed.
- The `PostHog` client is constructed with `flushAt: 1, flushInterval: 0` and `await posthog.shutdown()` runs at the end of `main()` (and in the catch handler), since this is a short-lived CLI script rather than a long-running server — otherwise the batched `$ai_span` capture could be dropped on exit.
- Every `client.messages.create(...)` call in `Conversation.ask()` (the turn) now carries:
  - `posthogProperties: { $ai_session_id: this.threadId }` — one id for the whole conversation (`thread_abc`).
  - `posthogTraceId: traceId` — one `crypto.randomUUID()` minted per `ask()` call (per turn), reused by both the initial call and the tool-result followup call inside that turn.
  - `posthogDistinctId: this.userId` — the app's existing `userId` (`user_123`).
- The app registers one tool (`get_weather`) and dispatches it inline in `ask()`. Added a `posthog.capture({ event: '$ai_span', ... })` right next to that dispatch, carrying the turn's `$ai_trace_id`, `$ai_session_id`, a fresh `$ai_span_id`, the tool name, input/output state, and latency.

Nothing else in the app was touched — no product-analytics events, no error tracking, no reverse proxy (not needed for server-side Node).

## Packages

Added to `package.json` (no vendor SDK version change):

- `@posthog/ai@^7.21.0`
- `posthog-node@^5.51.6`

Note on version pin: the latest `@posthog/ai` (8.x) declares `@anthropic-ai/sdk` as a peer requiring `>=0.78.0`, which conflicts with this project's pinned `@anthropic-ai/sdk@^0.32.0`. Per the skill's instruction not to upgrade the vendor SDK, I used `@posthog/ai@7.21.0` instead — the last line where `@anthropic-ai/sdk` is bundled as an ordinary (non-peer) dependency, so it installs cleanly alongside `^0.32.0` with no conflict. `npm install` and `tsc --noEmit` both pass.

One TypeScript wrinkle: the wrapper's `messages.create()` overloads resolve to a `Stream | Message` union once `posthog*` params are added without an explicit `stream` field. Since both call sites are non-streaming, I added an `as Anthropic.Message` cast after each call — this matches the actual runtime type and was the minimal fix instead of restructuring the calls.

## Environment variables

Set via `set_env_values` into `.env` (not committed) using the project's real token/host:

- `POSTHOG_API_KEY`
- `POSTHOG_HOST`

Added both (empty) to `.env.example`, which stays committed. `.env` is already covered by `.gitignore`.

## Verify it yourself

Run:

```bash
npm run start
```

This calls `ask()` twice on the same `Conversation` (`thread_abc`) — "What's the weather in San Francisco?" then "How about Boston?" — and the first call also exercises the `get_weather` tool. You'll need `ANTHROPIC_API_KEY` set in your shell for the Anthropic call to succeed; the PostHog side only needs `POSTHOG_API_KEY`/`POSTHOG_HOST` in `.env`, which are already set.

Then open **AI Observability > Traces** in PostHog and check the newest trace(s):

- One session (`$ai_session_id = thread_abc`) should group both turns.
- The first turn's trace should hold two generations (initial call + tool-result followup) plus one `$ai_span` for `get_weather`.
- The second turn's trace should hold a single generation with no span (no tool call expected for "Boston").
- The person should resolve to `user_123`.

I did not run the vendor SDK myself (no Anthropic credentials available here), so this is **wired, unverified** — please confirm what lands in PostHog.
