# PostHog AI Observability setup

## Status

AI Observability is wired for the Anthropic Python SDK. It is **wired but unverified against the PostHog UI**, because no Anthropic credential was configured and no model request was run.

## Changes made

- Added the `posthog` Python dependency in `requirements.txt` alongside the existing Anthropic SDK.
- Replaced the direct Anthropic client with `posthog.ai.anthropic.Anthropic` in `main.py`.
- Configured a `Posthog` client from `POSTHOG_API_KEY` and `POSTHOG_HOST`, with exception autocapture and an `atexit` shutdown hook for CLI flushing.
- Added a process-run `$ai_session_id` and one `posthog_trace_id` per `ask()` turn.
- Attached the session ID, trace ID, and existing stable user ID to both Anthropic calls so a tool-enabled request becomes one trace.
- Captured the existing `get_weather` execution as an `$ai_span` with the same session and trace IDs.
- Added local PostHog configuration to `.env` and documented required keys in `.env.example` without credentials.
- Wrote `.posthog-wizard-cache/.posthog-ai.json` for the wrapper integration.

## Trace shape

For one call to `ask()`, PostHog should receive one session and one trace:

```text
run session
└─ ask() trace
   ├─ Anthropic generation (tool request)
   ├─ get_weather span
   └─ Anthropic generation (final answer)
```

The session ID is reused while the CLI process runs; the trace ID is shared only by the model calls and tool span within one `ask()` turn.

## Verification

Set `ANTHROPIC_API_KEY` in `.env`, then run:

```bash
python3 main.py
```

Open **AI Observability → Traces** in PostHog and inspect the newest trace. Confirm that both generations and the `get_weather` span share one trace, that the trace belongs to a single run session, and that it is attributed to `user_123`.

No request was sent during setup, so delivery to PostHog remains to be confirmed after that run.
