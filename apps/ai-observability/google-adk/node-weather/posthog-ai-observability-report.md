# PostHog AI Observability setup

## Integration

- **Selected workflow:** `ai-observability-google-adk` because `@google/adk` is the framework that owns the application's model calls, tool execution, user identity, and conversation sessions.
- **Packages installed:** `@posthog/ai` and `posthog-node`.
- **Instrumentation entry point:** `src/index.ts`.
- **Run record:** `.posthog-wizard-cache/.posthog-ai.json` records the Google ADK integration and entry point.

`src/index.ts` now creates a `PostHog` client from `POSTHOG_API_KEY` and `POSTHOG_HOST`, then registers `PostHogADKPlugin` with the existing ADK `Runner`. The application keeps its existing agent, tool, and two-turn conversation intact.

The plugin automatically records the complete ADK hierarchy:

- The existing ADK session ID becomes one AI Observability session.
- Each call to `ask()` becomes a trace.
- The ADK user ID becomes the PostHog distinct ID.
- Agent execution and the existing weather tool call become spans.
- Each model invocation becomes a generation.

The client is shut down in `main()`'s `finally` block so queued observability events flush before the script exits.

## Environment configuration

The local `.env` contains the configured values for:

```text
POSTHOG_API_KEY
POSTHOG_HOST
```

`.env.example` documents those variables with empty values so deployments can configure them without committing credentials. In non-production environments, a missing variable raises a clear startup error; production runs without observability rather than breaking application execution.

## Verification

`npm run build` completed successfully (`tsc --noEmit`). This verifies the installed SDK and ADK plugin imports type-check.

The integration is **wired but not end-to-end verified** because triggering the agent requires the application's model-provider credentials. To verify delivery:

1. Ensure the PostHog variables above and the required Google model-provider credentials are available to the process.
2. Run `npm run start`.
3. Open [AI Observability Traces](https://app.posthog.com/ai-observability/traces) and inspect the newest traces.
4. Confirm both turns share one AI session, each turn is a separate trace, the existing tool appears as a span, and model calls appear as generations under the agent span.

## Privacy mode

Privacy mode is explicitly **off** in `src/index.ts` on both the PostHog client and `PostHogADKPlugin` (`privacyMode: false`). This preserves prompt and completion content in AI Observability, matching the default setup behavior.

Before sending prompts or responses whose sensitive content must not be stored in PostHog, change the applicable `privacyMode` option in `src/index.ts` to `true`. Privacy mode excludes SDK-captured AI inputs and output choices, but it does not remove arbitrary custom properties, manually captured payloads, or events already stored in PostHog. See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).
