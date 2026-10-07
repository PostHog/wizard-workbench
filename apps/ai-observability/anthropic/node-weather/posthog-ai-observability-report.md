# PostHog AI Observability setup

## Status

**Wired, live delivery unverified.** TypeScript compilation passes (`npm run build`), but no LLM request was run because it requires an Anthropic credential and would incur an external model call.

## What changed

- Added `posthog-node` as a runtime dependency.
- Configured `POSTHOG_API_KEY` and `POSTHOG_HOST` in the local `.env` file using the supplied project values. No credentials were added to source control.
- Added explicit AI Observability capture to `src/index.ts`:
  - one `$ai_session_id` per `Conversation.threadId` (`thread_abc` in the included runner),
  - one generated `$ai_trace_id` per `Conversation.ask()` turn,
  - a `$ai_generation` event for every Anthropic `messages.create` call, including model, provider, input/output, usage, latency, and stop reason,
  - a `$ai_span` event for `get_weather`, placed between the initial generation and its tool-result follow-up generation,
  - `userId` as the PostHog `distinctId`, and
  - an awaited `posthog.shutdown()` at CLI completion so queued AI events are sent before exit.
- Wrote `.posthog-wizard-cache/.posthog-ai.json` to record the integration path.

## Compatibility decision

The project uses `@anthropic-ai/sdk` `^0.32.0`. The current `@posthog/ai` wrapper declares a peer range of `@anthropic-ai/sdk >=0.112.3 <0.129.0`, so installing the wrapper fails dependency resolution. I preserved the existing Anthropic SDK version and used PostHog's supported **manual-capture** path with `posthog-node` instead. This captures the same session → trace → generation/span tree without upgrading or replacing the application’s LLM SDK.

## Expected trace structure

Running the included two-turn weather conversation should create one AI session containing two traces, both attributed to `user_123`:

```text
thread_abc
├─ ask("What's the weather in San Francisco?")
│  ├─ Anthropic generation
│  ├─ get_weather span
│  └─ Anthropic generation
└─ ask("How about Boston?")
   ├─ Anthropic generation
   ├─ get_weather span
   └─ Anthropic generation
```

## Verification

- Passed: `npm run build` (`tsc --noEmit`).
- Confirmed: `POSTHOG_API_KEY` and `POSTHOG_HOST` are present in `.env`.
- Not run: `npm run start`, because `ANTHROPIC_API_KEY` is not configured for this run and the command invokes Claude.

To verify delivery, make `ANTHROPIC_API_KEY`, `POSTHOG_API_KEY`, and `POSTHOG_HOST` available to the process (the application itself reads environment variables; ensure your chosen shell or deployment loads `.env`), then run:

```bash
npm run start
```

Open **AI Observability → Traces** in PostHog and inspect the newest trace. Confirm each turn has a single trace ID shared by its generations and weather span, and confirm that both turns are grouped under the same `thread_abc` AI session.

## Privacy mode

The PostHog client in `src/index.ts` sets `privacyMode: false`. Prompt and completion payloads supplied to the manual `$ai_generation` captures are therefore sent to PostHog. Change that constructor option to `privacyMode: true` *before* sending prompts or responses whose content should not be stored. Privacy mode excludes `$ai_input` and `$ai_output_choices` from SDK-captured AI events; it does not remove arbitrary custom properties, manually constructed payloads beyond the SDK’s supported handling, or data already ingested.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for the current behavior and controls.
