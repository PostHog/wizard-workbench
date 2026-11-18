# PostHog AI Observability setup

## Integration

- Selected `ai-observability-anthropic-node` because the Node manifest uses `@anthropic-ai/sdk` directly.
- Declared the required wrapper dependencies: `@posthog/ai` and `posthog-node`.
- Replaced the direct Anthropic client with PostHog's Anthropic wrapper in `src/index.ts`.
- Configured the PostHog client from `POSTHOG_API_KEY` and `POSTHOG_HOST`; the supplied project configuration was written to the uncommitted `.env` file, not source code.
- Added a run record at `.posthog-wizard-cache/.posthog-ai.json`.

## Trace structure

The weather assistant already has the right scopes for AI Observability:

- **Session:** `Conversation.threadId` is sent as `$ai_session_id`, grouping the two scripted questions into one conversation.
- **User:** `Conversation.userId` is sent as the PostHog distinct ID on model calls and tool spans.
- **Turn:** each `Conversation.ask()` call creates one UUID trace ID. Both Claude calls in a tool-using turn share it.
- **Tool span:** each `get_weather` execution is captured as an `$ai_span`, including its input, output, latency, trace ID, and session ID.
- **Delivery:** the script shuts down the PostHog client after completion so queued observability events can be sent before Node exits.

## Privacy mode

Privacy mode is explicitly **off** in `src/index.ts` (`privacyMode: false`). This is the default integration behavior and allows the wrapper to capture prompt content in `$ai_input` and completions in `$ai_output_choices`.

Before sending prompts or completions that must not be stored in PostHog, change the PostHog constructor option to `privacyMode: true`, or add `posthogPrivacyMode: true` to an individual Anthropic request. Privacy mode excludes SDK-captured inputs and outputs; it does not remove arbitrary custom properties, manually captured payloads, or data already stored.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).

## Verification

The integration is wired but not fully runtime-verified:

- `pnpm build` was attempted, but this checkout has no `node_modules`, so `tsc` was unavailable.
- The workflow intentionally declares dependencies in `package.json` without changing the lockfile or installing packages.

After project dependencies are installed, run:

```bash
pnpm build
```

Then run the existing script with a valid `ANTHROPIC_API_KEY` and the PostHog environment variables available to the process. It sends two questions in the same `thread_abc` conversation. In **AI Observability → Traces**, confirm:

1. Both turns share one session.
2. A tool-using turn contains two Claude generations under one trace.
3. The `get_weather` span appears in that trace.
4. The attributed person matches the conversation's stable user ID.
