# PostHog AI Observability setup

## Integration

- Selected **manual capture** for the existing `@anthropic-ai/sdk` 0.32.x client. The SDK is older than the compatible PostHog Anthropic wrapper range, so the vendor SDK was not upgraded and its real calls are captured explicitly instead.
- Added `posthog-node` and initialized it in `src/index.ts` with `POSTHOG_API_KEY` and `POSTHOG_HOST` read from the environment. No PostHog token or host is hardcoded in source.
- Added `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env` and documented their names in `.env.example`.
- Recorded the integration in `.posthog-wizard-cache/.posthog-ai.json`.

## Captured AI observability tree

`Conversation.threadId` is the AI session ID and `Conversation.userId` is the distinct ID. Each `ask()` call creates one UUID trace ID, shared by every item in that turn:

```text
thread_abc (AI session)
├─ ask("What's the weather in San Francisco?")
│  └─ trace
│     ├─ $ai_generation (Anthropic messages.create)
│     ├─ $ai_span (get_weather)
│     └─ $ai_generation (Anthropic follow-up)
└─ ask("How about Boston?")
   └─ trace with the same shape
```

Generation events include the Anthropic model, provider, request and response payloads, token counts, latency, tool definitions, session ID, trace ID, and parent/span IDs. The weather-tool span is linked to the initial generation; the follow-up generation is linked to that span.

## Verification

- `npm run build` passed (`tsc --noEmit`).
- `posthog-node` resolved to `^5.52.6`; no vulnerabilities were reported during installation.
- A live model request was **not** run because `ANTHROPIC_API_KEY` is not configured in the local environment. PostHog delivery is therefore wired but unverified.

## Live verification

1. Set `ANTHROPIC_API_KEY` in the runtime environment used by the app.
2. Run `npm run start`.
3. In PostHog, open **AI Observability → Traces** and inspect the two newest traces.
4. Confirm both traces belong to `thread_abc`, are attributed to `user_123`, and each contains two Anthropic generations around one `get_weather` span.

The client calls `posthog.shutdown()` on both successful and failed CLI exits so queued observability events are flushed before the process ends.
