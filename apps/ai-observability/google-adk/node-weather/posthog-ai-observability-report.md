# PostHog AI Observability setup

## Status

AI Observability is wired for the Google Agent Development Kit (Google ADK) Node.js agent. The implementation is **build-verified** with `pnpm run build`.

## Integration selected

- **Variant:** `ai-observability-google-adk`
- **Why:** `package.json` declares `@google/adk`, which is the framework that owns the application's model calls, agent loop, and tool execution.
- **Packages installed:** `@posthog/ai` `^8.21.0` and `posthog-node` `^6.0.2`. Existing `@google/adk` and `zod` manifest versions were preserved.

## What changed

- `src/index.ts`
  - Creates a server-side `PostHog` client from `POSTHOG_API_KEY` and `POSTHOG_HOST`.
  - Registers `PostHogADKPlugin` on the existing ADK `Runner`.
  - Preserves the existing ADK user ID (`user_123`) and conversation/session ID (`thread_abc`). The plugin uses these for person attribution and `$ai_session_id` respectively.
  - Keeps prompt and completion capture enabled with `privacyMode: false` on both the client and plugin.
  - Flushes queued observability events with a bounded, non-throwing `shutdown(3000)` when the short-lived script finishes.
  - Emits a development warning to stderr when either required PostHog environment variable is not configured; production remains a no-op.
- `package.json`
  - Declares the PostHog ADK plugin and Node SDK dependencies.
- `.env`
  - Configures `POSTHOG_API_KEY` and `POSTHOG_HOST` using this project's PostHog settings.
- `.posthog-wizard-cache/.posthog-ai.json`
  - Records the Google ADK integration for future setup reporting.

The agent already registers `get_weather`; the Google ADK plugin automatically captures the invocation trace, agent span, tool span, and model generations. No manual tool-span capture was added.

## How to verify

1. Run the agent:

   ```bash
   pnpm start
   ```

2. The script runs two turns in the same ADK session. The first weather question is expected to exercise the `get_weather` tool.
3. In [PostHog AI Observability Traces](https://app.posthog.com/ai-observability/traces), open the newest trace and confirm:
   - each invocation has a trace;
   - both traces share the `thread_abc` AI session;
   - events are attributed to the ADK user ID;
   - the first trace contains an agent span, a `get_weather` tool span, and the model generation(s).

### Verification result

`pnpm run build` completed successfully after installing the declared dependencies. No model invocation was attempted because this environment does not hold the application's model credentials. Run the command above and inspect the resulting traces.

## Privacy mode

The effective setting is **off** (`privacyMode: false`) in `src/index.ts` for both the PostHog client and `PostHogADKPlugin`. Prompts and model completions will therefore be captured in AI Observability.

Enable privacy mode before sending prompts or responses whose sensitive content must not be stored in PostHog. Change both values in `src/index.ts` to `privacyMode: true`. This excludes SDK-captured inputs and outputs, including `$ai_input` and `$ai_output_choices`, but retains metadata such as model, token counts, cost, latency, and HTTP status. It does not remove arbitrary custom properties, manually captured content, or previously stored events.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for details.
