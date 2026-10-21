# PostHog AI Observability setup

## Status

**Wired, unverified with a live provider request.** The TypeScript build passes, and the project is configured to send AI Observability events once it is run with valid Anthropic credentials.

## Integration selected

The project uses the Anthropic Node SDK directly, but its installed version (`@anthropic-ai/sdk` `^0.32.0`) cannot satisfy the current `@posthog/ai` wrapper peer dependency (`>=0.112.3`). To preserve the existing provider SDK rather than upgrade it, this setup uses the compatible **manual-capture** integration with `posthog-node`.

## Changes made

- Added `posthog-node` to `package.json`.
- Added `POSTHOG_API_KEY` and `POSTHOG_HOST` to the local `.env` file.
- Created a PostHog Node client in `src/index.ts` that reads its token and host exclusively from environment variables.
- Captured each Anthropic response as `$ai_generation`, including model, provider, input/output, token counts, latency, tool definitions, and stop reason.
- Generated one trace ID per `Conversation.ask()` call. If the model calls the weather tool, the initial generation, tool span, and follow-up generation share that trace ID.
- Used the stable conversation thread ID as `$ai_session_id`, grouping both sample turns in one AI Observability session.
- Captured each weather-tool execution as an `$ai_span` with input, output, and latency.
- Shut down the PostHog client before process exit so queued events can flush.
- Recorded the workflow result in `.posthog-wizard-cache/.posthog-ai.json`.

## Event hierarchy

For each chat turn:

- **Session:** the `Conversation` thread ID.
- **Trace:** a new UUID generated at the start of `ask()`.
- **Generations:** one initial Anthropic call, plus a follow-up call when a tool is used.
- **Span:** one `get_weather` tool execution when requested by the model.
- **Person:** the existing stable conversation user ID is used as the PostHog distinct ID.

## Verification

- Ran `npm run build` successfully.
- A live model call was intentionally not run because this environment has no `ANTHROPIC_API_KEY` configured.

To verify delivery:

1. Make `ANTHROPIC_API_KEY` available to the process that runs the app. The application reads environment variables directly; ensure your runtime loads `.env` or exports the variables before launch.
2. Run `npm run start`.
3. In PostHog, open **AI Observability → Traces** and inspect the newest trace.
4. Confirm that both sample turns share one AI session, each turn has its own trace, and a tool-using turn contains both generations and a `get_weather` span.

## Privacy mode

`src/index.ts` configures the PostHog client with `privacyMode: false`, which is the default and means prompt and completion content is eligible for capture. Because this project uses **manual capture**, the helper explicitly includes `$ai_input` and `$ai_output_choices`; changing the client privacy setting alone does not remove those manually supplied fields.

Before sending prompts or completions that must not be stored in PostHog, change the manual capture helper in `src/index.ts` to omit or redact `$ai_input`, `$ai_output_choices`, and any other sensitive manual properties before capture. See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).
