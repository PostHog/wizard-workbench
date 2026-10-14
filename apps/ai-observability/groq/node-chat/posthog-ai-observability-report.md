# PostHog AI Observability setup

## Status

The Groq AI Observability integration is wired and the TypeScript build passes. Live delivery to AI Observability remains **unverified** because no LLM request was made during setup.

## Integration

- Selected the **Groq (Node)** workflow because the project uses the modern `openai` Node SDK with `baseURL: 'https://api.groq.com/openai/v1'`.
- Installed `@posthog/ai` and `posthog-node` without upgrading the existing `openai` dependency.
- Configured `POSTHOG_API_KEY` and `POSTHOG_HOST` in the local `.env` file through secure environment tooling. `.env.example` documents the required variable names without credentials.
- Replaced the vendor client in `src/index.ts` with PostHog’s OpenAI-compatible wrapper while preserving the Groq base URL.
- Recorded the wrapper location in `.posthog-wizard-cache/.posthog-ai.json`.

## Trace structure

- **Conversation/session:** `Thread.threadId` is sent as `$ai_session_id`, so every turn in one chat thread belongs to the same AI Observability session.
- **Turn/trace:** `Thread.ask()` creates one UUID per user question and passes it as `posthogTraceId` to every model call in that turn.
- **User:** `Thread.userId` is sent as `posthogDistinctId`.
- **Groq attribution:** every wrapped call sets `$ai_provider: 'groq'`, preventing the OpenAI-compatible gateway from being attributed as OpenAI.
- **Tools:** this CLI registers no model tools, so no `$ai_span` events are expected.
- **Shutdown:** the CLI awaits `posthog.shutdown()` on both successful and failed exits so queued AI events can be delivered.

The second prompt in `main()` runs both the conversation-condensing generation and the reply generation. They share one trace ID; both user turns share the thread session ID.

## Verification

I installed the declared dependencies while preserving the existing OpenAI 4.x dependency, then ran:

```bash
npm run build
```

The build passed successfully. npm’s latest `@posthog/ai` release declares an optional peer dependency on OpenAI 6.x, so installation used npm’s legacy peer-dependency resolution rather than upgrading the project’s LLM SDK.

To verify live delivery, provide `GROQ_API_KEY` in the execution environment and run:

```bash
npm start
```

Then open **AI Observability → Traces** in PostHog and inspect the latest traces. Confirm that each question produces one trace, the second question has two generations under one trace, both traces share the same session, the user is attributed to the stable application user ID, and the provider is Groq.

## Privacy mode

Privacy mode is explicitly **off** in `src/index.ts` on the `PostHog` constructor (`privacyMode: false`). This is the default behavior and captures prompt and completion content in SDK-captured AI generation events.

Enable privacy mode before sending prompts or responses that must not be stored in PostHog. Change that constructor option to `privacyMode: true`, or set `posthogPrivacyMode: true` on an individual wrapped LLM call. Privacy mode excludes `$ai_input` and `$ai_output_choices`; it does not remove arbitrary custom properties, manually captured payloads, or events already stored.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for details.
