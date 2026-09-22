# PostHog AI Observability setup

## Integration

- **Workflow:** `ai-observability-anthropic-node`, selected because this Node project directly uses `@anthropic-ai/sdk`.
- Added `@posthog/ai` and `posthog-node`.
- `src/index.ts` now constructs PostHog's Anthropic wrapper with `POSTHOG_API_KEY` and `POSTHOG_HOST` from the environment. The configured values are stored in the local `.env` file and are not embedded in source.
- The client flushes pending telemetry with `posthog.shutdown()` before the CLI process exits.

## Trace structure

- `Conversation.threadId` is sent as `$ai_session_id`, so both example turns are grouped into one AI session.
- Each `Conversation.ask()` call creates one `posthogTraceId` and supplies it to every Anthropic call in that turn.
- `Conversation.userId` is passed as the stable `posthogDistinctId`.
- The existing `get_weather` tool dispatch now emits an `$ai_span` with the same trace and session IDs. A tool-enabled turn therefore contains its model generations plus the weather-tool span in one trace.

## Verification

- `npm run build` completed successfully (`tsc --noEmit`).
- A live model call was not run because this environment has no configured `ANTHROPIC_API_KEY`. The integration is **wired but not live-verified**.
- To verify, load the configured `.env` values, provide a valid `ANTHROPIC_API_KEY`, and run `npm run start`. Then open **AI Observability → Traces** in PostHog. The sample run should create one `thread_abc` session containing two turn traces; the first weather turn should include two generations and a `get_weather` span.

## Compatibility note

The installed `@posthog/ai` release declares an optional peer range of `@anthropic-ai/sdk >=0.112.3 <0.126.0`, while this project retains its existing `@anthropic-ai/sdk ^0.32.0`. Dependencies were installed with npm's legacy peer-dependency resolution to preserve the project SDK version. The TypeScript build passes, but confirm the live trace before relying on this unsupported SDK pairing. No vendor SDK upgrade was made.
