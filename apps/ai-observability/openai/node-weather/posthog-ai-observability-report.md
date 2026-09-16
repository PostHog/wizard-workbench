# PostHog AI Observability — Setup Report

**Variant:** `ai-observability-openai-node` (OpenAI SDK, Node — matched by the `openai` dependency in `package.json`)

## What changed

- **`package.json`** — added `@posthog/ai` and `posthog-node` alongside the existing `openai` dependency. No existing dependency was upgraded.
- **`src/index.ts`**:
  - Swapped the vendor `OpenAI` client constructor for the PostHog wrapper (`OpenAI as PostHogOpenAI` from `@posthog/ai`), keeping the plain `openai` package as a type-only import for the request/response shapes. The wrapper is a drop-in — both `chat.completions.create` call sites are unchanged except for three new parameters.
  - Created a module-level `PostHog` client reading `POSTHOG_API_KEY` / `POSTHOG_HOST` directly from `process.env` (no extra presence guard — an unset key fails when the client tries to use it, per the existing pattern in this file for `OPENAI_API_KEY`).
  - **Session** — the app has no conversation/thread id, so one process run is one session: `SESSION_ID = randomUUID()` at module scope, sent as `$ai_session_id` on every call.
  - **Trace** — `ask()` is the turn (it may call the model twice: once for the initial response, once for the follow-up after the tool runs). A `traceId = randomUUID()` is minted once per `ask()` call and passed as `posthogTraceId` to both `chat.completions.create` calls in that turn.
  - **User** — the file already declared an unused `USER_ID = 'user_123'` constant; it's now wired through as `posthogDistinctId` on every call.
  - **Tool span** — `get_weather` is the one registered tool. Its dispatch (already present in `ask()`) now also emits a `posthog.capture({ event: '$ai_span', ... })` call carrying the turn's `$ai_trace_id`, the session id, input/output state, and latency.
  - `main()` awaits `posthog.shutdown()` before exit (and on the error path) so the buffered events flush before the short-lived process ends.
- **`.env`** — set `POSTHOG_API_KEY` and `POSTHOG_HOST` to this project's real values.
- **`.env.example`** — added `POSTHOG_API_KEY=` / `POSTHOG_HOST=` (empty, documentation only, stays committed).

Nothing else was touched — no `posthog.capture()` events for product analytics, no error handler, no dashboard. Those belong to the base `integration` skill, not this one.

## Note on the install doc

The doc for this variant showed `import { OpenAI } from '@posthog/ai/openai'`. The installed package (`@posthog/ai@3.3.2`) has no `/openai` subpath export — the wrapper class is exported from the package root as `OpenAI`. Since that name collides with the plain `openai` package's default export (needed for `OpenAI.ChatCompletionTool` / `OpenAI.ChatCompletionMessageParam` types), the plain SDK is imported as a type-only `OpenAI` and the wrapper as `PostHogOpenAI`. Verified with `tsc --noEmit` — the project builds clean.

## Verify it yourself

1. Make sure `OPENAI_API_KEY` is set (it isn't managed by this skill — it was already read from the environment before this change).
2. Run `npm run start` (`tsx src/index.ts`). This triggers one turn that calls the model, runs the `get_weather` tool, and calls the model again with the tool result.
3. Open **LLM Analytics → Traces** in PostHog and check the newest trace:
   - One trace should contain both `chat.completions.create` generations from that run.
   - A `$ai_span` event named `get_weather` should appear in the same trace.
   - The person should be `user_123`, not anonymous.
4. Run it a second time in the same process lifetime (or re-run the script) — traces from different runs get different session ids, since each process run is treated as its own conversation. If you want multiple turns to share a session, that requires a real conversation id, which this app doesn't have.

This is **wired, unverified** — I did not call the OpenAI API myself (no credentials here), so confirm the trace tree lands as described above before relying on it.
