# AI Observability setup

## Status

Wired and build-verified; ingestion is unverified because this project does not have an `OPENAI_API_KEY` configured, and no model request was made during setup.

## Integration

- Selected `ai-observability-openai-node` because the Node manifest contains the direct `openai` SDK and no higher-level AI framework or gateway configuration.
- Added `@posthog/ai` and `posthog-node`.
- Replaced the direct OpenAI client with PostHog's OpenAI wrapper in `src/index.ts`.
- Initialized the PostHog server client from `POSTHOG_API_KEY` and `POSTHOG_HOST`; both are configured in `.env`.
- Left the existing OpenAI API-key behavior unchanged.
- Set `privacyMode: false`, so the wrapper captures model prompts and completions by default.

## Trace structure

- One AI session ID is created for each process run, which is the app's available conversation scope.
- Each `ask()` call creates one trace ID and passes it to every OpenAI generation in that turn.
- The existing stable user ID is sent as the PostHog distinct ID.
- Each `get_weather` execution emits an `$ai_span` with the same trace and session IDs, its arguments, result, and latency.
- The script performs a bounded PostHog shutdown so queued AI events can be delivered before the process exits.

## Verification

`pnpm build` completed successfully.

To verify ingestion, provide a valid `OPENAI_API_KEY` in the runtime environment and run:

```bash
pnpm start
```

Then open **AI Observability → Traces** in PostHog. The newest run should show one session containing one trace. If the model calls `get_weather`, the trace should contain the first generation, a `get_weather` span, and the follow-up generation. This script has one turn per process; to confirm that multiple turns share an AI session while retaining distinct traces, invoke `ask()` twice before the process shuts down.

## Privacy mode

The effective setting is `privacyMode: false` on the `PostHog` constructor in `src/index.ts`. This captures `$ai_input` and `$ai_output_choices` for wrapper-captured generations.

Enable privacy mode before sending prompts or responses whose content should not be stored in PostHog. Change that constructor setting to `privacyMode: true` for all requests, or pass `posthogPrivacyMode: true` to a specific OpenAI request. Privacy mode excludes SDK-captured inputs and outputs, but it does not remove arbitrary custom properties, manually captured payloads, or data already ingested.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).

## Notes

The dependency installation reported that `@posthog/ai` declares an OpenAI peer range starting at v6, while this project intentionally remains on its existing OpenAI v4 dependency. The TypeScript build succeeds; validate an end-to-end request before relying on the integration in production.
