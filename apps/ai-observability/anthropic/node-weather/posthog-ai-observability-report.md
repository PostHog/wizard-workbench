# PostHog AI Observability setup

## Status

**Wired, locally verified, and awaiting a live model run.** TypeScript compilation succeeds with `npm run build`. A live run was intentionally not performed because no Anthropic API credential is configured.

## Integration selected

- The project makes its model calls directly with `@anthropic-ai/sdk` in Node.
- The installed Anthropic SDK is pinned to `^0.32.0`, below the `@posthog/ai` wrapper's supported peer range. Per the integration workflow, this uses **manual capture** rather than upgrading the vendor SDK or installing unsupported instrumentation.
- Added `posthog-node` (`^5.57.0`). No OpenTelemetry packages were added.
- Saved the required PostHog environment values in `.env` as `POSTHOG_API_KEY` and `POSTHOG_HOST`; no credentials were added to source code.

## What is captured

`src/index.ts` now captures a complete AI Observability tree:

- **Session:** `Conversation.threadId` is sent as `$ai_session_id`, grouping the two example turns into one conversation session.
- **Trace:** each `Conversation.ask()` call creates one UUID trace ID. If the model uses the weather tool, both Anthropic generations and the tool span share that trace ID.
- **Generations:** each Anthropic response is sent as `$ai_generation`, including model, provider, input/output messages, token counts, latency, stop reason, and declared tools.
- **Tool span:** each `get_weather` execution is sent as `$ai_span`, including input, result, latency, and the current trace/session IDs.
- **Attribution:** events use the existing `Conversation.userId` as the PostHog distinct ID.
- **Delivery:** the CLI awaits `posthog.shutdown()` before exiting so queued AI events can be flushed.

The integration record is stored at `.posthog-wizard-cache/.posthog-ai.json`.

## Verify a live trace

1. Configure `ANTHROPIC_API_KEY` in the process environment. The application already expects this variable.
2. Ensure the process loads the PostHog values saved in `.env` (or configure the same variables in the deployment environment).
3. Run `npm run start`.
4. In PostHog, open **AI Observability → Traces** and inspect the newest trace.

Expected result:

- One AI session contains both sample conversation turns.
- Each question creates one trace.
- A turn that invokes `get_weather` has two generations plus a `get_weather` span, all sharing its trace ID.
- Generations are attributed to the conversation's existing user ID.

## Privacy mode

- **Effective setting:** `privacyMode: false` in `src/index.ts`. Prompt and completion content are intentionally captured in the manually constructed `$ai_generation` payloads.
- **When to change it:** enable protection before sending prompts or outputs that must not be stored in PostHog.
- **How to change it:** set `privacyMode: true` on the `PostHog` client in `src/index.ts`. Because this integration manually supplies `$ai_input`, `$ai_output_choices`, and tool state, also remove or redact those properties in `captureGeneration()` and the `$ai_span` capture when content must not leave the application.
- **Scope:** privacy mode excludes `$ai_input` and `$ai_output_choices` from SDK-captured events; it does not retroactively change stored events or automatically redact custom manually captured properties.
- Reference: [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).

## Verification performed

- `npm run build` ✅
- Live Anthropic request and PostHog ingestion ⏳ not run, because the Anthropic credential is not configured and no vendor API call was made during setup.
