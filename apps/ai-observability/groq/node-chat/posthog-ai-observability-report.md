# PostHog AI Observability setup

## Status

AI Observability is wired for the Groq chat application and the TypeScript build passes. Delivery is **wired, unverified**: no Groq request was made during setup, so confirm the resulting trace in PostHog after triggering the app.

## Integration

- Selected `ai-observability-groq-node`: the project uses the OpenAI Node SDK with `https://api.groq.com/openai/v1`, so Groq is the actual provider.
- Added `@posthog/ai` and `posthog-node` to `package.json`; the existing OpenAI SDK was not changed.
- `src/index.ts` now constructs PostHog from `POSTHOG_API_KEY` and `POSTHOG_HOST`, and passes it to the PostHog OpenAI wrapper while retaining Groq’s base URL.
- Each `Thread` is one AI session (`$ai_session_id` from `threadId`). Each `ask()` call creates one trace ID, shared by the turn’s model calls. The second sample turn therefore groups its recap and response generations in one trace.
- Generations use the thread’s `userId` as their stable distinct ID and set `$ai_provider` to `groq` for correct provider attribution and cost calculation.
- The application has no registered model tools, so no `$ai_span` tool captures were added.
- The production-only fallback continues to run the original Groq client when PostHog configuration is absent. Non-production runs fail loudly if `POSTHOG_API_KEY` is missing, preventing silent observability loss.

## Configuration

The supplied PostHog values are stored in `.env` under:

- `POSTHOG_API_KEY`
- `POSTHOG_HOST`

Keep `GROQ_API_KEY` configured separately. The project does not load `.env` itself, so export its values before running the script, for example:

```bash
set -a
. .env
set +a
GROQ_API_KEY=your_groq_key npm run start
```

## Verification

- Passed: `npm run build` (`tsc --noEmit`).
- Not run: `npm run start`, because it would send real requests to Groq.

To verify delivery, run the command above and then open **AI Observability → Traces** in PostHog. Confirm:

1. Both sample questions are in the `thread_abc` AI session.
2. The second question produces a single trace containing both the conversation-condensing generation and the reply generation.
3. Generations have provider `groq`, model `llama-3.3-70b-versatile`, and distinct ID `user_123`.

## Privacy mode

Privacy mode is explicitly **off** in `src/index.ts` on the `PostHog` constructor (`privacyMode: false`). This captures prompt and completion content in SDK-captured AI events, which is the default behavior requested by the integration.

Enable privacy mode before sending prompts or responses that should not be stored in PostHog. Change that constructor option to `privacyMode: true`, or pass `posthogPrivacyMode: true` on an individual LLM call. Privacy mode excludes `$ai_input` and `$ai_output_choices`; it does not remove arbitrary custom properties or previously stored events.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).
