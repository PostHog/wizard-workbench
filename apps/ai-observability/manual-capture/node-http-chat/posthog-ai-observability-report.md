# PostHog AI Observability setup

> ⚠️ **Needs your attention**
> - Start the configured LLM endpoint, run `pnpm start`, and inspect the resulting traces in PostHog to complete runtime verification.

## Integration

- **Selected workflow:** `ai-observability-manual-capture`
- **Reason:** This Node project makes OpenAI-compatible LLM requests directly with `fetch`, rather than through a vendor SDK or framework.
- **SDK:** Reused the existing `posthog-node` dependency and existing server-side PostHog client. No existing PostHog initialization, identity, product events, or dashboards were changed.
- **Configuration:** Added `POSTHOG_PROJECT_API_KEY` and `POSTHOG_HOST` to the uncommitted `.env` file. The application continues to read its existing environment variable names; no token or host was added to source code.

## Captured AI structure

`src/index.ts` now manually captures AI Observability events for every LLM call:

- `$ai_generation` captures the model, provider (`ollama`), request URL, messages, tool definitions, token usage, output, and latency.
- The chat thread id is used as `$ai_session_id`, so both turns in a conversation are grouped into one AI Observability session.
- Each `Thread.ask()` call creates one UUID `$ai_trace_id`; the initial and post-tool model calls for that turn share it.
- Each `lookup_order` execution is captured as a `$ai_span` in the same trace.
- The app's existing stable user id remains the event `distinctId`; no name, email, or other user-entered PII was added to event properties.

A run record was also written to `.posthog-wizard-cache/.posthog-ai.json`.

## Verification

1. Declared dependencies were restored with `pnpm install`, and `pnpm build` passed (`tsc --noEmit`).
2. Ensure the local OpenAI-compatible endpoint configured by `LLM_URL` is running.
3. Run `pnpm start`. The included script sends two questions in the same `thread_abc` conversation; the first can invoke `lookup_order`.
4. In **PostHog AI Observability > Traces**, open the newest trace and confirm:
   - both LLM calls inside a tool-using turn share one trace;
   - `thread_abc` groups the two turns into one session;
   - `lookup_order` appears as a span when the model calls it; and
   - the trace is attributed to the app's stable user id.

Runtime delivery was not exercised because no LLM credentials or endpoint were run by this setup.

## Privacy mode

- **Effective setting:** Prompt and completion content is captured. In this manual-capture integration, `src/index.ts` explicitly sends `$ai_input` and `$ai_output_choices`; there is no SDK `privacyMode` setting on this path.
- **When to change it:** Before sending prompts or responses whose content must not be stored in PostHog.
- **How to change it:** For manual capture, remove or redact `$ai_input` and `$ai_output_choices` in the `$ai_generation` payload in `src/index.ts` before capture. Do not add unsupported per-request privacy options to this manual path.
- **What changes:** Omitting those properties prevents prompt and completion text from being sent in subsequently captured manual events; it does not alter already ingested events or arbitrary custom properties.
- [AI Observability privacy mode documentation](https://posthog.com/docs/ai-observability/privacy-mode)
