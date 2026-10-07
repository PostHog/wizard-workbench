# PostHog AI Observability setup

> ⚠️ **Needs your attention**
> - After sending the sample turns, confirm the resulting trace tree in [AI Observability → Traces](https://app.posthog.com/ai-observability/traces).

## Integration

Instrumented the Google Agent Development Kit (ADK) workflow with `PostHogADKPlugin` in `src/index.ts`.

- Added `@posthog/ai` and `posthog-node` to `package.json`.
- Created a server-side `PostHog` client using `POSTHOG_API_KEY` and `POSTHOG_HOST`; no PostHog credentials are embedded in source.
- Registered `PostHogADKPlugin` on the existing `Runner`.
- Kept the existing ADK session (`thread_abc`) as the AI session, existing user ID (`user_123`) as the distinct ID, and each `runner.runAsync()` invocation as an ADK trace.
- Preserved the existing `get_weather` tool. The ADK plugin captures its tool run as a span and its associated model calls as generations.
- Added `await posthog.shutdown()` so this short-lived script flushes pending observability events before exiting.
- Wrote the integration run record to `.posthog-wizard-cache/.posthog-ai.json`.

## Environment

The following keys are configured in `.env`:

- `POSTHOG_API_KEY`
- `POSTHOG_HOST`

The application fails loudly during development if either is absent or empty, while production runs without observability rather than failing to boot.

## Verify

With the agent's usual Gemini credentials configured, run:

```bash
npm run build
npm run start
```

The script sends two weather questions in the same ADK session. In **AI Observability → Traces**, inspect the newest traces and verify:

1. Both turns belong to one AI session (`thread_abc`).
2. Each turn is a separate trace.
3. Each trace contains the agent run, the `get_weather` tool span, and its model generations.
4. Events are attributed to the existing user ID (`user_123`).

The declared dependencies are installed and `npm run build` completes successfully. The integration is wired and build-verified, but its runtime delivery is unverified because no model request was made during setup.

## Privacy mode

Privacy mode is explicitly disabled in `src/index.ts` on both the PostHog client and ADK plugin (`privacyMode: false`). Prompt and completion content will be captured in AI Observability. Before handling prompts or responses that must not be stored in PostHog, change the plugin option to `privacyMode: true` in that file. Privacy mode excludes SDK-captured `$ai_input` and `$ai_output_choices`; it does not remove previously stored events or arbitrary custom payloads.

See the [AI Observability privacy-mode documentation](https://posthog.com/docs/ai-observability/privacy-mode) for details.
