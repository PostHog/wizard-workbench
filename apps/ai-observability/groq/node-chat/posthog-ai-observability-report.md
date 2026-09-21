# PostHog AI Observability setup

## Status

**Wired and build-verified; delivery is runtime-unverified.** The project now emits PostHog AI Observability generations for its Groq chat calls. A live Groq request was not made during setup because no provider credential was used.

## Integration

- Selected the **Groq Node** workflow. Although the application uses the `openai` package, its client targets `https://api.groq.com/openai/v1`, making it an OpenAI-compatible Groq gateway.
- Added `@posthog/ai` and `posthog-node`; the existing `openai` dependency was preserved.
- Configured `POSTHOG_API_KEY` and `POSTHOG_HOST` in the local `.env` file using the supplied project configuration. No token or host is hard-coded in source.
- Replaced the vendor client constructor in `src/index.ts` with PostHog's OpenAI-compatible wrapper, retaining the Groq base URL.
- Attached the real application identifiers to every generation:
  - `$ai_session_id`: `Thread.threadId`, shared across the conversation.
  - `posthogTraceId`: one UUID minted per `Thread.ask()` turn. The second turn's summarization and reply calls share that trace ID.
  - `posthogDistinctId`: `Thread.userId`.
  - `$ai_provider`: `groq`, so model attribution and cost calculations use the gateway's actual provider.
- The CLI now waits for `posthog.shutdown()` on both successful and failed completion so queued events are flushed before exit.
- The application registers no LLM tools, so no `$ai_span` tool events were added.

## Verification

- `npm run build` completed successfully (`tsc --noEmit`).
- The final runtime check requires a valid `GROQ_API_KEY` in the process environment. The app already read that key from the environment; it was not added to source or requested during setup.

## How to verify delivery

1. Run the existing script with `GROQ_API_KEY`, `POSTHOG_API_KEY`, and `POSTHOG_HOST` available in the process environment: `npm run start`.
2. In PostHog Project 483112, open **AI Observability → Traces** and inspect the newest traces.
3. Expect two traces in the same AI session (`thread_abc`):
   - The first question produces one Groq generation.
   - The second question produces two Groq generations (conversation condensation and final reply) under one shared trace.
4. Confirm the trace is attributed to the thread's stable user ID and that `$ai_provider` is `groq`.

## Scope

No existing PostHog initialization, identity handling, product event capture, or dashboards were modified. No dashboard was created because it is outside this AI Observability-only workflow.
