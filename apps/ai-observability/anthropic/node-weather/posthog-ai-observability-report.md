# PostHog AI Observability setup

## Status

AI Observability is wired but **not yet runtime-verified**. TypeScript verification passed with `npm run build`. A live run was not attempted because this environment has no `ANTHROPIC_API_KEY`.

## Integration

- **Variant:** `ai-observability-manual-capture`.
- **Why manual capture:** the project uses `@anthropic-ai/sdk` `^0.32.0`, while the current `@posthog/ai` wrapper requires Anthropic SDK versions `>=0.112.3 <0.126.0`. The existing SDK was intentionally not upgraded.
- **Package installed:** `posthog-node`.
- **Configuration:** `POSTHOG_API_KEY` and `POSTHOG_HOST` are set in the ignored local `.env`; `.env.example` documents the variable names without credentials.

`src/index.ts` now captures the existing Claude requests explicitly:

- `Conversation.threadId` is sent as `$ai_session_id`, so both scripted turns belong to one AI session.
- Each `Conversation.ask()` invocation creates exactly one UUID `$ai_trace_id`. The first generation, `get_weather` span, and follow-up generation share that trace id.
- Events use the existing stable `userId` as `distinctId`.
- Generation events include Anthropic model/provider, request input, response output, token counts, latency, configured tools, and stop reason.
- The tool execution is recorded as an `$ai_span`, nested between the two generation spans.
- The CLI awaits `posthog.shutdown()` so buffered events are sent before the process exits.

## Verify in PostHog

1. Set `ANTHROPIC_API_KEY` locally with a valid Anthropic credential.
2. Run `npm run start`.
3. In **AI Observability → Traces**, open the newest trace. The script should produce two traces under the `thread_abc` session. A turn that calls the tool should display:
   `anthropic.messages.create → get_weather → anthropic.messages.create`.
4. Confirm the trace is attributed to the existing `user_123` distinct id and that token, latency, model, and provider values are populated.

## Privacy mode

`src/index.ts` constructs the PostHog client with `privacyMode: false`, so the manual generation captures currently include prompt and completion content in `$ai_input` and `$ai_output_choices`.

For prompts or responses that must not be stored, change `privacyMode` to `true` before those events are sent **and** omit `$ai_input` and `$ai_output_choices` from the manual `captureGeneration` payload. Manual payload fields are explicitly supplied by this application, so changing SDK privacy mode alone does not remove them. This affects future captures only; it does not alter previously stored events or arbitrary custom properties.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for details.
