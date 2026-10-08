# PostHog AI Observability setup

## Status

AI Observability is wired and the TypeScript build passes. It remains **unverified in PostHog** because no Anthropic request was made during setup.

## Integration

- **Workflow:** `ai-observability-manual-capture`
- **Reason:** the application uses `@anthropic-ai/sdk` `^0.32.0`. The current `@posthog/ai` Anthropic wrapper requires `@anthropic-ai/sdk >=0.112.3 <0.129.0`, so installing the wrapper would conflict with the pinned vendor SDK. The vendor SDK was not upgraded.
- **SDK added:** `posthog-node` `^5.55.0`
- **Configuration:** `.env` now contains `POSTHOG_API_KEY` and `POSTHOG_HOST`; neither value is embedded in source code.

`src/index.ts` constructs a PostHog client from those environment variables and flushes it with `posthog.shutdown()` after the CLI finishes.

## Captured AI tree

For each `Conversation.ask()` call:

- `Conversation.threadId` is sent as `$ai_session_id`, so both turns in one thread are grouped into one AI session.
- One UUID is created at the beginning of the turn and reused as `$ai_trace_id` for every generation and tool span in that turn.
- Each Anthropic `messages.create()` call emits a `$ai_generation` with the Anthropic model, provider, request messages, response content, usage tokens, stop reason, tools, and latency.
- The existing `get_weather` execution emits an `$ai_span`, nested under the first generation; the follow-up generation is nested under that span.
- The existing `Conversation.userId` is used as the stable `distinctId` (`user_123` in this fixture).

The expected result is one `thread_abc` session containing two traces. A tool-using turn contains: generation → `get_weather` span → generation.

## Verification

1. Ensure `ANTHROPIC_API_KEY`, `POSTHOG_API_KEY`, and `POSTHOG_HOST` are available to the process that starts the app.
2. Run `npm run start`.
3. In PostHog, open **AI Observability → Traces** and inspect the newest trace.
4. Confirm that each turn has one trace, both traces share the same session ID, and a tool-using trace contains the `get_weather` span between its two generations.

Validation completed during setup:

```text
npm run build
# tsc --noEmit — passed
```

## Privacy mode

`src/index.ts` initializes the PostHog client with `privacyMode: false`. Because this is manual capture, the code explicitly sends `$ai_input` and `$ai_output_choices`; prompts and completions will therefore be stored in PostHog.

Before sending sensitive prompts or responses, change the code at the manual generation captures to omit or sanitize `$ai_input` and `$ai_output_choices`. Setting `privacyMode: true` is appropriate for SDK-captured generation fields, but it does not remove arbitrary properties explicitly sent by manual capture. Existing events are unaffected.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).
