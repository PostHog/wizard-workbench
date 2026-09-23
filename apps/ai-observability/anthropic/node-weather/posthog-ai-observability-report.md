# PostHog AI Observability setup

## Status

AI Observability is wired for the Node weather assistant and is **build-verified, but not live-verified**. A live Claude request was intentionally not run because this setup does not have an Anthropic API key.

## Integration selected

- **Mechanism:** Manual AI Observability capture with `posthog-node`.
- **Reason:** The project uses `@anthropic-ai/sdk` `^0.32.0`. The current `@posthog/ai` Anthropic wrapper requires an incompatible newer Anthropic SDK range, so the wrapper could not be installed without upgrading the vendor SDK. The existing SDK was preserved and its calls are captured explicitly instead.
- **Dependency added:** `posthog-node` `^5.53.0`.

## What is instrumented

`src/index.ts` now:

- Initializes a server-side PostHog client from `POSTHOG_API_KEY` and `POSTHOG_HOST` (lines 26–30). The project values are stored in the local `.env`; no token or host is embedded in source.
- Uses the conversation's `threadId` as `$ai_session_id`, preserving one AI session across both turns.
- Creates one UUID trace ID at the start of each `Conversation.ask()` call (line 98). Both Claude calls made during a tool-using turn share that trace ID.
- Captures one `$ai_generation` after every Claude response, including model, provider, input/output, token counts, stop reason, tools, and latency (lines 58–85).
- Captures the `get_weather` execution as an `$ai_span` sharing the same trace and session IDs (lines 132–145).
- Associates all AI events with the existing stable `userId`; no email, name, or other PII is added to event properties.
- Awaits `posthog.shutdown()` before the CLI exits so queued events are delivered (line 183).

In development, missing `POSTHOG_API_KEY` or `POSTHOG_HOST` produces a clear startup error. In production, missing PostHog configuration leaves observability inactive without breaking the application.

## Configuration

- Local `.env` now has `POSTHOG_API_KEY` and `POSTHOG_HOST` configured for the supplied PostHog project.
- `.env.example` documents `ANTHROPIC_API_KEY`, `POSTHOG_API_KEY`, and `POSTHOG_HOST` with empty values only.
- The application still requires a valid `ANTHROPIC_API_KEY` in its runtime environment to make Claude requests.

## Verification

- Ran `npm run build` successfully (`tsc --noEmit`). This validates the `posthog-node` import and all telemetry code.
- A live generation was not sent, so delivery to PostHog remains unverified.

To verify live delivery, run `npm run start` with a valid Anthropic API key and the PostHog variables available to the process. Then open **AI Observability → Traces** in PostHog and inspect the newest trace:

1. The first weather question should produce one trace containing the initial Claude generation, a `get_weather` span, and the follow-up Claude generation when Claude selects the tool.
2. The second question should create a separate trace under the same `thread_abc` AI session.
3. Generations should be attributed to the existing `user_123` distinct ID and report `anthropic` as the provider.

## Privacy mode

`privacyMode: false` is set at `src/index.ts:28`, so prompt and completion content is intended to be captured. This application also manually supplies `$ai_input` and `$ai_output_choices` in the generation helper at `src/index.ts:76` and `src/index.ts:78`.

Before sending sensitive prompts or responses, remove or redact those manually supplied properties in `captureGeneration` (or avoid calling that helper for the sensitive request). Do not rely solely on a client-wide privacy setting to remove manually captured payloads. For SDK-captured AI events, setting `privacyMode: true` at `src/index.ts:28` excludes `$ai_input` and `$ai_output_choices`; it does not remove arbitrary custom properties, manually captured content, or data already ingested.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for details.
