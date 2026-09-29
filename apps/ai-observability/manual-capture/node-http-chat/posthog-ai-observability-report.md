# PostHog AI Observability setup

## Status

**Wired, unverified in PostHog.** The TypeScript build passes, but no LLM request was sent during setup because this environment has no model-service credentials or runtime endpoint.

## Integration selected

- **Workflow:** `ai-observability-manual-capture`
- **Reason:** The project calls an OpenAI-compatible local endpoint with `fetch` rather than a vendor LLM SDK.
- **Provider recorded:** `ollama`, matching the default `localhost:11434` endpoint.
- **SDK:** Reused the existing `posthog-node` dependency and existing PostHog client. No dependency changes were required.

## What changed

`src/index.ts` now captures AI Observability data alongside the existing LLM request flow:

- Every `Thread.ask()` call mints one UUID trace ID and reuses it for all model calls in that turn.
- The thread ID is the `$ai_session_id`, grouping the conversation's turns in one AI Observability session.
- The authenticated application user ID is passed as the stable PostHog distinct ID.
- Each model request emits `$ai_generation` with model, provider, request URL, messages, tool declarations, token usage, latency, HTTP status, and completion content.
- Non-successful model HTTP responses emit an error generation before the application throws.
- Each `lookup_order` execution emits an `$ai_span` on the same trace, with its input, output, and latency.

Existing product analytics initialization, identify calls, and `chat_message_sent` capture were left unchanged.

## Configuration

Local values were added through the environment configuration workflow:

- `POSTHOG_PROJECT_API_KEY`
- `POSTHOG_HOST`

The existing PostHog client in `src/posthog.ts` reads these names. The public project token and host were not embedded in source code.

## Verification

Ran successfully:

```text
npm run build
# tsc --noEmit
```

## How to verify delivery

1. Ensure a compatible local model endpoint is available at `LLM_URL` (the default is the Ollama chat-completions endpoint).
2. Run `npm run start`.
3. Open **AI Observability → Traces** in PostHog Project 483112 and inspect the newest trace.
4. Confirm that the two sample questions appear as two traces in the same `thread_abc` session. The first turn should contain a generation, `lookup_order` span when the model selects the tool, and a follow-up generation; all items share that turn's trace ID.

## Privacy mode

This is explicit manual capture, so there is no SDK `privacyMode` switch controlling these events. `src/index.ts` deliberately sends prompt/message content in `$ai_input` and completion content in `$ai_output_choices`, plus tool input/output state. These AI-specific properties may contain sensitive content.

Before sending prompts, responses, or tool results that must not be stored in PostHog, update the capture payloads in `src/index.ts` to omit or redact those fields. This does not remove previously stored events or arbitrary custom properties. See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for the platform guidance.
