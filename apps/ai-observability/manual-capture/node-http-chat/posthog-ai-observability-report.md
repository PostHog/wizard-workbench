# PostHog AI Observability setup

> ⚠️ **Needs your attention**
> - The dependency install and TypeScript build now pass. Configure a reachable LLM endpoint and exercise the chat flow to confirm that AI traces arrive in PostHog.

## Integration

- **Variant:** `ai-observability-manual-capture`, selected because this Node project uses plain `fetch` against an OpenAI-compatible endpoint rather than a vendor LLM SDK.
- **SDK:** Updated `posthog-node` from `^4.2.0` to `^5.0.0` in `package.json` and installed the declared dependencies with pnpm.
- **Configuration:** Added the provided public PostHog project token and US ingestion host to the uncommitted `.env` file using `POSTHOG_PROJECT_API_KEY` and `POSTHOG_HOST`. The instrumentation reads only these variables; no token or host is embedded in source code.
- **Dedicated AI client:** `src/ai-observability.ts` creates a separate server-side client for AI events, leaves the existing product-analytics initialization unchanged, warns outside production when either required variable is absent, and safely shuts down without interrupting application work.

## Captured AI hierarchy

- Each `Thread` is an AI session, using its sanitized `threadId` as `$ai_session_id`.
- Each `Thread.ask()` call creates one UUID `$ai_trace_id`. Both LLM generations within a tool-using turn share that trace ID.
- Every successful model response emits `$ai_generation` with the model, configured provider (`LLM_PROVIDER`, defaulting to `ollama`), inputs, output, token counts, and latency.
- Each `lookup_order` execution emits an `$ai_span` with the same session and trace IDs.
- The application's existing stable user ID is used as the PostHog `distinctId`; no email, name, or other PII was added to event properties.

## Verify delivery

1. `pnpm install` completed and `pnpm build` now passes.
2. Configure the LLM endpoint as needed and run `pnpm start`. The included two-thread example is sufficient: the order question normally exercises two generations plus the `lookup_order` span, while the second question creates a second trace in the same AI session.
3. In PostHog, open **AI Observability → Traces** and inspect the newest trace. Confirm that model generations and any order lookup span share one trace for a turn, and that both turns appear under one session.

The code is **wired but live delivery remains unverified**: no model call was made because model-provider credentials were not available.

## Privacy mode

Privacy mode is explicitly **off** in `src/ai-observability.ts` so manual captures include `$ai_input` and `$ai_output_choices`, as is appropriate for the default AI Observability setup. Enable content exclusion before sending prompts or responses that must not be stored in PostHog by changing `privacyMode: false` to `privacyMode: true` in that file. This prevents SDK-captured AI inputs and outputs from being sent; it does not remove arbitrary custom properties or historic events.

See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode) for the available controls and their scope.
