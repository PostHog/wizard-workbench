# PostHog AI Observability setup

> ⚠️ **Needs your attention**
> - Set `OPENAI_API_KEY`, then run the assistant and inspect the resulting trace in PostHog AI Observability.

## Integration

- **Workflow:** `ai-observability-openai-node`
- **Reason:** The Node manifest contains the modern OpenAI SDK (`openai` 4.77.0) and the code uses its direct `chat.completions.create` API with no gateway base-URL override or higher-level agent framework.
- **Packages declared:** `@posthog/ai` and `posthog-node`; the existing OpenAI version is unchanged.
- **Wrapper setup:** `src/index.ts` creates a `PostHog` client from `POSTHOG_API_KEY` and `POSTHOG_HOST`, then supplies it to PostHog's OpenAI wrapper.

## Trace structure

`ask()` is one assistant turn. It now creates one trace ID and sends it on both model calls. The process-run session ID is created in `main()` and passed to the turn, so every generation in that turn has the same `$ai_session_id` and `$ai_trace_id`.

The application already has a stable user identifier (`user_123`), which is supplied as `posthogDistinctId`. The existing weather tool execution emits an `$ai_span` with the same trace and session IDs, its input/output state, and measured latency.

## Environment configuration

The local `.env` file now contains the supplied values for:

- `POSTHOG_API_KEY`
- `POSTHOG_HOST`

The `.env` file is ignored by Git. No PostHog credentials are embedded in source code.

## Verification

The required packages are installed and `npm run build` completes successfully. The application’s existing OpenAI 4.x dependency was preserved; the current PostHog wrapper declares a newer optional OpenAI peer, so npm installed the wrapper with its peer-resolution compatibility mode. TypeScript confirms the wrapper imports and instrumentation types compile.

No model request was made because an OpenAI credential was not available. After setting `OPENAI_API_KEY`, run:

```sh
npm run start
```

Then open **AI Observability → Traces** in PostHog and inspect the newest trace. A successful weather request that invokes the tool should show one session, one trace containing two OpenAI generations, and a `get_weather` span. Run another turn in the same process to confirm it groups under the same AI session.

## Privacy mode

Privacy mode is explicitly **off** in `src/index.ts` (`privacyMode: false`). Prompt and completion content are therefore captured by the wrapper. Enable `privacyMode: true` on the `PostHog` constructor, or use `posthogPrivacyMode: true` on a specific OpenAI request, before sending prompts or responses whose sensitive content should not be stored in PostHog. Privacy mode excludes SDK-captured `$ai_input` and `$ai_output_choices`; it does not remove arbitrary custom properties, manually captured payloads, or previously stored events.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).
