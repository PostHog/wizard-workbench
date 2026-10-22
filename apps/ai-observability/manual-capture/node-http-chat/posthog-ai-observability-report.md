# PostHog AI Observability setup

## Status

Manual AI Observability capture is wired and type-checked. It remains **runtime-unverified** because no model request was made during setup.

## Selected integration

- **Variant:** `ai-observability-manual-capture`
- **Reason:** the Node manifest contains no LLM provider or framework SDK. The chat reaches an OpenAI-compatible endpoint with `fetch`, so explicit `$ai_generation` and `$ai_span` capture is the correct integration.
- **SDK:** the existing `posthog-node` dependency and client are reused; no packages were added.

## Changes made

- Added manual AI generation capture in `src/index.ts` after each successful model response. Each generation includes the model, provider, endpoint, messages, response text, token counts, latency, tools, trace/session IDs, and parent span ID.
- Added a new trace ID for every `Thread.ask()` call and reuses it for every generation and tool span in that turn.
- Uses `Thread.threadId` as `$ai_session_id`, grouping the two sample turns into one AI Observability session.
- Added an `$ai_span` around each `lookup_order` tool execution. The follow-up generation is attached to the tool span, preserving the generation → tool → generation tree.
- Added `LLM_PROVIDER`, defaulting to `ollama` for the existing local endpoint. Set `LLM_PROVIDER` when `LLM_URL` points at a different compatible provider.
- Configured `POSTHOG_PROJECT_API_KEY` and `POSTHOG_HOST` in the local `.env` file. No credentials were added to source code.
- Wrote `.posthog-wizard-cache/.posthog-ai.json` for setup-report metadata.

The pre-existing PostHog client, `identify()` call, product event capture, shutdown behavior, and dashboards were not changed.

## Expected trace tree

For the included two-turn script, AI Observability should show one session (the thread) containing two traces:

1. First turn: model generation → `lookup_order` span → final model generation.
2. Second turn: one model generation.

All AI events use the thread's existing distinct ID. Every generation and tool span carries the same session and trace IDs for its respective turn.

## Verification

- Passed: `npm run build` (`tsc --noEmit`).
- Confirmed: the required PostHog environment keys are present in `.env`.
- Not run: `npm start`, because it would issue real model requests and requires a reachable LLM endpoint.

To verify delivery, make sure the process receives the configured `POSTHOG_PROJECT_API_KEY` and `POSTHOG_HOST` values, start the local model endpoint, then run:

```bash
npm start
```

Open **AI Observability → Traces** in PostHog and inspect the newest trace. Confirm that both turns share one session, calls within a turn share one trace, the first turn includes the `lookup_order` span, and the spans are parent-linked as described above.

## Privacy mode

This is a manual-capture integration. `src/index.ts` currently sends `$ai_input` and `$ai_output_choices`, so prompt and completion content is captured.

Manual capture does not have an SDK-wide `privacyMode` switch that removes fields already supplied to `capture()`. Before sending sensitive prompts or responses, change the generation capture in `src/index.ts` to omit `$ai_input` and `$ai_output_choices` (and avoid placing sensitive data in any other custom capture property). This affects only newly captured events; it does not remove previously stored data.

See the [AI Observability privacy-mode documentation](https://posthog.com/docs/ai-observability/privacy-mode) for the related SDK controls and retention behavior.
