# PostHog AI Observability — Setup Report

## Variant

`ai-observability-anthropic-node` — the project's only LLM SDK is `@anthropic-ai/sdk` in a Node/TypeScript app (`package.json`), with no agent framework or gateway base URL override, so the plain provider mapping applies.

## What changed

- **`package.json`** — added `@posthog/ai` (`^8.12.1`) and `posthog-node` (`^5.52.4`).
  - `@anthropic-ai/sdk` was bumped from `^0.32.0` to `^0.124.0`. This wasn't optional: `@posthog/ai@8.12.1` declares a peer dependency of `@anthropic-ai/sdk >=0.112.3 <0.125.0`, and no published `@posthog/ai` release supports the old 0.32.x line. `npm install` fails with an `ERESOLVE` conflict otherwise. Chose `^0.124.0`, the newest version inside the required range.
- **`src/index.ts`**
  - Swapped `new Anthropic(...)` for PostHog's wrapper client: `new PostHogAnthropic({ apiKey, posthog })`, built from a `new PostHog(process.env.POSTHOG_API_KEY!, { host: process.env.POSTHOG_HOST })` client constructed at module level.
  - Both `client.messages.create(...)` calls inside `Conversation.ask()` (the initial call and the tool-result follow-up) now pass `posthogDistinctId`, `posthogTraceId`, and `posthogProperties: { $ai_session_id }`.
  - Cast each `create()` result to `Anthropic.Message` — the wrapper's overloads only carry a plain `Message` return type on the signature *without* the `posthog*` params, so adding those params pushes TypeScript onto the broader `Stream<RawMessageStreamEvent> | Message` overload. The cast restores the original narrowing without touching call behavior.
  - Added an `$ai_span` capture around the `get_weather` tool dispatch (the wrapper never sees that inline call), carrying the turn's trace id.
  - `main()` now `await`s `posthog.shutdown()` after both turns so the batched events flush before the process exits.
- **`.env`** — `POSTHOG_API_KEY` and `POSTHOG_HOST` set to this project's values (not committed).
- **`.env.example`** (new) — documents both keys with empty values, committed.
- **`.gitignore`** (new) — ignores `.env` only.

Nothing else was touched — no product-analytics `capture()` calls, no dashboards, no identify calls.

## The four facts

| Fact | Value | Source |
|---|---|---|
| Conversation | `Conversation.threadId` (e.g. `thread_abc`) | used as `$ai_session_id` |
| User | `Conversation.userId` (e.g. `user_123`) | used as `posthogDistinctId` |
| Turn | `Conversation.ask()` | one `crypto.randomUUID()` per call, shared by both `messages.create` calls inside it as `posthogTraceId` |
| Tools | `get_weather`, dispatched inline in `ask()` | captured as one `$ai_span` per run, tagged with the turn's trace id |

## Verify

Wired but unverified — I don't hold Anthropic or PostHog credentials to trigger a real call.

Run:

```bash
npm install
ANTHROPIC_API_KEY=sk-ant-... npm start
```

This asks two questions in the same conversation (`"What's the weather in San Francisco?"` then `"How about Boston?"`), the first of which triggers the `get_weather` tool.

Then open **LLM Analytics → Traces** in PostHog and check:

- One session (`thread_abc`) groups both turns.
- Each turn is its own trace, holding one or two generations (two for the San Francisco turn, since it calls the model twice around the tool call).
- The San Francisco trace has an `$ai_span` for `get_weather`.
- Events are attributed to `user_123`, not anonymous.

The build was verified locally: `npm install` resolves cleanly with the bumped `@anthropic-ai/sdk` version, `npm run build` (`tsc --noEmit`) passes with no errors, and `node -e "import('@posthog/ai/anthropic')..."` confirms the wrapper module resolves at runtime.

## Symptoms to watch for

| Symptom | Likely cause |
|---|---|
| One trace per generation instead of one per turn | `posthogTraceId` didn't reach a call (shouldn't happen here — both calls in `ask()` share the same `traceId` variable) |
| No session id / traces not grouped by conversation | `posthogProperties` didn't reach a call |
| Anonymous person | `POSTHOG_API_KEY` unset locally when running, or `posthogDistinctId` stripped |
| Nothing arrives in PostHog | `POSTHOG_API_KEY`/`POSTHOG_HOST` missing from `.env`, or the process exits before `posthog.shutdown()` completes |
