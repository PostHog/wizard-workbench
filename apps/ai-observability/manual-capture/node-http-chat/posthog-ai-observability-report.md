# PostHog AI Observability setup

## Status

AI Observability is wired for the app's manual `fetch`-based OpenAI-compatible LLM calls. The TypeScript build passes; ingestion is **wired, unverified** because no LLM request was run during this setup.

## Integration selected

- **Workflow:** `ai-observability-manual-capture`
- **Reason:** The Node manifest has no vendor LLM SDK. The app calls an OpenAI-compatible endpoint directly through `fetch`.
- **Provider default:** `ollama`, matching the default local endpoint. Override it with `LLM_PROVIDER` when the endpoint represents another provider.
- **SDK:** existing `posthog-node` client; no packages were added.

## Changes made

- Added `src/ai-observability.ts` to capture AI Observability events using the existing PostHog server client.
- Added one `$ai_generation` event for every LLM request, including messages, completion/tool-call output, model, provider, token usage, latency, HTTP status, request URL, and error details when a request fails.
- Added a `$ai_span` event for each `lookup_order` tool execution without recording tool arguments or results as ordinary event properties.
- Assigned one `$ai_session_id` from `Thread.threadId` to every turn in a conversation.
- Assigned one UUID `$ai_trace_id` per `Thread.ask()` call and reused it for the initial generation, tool span, and follow-up generation in that turn.
- Preserved the existing PostHog initialization, identification, and `chat_message_sent` analytics event.
- Configured `POSTHOG_PROJECT_API_KEY` and `POSTHOG_HOST` in `.env`; values are not included in this report.
- Wrote the required integration record to `.posthog-wizard-cache/.posthog-ai.json`.

## Verification

1. Ensure a compatible LLM endpoint is available at `LLM_URL` (the default is the local Ollama-compatible endpoint) and set `LLM_MODEL` or `LLM_PROVIDER` if the defaults do not represent that endpoint.
2. Make the configured environment variables available to the Node process, then run:

   ```bash
   npm run start
   ```

3. The included flow asks two questions on the same `thread_abc` conversation. The first order question can cause two model generations with a `lookup_order` span between them; the second question creates a new trace in the same AI session.
4. Open **AI Observability → Traces** in PostHog and inspect the newest traces. Confirm:
   - both turns share one `$ai_session_id`;
   - each turn has its own `$ai_trace_id`;
   - all generations and the optional tool span within a turn share that turn's trace ID;
   - generations show the configured model/provider, token counts, prompt/completion content, and latency;
   - the person is attributed using the existing stable user ID.

## Build verification

`npm run build` completed successfully (`tsc --noEmit`).
