# PostHog AI Observability setup

## Status

AI Observability is wired for manual capture and the TypeScript build passes. No LLM request was sent during setup, so delivery to PostHog remains unverified until you run the chat with a reachable model endpoint.

## Integration

- **Variant:** `ai-observability-manual-capture`, selected because the app calls an OpenAI-compatible endpoint through `fetch` and has no vendor LLM SDK.
- **Client:** Reused the existing `posthog-node` client from `src/posthog.ts`; existing product analytics initialization, identify calls, and product events were not changed.
- **Environment:** Configured `POSTHOG_PROJECT_API_KEY` and `POSTHOG_HOST` in `.env` for the existing client. No PostHog credentials are embedded in source.
- **Dependencies:** No change required: `posthog-node` was already declared.

`src/index.ts` now captures every successful model completion as `$ai_generation`, including the model, Ollama provider, request URL, messages, completion, token counts, latency, available tools, and parent span relationship. Each `ask()` call creates one UUID trace ID, while the stable `Thread.threadId` remains the AI session ID for the whole conversation. `Thread.userId` is used as the stable PostHog distinct ID.

When the model requests `lookup_order`, its execution is captured as an `$ai_span` in the same trace. The follow-up generation is linked beneath that tool span. This yields the expected first-turn tree—generation → `lookup_order` span → generation—and a second-turn trace in the same session.

## Verification

- Ran `npm run build` successfully (`tsc --noEmit`).
- To trigger the sample, ensure the configured PostHog environment variables are available to the process and that an OpenAI-compatible endpoint is running at `LLM_URL` (default: the local Ollama endpoint), then run `npm start`.
- Open **AI Observability → Traces** in PostHog and inspect the newest trace. A complete run should show one session for the thread, one trace for each `ask()` call, the `lookup_order` span on the first trace, and attribution to the thread user.

## Privacy mode

The manual capture sends `$ai_input` and `$ai_output_choices` from `src/index.ts`, so prompt and completion content is captured. Manual capture does not use an SDK-wide `privacyMode` switch to filter these explicitly supplied properties. Before sending sensitive prompts or responses, remove or redact those two properties at the capture callsite; this does not remove already stored events. See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for the general behavior and retention guidance.

## Files created

- `.env` — project token and host for the existing PostHog client
- `.posthog-wizard-cache/.posthog-ai.json` — AI Observability run record
- `posthog-ai-observability-report.md` — this handoff report
