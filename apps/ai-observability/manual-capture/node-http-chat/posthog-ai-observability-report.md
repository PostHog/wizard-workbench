# PostHog AI Observability setup

## Status

AI Observability is wired for manual capture and the TypeScript build passes. It has not been live-verified against the model endpoint, because no model request was made during setup.

## Integration selected

- **Variant:** `ai-observability-manual-capture`
- **Reason:** the project calls an OpenAI-compatible endpoint with `fetch` and has no vendor LLM SDK in its Node manifest.
- **Provider:** `ollama`, based on the default local endpoint (`http://localhost:11434`).
- **SDK:** the existing `posthog-node` client is reused; no second PostHog client was created.

## What was instrumented

`src/index.ts` now captures the existing LLM workflow as AI Observability events:

- Each `Thread` is one AI session, using `Thread.threadId` as `$ai_session_id`.
- Each `ask()` invocation creates one UUID `$ai_trace_id` shared by every model call and tool execution in that turn.
- Every `complete()` fetch is captured as `$ai_generation`, including the model, provider, input/output messages, token counts, latency, and available tools.
- Each `lookup_order` execution is captured as `$ai_span`.
- Generation and tool events use `$ai_parent_id` and `$ai_span_id` to preserve the execution hierarchy.
- The existing authenticated user ID is used as the stable PostHog distinct ID.

Existing product analytics initialization, `identify()`, and `chat_message_sent` capture calls were left unchanged.

## Configuration

The project `.env` now defines the existing client's required values:

- `POSTHOG_PROJECT_API_KEY`
- `POSTHOG_HOST`

No credentials were added to source code. Ensure your local shell or deployment loads `.env` before starting the app.

The AI integration record is available at `.posthog-wizard-cache/.posthog-ai.json`.

## Verification

Verified successfully:

```bash
npm run build
```

To live-verify, start the app with the PostHog environment variables loaded and a reachable local Ollama-compatible server, then run:

```bash
npm start
```

The sample program sends two questions in `thread_abc`. In **LLM Analytics → Traces**, expect one AI session with two traces:

1. The first trace contains a generation that requests `lookup_order`, the `lookup_order` span, and the final generation.
2. The second trace contains one generation.

Both traces should be attributed to the application's stable user ID. If `LLM_URL` is redirected to a non-Ollama provider, update the `$ai_provider` value in `src/index.ts` to match that provider before assessing costs.

## Files changed

- `src/index.ts`
- `.env`
- `.posthog-wizard-cache/.posthog-ai.json`
- `posthog-ai-observability-report.md`
