# PostHog AI Observability setup

## Status

**Wired and build-verified; delivery unverified.** The Groq calls are instrumented and `pnpm build` passes. A live Groq request was not made during setup, so confirm delivery in AI Observability after running the script.

## Integration

- Selected the **Groq Node** workflow. Although the project uses the `openai` package, its client targets Groq through `https://api.groq.com/openai/v1`.
- Declared `@posthog/ai@8` and `posthog-node@6` in `package.json`, retaining the existing OpenAI SDK version.
- Replaced the vendor constructor in `src/index.ts:1-15` with PostHog's OpenAI-compatible wrapper, while preserving the existing Groq base URL.
- Initialized PostHog from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`; these real values are configured in the local `.env` file and are not embedded in source.
- Every model call now includes the existing thread ID as `$ai_session_id`, the existing user ID as `posthogDistinctId`, and `$ai_provider: 'groq'` (`src/index.ts:25-43`).
- `Thread.ask()` creates one UUID trace per user turn (`src/index.ts:59`). The second turn's conversation-condensing generation and reply generation therefore share one trace, while both turns remain in the same thread session.
- The app has no tool registration or dispatch loop, so no `$ai_span` events were added.
- The short-lived script now shuts down the PostHog client after completion to give queued AI events a chance to send (`src/index.ts:98-103`).

## Verification

Dependencies were installed and the configured build command completed successfully:

```bash
pnpm build
```

No Groq request was made during setup. Ensure the process has the existing `GROQ_API_KEY` configured, then run:

```bash
pnpm start
```

Open **AI Observability → Traces** in PostHog and inspect the newest trace:

1. The two sample questions should share the `thread_abc` AI session.
2. The first question should produce one trace with one generation.
3. The second question should produce one trace with two generations (condense and reply).
4. Generations should be attributed to `user_123` and have provider `groq`.

> **Compatibility note:** `pnpm install` warned that the installed `@posthog/ai` release declares an OpenAI peer range of `^6.48.0 || ^7.0.0`, while this project retains its existing `openai` 4.x dependency. The integration build passes, and the existing OpenAI SDK was intentionally not upgraded. Confirm the live trace after the first run before considering a provider-SDK upgrade.

## Privacy mode

Privacy mode is explicitly **off** in `src/index.ts:6` (`privacyMode: false`), so PostHog captures prompts and completion content for the wrapper-generated AI events. Before sending sensitive model inputs or outputs, set `privacyMode: true` in that constructor or pass `posthogPrivacyMode: true` on an individual model request. Privacy mode excludes `$ai_input` and `$ai_output_choices` from SDK-captured events; it does not alter previously captured events or arbitrary custom properties.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for details.

## Files changed

- `package.json`
- `src/index.ts`
- `.posthog-wizard-cache/.posthog-ai.json`
- `posthog-ai-observability-report.md`
