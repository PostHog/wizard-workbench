# PostHog AI Observability setup

## Status

**Wired, unverified in PostHog.** TypeScript compilation passes, but no model request was made during setup because the LLM endpoint credentials and service are user-controlled.

## Integration

- Selected the **manual-capture Node** workflow because this project calls an OpenAI-compatible endpoint through `fetch`, with no vendor LLM SDK installed.
- Reused the existing `posthog-node` client; no second client was created and the existing product analytics calls were not changed.
- Added `$ai_generation` captures in `src/index.ts` for every successful model completion. They include the model, provider, request messages, output choices, token counts, HTTP status, latency, tools, and request URL.
- Added `$ai_span` captures for each `lookup_order` tool execution.
- Each `Thread` is an AI Observability session (`$ai_session_id = threadId`), and each `ask()` call mints one `$ai_trace_id`. Generation and tool span IDs are connected with `$ai_parent_id` to form the trace tree.
- The model provider defaults to `ollama`, matching the local endpoint. Set `LLM_PROVIDER` if `LLM_URL` targets a different OpenAI-compatible provider.

## Configuration

Configured the existing environment variable names in `.env`:

- `POSTHOG_PROJECT_API_KEY`
- `POSTHOG_HOST`

The token and ingestion host are read from environment variables by the existing PostHog client and are not embedded in source code.

## Verification

`npm run build` completed successfully (`tsc --noEmit`).

To verify delivery, start the app with the required LLM environment configured:

```bash
npm run start
```

Then open **AI Observability → Traces** in the configured PostHog project. The fixture runs two turns in `thread_abc`:

1. The order question should produce one trace containing a generation, a `lookup_order` span, and a final generation.
2. The refund question should produce a second trace with one generation.

Both traces should be grouped in the same AI session and attributed to the existing stable user ID. The generation provider should be `ollama` unless `LLM_PROVIDER` was set.

## Privacy mode

Manual captures currently send `$ai_input` and `$ai_output_choices`, so prompt and completion content is captured. There is no SDK privacy-mode setting applied to the manual payloads.

Before sending prompts or responses that must not be stored in PostHog, remove or redact those properties in the `$ai_generation` capture in `src/index.ts` before the event is sent. This does not change previously stored events or arbitrary custom properties. See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for the supported controls on SDK-captured integrations.
