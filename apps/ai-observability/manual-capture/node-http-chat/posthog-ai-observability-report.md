# PostHog AI Observability setup

## Status

AI Observability is **wired, unverified against a live model response**. The TypeScript build passes, but no model request was sent during setup.

## Integration

- Selected the `ai-observability-manual-capture` workflow because the project makes OpenAI-compatible HTTP calls with `fetch`, not a vendor LLM SDK.
- Reused the existing `posthog-node` client from `src/posthog.ts`; no second client, SDK installation, or dashboard was added.
- Configured the existing `POSTHOG_PROJECT_API_KEY` and `POSTHOG_HOST` environment-variable names in `.env`. Values are not included in this report.
- Added manual `$ai_generation` capture in `src/index.ts` for every model request, including model, provider (`ollama`), messages, token counts, latency, HTTP status, and error status.
- Added a UUID trace ID once per `Thread.ask()` call and reused it for every generation and tool span in that turn.
- Used `Thread.threadId` (normalized to the supported character set) as `$ai_session_id`, grouping the two chat turns into one AI Observability session.
- Added `$ai_span` capture for each `lookup_order` tool execution. Spans and generations use `$ai_parent_id` to form the expected generation → tool → generation tree.
- Left the existing `identify()` and `chat_message_sent` product-analytics capture unchanged.

## Verification

- `npm run build` completed successfully (`tsc --noEmit`).
- To send the sample two-turn conversation, ensure the configured model endpoint is available, then run:

  ```bash
  npm run start
  ```

- In **AI Observability → Traces**, open the newest trace and verify:
  1. One session contains both turns for the same thread.
  2. Each `ask()` call creates one trace.
  3. The order-question turn contains a generation, a `lookup_order` span, and a final generation.
  4. Both traces are attributed to the application’s existing stable user ID.

## Privacy mode

Manual capture intentionally sends `$ai_input` and `$ai_output_choices`; therefore prompt and completion content is currently captured. The relevant payload is assembled in `src/index.ts` in `captureGeneration()`.

Manual capture does not apply an SDK-wide `privacyMode` switch to data that is explicitly added to the event. Before sending prompts or completions that must not be stored in PostHog, change `captureGeneration()` to omit or redact `$ai_input` and `$ai_output_choices` for those requests. This does not remove previously stored events or arbitrary custom properties.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for the product-level behavior.
