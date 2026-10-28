# PostHog AI Observability setup

## Status

AI Observability is wired with explicit manual capture and compiles successfully. It has not been exercised against a live model endpoint, so delivery to PostHog remains runtime-unverified.

## Integration selected

- **Variant:** `ai-observability-manual-capture`
- **Reason:** The Node project calls an OpenAI-compatible local endpoint with `fetch` rather than a vendor LLM SDK. The endpoint and model identify the default provider as Ollama.
- **SDK:** Reused the existing `posthog-node` dependency; no packages were added.

## What changed

- `src/index.ts`
  - Adds one sanitized `$ai_session_id` per chat thread.
  - Generates one UUID `$ai_trace_id` per `Thread.ask()` turn. Both model generations within a tool-using turn share that trace ID.
  - Captures each successful model response as `$ai_generation` with model, provider, prompts, response, token counts, latency, HTTP status, request URL, and available tools.
  - Captures each `lookup_order` execution as an `$ai_span` in the same trace, including its input, output, and latency.
  - Reuses the existing stable user ID as the AI event distinct ID.
  - Fails loudly in non-production when `POSTHOG_PROJECT_API_KEY` is absent; production skips AI capture in that case.
- `package.json`
  - The `start` script now loads the local `.env` file through `tsx`.
- `.env`
  - Configures `POSTHOG_PROJECT_API_KEY` and `POSTHOG_HOST` using the provided project values.
- `.env.example`
  - Documents the two required environment variable names without values.
- `.posthog-wizard-cache/.posthog-ai.json`
  - Records the manual-capture integration metadata for later wizard reporting.

Existing product analytics initialization, identification, `chat_message_sent` capture, and dashboards were not changed.

## Verification

- Ran `npm run build` successfully (`tsc --noEmit`).
- A live request was not run because the application depends on a reachable LLM endpoint. To verify delivery, start the endpoint and run:

```bash
npm run start
```

The script runs two turns in one chat thread. In PostHog, open **AI Observability → Traces** and check that both turns belong to one session, each turn has one trace, each successful model request is a generation, and any `lookup_order` execution appears as a span in that turn's trace.

## Privacy mode

Manual capture currently sends prompt and completion content because `src/index.ts` explicitly includes `$ai_input`, `$ai_output_choices`, `$ai_input_state`, and `$ai_output_state`. This is the effective default for the new integration.

Before sending prompts, responses, tool arguments, or tool results that must not be stored in PostHog, change the manual payload construction in `src/index.ts` to omit or conditionally exclude those `$ai_*` content properties. Manual capture does not use a wrapper SDK privacy-mode switch. Removing these properties affects future events only; it does not delete previously ingested data.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for the behavior of privacy controls in SDK-based integrations.
