# PostHog AI Observability setup

## Integration

- **Selected workflow:** `ai-observability-manual-capture`, because the Node project sends OpenAI-compatible chat requests with plain `fetch` and has no vendor LLM SDK.
- **Provider/model:** Ollama / `llama3.2`, matching the configured default endpoint.
- **Existing client:** Reused the sole `posthog-node` client from `src/posthog.ts`; existing product-analytics initialization, identification, and `chat_message_sent` capture were not changed.
- **Configuration:** `POSTHOG_PROJECT_API_KEY` and `POSTHOG_HOST` are set in the local `.env` file. No credentials were added to source control.

## Captured AI tree

`src/index.ts` now captures:

- one `$ai_session_id` from `Thread.threadId` for the complete conversation;
- one UUID `$ai_trace_id` per `Thread.ask()` turn;
- one `$ai_generation` for each request made by `complete()`, including model, prompt/output messages, token counts, tools, and latency;
- one `$ai_span` for each `lookup_order` tool execution, with safe structural input/output state and latency.

Generation and tool spans share the turn trace ID and use `$ai_parent_id` to form the generation → tool → final-generation tree. All events use the existing thread user ID as their distinct ID.

## Verification

`npm run build` completed successfully (`tsc --noEmit`). The model was not invoked during setup.

To verify delivery, run the chat with `POSTHOG_PROJECT_API_KEY` and `POSTHOG_HOST` available to the process, then open **AI Observability → Traces** in PostHog. The existing `main()` performs two questions in `thread_abc`:

1. The order question should create one trace containing the initial generation, `lookup_order` span, and final generation.
2. The refund question should create a second trace in the same AI session.

Confirm that both traces are attributed to `user_123`, have the `ollama` provider and `llama3.2` model, and that the order trace has the expected parent-child hierarchy. This wiring is build-verified but runtime delivery remains unverified until a configured model request is run.

## Privacy mode

Manual capture currently sends `$ai_input` and `$ai_output_choices` explicitly in `src/index.ts`, so prompt and completion content is captured. This is the effective privacy-mode-off behavior for the manual path; SDK-wide `privacyMode` settings do not remove properties that application code manually adds.

Before sending sensitive prompt or completion content, change the `$ai_generation` capture in `complete()` in `src/index.ts` to omit or redact `$ai_input` and `$ai_output_choices` (and any sensitive custom AI properties). This affects future events only; it does not delete data already stored in PostHog. See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).
