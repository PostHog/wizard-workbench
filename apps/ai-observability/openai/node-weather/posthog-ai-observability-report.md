# PostHog AI Observability setup

## Status

**Wired, unverified.** TypeScript verification passed with `npm run build`. The model was not called because this setup does not have an OpenAI credential available for a safe live request.

## Integration

- Selected `ai-observability-openai-node`: this is a Node project that uses the direct `openai` SDK, without a gateway base URL or higher-level LLM framework.
- Added `@posthog/ai` and `posthog-node`, then replaced the direct client with PostHog's OpenAI wrapper in `src/index.ts`.
- The PostHog client reads `POSTHOG_API_KEY` and `POSTHOG_HOST` from the environment; no PostHog token or host is embedded in source.
- Added a per-process AI session ID and a new trace ID for each call to `ask`. The initial completion and the tool-result follow-up share that trace ID.
- The weather tool emits an `$ai_span` in the same trace when the model invokes it. Its stable demo user ID is attached as the distinct ID; no user-entered PII is added as a custom event property.
- The application awaits `posthog.shutdown()` on completion so queued AI events are flushed before the script exits.
- Wrote the integration run record to `.posthog-wizard-cache/.posthog-ai.json`.

## Environment

`POSTHOG_API_KEY` and `POSTHOG_HOST` are configured in `.env`. `OPENAI_API_KEY` is still required in the process environment before a live run. This CLI currently reads environment variables directly, so ensure its launcher makes the local environment file available or provides the variables through the host environment.

> Note: installation used npm's legacy peer-dependency resolution because the latest `@posthog/ai` package declares an optional OpenAI peer dependency for a newer major version while this project intentionally retains OpenAI 4.x. The TypeScript build passes, but a live trace is still required to validate runtime compatibility.

## Verification steps

1. Provide `OPENAI_API_KEY` in the runtime environment.
2. Run `npm run start`.
3. In PostHog, open **AI Observability → Traces** and inspect the newest trace.
4. Confirm that the trace contains the initial generation and, when the model uses `get_weather`, the weather-tool span plus the follow-up generation. All of these operations must share one trace ID.
5. Run another turn within the same process if the script is extended to accept multiple questions. The current sample has no conversation/thread field, so it intentionally uses one AI session per process run.

## Privacy mode

Privacy mode is **off** at `src/index.ts:11` (`privacyMode: false`). As a result, SDK-captured prompts and completion content are sent to PostHog along with metadata such as model, token usage, and latency.

Enable privacy mode before sending prompts or responses whose sensitive content should not be stored. For this integration, change that client option to `privacyMode: true`, or set `posthogPrivacyMode: true` on an individual OpenAI request. Privacy mode excludes SDK-captured `$ai_input` and `$ai_output_choices`; it does not retroactively delete prior events or automatically remove arbitrary custom/manual properties.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for details.
