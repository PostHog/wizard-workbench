# PostHog AI Observability setup

> ⚠️ **Needs your attention**
> - Run the sample with a valid Gemini/Google model credential and inspect the resulting trace in PostHog to complete live verification.

## Integration

- Selected the **Google ADK (Node)** workflow because the application uses `@google/adk` to run its `LlmAgent` model calls.
- Declared `@posthog/ai` and `posthog-node` alongside the existing ADK dependency in `package.json`.
- Configured `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in the local `.env`; no credentials are embedded in source code.
- Registered `PostHogADKPlugin` on the existing ADK `Runner` in `src/index.ts`.
- The plugin records the ADK run hierarchy automatically: one trace for each `ask()` invocation, generations for model calls, the `get_weather` tool span, and the runner's `USER_ID` as the distinct ID.
- The existing ADK `SESSION_ID` groups both sample turns into one AI Observability session. The client is shut down in `main()` so queued telemetry is flushed before the script exits.

## Verification

Dependencies were installed and `npm run build` now completes successfully. No model call was made during setup.

To complete live verification, run:

```bash
npm start
```

Then open **AI Observability → Traces** in PostHog and inspect the newest trace. A weather query should produce one trace containing the agent run, a `get_weather` tool span, and the associated model generations. Running the second sample turn should create another trace in the same AI session.

## Privacy mode

Privacy mode is explicitly **off** in `src/index.ts` (both the `PostHog` client and `PostHogADKPlugin` use `privacyMode: false`). Consequently, the plugin captures prompt and completion content in SDK-generated AI events.

Enable privacy mode before prompts or responses with content that must not be stored in PostHog by changing those settings to `privacyMode: true`. This excludes `$ai_input` and `$ai_output_choices` from SDK-captured events; it does not remove custom properties, manually captured payloads, or data already stored. See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).
