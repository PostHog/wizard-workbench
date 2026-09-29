# PostHog AI Observability setup

## Status

**Wired, unverified in PostHog.** TypeScript compilation succeeds with `npm run build`; no Anthropic request was made during setup.

## Integration

- Selected the **manual-capture Node** path. The project uses `@anthropic-ai/sdk` `^0.32.0`, while the current `@posthog/ai` wrapper requires a newer, incompatible Anthropic SDK range. The existing Anthropic SDK was deliberately not upgraded.
- Added `posthog-node` and initialized it from `POSTHOG_API_KEY` and `POSTHOG_HOST` in `src/index.ts`.
- Added explicit `$ai_generation` events after each Anthropic `messages.create` call, including model, provider, prompt/completion payloads, token counts, stop reason, tools, and latency.
- Added the existing `get_weather` execution as an `$ai_span` with input, output, and latency.
- Each `Conversation.ask()` call creates one trace ID. Both generations and the tool span share that trace ID; `Conversation.threadId` is the AI session ID and `Conversation.userId` is the distinct ID.
- The first generation is the parent of the tool span, and the follow-up generation is the child of that span. The client shuts down after the CLI completes so queued events are flushed.

## Environment

Configured the supplied PostHog project values in the local `.env` file:

- `POSTHOG_API_KEY`
- `POSTHOG_HOST`

`.env.example` documents these keys and `ANTHROPIC_API_KEY` without values. Keep the real Anthropic API key in the runtime environment; it was not added by this setup.

## Verification

1. Ensure `ANTHROPIC_API_KEY`, `POSTHOG_API_KEY`, and `POSTHOG_HOST` are available to the process.
2. Run `npm run start`.
3. In PostHog, open **AI Observability → Traces** and inspect the newest trace.
4. Confirm the two turns share one `$ai_session_id` (`thread_abc`). Each turn should have its own trace. When Claude elects to call the weather tool, its trace should display `messages.create → get_weather → messages.create`, attributed to `user_123`.

## Privacy mode

`privacyMode: false` is set in `src/index.ts:27`, so prompt and completion content is intentionally captured. This is the default chosen because no existing privacy requirement was present.

Enable privacy mode at that constructor location (`privacyMode: true`) before sending prompts or completions that must not be SDK-captured. This manual-capture integration explicitly supplies `$ai_input`, `$ai_output_choices`, and tool state, so privacy mode alone must not be assumed to redact those properties: omit or scrub those fields in the manual capture payloads when sensitive content must not leave the application. See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).
