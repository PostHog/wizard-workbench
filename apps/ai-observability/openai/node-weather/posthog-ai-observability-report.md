# PostHog AI Observability setup

## Status

AI Observability is wired for the app's direct OpenAI Node SDK calls using the `ai-observability-openai-node` workflow. The TypeScript build passes, but no model request was made during setup, so delivery to PostHog remains **wired, unverified**.

## What changed

- Added `@posthog/ai` and `posthog-node` alongside the existing OpenAI SDK in `package.json`.
- Added `POSTHOG_API_KEY` and `POSTHOG_HOST` to the local `.env` file using the configured project values.
- Replaced the OpenAI client in `src/index.ts` with PostHog's wrapped client whenever PostHog configuration is available. In production with missing PostHog configuration, the application retains a normal OpenAI client and sends no observability data; development fails with an actionable configuration error instead.
- Set a single AI session ID for the process-run conversation and a fresh trace ID for each `ask()` turn. Both the initial completion and tool-result follow-up share that trace ID.
- Attached the existing stable `USER_ID` as `posthogDistinctId` to wrapped generations.
- Added an `$ai_span` capture around `get_weather`, including the shared trace and session IDs, tool input/output state, and latency.
- Flushes pending PostHog events with `posthog.shutdown()` before the script exits.
- Wrote the workflow cache record to `.posthog-wizard-cache/.posthog-ai.json`.

## Verification

`npm run build` completed successfully.

To verify delivery, configure `OPENAI_API_KEY` in your local environment and run:

```bash
npm run start
```

Then open **AI Observability → Traces** in PostHog and inspect the newest trace. A weather query that calls the tool should produce:

1. One session for the process run.
2. One trace containing both OpenAI generations for the turn.
3. One `get_weather` span in that same trace.
4. Attribution to the application's `user_123` distinct ID.

Run a second `ask()` turn within the same process to confirm it remains in the same AI session while using a new trace.

## Privacy mode

Privacy mode is disabled at `src/index.ts` in the `PostHog` client configuration (`privacyMode: false`). This captures SDK-generated prompt and completion content, including `$ai_input` and `$ai_output_choices`, which is the default observability behavior.

Before sending sensitive prompts or responses that must not be stored in PostHog, change that setting to `privacyMode: true` or add `posthogPrivacyMode: true` to a specific wrapped OpenAI call. Privacy mode excludes those SDK-captured input and output properties; it does not remove arbitrary custom properties, manually captured payloads, or previously stored events.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).

## Dependency note

The current `@posthog/ai` release declares an optional peer range for OpenAI 6 while this app intentionally keeps OpenAI 4. The packages were installed with npm's legacy peer-dependency behavior so the existing OpenAI version was not upgraded. The integration type-checks successfully; validate the trace after a real request as described above.
