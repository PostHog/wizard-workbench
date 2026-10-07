# PostHog AI Observability setup

> ⚠️ **Needs your attention**
> - Run `npm run start` with `GROQ_API_KEY` configured, then inspect the newest trace in PostHog AI Observability. The integration was build-verified but no live model request was made during setup.

## What changed

- Selected the **Groq Node** workflow because the existing OpenAI-compatible client targets Groq's API base URL.
- Added `@posthog/ai` and `posthog-node` alongside the existing OpenAI SDK. The existing OpenAI SDK version was preserved.
- Added `POSTHOG_API_KEY` and `POSTHOG_HOST` to the local `.env` file and documented the empty variable names in `.env.example`.
- Replaced the Groq client with PostHog's OpenAI wrapper when PostHog is configured. Production without PostHog configuration keeps the original vendor client behavior rather than sending with a blank token; development reports the missing configuration loudly.
- Added a stable AI session ID from `Thread.threadId`, a fresh UUID trace ID per `Thread.ask()` call, the thread user ID as the distinct ID, and `$ai_provider: groq` on each wrapped model call.

## Expected AI Observability hierarchy

The demo creates one `Thread`, so both questions belong to one AI session. Each `ask()` call creates one trace:

- The first turn produces one Groq generation.
- The second turn produces a summary generation and an answer generation sharing the same trace ID.
- There are no application tool registrations, so no `$ai_span` events are expected.

## Verification

`npm run build` completed successfully after the integration.

To validate data delivery, run:

```bash
npm run start
```

Then open **AI Observability → Traces** in PostHog and inspect the newest trace. Confirm that the two turns share the `thread_abc` session, the second turn contains two generations in one trace, the person is attributed to the thread's user ID, and the provider is `groq`.

## Privacy mode

Privacy mode is explicitly **off** in `src/index.ts` through `privacyMode: false`, so PostHog captures SDK-generated prompt and completion content (`$ai_input` and `$ai_output_choices`). Enable it before sending content that must not be stored by changing that option to `privacyMode: true`; individual calls can instead use `posthogPrivacyMode: true`.

Privacy mode excludes those SDK-captured input and output properties. It does not remove arbitrary custom properties or previously stored events. See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).
