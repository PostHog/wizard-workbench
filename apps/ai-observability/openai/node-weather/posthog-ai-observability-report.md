# PostHog AI Observability setup

> ⚠️ **Needs your attention**
> - Supply `OPENAI_API_KEY` and make the configured PostHog environment variables available to the process before running the script. Then confirm the resulting trace in PostHog.

## Integration

- **Selected workflow:** `ai-observability-openai-node`, because this Node project directly uses the modern `openai` SDK (`client.chat.completions.create`) and no higher-level LLM framework or OpenAI-compatible gateway is configured.
- **Dependencies installed:** `@posthog/ai` and `posthog-node`, alongside the existing OpenAI SDK in `package.json`. The package lockfile was generated during installation.
- **Environment configuration:** `POSTHOG_API_KEY` and `POSTHOG_HOST` were added to the local `.env` through the environment configuration tool. The application reads both exclusively from environment variables in `src/index.ts`.
- **Wrapped client:** `src/index.ts` constructs a `PostHog` client and passes it to the PostHog OpenAI wrapper. AI prompt and completion capture is enabled with `privacyMode: false`.

## Trace structure

`ask()` is one assistant turn. It now creates a UUID trace ID that is shared by both OpenAI calls in the turn. A process-scoped UUID serves as the AI session ID, grouping multiple `ask()` turns made during the same script run.

When the model calls `get_weather`, the dispatch loop emits an `$ai_span` with the same trace and session IDs, input arguments, output, span ID, name, and measured latency. Both model generations and the span use the existing stable `USER_ID` as the distinct ID.

## Verification

Run the weather turn after loading the required environment variables into the process:

```sh
npm run start
```

Then open **AI Observability → Traces** in PostHog and inspect the newest trace. A tool-using run should contain:

1. One AI session for the script process.
2. One trace for the weather question.
3. Two OpenAI generations sharing that trace (initial tool-selection and final response).
4. One `get_weather` span sharing the same trace.
5. Attribution to the existing `USER_ID`.

`npm run build` passes successfully. No model call was made during setup because no OpenAI credentials are available to the integration workflow, so the event delivery still needs runtime confirmation.

## Privacy mode

- **Effective setting:** `privacyMode: false` in `src/index.ts` at the `PostHog` constructor. Prompt and completion content are therefore captured for SDK-captured generations.
- **When to change it:** Enable privacy mode before sending prompts or completions whose sensitive content must not be stored in PostHog.
- **How:** Set `privacyMode: true` on the `PostHog` constructor in `src/index.ts`, or pass `posthogPrivacyMode: true` to an individual wrapped OpenAI request.
- **Effect:** Privacy mode excludes `$ai_input` and `$ai_output_choices` from SDK-captured events. It does not remove arbitrary custom properties, manually captured payloads, or events already stored.
- **Documentation:** [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).
