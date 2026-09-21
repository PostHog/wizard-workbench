# PostHog AI Observability setup report

## Status: blocked safely

This project uses the Google Agent Development Kit (`@google/adk`), so the Google ADK Node integration is the appropriate PostHog AI Observability path.

The current [Google ADK installation documentation](https://posthog.com/docs/ai-observability/installation/google-adk) specifies `PostHogADKPlugin` imported from `@posthog/ai/adk`. However, the currently published `@posthog/ai` package available to this project is version `1.6.0`, whose exports contain no `./adk` module or `PostHogADKPlugin` symbol. Installing `@posthog/ai@next` also failed because that npm tag does not exist.

I did not leave an import that would fail at runtime or a dependency that cannot provide the documented integration. Therefore **no AI events are currently being sent**.

## What was verified

- Confirmed `@google/adk` is the framework responsible for the application’s model calls.
- Confirmed the application has one shared conversation/session (`thread_abc`), a stable user ID (`user_123`), and an ADK-managed `get_weather` tool loop.
- Confirmed the documented plugin import fails to resolve with the published package:
  `TS2307: Cannot find module '@posthog/ai/adk'`.
- Restored the project to its prior supported dependency set and ran `npm run build` successfully.
- Confirmed the supplied `POSTHOG_API_KEY` and `POSTHOG_HOST` values are configured in `.env` without placing them in source code.

## Required next step

Wait for a published PostHog package release that exports `@posthog/ai/adk` and `PostHogADKPlugin` (or obtain an officially supported package/version from PostHog). Once available, install that version and register the plugin on the existing `Runner` in `src/index.ts` with a `PostHog` client initialized from `POSTHOG_API_KEY` and `POSTHOG_HOST`.

The expected result for each `ask()` call is one AI trace using `thread_abc` as the AI session ID, attributed to the ADK `userId`, with tool spans for `get_weather` and model-generation events beneath the same trace.

## Verification after the package is available

1. Run `npm run build`.
2. Set any required Gemini provider credentials locally.
3. Run `npm start` to execute both weather questions in the shared ADK session.
4. In [AI Observability](https://us.posthog.com/project/483112/ai-observability), inspect the newest traces. Confirm each user question is one trace, both traces share the same AI session, and the weather tool appears as a span.
