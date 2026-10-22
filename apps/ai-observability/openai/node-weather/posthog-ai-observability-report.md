# PostHog AI Observability setup

> ⚠️ **Needs your attention**
> - Set `OPENAI_API_KEY` in your local environment before running the weather assistant.
> - Trigger a run and confirm the resulting trace in PostHog before treating this as verified.

## Integration

- Selected `ai-observability-openai-node` because this Node project uses the modern `openai` SDK directly, with no framework or gateway override.
- Declared `@posthog/ai` and `posthog-node` alongside the existing OpenAI SDK in `package.json`.
- Configured `POSTHOG_API_KEY` and `POSTHOG_HOST` in the local `.env` file using the supplied project configuration. No credentials were added to source code.
- Replaced the direct OpenAI client with PostHog's OpenAI wrapper in `src/index.ts`.
- Recorded the integration in `.posthog-wizard-cache/.posthog-ai.json`.

## Trace structure

`ask()` is one AI turn. Each call creates one `posthogTraceId`, which is supplied to both model requests. A process-scoped UUID is used as `$ai_session_id`, so all turns during one script run share an AI session.

The existing `USER_ID` is supplied as the distinct ID. The existing weather-tool dispatch now emits an `$ai_span` with the same trace and session identifiers, along with its input, result, and elapsed time.

A tool-using run should therefore appear as one trace containing two OpenAI generations and one `get_weather` span. If the model elects not to call the tool, the trace will contain the initial generation only.

## Verification

Installed the compatible SDK pair: `@posthog/ai@^4.4.0` and `posthog-node@^4.18.0`. The project’s `npm run build` command now passes.

The integration is wired but not yet verified against a live model call because `OPENAI_API_KEY` is not configured. After setting it:

1. Run `npm start`.
2. Open **AI Observability → Traces** in PostHog and inspect the newest trace.
3. Confirm that the trace contains the expected generation(s), a `get_weather` span when the tool runs, the process-level session ID, and the existing distinct ID.

## Privacy mode

Privacy mode is disabled via `privacyMode: false` in `src/index.ts`. This is the default AI Observability behavior and allows SDK-captured prompts and completions to be sent as `$ai_input` and `$ai_output_choices`.

Enable privacy mode before processing content that must not be stored in PostHog. Change that option to `privacyMode: true` in `src/index.ts`, or pass `posthogPrivacyMode: true` on an individual wrapped OpenAI request. Privacy mode excludes SDK-captured `$ai_input` and `$ai_output_choices`; it does not retroactively delete existing events or automatically remove arbitrary custom properties.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).
