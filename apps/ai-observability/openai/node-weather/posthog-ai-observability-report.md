# PostHog AI Observability setup

## Integration

- **Variant:** `ai-observability-openai-node`
- **Why:** This Node project uses the modern `openai` SDK directly through `chat.completions.create`, with no framework or OpenAI-compatible gateway override.
- **Packages declared:** `@posthog/ai` and `posthog-node` in `package.json`. The existing `openai` SDK was not changed.
- **Configuration:** `.env` now supplies `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`. The application reads both values only from environment variables; no PostHog token or host is embedded in source.

## Instrumented flow

`src/index.ts` now constructs PostHog's OpenAI wrapper when PostHog configuration is available. In development, a missing PostHog token or host produces a clear configuration error; in production, the existing OpenAI client remains usable without PostHog capture.

The weather assistant has no conversation identifier, so one `$ai_session_id` is generated for each process run. Each `ask()` invocation generates one `posthog_trace_id`, which is passed to both model calls in that turn along with the existing stable user ID. This yields the expected tree:

```text
process run session
└─ ask() turn trace
   ├─ first chat completion
   ├─ get_weather tool span
   └─ follow-up chat completion
```

The `get_weather` dispatch records an `$ai_span` with the same trace and session IDs, tool input/output state, and latency. The CLI shuts down the PostHog client in `finally` so queued AI events are flushed before exit.

## Privacy mode

Privacy mode is explicitly **off** via `privacyMode: false` in `src/index.ts`. This is the default capture behavior: SDK-captured prompts and completion content are included in AI Observability.

Enable it before sending prompts or responses whose sensitive content must not be stored in PostHog. Change that option to `privacyMode: true`, or set `posthog_privacy_mode: true` on a specific OpenAI request. Privacy mode excludes SDK-captured `$ai_input` and `$ai_output_choices`; it does not remove arbitrary custom properties, manually captured payloads, or events already stored.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).

## Verification

The intended manual trigger is the existing CLI flow: run `npm run start` after making `OPENAI_API_KEY`, `POSTHOG_PROJECT_TOKEN`, and `POSTHOG_HOST` available to the process. Do not run the model only for verification; after a user-triggered run, open **AI Observability → Traces** and confirm one trace containing two generations and the `get_weather` span. A later `ask()` turn in the same process should appear in the same AI session.

Installed dependencies and ran `npm run build` successfully. The integration is type-checked but not runtime-verified because the OpenAI model was deliberately not called during setup. Run the CLI trigger above, then inspect the newest trace in PostHog.
