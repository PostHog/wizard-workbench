# PostHog AI Observability setup

## Integration

Instrumented the Node.js Anthropic SDK using the `ai-observability-anthropic-node` wrapper path.

- Added `@posthog/ai` and compatible `posthog-node` dependencies.
- Replaced the direct Anthropic client construction with the PostHog Anthropic wrapper in `src/index.ts`.
- Configured the PostHog client exclusively from `POSTHOG_API_KEY` and `POSTHOG_HOST`; both are configured locally in `.env`.
- Preserved the existing Anthropic API-key configuration.
- Added one AI session per `Conversation` (`threadId`) and one trace per `ask()` turn (`randomUUID()`). Both Anthropic calls in a tool-use turn share the same trace ID and stable user ID.
- Added an `$ai_span` for each `get_weather` tool execution, sharing the turn trace and conversation session.
- Added graceful PostHog shutdown after the script finishes or errors so queued AI events are sent.

## Verification

`npm run build` completed successfully after installing the declared dependencies.

The integration is wired but runtime delivery is unverified because no Anthropic API request was made. To verify with credentials configured, run:

```bash
npm run start
```

Then open **AI Observability → Traces** in PostHog. The sample run has two turns in `thread_abc`; each turn should appear as one trace in the same AI session. A turn where Claude requests the weather should contain two generations and a `get_weather` span.

## Privacy mode

Privacy mode is disabled with `privacyMode: false` in `src/index.ts:11`. As a result, SDK-captured prompts and completions are included in AI Observability events. Enable it before sending prompts or responses whose sensitive content must not be stored in PostHog by changing that value to `true`, or use the supported per-request `posthogPrivacyMode: true` setting.

Privacy mode excludes `$ai_input` and `$ai_output_choices` from SDK-captured events; it does not remove arbitrary custom properties, manually captured payloads, or data already stored. See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).

## Files changed

- `package.json`
- `package-lock.json`
- `src/index.ts`
- `.env` (local PostHog configuration)
- `.posthog-wizard-cache/.posthog-ai.json`
- `posthog-ai-observability-report.md`
