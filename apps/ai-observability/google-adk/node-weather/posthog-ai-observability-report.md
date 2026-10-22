# PostHog AI Observability setup

## Status

**Wired, unverified in PostHog.** The project compiles successfully after instrumentation, but no model request was sent during setup because model-provider credentials and a user-triggered run are required to validate ingestion.

## What was installed and configured

- Selected the **Google ADK (Node)** workflow because the project uses `@google/adk` to run its agent and model calls.
- Added `@posthog/ai` and `posthog-node` to `package.json`.
- Configured `POSTHOG_API_KEY` and `POSTHOG_HOST` in `.env`; credentials remain outside source control.
- Added `PostHogADKPlugin` to the existing ADK `Runner` in `src/index.ts`.
- Created a `PostHog` server client from environment variables and call `await posthog.shutdown()` before the script exits so buffered events are delivered.

## Observability tree

The plugin instruments ADK callbacks directly, preserving the agent structure without modifying the weather tool or hand-authoring duplicate spans:

- The ADK `sessionId` becomes one `$ai_session_id` for the two-turn conversation.
- Each `runner.runAsync()` invocation becomes a separate trace.
- The ADK `userId` becomes the PostHog distinct ID.
- The agent run and `get_weather` execution appear as spans.
- Each model request appears as a generation; this agent path should emit a generation before and after the tool call.

## Verification

- Ran `npm run build` successfully (`tsc --noEmit`).
- To verify delivery, run `npm run start` with the model-provider configuration available to the process. Then open **AI Observability → Traces** in PostHog and inspect the newest trace.
- A correct run has one trace containing the agent span, model generations, and tool span. Run the second turn to confirm both traces share one AI session and user attribution.

## Privacy mode

Privacy mode is explicitly **off** in `src/index.ts` through `privacyMode: false` on both the PostHog client and `PostHogADKPlugin`. Prompt and completion content will therefore be captured for AI Observability.

Before handling prompts or responses that must not be stored in PostHog, set `privacyMode: true` on the plugin (and keep the client configuration aligned) in `src/index.ts`. Privacy mode prevents SDK-captured `$ai_input` and `$ai_output_choices`; it does not remove arbitrary custom properties or data captured before the change. See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).
