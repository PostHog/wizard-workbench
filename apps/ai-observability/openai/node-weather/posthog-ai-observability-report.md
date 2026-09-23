# PostHog AI Observability setup

## Integration

- Selected the **OpenAI (Node)** workflow because this project makes its model calls through the `openai` Node SDK (`chat.completions.create`).
- Declared `@posthog/ai` and `posthog-node` alongside the existing OpenAI SDK in `package.json`.
- Configured `POSTHOG_API_KEY` and `POSTHOG_HOST` in the local `.env` file. The application reads both values from the environment; no PostHog credentials are embedded in source.
- Replaced the direct OpenAI client with PostHog’s OpenAI wrapper in `src/index.ts` and set `privacyMode: false`.

## Trace structure

The CLI process is the AI session because the app has no conversation ID. Each call to `ask()` creates one trace ID and attaches it to every generation in that turn.

When the weather tool is requested, the expected AI Observability tree is:

```text
session (one CLI process)
└─ trace (one ask() turn)
   ├─ OpenAI generation
   ├─ get_weather span
   └─ OpenAI generation
```

The existing stable `USER_ID` is attached as the AI distinct ID. The weather tool span uses the same trace and session IDs as the wrapped model calls. The CLI awaits `posthog.shutdown()` before exit so queued events are sent.

## Verification

Installed the declared dependencies and verified the integration with:

```bash
npm run build
```

The TypeScript build passes. A live model call was not made because it requires the application's OpenAI credential. To validate ingestion, make `OPENAI_API_KEY`, `POSTHOG_API_KEY`, and `POSTHOG_HOST` available to the process, then run:

```bash
npm start
```

In PostHog, open **AI Observability → Traces** and inspect the newest trace. Confirm the two model generations and `get_weather` span share one trace, and that a second CLI turn receives a new trace under a new CLI-process session.

## Privacy mode

Privacy mode is disabled through `privacyMode: false` in `src/index.ts`. This captures prompt and completion content in SDK-captured AI events. Enable it before sending prompts or responses whose content must not be stored in PostHog by changing that option to `privacyMode: true`, or set `posthogPrivacyMode: true` on an individual OpenAI request.

Privacy mode excludes `$ai_input` and `$ai_output_choices` from SDK-captured events; it does not retroactively remove existing events or automatically scrub arbitrary custom properties. See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).

## Status

The instrumentation is wired and the TypeScript build passes. Runtime ingestion remains pending a user-triggered model call.
