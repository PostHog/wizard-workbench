# PostHog AI Observability setup

## Status

AI Observability is wired for the app's **Groq** calls and the TypeScript build passes. End-to-end ingestion is **unverified** because this setup does not have a Groq API key and must not invoke the vendor API.

## Integration

- Selected `ai-observability-groq-node`: the project uses the Node `openai` SDK with Groq's `https://api.groq.com/openai/v1` base URL, so the gateway-specific Groq workflow takes precedence over the plain OpenAI workflow.
- Added `@posthog/ai@8` and `posthog-node@5` alongside the existing OpenAI SDK.
- Replaced the OpenAI-compatible client constructor in `src/index.ts` with PostHog's wrapped `OpenAI` client and a `PostHog` client.
- Reads configuration only from `POSTHOG_API_KEY` and `POSTHOG_HOST`; the configured values are stored in `.env`, never in source code.
- Uses `privacyMode: false` in `src/index.ts`, which is the default behavior and captures LLM prompts and completions.
- Shuts down PostHog with a bounded, non-throwing wait when the short-lived script exits so queued AI events have a chance to flush.

## Trace design

`Thread` provides the existing analytics boundaries:

- **AI session:** `threadId` — all turns in one chat thread share `$ai_session_id`.
- **Trace:** one `randomUUID()` per `Thread.ask()` call — every model call made while answering that question shares the same `posthogTraceId`.
- **Person:** `userId` is sent as `posthogDistinctId`.
- **Provider:** each generation explicitly sets `$ai_provider: 'groq'`, ensuring the OpenAI-compatible client is attributed and priced as Groq.
- **Tools:** this project does not register or dispatch LLM tools, so no `$ai_span` events are expected.

In the supplied two-turn example, the first turn should produce one generation in its trace. The second turn should produce the conversation-condensing generation and the reply generation in a **single second trace**; both traces should appear in the same AI session.

## Verification

- Ran `pnpm build` successfully (`tsc --noEmit`).
- Confirmed the PostHog package imports, wrapped client, per-call session/trace/identity properties, and bounded shutdown in `src/index.ts`.
- Confirmed `POSTHOG_API_KEY` and `POSTHOG_HOST` are present in `.env`.

To verify ingestion, ensure `GROQ_API_KEY` is available in the process environment, then run `pnpm start`. In PostHog's **AI Observability → Traces**, inspect the newest trace and confirm:

1. `$ai_provider` is `groq` and the model is `llama-3.3-70b-versatile`.
2. The first turn has one generation; the second has two generations grouped under one trace.
3. Both traces share the same `$ai_session_id`.
4. The trace is attributed to the thread's user ID.

## Privacy mode

`privacyMode: false` in `src/index.ts` captures `$ai_input` and `$ai_output_choices`, including prompt and completion content. Before sending sensitive prompts or outputs to PostHog, change that client setting to `privacyMode: true`; for a one-off call, add `posthogPrivacyMode: true` to the completion request. Privacy mode removes SDK-captured inputs and output choices, but it does not retroactively remove stored data or automatically scrub arbitrary custom properties.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).

## Follow-up

`pnpm` reported that `@posthog/ai@8.19.2` declares a peer range for OpenAI 6 or 7, while this project retains OpenAI 4.x. The integration build still passes. The existing OpenAI version was intentionally not upgraded because the workflow directs preserving the vendor SDK version; validate one real Groq request before considering ingestion confirmed.

Integration metadata is recorded in `.posthog-wizard-cache/.posthog-ai.json`.
