# PostHog AI Observability setup

## What changed

- Installed `@posthog/ai` and `posthog-node` alongside the existing Google ADK dependency.
- Configured a `PostHog` server client in `src/index.ts`, reading `POSTHOG_API_KEY` and `POSTHOG_HOST` from the existing environment configuration.
- Registered `PostHogADKPlugin` on the ADK `Runner`. The plugin captures the complete ADK hierarchy without changing the agent or weather tool behavior:
  - one session for the shared ADK session ID;
  - one trace for each `runner.runAsync()` turn;
  - agent and tool spans; and
  - generations for each model call.
- The ADK `userId` remains the distinct ID. The client is shut down in `finally` so buffered observability events are delivered before this script exits.

## Validation

- `npm run build` completed successfully (`tsc --noEmit`).
- `POSTHOG_API_KEY` and `POSTHOG_HOST` are already configured in `.env`; no credentials were written to source or changed.
- The model was not executed because that requires the project's Google model credentials. The setup is wired but event delivery is unverified until a live run.

## Verify delivery

1. Ensure the existing Google model credentials and the PostHog environment variables are available.
2. Run `npm run start`.
3. In **AI Observability → Traces**, open the newest trace. The script runs two questions in one ADK session. Each turn should appear as its own trace, attributed to the existing ADK user ID, with the agent run, `get_weather` tool span, and model generations nested under it.
4. Confirm that both traces share one session. This proves conversation grouping is based on the existing session ID rather than a new value per turn.

## Privacy mode

`privacyMode: false` is set on `PostHogADKPlugin` in `src/index.ts`. This is the default, so prompt and completion content are captured in SDK-generated AI Observability events. Enable `privacyMode: true` in that plugin configuration before sending prompts or responses whose content must not be stored in PostHog. Privacy mode excludes `$ai_input` and `$ai_output_choices` from SDK-captured events; it does not retroactively remove stored data or necessarily filter arbitrary custom properties.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for details.
