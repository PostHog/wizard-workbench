# PostHog AI Observability setup

## Status

**Wired, unverified in PostHog.** The TypeScript build passes, but no live model call was made during setup because it requires the project's Google credentials. Run the agent and inspect the resulting trace in PostHog to complete live verification.

## Integration

- Selected the **Google ADK** AI Observability variant because `@google/adk` is the framework making the application's model calls and running its tool loop.
- Added `@posthog/ai` and `posthog-node` to `package.json`.
- `src/index.ts` constructs a server-side PostHog client from `POSTHOG_API_KEY` and `POSTHOG_HOST`, then registers `PostHogADKPlugin` on the ADK `Runner`.
- The plugin automatically captures the full hierarchy for each ADK invocation: a trace, agent and tool spans, and model generations. No manual tool-span capture was added because ADK emits those through the plugin.
- The existing ADK session ID (`thread_abc`) is used as the AI session ID, so both questions in the script should appear in one AI Observability session. Each `ask()` invocation becomes its own trace. The existing ADK user ID (`user_123`) is used by the plugin as the distinct ID.
- `await posthog.shutdown()` in `src/index.ts` flushes buffered observability events before this short-lived script exits.
- The configured project token and host are available in `.env` under `POSTHOG_API_KEY` and `POSTHOG_HOST`; neither is embedded in application source.
- In development, missing PostHog configuration raises a clear error. In production, the agent continues without observability when either configuration value is absent.

## Verification performed

- Ran `npm run build` successfully (`tsc --noEmit`). This confirms the PostHog imports and ADK plugin registration type-check.
- Did not run the agent or send a test model request.

## Live verification

1. Ensure the process has the configured PostHog environment variables and the Google credentials needed by the existing ADK agent.
2. Run `npm run start`.
3. Open **AI Observability → Traces** in PostHog and inspect the newest traces.
4. Confirm that the two agent turns share one AI session, each turn is a separate trace, the `get_weather` execution appears as a tool span, and the associated generations are attributed to the ADK user ID.

## Privacy mode

Privacy mode is explicitly **off** at `src/index.ts:23` and `src/index.ts:49` (`privacyMode: false`). Consequently, SDK-captured prompts and completions are sent to PostHog for AI Observability.

Before sending sensitive prompt or response content, change the relevant `privacyMode` settings in `src/index.ts` to `true`. Privacy mode excludes `$ai_input` and `$ai_output_choices` from SDK-captured events; it does not remove previously stored events or arbitrary custom properties.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for details.
