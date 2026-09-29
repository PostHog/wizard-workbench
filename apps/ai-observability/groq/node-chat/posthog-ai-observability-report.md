# PostHog AI Observability setup

## Outcome

Groq AI Observability is wired for the Node chat application. The **Groq Node** variant was selected because the app uses the OpenAI SDK with the `https://api.groq.com/openai/v1` gateway base URL. This ensures the captured provider is `groq`, rather than `openai`.

The integration is **wired and build-verified**, but live delivery remains unverified because no model call was made without a configured Groq credential.

## Changes made

- Added `@posthog/ai` and `posthog-node` to the project dependencies.
- Configured `POSTHOG_API_KEY` and `POSTHOG_HOST` in `.env`; application code reads both values exclusively from environment variables.
- Replaced the direct OpenAI client with PostHog's `@posthog/ai/openai` wrapper while preserving the Groq base URL.
- Created a PostHog client in `src/index.ts` with `privacyMode: false` and flushes it with `await posthog.shutdown()` before the CLI exits.
- Added a fresh UUID trace ID for each `Thread.ask()` turn and passed it to every LLM call in that turn.
- Attached the existing `Thread.threadId` as `$ai_session_id`, the existing `Thread.userId` as the distinct ID, and `$ai_provider: 'groq'` to each generation.
- Did not add tool spans: the application has no registered LLM tools. The existing `moderate()` function is a local guard and remains untouched.
- Wrote the AI setup metadata to `.posthog-wizard-cache/.posthog-ai.json`.

## Expected AI Observability hierarchy

For the built-in sample thread, PostHog should receive:

- One AI session: `thread_abc`.
- Two traces, one for each `ask()` call.
- The first trace contains one generation.
- The second trace contains both the conversation-condensing and reply generations under the same trace ID.
- All generations are attributed to the existing distinct ID `user_123` and provider `groq`.

## Verification

- `npm run build` completed successfully (`tsc --noEmit`).
- To validate delivery, provide `GROQ_API_KEY` and make the configured PostHog environment variables available to the process, then run `npm start`.
- In PostHog project **483112**, open **AI Observability → Traces** and inspect the newest trace. Confirm the session/traces/generation grouping above and that the provider is `groq`.

The installation retained the project's existing OpenAI v4 dependency. npm resolved the PostHog wrapper's newer OpenAI peer requirement using compatibility mode, and the TypeScript build passes; validate a live Groq request before relying on production telemetry.

## Privacy mode

Privacy mode is currently **off** in `src/index.ts` in the PostHog client configuration (`privacyMode: false`). Prompt and completion content are therefore captured in the SDK-generated AI events.

Enable privacy mode before sending prompts or responses whose sensitive content must not be stored in PostHog. Change that setting to `privacyMode: true` in `src/index.ts`, or set `posthogPrivacyMode: true` on an individual LLM request. Privacy mode excludes `$ai_input` and `$ai_output_choices`; it does not retroactively remove stored data or automatically filter arbitrary custom properties.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for details.
