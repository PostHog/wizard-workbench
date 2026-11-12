# PostHog AI Observability setup

## Status

**Wired and build-verified; ingestion unverified.** Dependencies were installed and `pnpm build` completed successfully. The AI model was not invoked during setup because this project does not have a configured `GOOGLE_API_KEY`.

## Integration

- Selected **Google ADK (Node)** because `package.json` declares `@google/adk` and the application creates an ADK `Runner` that owns the model and tool loop.
- Added `@posthog/ai` (major version 8) and `posthog-node` (major version 5) to `package.json`.
- Created a `PostHog` server client in `src/index.ts`, reading `POSTHOG_API_KEY` and `POSTHOG_HOST` from the environment. Both variables are already configured in this project’s `.env`; no credentials were copied into source code.
- Registered `PostHogADKPlugin` on the existing ADK `Runner`. The plugin captures ADK runs, agent/tool spans, and model generations without modifying the existing agent or weather-tool behavior.
- Added a bounded `posthog.shutdown(3000)` call before this short-lived CLI process exits. Delivery failures are logged and do not replace application errors.
- Recorded the integration metadata in `.posthog-wizard-cache/.posthog-ai.json`.

## Trace model

The existing ADK values define the grouping:

- **Conversation/session:** `SESSION_ID` (`thread_abc`)
- **User attribution:** `USER_ID` (`user_123`)
- **Turn/trace:** each call to `ask()` / `runner.runAsync()`
- **Tooling:** the registered `get_weather` `FunctionTool`

Running the script issues two turns within one shared conversation. For a successful model run that uses the tool, PostHog should show one AI session containing two traces. Each trace should include the agent and weather-tool spans plus the model generations for tool selection and the final response.

## Verification

- **Completed:** installed dependencies with `pnpm install` and ran `pnpm build` successfully.
- **Still required:** configure `GOOGLE_API_KEY` with valid Gemini credentials; it is currently not set in this project.

After configuring that key, run one conversation with `pnpm start`. In **AI Observability → Traces**, inspect the newest trace and confirm that:
   - both turns share the `thread_abc` AI session;
   - each turn is a separate trace;
   - the trace includes ADK agent and `get_weather` spans; and
   - generations include model, token, latency, and cost information.

## Privacy mode

`privacyMode: false` is set on the `PostHogADKPlugin` in `src/index.ts`, so prompts and model completions are captured by default. Set that option to `true` before sending prompts or responses whose contents must not be stored in PostHog. Privacy mode excludes SDK-captured inputs and outputs, but does not retroactively remove stored events or automatically scrub unrelated custom properties.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for details.

## Scope

This setup only adds AI Observability instrumentation. It does not alter existing product analytics initialization, identity calls, event capture, or dashboards.
