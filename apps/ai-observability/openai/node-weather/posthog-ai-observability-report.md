# PostHog AI Observability setup

## Status

**Wired, unverified.** The project uses the OpenAI Node SDK directly, so it was instrumented with the `ai-observability-openai-node` workflow. The TypeScript build passes, but no live model request was made because `OPENAI_API_KEY` is not configured in this project.

## What changed

- Added `@posthog/ai` and `posthog-node` to `package.json`.
  - The existing `openai` dependency remains on `^4.77.0`; it was not upgraded.
  - Installation used npm's legacy peer-dependency resolution because the currently installed `@posthog/ai` package declares an optional OpenAI 6 peer dependency. The project typechecks successfully with its existing OpenAI 4 SDK.
- Configured `POSTHOG_API_KEY` and `POSTHOG_HOST` in `.env` and documented their empty variable names in `.env.example`.
- Wrapped OpenAI calls in `src/index.ts` with PostHog's `OpenAI` wrapper when PostHog configuration is available.
- Added a process-scoped AI session ID, a new trace ID for each `ask()` turn, and the existing application user ID to every model call.
- Reused the same trace ID for the initial model call and tool-result follow-up, so both generations appear in one trace.
- Captured each `get_weather` execution as an `$ai_span` attached to the same trace and session.
- Awaited `posthog.shutdown()` before the process exits so queued observability events can be sent.
- Added `.posthog-wizard-cache/.posthog-ai.json` for the setup-report integration.

## Verification completed

```text
npm run build
```

The command completed successfully (`tsc --noEmit`).

## Verify a live trace

1. Configure a valid `OPENAI_API_KEY` in `.env`.
2. Run:

   ```bash
   npm run start
   ```

3. In PostHog, open **AI Observability → Traces** and open the newest trace.
4. Confirm that the run contains:
   - one session for the process run;
   - one trace for the `ask()` turn;
   - the initial and follow-up OpenAI generations in that same trace when the model calls `get_weather`;
   - one `get_weather` tool span connected to that trace.

## Privacy mode

Privacy mode is explicitly **off** per AI request in `src/index.ts` via `posthogPrivacyMode: false`. This means SDK-captured prompt input and model completion content are sent to PostHog AI Observability.

Before sending prompts or completions that must not be stored in PostHog, change that setting to `posthogPrivacyMode: true` in `createCompletion()`. This excludes `$ai_input` and `$ai_output_choices` from SDK-captured events; it does not remove arbitrary custom properties, manually captured payloads, or data already ingested.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for details.

## Remaining action

Add a valid `OPENAI_API_KEY` to `.env` before running the sample. The PostHog token and host are already configured in `.env`.
