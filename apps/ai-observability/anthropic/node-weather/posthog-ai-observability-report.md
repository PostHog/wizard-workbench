# PostHog AI Observability setup

## Status

**Wired, awaiting live verification.** The project builds successfully with the new instrumentation, but no Anthropic request was made during setup because an Anthropic API credential was not available.

## Integration

- The app uses `@anthropic-ai/sdk` version `0.32.x`. The current `@posthog/ai` Anthropic wrapper requires Anthropic SDK `>=0.112.3`, so it was not used and the existing SDK was not upgraded.
- Added `posthog-node` `5.69.0` and explicit AI Observability capture in `src/index.ts`.
- Configured `POSTHOG_API_KEY` and `POSTHOG_HOST` in the local `.env`; `.env.example` documents them without values.
- The PostHog client reads both values only from environment variables, uses `privacyMode: false`, and warns in non-production when configuration is missing. Telemetry captures are guarded so they cannot interrupt the assistant's work; the CLI awaits shutdown with a bounded timeout.

## Captured hierarchy

For each `Conversation.ask()` call:

1. A UUID is created once as `$ai_trace_id`.
2. Each Anthropic model response emits a `$ai_generation` event with model, provider (`anthropic`), messages, token usage, latency, stop reason, and registered tools.
3. The existing `get_weather` dispatch emits an `$ai_span` with the same trace ID, tool input/output, and latency.
4. The follow-up generation is linked to that tool span.
5. `Conversation.threadId` is sent as `$ai_session_id`, so both turns in the thread join one AI Observability session; `Conversation.userId` is the event distinct ID.

The expected tree for the sample CLI run is one session (`thread_abc`) containing two traces. Each trace should show `generation → get_weather span → generation` for `user_123`.

## Verification

- Passed: `pnpm build` (`tsc --noEmit`).
- To verify delivery, configure `ANTHROPIC_API_KEY` in your runtime environment and run `pnpm start`.
- Open [AI Observability Traces](https://us.posthog.com/project/483112/ai-observability/traces) and inspect the newest trace. Confirm the two generations and weather span share one trace ID, then confirm the second question appears in the same `thread_abc` session.

## Privacy mode

`privacyMode: false` in `src/index.ts` intentionally allows prompt, completion, and tool payload capture. This is the default setup because no existing privacy requirement was present.

These are manually captured AI events, so enabling the PostHog client's privacy mode alone does **not** remove the custom `$ai_input`, `$ai_output_choices`, `$ai_input_state`, or `$ai_output_state` properties. Before capturing sensitive prompts, completions, or tool data, change the manual payload construction in `src/index.ts` to omit those properties (or apply the application's own redaction) before calling PostHog.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for behavior of SDK-captured fields and related controls.
