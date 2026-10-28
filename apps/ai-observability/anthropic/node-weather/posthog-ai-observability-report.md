# PostHog AI Observability setup

## Status

**Wired, unverified.** The TypeScript build passes, but no LLM call was made because this environment does not have an Anthropic API key configured.

## Integration

- Added `posthog-node` for manual AI Observability capture.
- Used the **manual-capture** path because the existing `@anthropic-ai/sdk` version (`^0.32.0`) is outside the peer-supported range of the current `@posthog/ai` Anthropic wrapper. The Anthropic SDK was not upgraded.
- Initialized a guarded PostHog client in `src/index.ts` using `POSTHOG_API_KEY` and `POSTHOG_HOST`. In non-production environments, missing PostHog configuration throws a clear error; production remains a no-op.
- Configured the start script to load `.env` with `tsx --env-file=.env`.
- Stored the PostHog token and ingestion host in `.env` and documented their names in `.env.example`. No credentials were added to source code.

## Captured AI tree

`Conversation.threadId` is the AI session identifier and `Conversation.userId` is the distinct ID.

Each `Conversation.ask()` call creates one UUID trace ID. Both Anthropic requests made during a tool-using turn share that trace ID, producing:

```text
session (threadId)
└─ trace (one ask call)
   ├─ $ai_generation: initial Anthropic request
   ├─ $ai_span: get_weather execution
   └─ $ai_generation: follow-up Anthropic request
```

Generation events include Anthropic model, token usage, latency, prompts, responses, stop reason, and available tools. The tool span captures its input, result, and latency. All events are associated with the existing stable user ID. The CLI awaits `posthog.shutdown()` before exit so queued events are flushed.

## Verification

- Passed: `npm run build` (`tsc --noEmit`).
- Not run: `npm run start`, which would call Anthropic and requires `ANTHROPIC_API_KEY`.

To verify delivery:

1. Set `ANTHROPIC_API_KEY` in `.env`.
2. Run `npm run start`.
3. In PostHog, open **AI Observability → Traces** and inspect the newest trace.
4. Confirm that the two turns share one session, each turn has its own trace, and tool-using turns show two generations with a `get_weather` span between them.

## Privacy mode

The PostHog client is configured with `privacyMode: false` in `src/index.ts`, so this setup intentionally captures prompts and model completions. It also manually supplies `$ai_input`, `$ai_output_choices`, `$ai_input_state`, and `$ai_output_state` in that file.

Before sending prompts, completions, tool inputs, or tool results that must not be stored in PostHog, enable `privacyMode: true` at the client initialization **and** remove the manually supplied content fields from the generation and span capture helpers. Client privacy mode excludes SDK-captured `$ai_input` and `$ai_output_choices`, but manually captured properties must be removed deliberately. Existing data is unaffected.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).

## Scope

No existing PostHog initialization, identity, product event capture, or dashboards were changed.
