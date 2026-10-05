# PostHog AI Observability setup

## Status

**Wired, unverified in PostHog.** The integration type-checks successfully, but no model request was sent during setup.

## Integration

- Selected the `ai-observability-google-adk` variant because `@google/adk` is the application framework that runs the model calls.
- Added `@posthog/ai` and `posthog-node` to `package.json`.
- `src/index.ts` now creates a `PostHog` server client from `POSTHOG_API_KEY` and `POSTHOG_HOST`, then registers `PostHogADKPlugin` on the existing ADK `Runner`.
- The existing ADK `sessionId` (`thread_abc`) becomes the shared `$ai_session_id`; the two calls to `ask()` each create one trace under that session.
- The existing ADK `userId` becomes the PostHog distinct ID. The plugin captures the agent run, both model generations, and the `get_weather` tool span without manual duplicate captures.
- The process awaits `posthog.shutdown()` on both success and error paths so pending observability events are flushed before the script exits.
- Existing PostHog environment keys in `.env` were reused and not overwritten. No token or host value was added to source code.

## Verification

- Passed: `npm run build` (`tsc --noEmit`).
- Not run: the model workflow itself, because setup does not use the application's model-provider credentials.

## How to verify delivery

1. Ensure the normal ADK model-provider configuration and the existing `POSTHOG_API_KEY` and `POSTHOG_HOST` environment variables are available.
2. Run `npm run start`.
3. In PostHog, open **AI Observability → Traces** and inspect the newest trace.
4. Confirm that `thread_abc` has two traces, one for each question. Each trace should contain an agent span, a generation that requests `get_weather`, the `get_weather` tool span, and a generation that returns the answer. Both traces should be attributed to the ADK user ID.

## Privacy mode

Privacy mode is explicitly **off** in `src/index.ts` through `PostHogADKPlugin({ ..., privacyMode: false })`. Consequently, the plugin captures model prompt and completion content in SDK-captured AI events.

Enable it before sending prompts or responses whose content should not be stored in PostHog: change that option to `privacyMode: true` in the runner's plugin registration. Privacy mode excludes `$ai_input` and `$ai_output_choices` from SDK-captured events; it does not change arbitrary custom properties, manually captured payloads, or data already stored.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for details.

## Scope

No existing analytics initialization, identity calls, capture calls, dashboards, agent configuration, or tool implementation was changed.
