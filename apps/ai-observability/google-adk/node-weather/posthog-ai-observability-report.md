# PostHog AI Observability setup

## Status

Google ADK AI Observability is wired and the TypeScript build passes. Delivery to PostHog remains **unverified** until a run with valid Google model credentials is triggered and inspected in PostHog.

## Integration

- Selected the `ai-observability-google-adk` workflow because this Node project uses `@google/adk`, the framework responsible for its model calls.
- Added `@posthog/ai` and `posthog-node` to `package.json`.
- Added a `PostHog` client in `src/index.ts`, configured exclusively from `POSTHOG_API_KEY` and `POSTHOG_HOST` environment variables.
- Registered `PostHogADKPlugin` with the existing `Runner`. The plugin captures the ADK run, agent activity, tool execution, and model calls without modifying the agent or weather tool.
- The process awaits `posthog.shutdown()` in `main()` so queued AI events are delivered before exit.
- The existing environment already defines `POSTHOG_API_KEY` and `POSTHOG_HOST`; no secrets were added to source code.

## Expected trace structure

The application uses ADK’s existing IDs:

- ADK `sessionId` (`thread_abc`) becomes one `$ai_session_id` shared by both turns.
- Each call to `ask()` becomes a separate trace.
- ADK `userId` (`user_123`) is used as the PostHog distinct ID.
- The registered `get_weather` tool is emitted by the plugin as a tool span.

A successful run should show one session with two traces. Each trace should contain the agent span, the model generation(s), and the `get_weather` span when the tool is used.

## Verify

1. Ensure the existing PostHog environment variables and the project’s Google model credentials are available.
2. Run `npm run start`.
3. Open **AI Observability → Traces** in PostHog and inspect the newest trace.
4. Confirm that the two turns share the same AI session, each invocation has its own trace, events are attributed to `user_123`, and the weather tool appears as a span.

`npm run build` completed successfully. No model request was run during setup because provider credentials were not used by the setup workflow.

## Privacy mode

Privacy mode is explicitly disabled with `privacyMode: false` in `src/index.ts`. This preserves the default AI Observability behavior: captured model prompts and completions are included in SDK-captured `$ai_input` and `$ai_output_choices` properties.

Before sending prompts or responses whose sensitive content must not be stored in PostHog, change that option to `privacyMode: true` in `src/index.ts`. For Google ADK, pass `privacyMode: true` to `PostHogADKPlugin` to apply the plugin’s documented privacy control. Privacy mode excludes SDK-captured input and output properties; it does not retroactively remove stored events or remove unrelated custom properties.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).

## Scope

No existing PostHog initialization, identity calls, event capture, dashboard, agent, or tool code was changed.
