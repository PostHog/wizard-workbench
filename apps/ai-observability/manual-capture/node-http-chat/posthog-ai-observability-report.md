# PostHog AI Observability setup

## Status

**Wired and build-verified; runtime delivery is unverified.** The project has no vendor LLM SDK: it calls an OpenAI-compatible endpoint with `fetch`, so it uses PostHog's manual-capture integration.

`npm run build` completed successfully (`tsc --noEmit`). I did not call the model endpoint because its credentials and availability are outside this setup.

## What changed

- Added manual `$ai_generation` capture around every model request in `src/index.ts`.
  - Captures model, configured provider, prompt and completion messages, token counts, response latency, HTTP status, request URL, and available tools.
  - Uses `LLM_PROVIDER`, defaulting to `ollama`, so deployments targeting another compatible provider can set the correct provider name without a code change.
- Added one valid `$ai_session_id` per chat thread (`thread-<sanitized thread id>`) and a new UUID `$ai_trace_id` per `Thread.ask()` turn.
  - Multiple model calls in a tool-using turn share that trace ID.
  - The two scripted questions share the same AI session ID.
- Added an `$ai_span` for each `lookup_order` tool execution, linked to the surrounding turn trace.
- Preserved the existing product-analytics initialization, `identify()`, and `chat_message_sent` capture unchanged.
- Configured `POSTHOG_PROJECT_API_KEY` and `POSTHOG_HOST` in the ignored local `.env` file, and added an empty `.env.example` template. No credentials were added to source code.
- Wrote the AI Observability run record to `.posthog-wizard-cache/.posthog-ai.json`.

## Dashboard

Created [AI Observability — HTTP Chat](https://us.posthog.com/project/483112/dashboard/2128783) with these saved insights:

1. [AI generations](https://us.posthog.com/project/483112/insights/ri0QFP0e) — daily generation volume.
2. [AI generation latency](https://us.posthog.com/project/483112/insights/sFcAB1vs) — average generation latency.
3. [AI token usage](https://us.posthog.com/project/483112/insights/iI0cR35M) — daily input and output token totals.

The dashboard will populate after the application submits `$ai_generation` events.

## Verify a trace

1. Make the configured PostHog environment variables available to the Node process. This project reads `process.env`; if your runtime does not load `.env` automatically, export the values from your local environment before starting it.
2. Ensure the configured OpenAI-compatible endpoint is reachable. By default this is `http://localhost:11434/v1/chat/completions` with model `llama3.2`.
3. Run `npm start`.
4. Open **AI Observability → Traces** and inspect the newest trace, then run a second turn in the same thread if needed.

Expected result:

- One AI session for `thread_abc` spanning both scripted questions.
- One trace per question/turn.
- The order question should show two generations and one `lookup_order` span when the model selects the tool.
- The second question should appear as a separate trace in the same session.

## Privacy mode

Manual capture currently sends `$ai_input` and `$ai_output_choices` explicitly from `src/index.ts`, so prompt and completion content is captured. This manual path has no SDK-wide `privacyMode` switch to add. Before handling prompts or responses that must not be stored in PostHog, redact or omit those two properties at the manual `$ai_generation` capture call in `src/index.ts`.

This only affects future captured events; it does not alter historical data or arbitrary custom properties. See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for the documented privacy behavior.
