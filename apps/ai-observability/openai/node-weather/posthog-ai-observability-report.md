# PostHog AI Observability — Setup Report

## Variant

**`ai-observability-openai-node`** — the project's only LLM SDK is `openai` (`^4.77.0`) in `package.json`, called directly (no LangChain, no gateway `baseURL` override), so the plain OpenAI Node provider variant applies.

## What changed

- `package.json` — added `@posthog/ai` (`^7.21.0`) and `posthog-node` (`^5.51.6`) next to the existing `openai` dependency. The vendor SDK version was left untouched.
  - Note: `@posthog/ai@8.x` requires `openai@^6.48.0` as a peer and would have forced an upgrade of the vendor SDK, so `7.21.0` was pinned instead — the latest major that has no `openai` peer constraint and works with the project's `openai@4.x`.
- `.env` — created with `POSTHOG_API_KEY` and `POSTHOG_HOST` (not committed; already `.gitignore`d).
- `.env.example` — created with the same two keys, empty values, committed as documentation.
- `src/index.ts`:
  - Swapped `new OpenAI(...)` for PostHog's wrapper client: `new (OpenAI from '@posthog/ai/openai')({ apiKey, posthog })`.
  - Added a module-level `PostHog` client (`posthog-node`), read from `POSTHOG_API_KEY`/`POSTHOG_HOST`.
  - `SESSION_ID` — one `crypto.randomUUID()` generated once at module load. The app has no thread/conversation id, so per the skill's rule the process run is the conversation.
  - `ask()` is the turn: a fresh `traceId` is generated at the top of the function and passed as `posthogTraceId` to both `chat.completions.create` calls inside it (initial call + the follow-up after the tool result), so both generations land in one trace.
  - `posthogDistinctId: USER_ID` attached to both calls — the app already had a `USER_ID = 'user_123'` constant in scope.
  - The `get_weather` tool run (previously untracked — the wrapper never sees it, since it runs inline between the two `create()` calls) is now captured as an `$ai_span` event via `posthog.capture()`, carrying the turn's `$ai_trace_id` and `$ai_session_id` so it joins the trace.
  - `main()` now `await posthog.shutdown()`s before exit (both success and error paths) so the queued events flush before the short-lived process ends.

No existing PostHog init, identify calls, event capture, or dashboards existed in this project — none were touched, per the AI Observability carve-out.

## Verification — wired, unverified

- `npm install` succeeded; `npm run build` (`tsc --noEmit`) passes cleanly, confirming the `@posthog/ai/openai` import resolves and all types line up (message/tool types are derived from the wrapped client's own call signature to avoid a mismatch between the project's `openai@4.104.0` and the newer `openai@6.49.0` that `@posthog/ai` bundles internally).
- The app was **not run** — no `OPENAI_API_KEY` is configured in this environment, and per the skill I don't hold credentials to trigger a live model call.

### To verify

1. Set `OPENAI_API_KEY` in `.env` (real key).
2. Run `npm run start`. This asks one question ("What's the weather in San Francisco?"), which triggers a tool call, so the trace has depth: generation → span → generation.
3. In PostHog, open **LLM Analytics → Traces** and check the newest trace:
   - One trace holds both generations from the run.
   - A span appears for the `get_weather` tool call.
   - The person is `user_123`, not anonymous.
   - Run the app a second time and confirm a *new* session id appears (each process run is a new conversation) with its own trace, per the app's "no conversation id" design.
