# PostHog AI Observability setup

## Integration

- Selected the **manual-capture** variant because the Node manifest has no vendor LLM SDK; the app calls an OpenAI-compatible endpoint through `fetch`.
- Reused the existing `posthog-node` client and left its existing initialization, identify call, product event, and dashboard configuration unchanged.
- Added manual AI Observability capture in `src/index.ts`:
  - Each `Thread.ask()` creates one UUID `$ai_trace_id`.
  - The stable thread identifier becomes `$ai_session_id`, with a deterministic safe fallback for identifiers containing unsupported characters.
  - Every HTTP model response emits `$ai_generation` with model, provider, messages, token counts, latency, status, and available tools.
  - Both model calls in a tool-using turn share the same trace ID.
  - Each `lookup_order` dispatch emits an `$ai_span` in that same trace.
  - The authenticated application user ID is used as the PostHog `distinctId`.
- `LLM_PROVIDER` defaults to `ollama`, matching the existing local default endpoint. Set `LLM_PROVIDER` when deploying this fetch client against another provider.
- Configured `POSTHOG_PROJECT_API_KEY` and `POSTHOG_HOST` in the local `.env` file using the supplied project configuration. No token or host was added to source code.
- Wrote the AI Observability run record to `.posthog-wizard-cache/.posthog-ai.json`.

## Verification

- `npm run build` completed successfully (`tsc --noEmit`).
- Runtime delivery is **wired, unverified** because no model request was run during setup. With the configured LLM endpoint available, run `npm run start`, then open **AI Observability → Traces** in PostHog.
- The first sample question should create one trace containing two generations and an `lookup_order` span. The second question should create a second trace under the same AI session.

## Privacy mode

Manual capture has no SDK privacy-mode switch in this integration. Prompt and completion content are intentionally captured in `src/index.ts:84` (`$ai_input`) and `src/index.ts:86` (`$ai_output_choices`). No `privacyMode` or per-request privacy override is configured.

Before sending prompts or responses whose sensitive content must not be stored in PostHog, redact or omit those two manually captured properties at the capture callsite in `src/index.ts`. This affects future captures only and does not remove previously stored events. See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for the product’s privacy behavior and SDK-supported controls.

## Scope

No existing PostHog product analytics instrumentation was modified, and no dashboards were created or changed.
