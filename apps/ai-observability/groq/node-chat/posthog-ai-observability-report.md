# PostHog AI Observability setup

## Status

AI Observability is wired for Groq and the TypeScript build passes. Delivery of a live trace remains unverified because `GROQ_API_KEY` is not configured in this project environment.

## What changed

- Installed `@posthog/ai` and `posthog-node` alongside the existing `openai` SDK. The install required npm's `--legacy-peer-deps` because the current wrapper declares an optional peer dependency on a newer OpenAI SDK; the existing SDK was intentionally not upgraded.
- Replaced the raw OpenAI-compatible constructor in `src/index.ts` with PostHog's `OpenAI` wrapper, retaining Groq's existing `baseURL`.
- Added a module-level PostHog client that reads `POSTHOG_API_KEY` and `POSTHOG_HOST` from the environment.
- Added per-call AI Observability metadata:
  - `Thread.threadId` is the `$ai_session_id`, so both chat turns belong to the same conversation.
  - Each `Thread.ask()` invocation creates one `posthogTraceId`; the second turn's summarization and reply calls share that ID.
  - `Thread.userId` is supplied as `posthogDistinctId`.
  - `$ai_provider` is explicitly set to `groq`, preventing OpenAI-compatible calls from being attributed as OpenAI.
- Added `await posthog.shutdown()` in the CLI's `finally` block so queued observability events flush before the process exits.
- Added `.env.example` entries for the two PostHog configuration keys and wrote their configured values to the local `.env` file.
- Added `.posthog-wizard-cache/.posthog-ai.json` for future wizard reporting.

No tool dispatch loop exists in this project, so no `$ai_span` events were added. The existing `moderate()` guard was left unchanged.

## Verification

- `npm run build` completed successfully (`tsc --noEmit`).
- A live provider call was not run because this setup does not have `GROQ_API_KEY` configured. This avoids attempting a model call without the application's provider credential.

## How to verify delivery

1. Configure `GROQ_API_KEY` in `.env` with a valid Groq API key.
2. Run `npm run start`.
3. In PostHog, open **AI Observability → Traces** and inspect the newest trace.
4. Confirm the two CLI questions appear under one AI session, with one generation on the first trace and two generations on the second trace. Confirm the provider is `groq` and the calls are associated with the application's stable user ID.

## Privacy mode

`privacyMode: false` in `src/index.ts` configures the PostHog client with privacy mode disabled. As a result, SDK-captured prompt and completion content is sent in `$ai_input` and `$ai_output_choices`, in addition to model, token, latency, and cost metadata.

Enable privacy mode before capturing conversations whose prompt or completion content must not be stored in PostHog. For this integration, change that option to `privacyMode: true`; it removes SDK-captured inputs and output choices, but does not retroactively remove existing events or arbitrary custom properties. A one-off request can instead pass `posthogPrivacyMode: true` to the wrapped model call.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for details.
