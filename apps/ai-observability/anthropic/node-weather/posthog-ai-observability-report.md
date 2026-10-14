# PostHog AI Observability setup

## Implementation

- Selected the **Anthropic Node** integration because the project uses `@anthropic-ai/sdk` directly from its Node entrypoint.
- Added `@posthog/ai` (`^3.3.2`) and `posthog-node` (`^5.56.1`). The wrapper release was selected to remain compatible with the existing `@anthropic-ai/sdk` (`^0.32.0`) without upgrading it.
- Replaced the direct Anthropic client construction in `src/index.ts` with PostHog’s Anthropic wrapper and a `PostHog` client.
- Configured the PostHog client from `POSTHOG_API_KEY` and `POSTHOG_HOST`; both values are saved in the local `.env` file.
- Added one AI session per `Conversation` (`threadId`), one trace per `ask()` turn, and the conversation’s stable user ID as the distinct ID on each generation.
- Added an `$ai_span` for each executed `get_weather` tool call, linked to the current turn trace and conversation session.
- Added `await posthog.shutdown()` when the CLI exits so queued observability events are delivered.
- Added `.posthog-wizard-cache/.posthog-ai.json` to record the Anthropic wrapper setup.

No existing product analytics initialization, identify calls, event capture, or dashboards were changed.

## Verification

`npm run build` completed successfully (`tsc --noEmit`). No model request was made during setup.

To verify live data, provide a valid `ANTHROPIC_API_KEY` and load the PostHog values saved in `.env` into the shell environment, then run:

```bash
set -a; . ./.env; set +a; npm start
```

The program runs two turns in the same conversation. In **AI Observability → Traces**, verify that `thread_abc` is one session containing two traces. Each trace should contain the Anthropic generation(s) and, when Claude invokes the tool, a `get_weather` span. The generations and spans should be attributed to the existing stable user ID.

## Privacy mode

Privacy mode is explicitly **off** in `src/index.ts` on the `PostHog` constructor (`privacyMode: false`). Consequently, SDK-captured prompt and completion content is sent in `$ai_input` and `$ai_output_choices`.

Before sending prompts or responses that should not be stored in PostHog, change that option to `privacyMode: true`; for a specific request, use the supported `posthogPrivacyMode: true` option. Privacy mode excludes `$ai_input` and `$ai_output_choices` from SDK-captured events; it does not remove manually supplied properties or previously stored events.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) and the [Anthropic integration guide](https://posthog.com/docs/ai-observability/installation/anthropic).
