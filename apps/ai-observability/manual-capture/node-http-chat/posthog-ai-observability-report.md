# PostHog AI Observability setup

## Integration

- Selected the `ai-observability-manual-capture` workflow because this Node project calls an OpenAI-compatible endpoint with `fetch` and has no vendor LLM SDK.
- Reused the existing `posthog-node` dependency and client; no packages or existing Product Analytics instrumentation were changed.
- Configured `POSTHOG_PROJECT_API_KEY` and `POSTHOG_HOST` in the local `.env` file.
- Recorded the integration in `.posthog-wizard-cache/.posthog-ai.json`.

## Instrumented behavior

`src/index.ts` now emits AI Observability events for the existing LLM flow:

- Each `Thread.ask()` invocation creates one UUID trace ID. Both model generations in a tool-using turn share that trace ID.
- The existing `threadId` is sent as `$ai_session_id`, so every turn in a chat thread belongs to one AI Observability session.
- The existing stable `userId` is used as the PostHog distinct ID.
- Each successful model response emits `$ai_generation` with the model, provider, messages, token counts, latency, available tools, and output.
- Each `lookup_order` invocation emits an `$ai_span` attached to the same trace. The span records only the tool name and whether an order was found, not order contents or tool arguments.
- The provider defaults to `ollama`, matching the existing local endpoint. If `LLM_URL` targets another OpenAI-compatible provider, set `LLM_PROVIDER` to that provider's name so costs and provider attribution remain accurate.

## Verification

- `npm run build` completed successfully (`tsc --noEmit`).
- The model was not invoked during setup, so delivery is **wired but unverified** in PostHog.

To verify delivery, run `npm run start` while a compatible model endpoint is available at `LLM_URL` (or use the default local Ollama endpoint). The script sends two turns on `thread_abc`. Then open **AI Observability → Traces** in PostHog and confirm:

1. One AI session for `thread_abc` contains both turns.
2. Each question creates one trace; a tool-using question has two generations that share its trace ID.
3. A `lookup_order` span appears in the relevant trace only when the model invokes that tool.
4. Generations are attributed to the existing `user_123` distinct ID and the configured provider.

## Privacy mode

This manual-capture implementation currently captures prompt messages in `$ai_input` and completions in `$ai_output_choices` at `src/index.ts`'s `captureGeneration` helper. There are no request-level privacy overrides.

Manual capture does not use the wrapper SDK's `privacyMode` option. Before sending prompts or outputs that must not be stored in PostHog, redact or omit `$ai_input` and `$ai_output_choices` in that helper. This affects future manually captured events only; it does not remove data already ingested. See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).
