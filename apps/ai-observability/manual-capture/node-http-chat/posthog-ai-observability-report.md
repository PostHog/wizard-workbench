# PostHog AI Observability setup

## Status

AI Observability is wired for the application's manual HTTP chat calls and is **build-verified, runtime-unverified**. The project makes OpenAI-compatible `fetch` requests directly to a local Ollama endpoint and has no vendor LLM SDK, so the `ai-observability-manual-capture` workflow was used.

## What changed

- Configured `POSTHOG_PROJECT_API_KEY` and `POSTHOG_HOST` in `.env` for the existing `posthog-node` client. No token or host was added to source code.
- Added explicit `$ai_generation` capture in `src/index.ts` for every model request, including model, provider (`ollama`), messages, completion text, token usage, tools, and latency.
- Added a new UUID trace for each `Thread.ask()` turn (`src/index.ts:121`) and reuses it for every generation and tool span in that turn.
- Uses `Thread.threadId` as `$ai_session_id` on every AI event, grouping the two chat turns into one AI Observability session.
- Added `$ai_span` capture for each `lookup_order` tool execution. Parent IDs link the initial generation, tool span, and follow-up generation into a tree.
- Preserved the existing PostHog client, product-analytics `identify()`, `chat_message_sent` event, and shutdown behavior.

## Expected AI Observability tree

For the existing two-turn sample conversation, PostHog should show one session for `thread_abc`:

1. First turn: generation → `lookup_order` span → follow-up generation.
2. Second turn: one generation.

All events are attributed with the existing stable application user ID. Each call in a turn shares the same `$ai_trace_id`; each turn gets a different trace ID.

## Verification

- Passed: `npm run build` (`tsc --noEmit`).
- Not run: the model request itself, because this setup does not have the application's LLM endpoint credentials or a running endpoint.

To verify delivery, run `npm run start` with the local LLM endpoint available (or set `LLM_URL` to the application's compatible endpoint). Then open **AI Observability → Traces** in PostHog project 483112 and inspect the newest traces. Run both included turns to confirm they share one session while keeping separate traces.

## Privacy mode

Manual capture does not use an SDK-wide privacy-mode setting. Prompt content and completions are deliberately sent in the manually captured `$ai_input` and `$ai_output_choices` properties at `src/index.ts:82` and `src/index.ts:84`.

Before handling prompts or responses that must not be stored in PostHog, remove or conditionally omit those two properties from the `$ai_generation` capture in `src/index.ts`. This only changes newly captured events; it does not remove previously stored events or arbitrary custom properties. See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for the broader privacy behavior.
