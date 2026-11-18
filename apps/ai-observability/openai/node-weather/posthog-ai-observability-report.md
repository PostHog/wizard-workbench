# PostHog AI Observability setup

> ⚠️ **Needs your attention**
> - Set `OPENAI_API_KEY` in the runtime environment before running the weather assistant. It was not configured by this setup.
> - The installed `@posthog/ai` 8.21.0 package declares a peer dependency on OpenAI 6 or 7, while this project retains its existing OpenAI 4.x dependency. Type checking passes, but validate a real request in a non-production environment before relying on production telemetry.

## What was configured

- Selected the **OpenAI Node** AI Observability workflow because the project uses the `openai` Node SDK directly (`package.json`).
- Added `@posthog/ai` and `posthog-node` to `package.json`; the existing OpenAI SDK was not upgraded.
- Configured `POSTHOG_API_KEY` and `POSTHOG_HOST` in the local `.env` file and added `.env` to `.gitignore`. No PostHog credentials were written to source code.
- Replaced the active OpenAI client path with PostHog's OpenAI wrapper whenever the PostHog environment variables are available. When they are unavailable, the original OpenAI client remains usable and a non-production server warning explains that AI events will be missed.

## Instrumentation

`src/index.ts` now models the CLI invocation as an AI Observability tree:

- One `process-<uuid>` `$ai_session_id` is generated in `main` for the process run.
- One UUID `posthogTraceId` is generated in `ask` for each user turn and reused for both `chat.completions.create` calls.
- The existing `user_123` identifier is sent as `posthogDistinctId`.
- The existing weather tool dispatch is captured as an `$ai_span` named `get_weather`, carrying the same trace and session identifiers, its timing, arguments, and result.
- The short-lived CLI calls `posthog.shutdown(3000)` in `finally`, with errors caught, so queued observability data gets an opportunity to send before exit.

Expected tree for the built-in request:

```text
process session
└─ weather question trace
   ├─ OpenAI generation (tool request)
   ├─ get_weather span
   └─ OpenAI generation (final answer)
```

## Verification

- `pnpm build` completed successfully (`tsc --noEmit`).
- PostHog environment keys are present in `.env`.
- No model request was sent during setup, so ingestion is **wired but unverified**.

To verify after supplying `OPENAI_API_KEY`, run the existing flow:

```bash
pnpm start
```

Then open **AI Observability → Traces** in PostHog and inspect the newest trace. Confirm it contains two generations and one `get_weather` span under one trace; run the script again to see a separate process session for that second run.

## Privacy mode

Privacy mode is explicitly **off** in `src/index.ts` through `privacyMode: false`. Consequently, SDK-captured prompt and completion content is included in AI Observability events. Enable it before sending prompts or completions that must not be stored in PostHog:

- SDK-wide: change `privacyMode: false` to `privacyMode: true` on the `PostHog` constructor.
- Per request: add `posthogPrivacyMode: true` to the relevant OpenAI call.

Privacy mode excludes SDK-captured `$ai_input` and `$ai_output_choices`; it does not remove arbitrary custom properties, manually captured payloads, or previously stored events. Review [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) before changing the setting.
