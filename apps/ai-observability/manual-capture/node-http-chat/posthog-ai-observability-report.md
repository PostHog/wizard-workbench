# PostHog AI Observability setup

## Status

**Wired and build-verified; runtime delivery remains unverified.** The TypeScript build completed successfully with `npm run build`. No LLM request was sent during setup because the local OpenAI-compatible endpoint requires the application's runtime configuration.

## Integration selected

- **Variant:** `ai-observability-manual-capture`
- **Reason:** The Node project makes model requests with plain `fetch` and has no vendor LLM SDK to wrap.
- **Provider:** Ollama, inferred from the default local endpoint and `llama3.2` model.
- **SDK:** The existing `posthog-node` dependency and existing PostHog client are reused. No packages were added.

## Changes made

- Added manual `$ai_generation` capture after each successful HTTP completion in `src/index.ts`.
  - Includes model, provider, request/response messages, token counts, latency, HTTP status, tools, request URL, and base URL.
- Added a UUID `$ai_trace_id` at the start of each `Thread.ask()` call and supplied it to every generation and tool span in that turn.
- Reused `Thread.threadId` as `$ai_session_id`, so separate turns in the same thread group into one AI Observability session.
- Added `$ai_span` capture for every `lookup_order` tool execution, sharing the turn trace and linked via `$ai_parent_id`.
- Reused the thread's stable user ID as the PostHog `distinctId` for AI events.
- Added `POSTHOG_PROJECT_API_KEY` and `POSTHOG_HOST` to the local `.env` file using the supplied project configuration. The token is not embedded in source code.
- Added the required run record at `.posthog-wizard-cache/.posthog-ai.json`.

Existing product analytics initialization, identify call, and `chat_message_sent` capture were left unchanged.

## Expected trace hierarchy

For the supplied script flow, PostHog should show:

- One AI session for `thread_abc`.
- One trace for each `ask()` invocation.
- The first turn: a generation for the tool-selection completion, a `lookup_order` span, then a final generation.
- The second turn: one generation.
- Every event attributed to the thread's stable user ID.

## Verify delivery

1. Ensure the local OpenAI-compatible LLM endpoint is available at `LLM_URL` (the default is the local Ollama chat-completions endpoint).
2. Run `npm run start`.
3. In PostHog project **483112**, open **LLM Analytics → Traces** and inspect the newest trace.
4. Confirm that the first turn has two generations plus the `lookup_order` span, that all three share a trace ID, and that both turns share one session ID.

If the configured endpoint is not Ollama, update the capture's `$ai_provider` value to the actual provider so PostHog applies correct model pricing.
